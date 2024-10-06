import Link from "next/link";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";

export default function DashboardShowQR() {
  return (
    <div className="flex min-h-screen flex-col bg-background items-center">
      <Header />
      <h1 className="text-3xl font-bold">See dashboard QR codes</h1>
      <div className="min-h-[50vh] flex justify-center items-center">
        <div className="flex flex-row gap-4 items-center justify-between">
          <Link href="/dashboard/qr/start">
            <Button className="text-xl px-10 py-12 bg-blue-500 hover:bg-blue-700">
              Start Training
            </Button>
          </Link>
          <Link href="/dashboard/qr/end">
            <Button className="text-xl px-10 py-12 bg-indigo-500 hover:bg-indigo-700">
              End Training
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
