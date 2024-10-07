"use client";

// import { v4 as uuidv4 } from "uuid";
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
import { Button } from "@/components/ui/button";
import { Gym, TrainingSession, User } from "@prisma/client";
import { TrainingSessionStatus } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardQR() {
  // const [dynamicUUID, setDynamicUUID] = useState("");
  const { authenticated, user } = usePrivy();
  const [account, setAccount] = useState<`0x${string}` | undefined>(undefined);
  const { data: walletClient } = useWalletClient();
  const [newTrainingSession, setNewTrainingSession] =
    useState<TrainingSession | null>(null);
  const [gym, setGym] = useState<Gym | null>(null);
  const [enableConfirm, setEnableConfirm] = useState(false);
  const [createFlowResult, setCreateFlowResult] = useState<
    `0x${string}` | undefined
  >(undefined);
  const [scannedUser, setScannedUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    async function fetchGymData() {
      const gymResult = await fetch(`/api/gym?ownerId=${user?.id}`);
      const gymData = await gymResult.json();
      setGym(gymData.data[0]);
    }
    fetchGymData();
  }, [user?.id]);

  useEffect(() => {
    async function postNewTrainingSession() {
      const res = await fetch("/api/training-session/", {
        method: "POST",
        body: JSON.stringify({
          gymId: gym?.id,
          status: TrainingSessionStatus.PENDING,
        }),
      });
      const data = await res.json();
      setNewTrainingSession(data.data);
    }
    if (gym) {
      postNewTrainingSession();
    }
  }, [gym]);

  console.log("newTrainingSession base", newTrainingSession);
  console.log("gym", gym);

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      setAccount(user?.wallet?.address as `0x${string}`);
    }
  }, [authenticated, user]);

  // const TWO_SECONDS = 1000;

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setDynamicUUID(uuidv4());
  //   }, TWO_SECONDS);
  //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  // }, []);

  // const link = `${APP_URL}/user/training-session/start/?id=${dynamicUUID}`;

  async function handleCreateFlow() {
    try {
      console.log("creating a new flow for user", scannedUser);
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
          // "0xA7c02289AcC571191b726467cF19beF9FCF2e7A8",
          scannedUser?.address,
          // flow rate
          flowRate,
          // bytes
          "0x0000000000000000000000000000000000000000",
        ],
      });
      console.log("result", result);
      setCreateFlowResult(result);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const checkTrainingSession = async () => {
        console.log("checking training session....");
        console.log("newTrainingSession polling", newTrainingSession);
        if (newTrainingSession) {
          const data = await fetch(
            `/api/training-session/?id=${newTrainingSession?.id}`,
          ).then((res) => res.json());
          console.log("data fetched from db", data);
          if (data.data.status === TrainingSessionStatus.ENTERED) {
            setEnableConfirm(true);
            const userFromDbResult = await fetch(
              `/api/user/?userId=${data.data.userId}`,
            ).then((res) => res.json());
            setScannedUser(userFromDbResult.data);
          }
        }
      };
      if (!enableConfirm) {
        checkTrainingSession();
      }
    }, 5000);
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [enableConfirm, newTrainingSession]);

  console.log("createFlowResult", createFlowResult);

  return (
    <div className="flex min-h-screen flex-col bg-background items-center">
      <Header />
      <h1 className="text-3xl font-bold">Welcome! 🤗</h1>
      <h3 className="text-lg">
        Scan the QR code to start your training session
      </h3>
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        {newTrainingSession && gym ? (
          <QRCode
            value={`${APP_URL}/user/training-session/start/?id=${newTrainingSession.id}`}
          />
        ) : (
          <Skeleton className="h-[200px] w-[200px] rounded-lg my-4" />
        )}
        <Button
          className="bg-red-500 mx-4 mt-4"
          onClick={handleCreateFlow}
          disabled={!enableConfirm}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
