import { AppBar } from "@/components/appbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="max-w-md">
        {children}
        <div className="sticky bottom-0 w-full bg-background">
          <AppBar />
        </div>
      </div>
    </div>
  );
}
