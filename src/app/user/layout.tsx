import { AppBar } from "@/components/appbar";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <div className="w-full">
          <div className="overflow-y-auto min-h-screen">
            <div className="w-full items-center max-w-md lg:max-w-md bg-background p-2 mx-auto">
              {children}
            </div>
          </div>
          <div className="sticky bottom-0 w-full bg-background max-w-md mx-auto">
            <AppBar />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
