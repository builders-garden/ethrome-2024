"use client";

import { Button } from "@/components/ui/button";
import usePimlico from "@/hooks/use-pimlico";
import {
  CFAv1ForwarderABI,
  CFAv1ForwarderAddress,
  SuperUSDCAddress,
} from "@/lib/constants";
import { Gym } from "@prisma/client";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { sepolia } from "viem/chains";
import { useWalletClient } from "wagmi";

export default function UserQr() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const { predictSmartAccountAddress } = usePimlico();
  const { data: walletClient } = useWalletClient();

  const [smartAccount, setSmartAccount] = useState<`0x${string}` | undefined>(
    undefined,
  );
  const [account, setAccount] = useState<`0x${string}` | undefined>(undefined);
  const [gym, setGym] = useState<Gym | null>(null);
  console.log("GYM", gym);

  useEffect(() => {
    async function fetchGym() {
      const userResult = await fetch(`/api/user?id=${user?.id}`);
      const userData = await userResult.json();
      const res = await fetch(`/api/user/gym?id=${userData.gymId}`);
      const data = await res.json();
      setGym(data.data);
    }

    if (authenticated && user?.wallet?.address) {
      setAccount(user?.wallet?.address as `0x${string}`);
    }
    fetchGym();
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

  const [createFlowResult, setCreateFlowResult] = useState<
    `0x${string}` | undefined
  >();

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
          gym?.flowRate,
          // bytes
          "0x",
        ],
      });
      console.log("result", result);
      setCreateFlowResult(result);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/user");
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    const startTrainingSession = async () => {
      if (!user || !user.id) return;

      const data = await fetch(`/api/training-session/`, {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
        }),
      }).then((res) => res.json());

      console.log("START TRAINING SESSION", data);
      if (data.status !== "ok") {
        console.error("Training session not found", data);
        toast.error("Training session not found");
      } else {
        // await handleCreateFlow();
        console.log("Training session started", data);
        toast.success("Training session started");
      }
    };
    startTrainingSession();
  }, [user]);

  useEffect(() => {
    console.log("handleCreateFlow useEffect");
    if (smartAccount) {
      console.log({
        smartAccount,
      });
      handleCreateFlow();
    }
  }, [smartAccount]);

  return (
    <div className="w-full min-h-screen">
      <h1 className="text-2xl font-bold">Training Session Started</h1>
      <Link href="/user">
        {createFlowResult ?? "waiting create flow result"}
        <Button>Back</Button>
      </Link>
    </div>
  );
}
