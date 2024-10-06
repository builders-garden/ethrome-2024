"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ScanQR from "@/components/user/scan-qr";

export default function UserQr() {
  const { ready, authenticated } = usePrivy();

  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/user");
    }
  }, [ready, authenticated, router]);

  return (
    <div className="w-full min-h-screen">
      <ScanQR />
    </div>
  );
}
