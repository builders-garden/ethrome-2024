"use client";

import { Header } from "@/components/header";
import CreateOwner from "@/components/dashboard/create-owner";
import RegisterGym from "@/components/dashboard/register-gym";

import { usePrivy } from "@privy-io/react-auth";
import GymTable from "@/components/dashboard/gym-table";

export default function Home() {
  const { user } = usePrivy();

  const privyId = user?.id;
  const name = user?.google?.name || user?.farcaster?.displayName || "";
  const email = user?.email?.address || user?.google?.email || "";
  const address = user?.wallet?.address || "";

  return (
    <div className="flex min-h-screen flex-col bg-background items-center">
      <Header />
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex flex-col items-center">
        <p>Register as owner</p>
        {user && privyId ? (
          <CreateOwner
            id={privyId}
            name={name}
            email={email}
            address={address}
          />
        ) : null}
      </div>
      <div className="flex flex-col items-center">
        <p>Register here your gyms</p>
        {user && privyId && address ? (
          <RegisterGym ownerId={privyId} address={address} />
        ) : null}
      </div>
      <div className="flex flex-col items-center">
        {user && privyId ? <GymTable ownerId={privyId} /> : null}
      </div>
    </div>
  );
}
