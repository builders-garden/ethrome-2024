"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import LeaderboardHero from "@/components/user/leaderboard-hero";
import LeaderboardTable from "@/components/user/leaderboard-table";

export default function UserLeaderboard() {
  const { ready, authenticated } = usePrivy();

  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/user");
    }
  }, [ready, authenticated, router]);
  return (
    <div className="min-h-screen w-full">
      <LeaderboardHero />
      <LeaderboardTable />
    </div>
  );
}
