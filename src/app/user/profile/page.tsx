"use client";

import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  fUSDCABI,
  gymSmartAccount,
  gymUserFee,
  gymUserMaxCashbackPercentage,
  ISuperTokenABI,
  SuperUSDCAddress,
  USDCAddress,
} from "@/lib/constants";
import { encodeFunctionData, formatEther, parseEther } from "viem";
import usePimlico from "@/hooks/use-pimlico";
import { useReadContract, useReadContracts } from "wagmi";
import { Gym } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import Divider from "@/components/divider";
import { toast } from "sonner";

export default function UserProfile() {
  const { logout, ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const [gym, setGym] = useState<Gym | null>(null);

  console.log("user", user);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/user");
    }
  }, [ready, authenticated, router]);

  const { smartAccountClient } = usePimlico();

  const { data: balanceResult } = useReadContract({
    address: USDCAddress,
    abi: fUSDCABI,
    functionName: "balanceOf",
    args: [smartAccountClient?.account?.address],
  });

  const usdcBalance = balanceResult as bigint;

  const formatFloat = (n: bigint) => {
    return parseFloat(formatEther(n)).toFixed(4);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Address copied to clipboard!");
    });
  };

  const smartAccountAddress = smartAccountClient?.account?.address;
  const shortenedAddress = `${smartAccountAddress?.slice(0, 6)}...${smartAccountAddress?.slice(-4)}`;

  const fetchGymOfUser = async () => {
    const data = await fetch(`/api/user?userId=${user?.id}`).then((res) =>
      res.json(),
    );
    setGym(data?.data?.Gym);
  };

  useEffect(() => {
    if (user?.id) {
      fetchGymOfUser();
    }
  }, [user?.id]);

  const { data: fullbalanceResult, isFetching: isFetchingBalance } =
    useReadContracts({
      contracts: [
        {
          address: SuperUSDCAddress,
          abi: ISuperTokenABI,
          functionName: "balanceOf",
          args: [smartAccountClient?.account?.address],
        },
        {
          address: USDCAddress,
          abi: fUSDCABI,
          functionName: "balanceOf",
          args: [smartAccountClient?.account?.address],
        },
      ],
    });

  const superUsdcUserBalance = fullbalanceResult?.[0].result as bigint;
  const usdcUserBalance = fullbalanceResult?.[1].result as bigint;

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
        args: [gymSmartAccount, maxCashbackAmount, "0x"],
      }),
    },
  ];

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
                    smartAccountClient?.account?.address,
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

  return (
    <div className="w-full min-h-screen">
      <h1 className="text-3xl font-bold py-4 px-4">Profile 👤</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 px-4 rounded-xl">
          <div className="flex items-center w-full justify-between">
            <span>Your Address:</span>
            {smartAccountAddress ? (
              <div className="flex items-center gap-2">
                <span>{shortenedAddress}</span>
                <Button
                  onClick={() => copyToClipboard(smartAccountAddress || "")}
                  className="h-6"
                  size="sm"
                >
                  Copy
                </Button>
              </div>
            ) : (
              <Skeleton className="h-[24px] w-[9rem] rounded-full" />
            )}
          </div>
          <div className="flex items-center w-full justify-between">
            <span>USDC Balance:</span>
            <span>
              {usdcBalance ? (
                `$${formatFloat(usdcBalance)}`
              ) : (
                <Skeleton className="h-[16px] w-[9rem] rounded-full" />
              )}
            </span>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-4 px-4 rounded-xl">
          <div className="flex flex-col gap-4">
            <div className="flex items-center w-full justify-between">
              <span>Your Gym:</span>
              <span>
                {gym?.name || (
                  <Skeleton className="h-[16px] w-[9rem] rounded-full" />
                )}
              </span>
            </div>
            <div className="flex items-center w-full justify-between">
              <span>Montly Fee:</span>
              <span>
                {gym?.monthlyFee !== undefined ? (
                  "$" + gym.monthlyFee
                ) : (
                  <Skeleton className="h-[16px] w-[9rem] rounded-full" />
                )}
              </span>
            </div>
            <div className="flex items-center w-full justify-between">
              <span>Cashback Percentage:</span>
              <span>
                {gym?.cashbackPercentage !== undefined ? (
                  gym?.cashbackPercentage + "%"
                ) : (
                  <Skeleton className="h-[16px] w-[9rem] rounded-full" />
                )}
              </span>
            </div>
          </div>
        </div>

        <Divider />

        <Button className="bg-red-500 mx-4" onClick={handleUserMonthlyDeposit}>
          Subscribe
        </Button>

        <Divider />

        <Button className="bg-red-500 mx-4" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
