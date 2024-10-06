"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OnboardOwnerProps {
  ready: boolean;
  authenticated: boolean;
  name: string;
  email: string;
  privyId: string;
}

function OnboardOwner({
  ready,
  authenticated,
  name,
  email,
  privyId,
}: OnboardOwnerProps) {
  const [ownerName, setOwnerName] = useState(name);
  const [ownerEmail, setOwnerEmail] = useState(email);

  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ready && authenticated) {
      fetch(`/api/owner?id=${privyId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            console.log("Owner already exists");
          } else {
            dialogTriggerRef.current?.click();
          }
        });
    }
  }, [ready, authenticated, privyId]);

  const handleSubmit = async () => {
    const ownerData = {
      id: privyId,
      name: ownerName,
      email: ownerEmail,
    };
    const owner = await fetch("/api/owner", {
      method: "POST",
      body: JSON.stringify(ownerData),
    });
    console.log("owner created", owner);
  };

  return (
    <Dialog>
      <DialogTrigger ref={dialogTriggerRef} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Owner</DialogTitle>
          <DialogDescription>
            Enter the details of the new owner. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Owner Name
            </Label>
            <Input
              id="name"
              name="name"
              className="col-span-3"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              className="col-span-3"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Create Owner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OnboardOwner;
