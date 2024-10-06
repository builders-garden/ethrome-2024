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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createFlowResult, setCreateFlowResult] = useState<
    `0x${string}` | undefined
  >();
  console.log("GYM", gym);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/user");
    }
  }, [ready, authenticated, router]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smartAccount]);

  return (
    <div className="flex min-h-screen flex-col bg-background items-center">
      <h1 className="text-3xl font-bold">Training Session Ended! 👋</h1>
      <h3 className="text-lg">Scan the QR code to end your training session</h3>
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Link href="/user">
          <Button>Back</Button>
        </Link>
      </div>
    </div>
  );
}
