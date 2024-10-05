"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateOwnerProps {
  id: string;
  email: string;
  name: string;
  address: string;
}

function CreateOwner({ id, name, email, address }: CreateOwnerProps) {
  const [ownerName, setOwnerName] = useState(name);
  const [ownerEmail, setOwnerEmail] = useState(email);

  const handleSubmit = async () => {
    const ownerData = {
      id,
      name: ownerName,
      email: ownerEmail,
      address: address,
    };
    const owner = await fetch("/api/owner", {
      method: "POST",
      body: JSON.stringify(ownerData),
    });
    console.log(owner);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Owner</Button>
      </DialogTrigger>
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

export default CreateOwner;
