"use client";

import { v4 as uuidv4 } from "uuid";
import Header from "@/components/header";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

import { APP_URL } from "@/lib/utils";
import { useWalletClient } from "wagmi";
import {
  CFAv1ForwarderABI,
  CFAv1ForwarderAddress,
  flowRate,
  SuperUSDCAddress,
} from "@/lib/constants";
import { sepolia } from "viem/chains";
import { usePrivy } from "@privy-io/react-auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Gym, TrainingSession } from "@prisma/client";
import { TrainingSessionStatus } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardQR() {
  const [dynamicUUID, setDynamicUUID] = useState("");
  const { authenticated, user } = usePrivy();
  const [account, setAccount] = useState<`0x${string}` | undefined>(undefined);
  const { data: walletClient } = useWalletClient();
  const [newTrainingSession, setNewTrainingSession] =
    useState<TrainingSession | null>(null);
  const [gym, setGym] = useState<Gym | null>(null);
  const [enableConfirm, setEnableConfirm] = useState(false);

  useEffect(() => {
    async function fetchTrainingSession() {
      const gymResult = await fetch(`/api/gym?ownerId=${user?.id}`);
      const gymData = await gymResult.json();
      setGym(gymData.data[0]);
      console.log("gymData data", gymData.data[0]);
      if (gymData.data[0]) {
        const res = await fetch("/api/training-session/", {
          method: "POST",
          body: JSON.stringify({
            gymId: gymData.data[0].id,
            status: TrainingSessionStatus.PENDING,
          }),
        });
        const data = await res.json();
        setNewTrainingSession(data.data);
      }
    }
    fetchTrainingSession();
  }, [user?.id]);

  console.log("newTrainingSession", newTrainingSession);
  console.log("gym", gym);

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      setAccount(user?.wallet?.address as `0x${string}`);
    }
  }, [authenticated, user]);

  const TWO_SECONDS = 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicUUID(uuidv4());
    }, TWO_SECONDS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  // const link = `${APP_URL}/user/training-session/start/?id=${dynamicUUID}`;

  async function handleCreateFlow() {
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
          "0xA7c02289AcC571191b726467cF19beF9FCF2e7A8",
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

  const startTrainingSession = async () => {
    if (!user || !user.id) return;

    const data = await fetch(`/api/training-session/`, {
      method: "POST",
      body: JSON.stringify({
        userId: "did:privy:cm1x5d12n05dpx2oybd5maczh",
      }),
    }).then((res) => res.json());

    console.log("START TRAINING SESSION", data);
    if (data.status !== "ok") {
      console.error("Training session not found", data);
      toast.error("Training session not found");
    } else {
      await handleCreateFlow();
      console.log("Training session started", data);
      toast.success("Training session started");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background items-center">
      <Header />
      <h1 className="text-3xl font-bold">Welcome! 🤗</h1>
      <h3 className="text-lg">
        Scan the QR code to start your training session
      </h3>
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        {dynamicUUID && newTrainingSession && gym ? (
          <QRCode
            value={`${APP_URL}/user/training-session/start/?id=${newTrainingSession.id}&dynamic=${dynamicUUID}`}
          />
        ) : (
          <Skeleton className="h-[200px] w-[200px] rounded-lg my-4" />
        )}
        <Button
          className="bg-red-500 mx-4 mt-4"
          onClick={startTrainingSession}
          disabled={!enableConfirm}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
