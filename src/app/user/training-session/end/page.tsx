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
    const endTrainingSession = async () => {
      if (!user || !user.id) return;

      const data = await fetch(`/api/training-session/`, {
        method: "PUT",
        body: JSON.stringify({
          userId: user.id,
        }),
      }).then((res) => res.json());

      console.log("END TRAINING SESSION", data);
      if (data.status !== "ok") {
        console.error("Training session not found", data);
        toast.error("Training session not found");
      } else {
        console.log("Training session started", data);
        toast.success("Training session started");
      }
    };
    endTrainingSession();
  }, [user]);

  return (
    <div className="w-full min-h-screen">
      <h1 className="text-2xl font-bold">Training Session Ended</h1>
      <Link href="/user">
        <Button>Back</Button>
      </Link>
    </div>
  );
}
