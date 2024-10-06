"use client";

import { usePrivy } from "@privy-io/react-auth";
import usePimlico from "@/hooks/use-pimlico";

import RegisterGym from "@/components/dashboard/register-gym";
import OnboardOwner from "@/components/dashboard/onboard-owner";
import GymTable from "@/components/dashboard/gym-table";

import { Header } from "@/components/header";
import { useState } from "react";
import { Gym } from "@prisma/client";
import GymUsers from "@/components/dashboard/gym-users";

export default function Dashboard() {
  const { user, ready, authenticated } = usePrivy();
  const { smartAccountClient } = usePimlico();
  console.log("smartAccount", smartAccountClient?.account?.address);
  console.log("user", user?.wallet?.address, user?.id);

  const [gyms, setGyms] = useState<Gym[]>([]);
  const [refetchGym, setRefetchGym] = useState(true);
  const [selectedGymId, setSelectedGymId] = useState<string>("");

  const privyId = user?.id;
  const name = user?.google?.name || user?.farcaster?.displayName || "";
  const email = user?.email?.address || user?.google?.email || "";
  const address = user?.wallet?.address || "";

  return (
    <div className="flex min-h-screen flex-col bg-background items-center">
      <Header />
      {user && privyId ? (
        <OnboardOwner
          ready={ready}
          authenticated={authenticated}
          name={name}
          email={email}
          privyId={privyId}
        />
      ) : null}
      <div className="flex flex-row w-full justify-between container">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex flex-row gap-2 items-center">
          <p>Register here your gyms</p>
          {user && privyId && address ? (
            <RegisterGym
              ownerId={privyId}
              address={address}
              setRefetchGym={setRefetchGym}
            />
          ) : null}
        </div>
      </div>
      {/* <div className="w-full max-w-lg flex flex-row items-center justify-around">
        <Link href="/dashboard/qr/start">
          <Button className="py-2 bg-blue-500 hover:bg-blue-700">
            Show &quot;Start Training&quot; QR Code
          </Button>
        </Link>
        <Link href="/dashboard/qr/end">
          <Button className="py-2">
            Show &quot;End Training&quot; QR Code
          </Button>
        </Link>
      </div> */}
      <div className="grid grid-cols-2 gap-4 py-10">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">Your Gyms</h1>
          {user && privyId ? (
            <GymTable
              ownerId={privyId}
              refetchGym={refetchGym}
              setRefetchGym={setRefetchGym}
              setGyms={setGyms}
            />
          ) : null}
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">Your Gym Users</h1>
          <select onChange={(e) => setSelectedGymId(e.target.value)}>
            <option value="">Select a gym</option>
            {gyms.map((gym) => (
              <option key={gym.id} value={gym.id}>
                {gym.name}
              </option>
            ))}
          </select>
          <GymUsers id={selectedGymId || ""} />
        </div>
      </div>
    </div>
  );
}
