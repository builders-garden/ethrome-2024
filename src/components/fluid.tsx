"use client";

import usePimlico from "@/hooks/use-pimlico";
import {
  CFAv1ForwarderABI,
  CFAv1ForwarderAddress,
  ISETHABI,
  SuperETHAddress,
} from "@/lib/constants";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { sepolia } from "viem/chains";
import { useBalance, useReadContracts } from "wagmi";

const Fluid = () => {
  const { predictSmartAccountAddress, smartAccountClient } = usePimlico();
  const { authenticated } = usePrivy();
  const [smartAccount, setSmartAccount] = useState<`0x${string}` | undefined>(
    undefined
  );
  // const [smartAccountBalance, setSmartAccountBalance] = useState<string | undefined>(undefined);

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

  const { data: balanceResult, isFetching: isFetchingBalance } =
    useReadContracts({
      allowFailure: false,
      contracts: [
        {
          address: SuperETHAddress,
          abi: ISETHABI,
          functionName: "balanceOf",
          args: [smartAccount],
        },
        {
          address: SuperETHAddress,
          abi: ISETHABI,
          functionName: "decimals",
        },
        {
          address: SuperETHAddress,
          abi: ISETHABI,
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
      const result = await smartAccountClient?.writeContract({
        address: CFAv1ForwarderAddress,
        abi: CFAv1ForwarderABI,
        functionName: "createFlow",
        chain: sepolia,
        account: smartAccount,
        args: [
          // token address
          SuperETHAddress,
          // sender
          smartAccount,
          // receiver
          "<add_here_address>",
          // flow rate
          3805175038052,
          // user data
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
