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

  return (
    <div className="w-full min-h-screen">
      <Welcome name="John Doe" weeklyCompleted={2} weeklyGoal={4} />
      <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-700">Your cashback</h2>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500">Available balance</span>
          <span className="text-4xl font-bold text-green-600">
            ${(cashback * 0.15).toFixed(2)}
          </span>
        </div>
      </div>
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
