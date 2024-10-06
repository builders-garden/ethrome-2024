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
  const { data: walletClient } = useWalletClient();
  const { predictSmartAccountAddress } = usePimlico();
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

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/user");
    }
  }, [ready, authenticated, router]);

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

  useEffect(() => {
    const endTrainingSession = async () => {
      if (!user || !user.id) return;

      const data = await fetch(`/api/training-session/`, {
        method: "PUT",
        body: JSON.stringify({
          userId: user.id,
        }),
      }).then((res) => res.json());

      console.log("END TRAINING SESSION", data);
      if (data.status !== "ok") {
        console.error("Training session not found", data);
        toast.error("Training session not found");
      } else {
        console.log("Training session started", data);
        toast.success("Training session started");
      }
    };
    endTrainingSession();
  }, [user]);

  return (
    <div className="w-full min-h-screen">
      <h1 className="text-2xl font-bold">Training Session Ended</h1>
      <Link href="/user">
        <Button>Back</Button>
      </Link>
    </div>
  );
}
