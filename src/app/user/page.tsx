"use client";

import {
  gymSmartAccount,
  gymUserFee,
  gymUserMaxCashbackPercentage,
  ISuperTokenABI,
  SuperUSDCAddress,
  USDCAddress
} from "@/lib/constants";
import { encodeFunctionData, erc20Abi, parseEther } from "viem";
import { useBalance, useReadContract, useWalletClient } from "wagmi";
import Welcome from "@/components/user/welcome";
import CalendarStreak from "@/components/calendar-streak";
import CustomBarChart from "@/components/charts/custom-bar-chart";
import usePimlico from "@/hooks/use-pimlico";
import Divider from "@/components/divider";
import Image from "next/image";
import { useState } from "react";

export default function User() {
  const { smartAccountClient } = usePimlico();
  const { data: walletClient } = useWalletClient();

  console.log("smartAccount", smartAccountClient?.account?.address);
  console.log("wallet", walletClient?.account.address);

  const ethBalance = useBalance({
    address: walletClient?.account.address,
  });

  async function handleUserMonthlyDeposit() {
    const directFeeToGym = parseEther(
      (gymUserFee * (1 - gymUserMaxCashbackPercentage)).toString()
    )
    const maxCashbackAmount = parseEther((gymUserFee * gymUserMaxCashbackPercentage).toString())
    const transactionHash = await smartAccountClient?.sendTransaction({
      calls: [
        {
          to: USDCAddress,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: "transfer",
            args: [gymSmartAccount, directFeeToGym],
          }),
        },
        {
          to: USDCAddress,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: "approve",
            args: [SuperUSDCAddress, maxCashbackAmount],
          }),
        },
        {
          to: SuperUSDCAddress,
          data: encodeFunctionData({
            abi: ISuperTokenABI,
            functionName: "upgradeTo",
            args: [gymSmartAccount, maxCashbackAmount, "0x"]
          }),
        },
      ],
    })
    console.log("tx", transactionHash)
  }

  const { data: balanceResult, isFetching: isFetchingBalance } =
    useReadContract({
      address: SuperUSDCAddress,
      abi: ISuperTokenABI,
      functionName: "balanceOf",
      args: [smartAccountClient?.account?.address],
    });
  if (!isFetchingBalance) {
    console.log("FETCHED: super balance", balanceResult);
  }

  async function handleUserWithdraw() {
    const txHash = await smartAccountClient?.sendTransaction({
      calls: [
        {
          to: SuperUSDCAddress,
          data: encodeFunctionData({
            abi: ISuperTokenABI,
            functionName: "downgrade",
            args: [balanceResult]
          }),
        }
      ]
    })
    console.log("tx", txHash)
  }

  console.log("ethBalance", ethBalance);

  const cashback = 2;

  const [subscriptionActive, setSubscriptionActive] = useState(true)

  return (
    <div className="w-full min-h-screen flex flex-col gap-4">
      <Welcome name="John" weeklyCompleted={2} weeklyGoal={4} />
      <Divider />
      <div className="rounded-xl p-4 py-0 flex justify-start items-center">
        <div className="flex flex-col items-start gap-1 w-full">
          <span className="text-xl font-medium">Your cashback</span>
          <span className="text-4xl font-extrabold text-red-500">
            ${(cashback * 0.15).toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col items-start gap-1 w-full">
          <span className="text-xl font-medium">Your subscription</span>
          <div className="flex gap-1 items-center">
            <span className="text-4xl font-extrabold">
              {subscriptionActive ? "Active" : "Expired"}
            </span>
            <Image
              src={`/images/${subscriptionActive ? "+" : "-"}1.png`}
              alt="ok"
              width={25}
              height={25}
            />
          </div>
        </div>
      </div>
      <Divider />
      <CalendarStreak />
      <CustomBarChart />
      <div className="flex flex-col items-center justify-center">
        Eu laboris sunt fugiat quis Lorem proident non officia voluptate sunt id
        veniam consequat voluptate quis. Ea magna nulla duis id esse nisi qui
        nostrud. Reprehenderit dolore aliqua nostrud ut sint esse fugiat
        exercitation qui enim. Magna minim sunt enim. Nulla ad ea deserunt
        laborum officia aliquip. Lorem id laborum aliquip consequat veniam
        officia. Enim voluptate id esse et veniam laborum sit dolore labore.
      </div>
      <div className="w-full h-full mt-8">
        <h1>Pay your month subscription</h1>
        <h2>ETH Balance</h2>
        <code>
          {`
              Amount: ${ethBalance.data?.value}
              Decimals: ${ethBalance?.data?.decimals}
              Symbol: ${ethBalance?.data?.symbol}
            `}
        </code>
        <p>Amount to pay: {gymUserFee} ETH</p>
        <p>Max cashback value: {gymUserFee * gymUserMaxCashbackPercentage}</p>
        <p>Max cashback (%): {gymUserMaxCashbackPercentage * 100}%</p>
        <button onClick={handleUserMonthlyDeposit}>Deposit</button>
        <button onClick={handleUserWithdraw}>Withdraw</button>
      </div>
    </div>
  );
}
