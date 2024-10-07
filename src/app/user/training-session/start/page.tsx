"use client";

import { Button } from "@/components/ui/button";
import { TrainingSessionStatus } from "@/lib/db";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function TrainingSessionStart() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/user");
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    const updateTrainingSession = async () => {
      if (!user || !user.id) return;

      const data = await fetch(`/api/training-session/`, {
        method: "PUT",
        body: JSON.stringify({
          id,
          userId: user.id,
          status: TrainingSessionStatus.ENTERED,
        }),
      }).then((res) => res.json());

      console.log("START TRAINING SESSION", data);
      if (data.status !== "ok") {
        console.error("Training session not found", data);
        toast.error("Training session not found");
      } else {
        console.log("Training session started", data);
        toast.success("Training session started");
      }
    };
    updateTrainingSession();
  }, [id, user]);

  return (
    <div className="flex min-h-screen flex-col bg-background items-center">
      <h1 className="text-3xl font-bold">Training Session Started! 🏋🏽</h1>
      <h3 className="text-lg">Enjoy your workout!</h3>
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Link href="/user">
          <Button>Back</Button>
        </Link>
      </div>
    </div>
  );
}
