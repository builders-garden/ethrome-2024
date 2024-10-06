"use client";

import { Button } from "@/components/ui/button";
import { House, QrCode, Shield, Swords, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const IconButton = ({
  icon,
  pathname,
  href,
  isQr = false,
  name,
}: {
  icon: React.ReactNode;
  href: string;
  pathname: string;
  isQr?: boolean;
  name?: string;
}) => {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center ${
        isActive ? "text-red-500" : ""
      }`}
    >
      <Button
        variant={isQr ? (isActive ? "outline" : "default") : "ghost"}
        className={`px-3 py-6 active:bg-none focus-visible:!bg-none hover:bg-none ${
          name ? "pb-5" : ""
        }`}
      >
        {icon}
      </Button>
      {name && <span className="text-xs text-center">{name}</span>}
    </Link>
  );
};

const AppBar = () => {
  const pathname = usePathname();

  const strokeWidth = 1.25;

  const icons = [
    {
      id: "home-icon",
      icon: <House size={32} strokeWidth={strokeWidth} />,
      href: "/user",
      pathname: pathname,
      name: "Home",
    },
    {
      id: "leaderboard-icon",
      icon: <Shield size={32} strokeWidth={strokeWidth} />,
      href: "/user/leaderboard",
      pathname: pathname,
      name: "League",
    },
    {
      id: "qr-icon",
      icon: <QrCode size={32} strokeWidth={strokeWidth} />,
      href: "/user/qr",
      pathname: pathname,
      isQr: true,
    },
    {
      id: "challenges-icon",
      icon: <Swords size={32} strokeWidth={strokeWidth} />,
      href: "/user/challenges",
      pathname: pathname,
      name: "Challenges",
    },
    {
      id: "profile-icon",
      icon: <User size={32} strokeWidth={strokeWidth} />,
      href: "/user/profile",
      pathname: pathname,
      name: "Profile",
    },
  ];

  return (
    <div
      className="flex items-center justify-between px-1 py-2 rounded-t-xl bg-red-200"
      style={{ boxShadow: "0px -9px 11px -3px rgba(0,0,0,0.1)" }}
    >
      {icons.map((icon) => (
        <IconButton
          key={icon.id}
          icon={icon.icon}
          href={icon.href}
          pathname={icon.pathname}
          isQr={icon.isQr}
          name={icon.name}
        />
      ))}
    </div>
  );
};

export { AppBar };
