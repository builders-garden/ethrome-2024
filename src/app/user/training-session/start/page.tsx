"use client";

import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function UserQr() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/user");
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    const startTrainingSession = async () => {
      if (!user || !user.id) return;

      const data = await fetch(`/api/training-session/`, {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
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
    startTrainingSession();
  }, [user]);

  return (
    <div className="w-full min-h-screen">
      <h1 className="text-2xl font-bold">Training Session Started</h1>
      <Link href="/user">
        <Button>Back</Button>
      </Link>
    </div>
  );
}
