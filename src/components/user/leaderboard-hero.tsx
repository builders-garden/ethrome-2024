"use client";
import { User } from "@prisma/client";
import { usePrivy } from "@privy-io/react-auth";
import { Shield, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

const LeaderboardHero = () => {
  const { user } = usePrivy();
  const defaultSize = 50;
  const expandedSize = 70;

  const [allUsers, setAllUsers] = useState<User[]>([]);
  useEffect(() => {
    async function fetchAllUsers() {
      const res = await fetch("/api/users/leaderboard?limit=100");
      const data = await res.json();
      setAllUsers(data.data);
    }
    fetchAllUsers();
  }, []);

  // search for user in allUsers to get the rank
  const userRank = (userId: string) => {
    return allUsers.findIndex((u) => u.id === userId) + 1;
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 gap-4">
      <div className="flex items-center justify-between w-full pt-4">
        <Shield
          size={defaultSize}
          className="text-orange-900 fill-orange-900"
        />
        <Shield size={defaultSize} className="text-slate-400 fill-slate-400" />
        <Shield
          size={defaultSize}
          className="text-orange-500 fill-orange-500"
        />
        <Shield size={expandedSize} className="text-green-500 fill-green-500" />
        <ShieldAlert
          size={defaultSize}
          className="text-slate-400"
          strokeWidth={1.25}
        />
        <ShieldAlert
          size={defaultSize}
          className="text-slate-400"
          strokeWidth={1.25}
        />
      </div>

      <h1 className="text-3xl font-bold">Emerald League</h1>

      <div className="flex gap-4 w-full">
        <div className="bg-red-200 p-4 rounded-lg text-center w-full">
          <p className="text-sm font-semibold">Your Position</p>
          {user?.id ? (
            <p className="text-3xl font-bold">{`${userRank(user?.id)} th`}</p>
          ) : (
            <Skeleton className="h-[32px] w-[5rem] rounded-full my-2" />
          )}
          <p className="text-xs">Keep going!</p>
        </div>

        <div className="bg-red-200 p-4 rounded-lg text-center w-full">
          <p className="text-sm font-semibold">Time Left</p>
          <p className="text-3xl font-bold">2d 14h</p>
          <p className="text-xs">League ends Sunday at 20:00</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardHero;
