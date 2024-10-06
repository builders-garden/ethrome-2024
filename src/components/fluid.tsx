"use client";

import usePimlico from "@/hooks/use-pimlico";
import {
  CFAv1ForwarderABI,
  CFAv1ForwarderAddress,
  flowRate,
  gymUserFee,
  gymUserMaxCashbackPercentage,
  ISuperTokenABI,
  SuperUSDCAddress,
} from "@/lib/constants";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { sepolia } from "viem/chains";
import { useBalance, useReadContracts, useWalletClient } from "wagmi";

const Fluid = () => {
  const { predictSmartAccountAddress } = usePimlico();
  const { authenticated, user } = usePrivy();
  const [smartAccount, setSmartAccount] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [account, setAccount] = useState<`0x${string}` | undefined>(undefined);
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      setAccount(user?.wallet?.address as `0x${string}`);
    }
  }, [authenticated, user]);

  useEffect(() => {
    async function getSmartAccount() {
      if (authenticated) {
        const smartAccountAddress = await predictSmartAccountAddress();
        setSmartAccount(smartAccountAddress);
      }
    }
    getSmartAccount();
  }, [authenticated, predictSmartAccountAddress]);

  console.log("smartAccount", smartAccount);
  console.log("user", user?.wallet?.address);

  const { data: balanceResult, isFetching: isFetchingBalance } =
    useReadContracts({
      allowFailure: false,
      contracts: [
        {
          address: SuperUSDCAddress,
          abi: ISuperTokenABI,
          functionName: "balanceOf",
          args: [user?.wallet?.address],
        },
        {
          address: SuperUSDCAddress,
          abi: ISuperTokenABI,
          functionName: "decimals",
        },
        {
          address: SuperUSDCAddress,
          abi: ISuperTokenABI,
          functionName: "symbol",
        },
      ],
    });
  if (!isFetchingBalance) {
    console.log("FETCHED: balanceResult", balanceResult);
  }

  const ethBalance = useBalance({
    address: smartAccount,
  });

  async function handleCreateFlow() {
    if (!smartAccount) {
      throw new Error("Smart account address not available");
    }

    try {
      const result = await walletClient?.writeContract({
        address: CFAv1ForwarderAddress,
        abi: CFAv1ForwarderABI,
        functionName: "createFlow",
        chain: sepolia,
        args: [
          // token address
          SuperUSDCAddress,
          // sender
          account,
          // receiver
          "0xAf491BE3402245400a537F84c09513cd9C371a50",
          // flow rate
          flowRate,
          // bytes
          "0x",
        ],
      });
      console.log("result", result);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteFlow() {
    if (!smartAccount) {
      throw new Error("Smart account address not available");
    }

    try {
      const result = await walletClient?.writeContract({
        address: CFAv1ForwarderAddress,
        abi: CFAv1ForwarderABI,
        functionName: "deleteFlow",
        chain: sepolia,
        args: [
          // token address
          SuperUSDCAddress,
          // sender
          account,
          // receiver
          "0xAf491BE3402245400a537F84c09513cd9C371a50",
          // bytes
          "0x",
        ],
      });
      console.log("result", result);

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col gap-6 items-center text-center max-w-3xl px-4">
        Smart account address: {smartAccount ? smartAccount : "Not available"}
        <button onClick={handleCreateFlow}>start flow</button>
        <button onClick={handleDeleteFlow}>stop flow</button>
        <h1>ETH Balance</h1>
        <code>
          {`
            Amount: ${ethBalance.data?.value}
            Decimals: ${ethBalance?.data?.decimals}
            Symbol: ${ethBalance?.data?.symbol}
          `}
        </code>
        <h1>ETHx (Super ETH) balance</h1>
        <code>
          {isFetchingBalance
            ? "Fetching balance..."
            : `
              Amount: ${balanceResult?.[0]}
              Decimals: ${balanceResult?.[1]}
              Symbol: ${balanceResult?.[2]}
              `}
        </code>
      </div>
    </div>
  );
};

export default Fluid;
