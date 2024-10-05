import { AppBar } from "@/components/appbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="w-full">
        <div className="overflow-y-auto min-h-screen">
          <div className="w-full items-center max-w-sm lg:max-w-md bg-background rounded-xl p-2 mx-auto">
            {children}
          </div>
        </div>
        <div className="sticky bottom-0 w-full bg-background">
          <AppBar />
        </div>
      </div>
    </div>
  );
}
