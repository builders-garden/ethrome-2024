"use client";

import {
  gymSmartAccount,
  gymUserFee,
  gymUserMaxCashbackPercentage,
  ISuperTokenABI,
  SuperUSDCAddress,
  USDCAddress,
  fUSDCABI,
  flowRate,
} from "@/lib/constants";
import { encodeFunctionData, formatEther, parseEther } from "viem";
import {
  useBalance,
  useReadContracts,
  useTransactionReceipt,
  useWalletClient,
} from "wagmi";
import Welcome from "@/components/user/welcome";
import CalendarStreak from "@/components/calendar-streak";
import CustomBarChart from "@/components/charts/custom-bar-chart";
import usePimlico from "@/hooks/use-pimlico";
import Divider from "@/components/divider";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import OnboardUser from "@/components/user/onboard-user";
import FlowingBalance from "@/components/flowing-balance";
import { Skeleton } from "@/components/ui/skeleton";
import { activeStreamsQuery } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { User as FitUser } from "@prisma/client";
import { toast } from "sonner";

export default function User() {
  const { ready, authenticated, user, login, isModalOpen } = usePrivy();

  const privyId = user?.id;
  const name = user?.google?.name || user?.farcaster?.displayName || "";
  const email = user?.email?.address || user?.google?.email || "";
  // const address = user?.wallet?.address || "";
  useEffect(() => {
    if (ready && !authenticated && !isModalOpen) {
      login();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, authenticated, isModalOpen]);
  const { smartAccountClient } = usePimlico();
  const { data: walletClient } = useWalletClient();

  const smartAccountAddress =
    smartAccountClient?.account?.address ||
    "0x0000000000000000000000000000000000000000";
  console.log("smartAccount", smartAccountAddress);
  console.log("wallet", walletClient?.account.address);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [subscriptionActive, setSubscriptionActive] = useState(true);
  const [subscriptionExpires, setSubscriptionExpires] = useState<Date | null>(
    null,
  );
  const [subscriptionDaysLeft, setSubscriptionDaysLeft] = useState<
    number | null
  >(null);
  const [storedUser, setStoredUser] = useState<FitUser | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/user?userId=${privyId}`);
      const data = await res.json();
      setStoredUser(data.data);
    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // calculate if the subscription is active using user.createdAt
  useEffect(() => {
    if (storedUser) {
      const now = new Date();
      const createdAt = new Date(storedUser.createdAt);
      const diffTime = Math.abs(now.getTime() - createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      console.log("diffDays", diffDays);
      setSubscriptionDaysLeft(30 - diffDays);
      if (diffDays > 30) {
        setSubscriptionActive(false);
      }
      if (diffDays <= 30) {
        setSubscriptionExpires(
          new Date(createdAt.setDate(createdAt.getDate() + 30)),
        );
      }
    }
  }, [storedUser]);
  console.log({
    subscriptionActive,
    subscriptionExpires,
    subscriptionDaysLeft,
  });

  const ethBalance = useBalance({
    address: walletClient?.account.address,
  });
  console.log("ethBalance", ethBalance);

  const [firstBalance, setFirstBalance] = useState<bigint | undefined>();

  const { data: balanceResult, isFetching: isFetchingBalance } =
    useReadContracts({
      contracts: [
        {
          address: SuperUSDCAddress,
          abi: ISuperTokenABI,
          functionName: "balanceOf",
          args: [smartAccountAddress],
        },
        {
          address: USDCAddress,
          abi: fUSDCABI,
          functionName: "balanceOf",
          args: [smartAccountAddress],
        },
      ],
      query: {
        enabled: smartAccountClient !== undefined,
      },
    });

  const superUsdcUserBalance = balanceResult?.[0].result as bigint;
  const usdcUserBalance = balanceResult?.[1].result as bigint;

  useEffect(() => {
    if (firstBalance === undefined && superUsdcUserBalance !== undefined) {
      setFirstBalance(superUsdcUserBalance);
    }
  }, [firstBalance, superUsdcUserBalance]);

  if (!isFetchingBalance) {
    console.log("superUsdcUserBalance", superUsdcUserBalance);
    console.log("usdcUserBalance", usdcUserBalance);
  }

  const directFeeToGym = parseEther(
    (gymUserFee * (1 - gymUserMaxCashbackPercentage)).toString(),
  );
  const maxCashbackAmount = parseEther(
    (gymUserFee * gymUserMaxCashbackPercentage).toString(),
  );

  const transferApproveAndUpgradeCall = [
    {
      to: USDCAddress,
      data: encodeFunctionData({
        abi: fUSDCABI,
        functionName: "transfer",
        args: [gymSmartAccount, directFeeToGym],
      }),
    },
    {
      to: USDCAddress,
      data: encodeFunctionData({
        abi: fUSDCABI,
        functionName: "approve",
        args: [SuperUSDCAddress, maxCashbackAmount],
      }),
    },
    {
      to: SuperUSDCAddress,
      data: encodeFunctionData({
        abi: ISuperTokenABI,
        functionName: "upgradeTo",
        args: [
          gymSmartAccount,
          maxCashbackAmount,
          "0x0000000000000000000000000000000000000000",
        ],
      }),
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function handleUserMonthlyDeposit() {
    const transactionHash =
      usdcUserBalance < parseEther(gymUserFee.toString())
        ? await smartAccountClient?.sendTransaction({
            calls: [
              {
                to: USDCAddress,
                data: encodeFunctionData({
                  abi: fUSDCABI,
                  functionName: "mint",
                  args: [
                    smartAccountAddress,
                    parseEther(gymUserFee.toString()),
                  ],
                }),
              },
              ...transferApproveAndUpgradeCall,
            ],
          })
        : await smartAccountClient?.sendTransaction({
            calls: transferApproveAndUpgradeCall,
          });
    console.log("tx", transactionHash);
  }

  const [claimTxHash, setClaimTxHash] = useState<`0x${string}` | undefined>(
    undefined,
  );
  const [claiming, setClaiming] = useState(false);

  async function handleUserWithdraw() {
    setClaiming(true);
    const txHash = await smartAccountClient?.sendTransaction({
      calls: [
        {
          to: SuperUSDCAddress,
          data: encodeFunctionData({
            abi: ISuperTokenABI,
            functionName: "downgrade",
            args: [superUsdcUserBalance],
          }),
        },
      ],
    });
    setClaimTxHash(txHash);
    setClaiming(false);
  }

  const {
    data: claimResult,
    // error: claimError,
    // isLoading: claimLoading,
  } = useTransactionReceipt({
    hash: claimTxHash,
  });

  console.log("claimResult", claimResult);

  // set claiming to false when transaction is confirmed
  useEffect(() => {
    if (claimResult?.status === "success") {
      toast.success("Cashback claimed successfully! 🎉");
      setClaiming(false);
      setFirstBalance(BigInt(0));
      setStartingDate(new Date());
    }
  }, [claimResult]);

  const [startingDate, setStartingDate] = useState<Date | null>(null);

  useEffect(() => {
    if (ready && authenticated) {
      setStartingDate(new Date());
    }
  }, [ready, authenticated]);

  console.log("smartAccountClient?.account?.address", smartAccountAddress);

  const { loading: loadingQueryRes, data: dataQueryRes } = useQuery(
    activeStreamsQuery,
    {
      variables: {
        receiver: smartAccountAddress.toLocaleLowerCase(),
      },
      fetchPolicy: "network-only",
    },
  );

  const streamIsActive = dataQueryRes?.streams.length > 0;

  return (
    <div className="w-full min-h-screen flex flex-col gap-4">
      <Welcome name={storedUser?.name} weeklyCompleted={2} weeklyGoal={4} />
      {user && privyId && smartAccountAddress ? (
        <OnboardUser
          ready={ready}
          authenticated={authenticated}
          name={name}
          email={email}
          address={smartAccountAddress}
          privyId={privyId}
        />
      ) : null}

      <Divider />

      <div className="rounded-xl p-4 py-0 flex justify-start items-center">
        <div className="flex flex-col items-start gap-1 w-full">
          <div className="flex items-center">
            <span className="text-xl font-medium">Your cashback</span>
            {!loadingQueryRes && streamIsActive && (
              <span className="flex bg-green-500 rounded-full w-2 h-2 ml-2 animate-pulse" />
            )}
          </div>
          {!loadingQueryRes && startingDate && firstBalance !== undefined ? (
            streamIsActive ? (
              <div
                style={{
                  display: "flex",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "135px", margin: "auto" }}>
                  <FlowingBalance
                    startingBalance={firstBalance}
                    startingBalanceDate={startingDate}
                    flowRate={flowRate}
                  />
                </div>
              </div>
            ) : (
              <span className="text-2xl font-extrabold">
                ${formatEther(firstBalance).substring(0, 9)}
              </span>
            )
          ) : (
            <Skeleton className="h-[24px] w-[9rem] rounded-full" />
          )}
        </div>
        <Button
          className="text-xl h-auto w-[7rem]"
          onClick={handleUserWithdraw}
          disabled={claiming}
        >
          {claiming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Claim
        </Button>
      </div>

      <Divider />

      <div className="rounded-xl p-4 py-0 flex justify-start items-center">
        <div className="flex flex-col items-start gap-1 w-full">
          <span className="text-xl font-medium">Your subscription</span>
          <div className="flex gap-1 items-center">
            <span className="text-2xl font-extrabold">
              {subscriptionActive ? "Active" : "Expired"}
            </span>
            <Image
              src={`/images/${subscriptionActive ? "+" : "-"}1.png`}
              alt="ok"
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 w-full">
          <span className="text-xl font-medium">
            {subscriptionActive ? "Expires" : "Expired"}
          </span>
          <span className="text-2xl font-extrabold">
            {subscriptionActive ? (
              subscriptionDaysLeft ? (
                `in ${subscriptionDaysLeft} days`
              ) : (
                <Skeleton className="h-[24px] w-[8rem] rounded-full" />
              )
            ) : (
              "Expired"
            )}
          </span>
        </div>
      </div>

      <Divider />

      <CalendarStreak />

      <Divider />

      <CustomBarChart />

      {/* <div className="w-full h-full mt-8">
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
      </div> */}
    </div>
  );
}
