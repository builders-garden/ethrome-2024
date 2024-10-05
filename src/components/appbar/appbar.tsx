"use client";

import { Button } from "@/components/ui/button";
import { House, QrCode, Swords, TableProperties, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const IconButton = ({
  icon,
  pathname,
  href,
  isQr = false,
}: {
  icon: React.ReactNode;
  href: string;
  pathname: string;
  isQr?: boolean;
}) => {
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <Button
        variant={isQr ? (isActive ? "outline" : "default") : "ghost"}
        className={`px-3 py-6 ${
          isActive ? "text-primary hover:text-primary" : ""
        }`}
      >
        {icon}
      </Button>
    </Link>
  );
};

const AppBar = () => {
  const pathname = usePathname();
  console.log(pathname);

  const icons = [
    {
      id: "home-icon",
      icon: <House size={32} />,
      href: "/user",
      pathname: pathname,
    },
    {
      id: "leaderboard-icon",
      icon: <TableProperties size={32} />,
      href: "/user/leaderboard",
      pathname: pathname,
    },
    {
      id: "qr-icon",
      icon: <QrCode size={32} />,
      href: "/user/qr",
      pathname: pathname,
      isQr: true,
    },
    {
      id: "challenges-icon",
      icon: <Swords size={32} />,
      href: "/user/challenges",
      pathname: pathname,
    },
    {
      id: "profile-icon",
      icon: <User size={32} />,
      href: "/user/profile",
      pathname: pathname,
    },
  ];

  return (
    <div className="flex items-center justify-between px-1 py-2 rounded-md bg-[#FFE0E7]">
      {icons.map((icon) => (
        <IconButton
          key={icon.id}
          icon={icon.icon}
          href={icon.href}
          pathname={icon.pathname}
          isQr={icon.isQr}
        />
      ))}
    </div>
  );
};

export { AppBar };
