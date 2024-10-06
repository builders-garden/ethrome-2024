"use client";

import ChallengeCard from "@/components/user/challenge-card";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const challenges = [
  {
    name: "September Challenge",
    author: "John Doe",
    type: "monthly",
    progress: 50,
  },
  {
    name: "October Challenge",
    author: "John Doe",
    type: "monthly",
    progress: 10,
  },
];

export default function UserChallenges() {
  const { ready, authenticated } = usePrivy();

  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/user");
    }
  }, [ready, authenticated, router]);

  return (
    <div className="w-full min-h-screen">
      <h1 className="text-3xl font-bold px-4 py-4">Challenges 🏋🏽</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.name} {...challenge} />
        ))}
      </div>
    </div>
  );
}
