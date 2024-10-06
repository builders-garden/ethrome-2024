"use client";

import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function UserQr() {
  const { user } = usePrivy();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    const startTrainingSession = async () => {
      if (!user || !user.id) return;

      const data = await fetch(`/api/training-session/`, {
        method: "PUT",
        body: JSON.stringify({
          userId: user.id,
        }),
      }).then((res) => res.json());

      console.log("DIOMERDA 2", data);
      if (data.status !== "ok") {
        console.error("Training session not found", data);
        toast.error("Training session not found");
      } else {
        console.log("Training session started", data);
        toast.success("Training session started");
      }
    };
    if (initialized.current) {
      startTrainingSession();
    }
  }, [user]);

  return (
    <div className="w-full min-h-screen">
      <h1 className="text-2xl font-bold">Training Session End</h1>
      <Link href="/user">
        <Button>Back</Button>
      </Link>
    </div>
  );
}
