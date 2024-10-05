"use client";

import {
  gymSmartAccount,
  gymUserFee,
  gymUserMaxCashbackPercentage,
  ISETHABI,
  SuperETHAddress,
} from "@/lib/constants";
import { encodeFunctionData, parseEther } from "viem";
import { useBalance, useReadContracts, useWalletClient } from "wagmi";
import Welcome from "@/components/user/welcome";
import CalendarStreak from "@/components/calendar-streak";
import CustomBarChart from "@/components/charts/custom-bar-chart";
import { Header } from "@/components/header";
import usePimlico from "@/hooks/use-pimlico";

export default function User() {
  const { smartAccountClient } = usePimlico();
  const { data: walletClient } = useWalletClient();

  console.log("smartAccount", smartAccountClient?.account?.address);
  console.log("wallet", walletClient?.account.address);

  const ethBalance = useBalance({
    address: walletClient?.account.address,
  });

  // const [userAccount, setUserAccount] = useState<`0x${string}` | undefined>(
  //   undefined
  // );

  // useEffect(() => {
  //   setUserAccount(walletClient?.account.address);
  // }, [walletClient?.account]);

  /**
   * Handle user monthly deposit
   * it needs to perform 2 transactions:
   * 1. transfer an x% of the fee to the gym account
   * 2. transfer the rest using the SuperToken contract
   */
  async function handleUserMonthlyDeposit() {
    const transactionHash = await smartAccountClient?.sendTransaction({
      calls: [
        {
          to: gymSmartAccount,
          value: parseEther(
            (gymUserFee * (1 - gymUserMaxCashbackPercentage)).toString()
          ),
          data: "0x",
        },
        {
          to: SuperETHAddress,
          value: parseEther((gymUserFee * gymUserMaxCashbackPercentage).toString()),
          data: encodeFunctionData({
            abi: ISETHABI,
            functionName: "upgradeByETHTo",
            args: [gymSmartAccount]
          }),
        },
      ],
    })
    console.log("tx", transactionHash)
  }

  const { data: balanceResult, isFetching: isFetchingBalance } =
    useReadContracts({
      allowFailure: false,
      contracts: [
        {
          address: SuperETHAddress,
          abi: ISETHABI,
          functionName: "balanceOf",
          args: [smartAccountClient?.account?.address],
        },
      ],
    });
  if (!isFetchingBalance) {
    console.log("FETCHED: balanceResult", balanceResult);
  }

  async function handleUserWithdraw() {
    const txHash = await smartAccountClient?.sendTransaction({
      calls: [
        {
          to: SuperETHAddress,
          data: encodeFunctionData({
            abi: ISETHABI,
            functionName: "downgradeToETH",
            args: [balanceResult?.[0]]
          }),
        }
      ]
    })
    console.log("tx", txHash)
  }

  console.log("ethBalance", ethBalance);

export default function Home() {
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
      <div className="w-full h-full">
        <Header />
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
