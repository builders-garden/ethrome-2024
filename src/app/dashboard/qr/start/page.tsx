"use client";

import { v4 as uuidv4 } from "uuid";
import { Header } from "@/components/header";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

import { APP_URL } from "@/lib/utils";

export default function DashboardQR() {
  const [dynamicUUID, setDynamicUUID] = useState("");

  const TWO_SECONDS = 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicUUID(uuidv4());
    }, TWO_SECONDS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  const link = `${APP_URL}/user/training-session/start/?id=${dynamicUUID}`;

  return (
    <div className="flex min-h-screen flex-col bg-background items-center">
      <Header />
      <h1 className="text-3xl font-bold">Dashboard QR</h1>
      <div className="flex flex-col items-center">
        <p>training {dynamicUUID}</p>
        {dynamicUUID && <QRCode value={link} />}
      </div>
    </div>
  );
}
