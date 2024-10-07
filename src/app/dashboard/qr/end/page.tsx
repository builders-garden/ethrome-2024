"use client";

import Header from "@/components/header";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

import { APP_URL } from "@/lib/utils";
import {
  CFAv1ForwarderABI,
  CFAv1ForwarderAddress,
  SuperUSDCAddress,
} from "@/lib/constants";
import { sepolia } from "viem/chains";
import { useWalletClient } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Gym, TrainingSession, User } from "@prisma/client";
import { TrainingSessionStatus } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardQR() {
  const [account, setAccount] = useState<`0x${string}` | undefined>(undefined);
  const { authenticated, user } = usePrivy();
  const { data: walletClient } = useWalletClient();
  const [newTrainingSession, setNewTrainingSession] =
    useState<TrainingSession | null>(null);
  const [gym, setGym] = useState<Gym | null>(null);
  const [enableConfirm, setEnableConfirm] = useState(false);
  const [deleteFlowResult, setDeleteFlowResult] = useState<
    `0x${string}` | undefined
  >(undefined);
  const [scannedUser, setScannedUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      setAccount(user?.wallet?.address as `0x${string}`);
    }
  }, [authenticated, user]);

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
          status: TrainingSessionStatus.EXITING,
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

  async function handleDeleteFlow() {
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
          // "0xA7c02289AcC571191b726467cF19beF9FCF2e7A8",
          scannedUser?.address,
          // bytes
          "0x",
        ],
      });
      console.log("result", result);
      setDeleteFlowResult(result);
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
          if (data.data.status === TrainingSessionStatus.LEFT) {
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

  console.log("deleteFlowResult", deleteFlowResult);

  return (
    <div className="flex min-h-screen flex-col bg-background items-center">
      <Header />
      <h1 className="text-3xl font-bold">Goodbye! 👋</h1>
      <h3 className="text-lg">Scan the QR code to end your training session</h3>
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        {/* {newTrainingSession && (
          <QRCode
            value={`${APP_URL}/user/training-session/end/?id=${newTrainingSession.id}`}
          />
        )} */}
        {/* <Button className="bg-red-500 mx-4 mt-4" onClick={endTrainingSession}>
          End
        </Button> */}

        {newTrainingSession && gym ? (
          <QRCode
            value={`${APP_URL}/user/training-session/end/?id=${newTrainingSession.id}`}
          />
        ) : (
          <Skeleton className="h-[200px] w-[200px] rounded-lg my-4" />
        )}
        <Button
          className="bg-red-500 mx-4 mt-4"
          onClick={handleDeleteFlow}
          disabled={!enableConfirm}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
