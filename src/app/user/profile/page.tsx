"use client";

import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserProfile() {

  const { logout, ready, authenticated } = usePrivy();

  const router = useRouter()

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/user")
    }
  }, [ready, authenticated, router])
  
  return (
    <div className="w-full min-h-screen">
      <h1 className="text-3xl font-bold px-4 py-4">Profile 👤</h1>
      <Button className="bg-red-500" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
