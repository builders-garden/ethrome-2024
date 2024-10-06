"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Gym } from "@prisma/client";

const getAllGyms = async () => {
  const data = await fetch("/api/gyms").then((res) => res.json());
  return data.data;
};

function OnboardUser({
  ready,
  authenticated,
  privyId,
  name,
  email,
  address,
}: {
  ready: boolean;
  authenticated: boolean;
  privyId: string;
  name: string;
  email: string;
  address: string;
}) {
  const sheetTriggerRef = useRef<HTMLButtonElement>(null);
  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [gymId, setGymId] = useState<string | null>(null);

  const { data: gyms, isFetched } = useQuery({
    queryKey: ["gyms"],
    queryFn: () => getAllGyms(),
  });

  useEffect(() => {
    if (ready && authenticated) {
      fetch(`/api/user?userId=${privyId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            console.log("User already onboarded");
          } else {
            sheetTriggerRef.current?.click();
          }
        });
    }
  }, [ready, authenticated, privyId]);

  const handleSubmit = async () => {
    const userData = {
      userId: privyId,
      name: newName,
      email: newEmail,
      address,
      gymId,
    };
    const user = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(userData),
    }).then((res) => res.json());

    if (user.status === "ok") {
      console.log("user created", user);
      toast.success("User created successfully");
    } else {
      console.error("user creation failed", user);
      toast.error("User creation failed");
    }
  };

  return (
    <Sheet>
      <SheetTrigger ref={sheetTriggerRef} className="hidden" />
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Register</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name *
            </Label>
            <Input
              id="name"
              value={newName}
              className="col-span-3"
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Email *
            </Label>
            <Input
              id="email"
              value={newEmail}
              type="email"
              className="col-span-3"
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Gym *
            </Label>
            <Select onValueChange={(value) => setGymId(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select your gym" />
              </SelectTrigger>
              <SelectContent>
                {isFetched && gyms && gyms.length > 0 ? (
                  gyms.map((gym: Gym) => (
                    <SelectItem key={gym.id} value={gym.id}>
                      {gym.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="undefined">No gyms found</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!newName || !newEmail || !gymId}
            >
              Register
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default OnboardUser;
