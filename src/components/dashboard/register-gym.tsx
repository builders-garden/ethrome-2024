"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus } from "lucide-react";

function RegisterGym({
  address,
  ownerId,
  setRefetchGym,
}: {
  address: string;
  ownerId: string;
  setRefetchGym: (refetch: boolean) => void;
}) {
  const closeDialogRef = useRef<HTMLButtonElement>(null);
  const [gymName, setGymName] = useState("");
  const [monthlyFee, setMonthlyFee] = useState(0);
  const [cashbackPercentage, setCashbackPercentage] = useState(0);

  const handleSubmit = async () => {
    const gymData = {
      name: gymName,
      monthlyFee,
      cashbackPercentage,
      address,
      ownerId,
    };

    const gym = await fetch("/api/gym", {
      method: "POST",
      body: JSON.stringify(gymData),
    }).then((res) => res.json());

    if (gym.status === "ok") {
      console.log("Gym created", gym);
      toast.success("Gym created", {
        description: `${gym.data.name} created successfully`,
      });
      setRefetchGym(true);
      closeDialogRef.current?.click();
      setGymName("");
      setMonthlyFee(0);
      setCashbackPercentage(0);
    } else {
      console.log("Error creating gym", gym);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex flex-row gap-2 items-center">
          <Plus size={16} /> Register Gym
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register New Gym</DialogTitle>
          <DialogDescription>
            Enter the details of the new gym. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Gym Name
            </Label>
            <Input
              id="name"
              name="name"
              className="col-span-3"
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="monthlyFee" className="text-right">
              Monthly Fee
            </Label>
            <Input
              id="monthlyFee"
              name="monthlyFee"
              type="number"
              className="col-span-3"
              onChange={(e) => setMonthlyFee(parseFloat(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cashbackPercentage" className="text-right">
              Cashback %
            </Label>
            <Input
              id="cashbackPercentage"
              name="cashbackPercentage"
              type="number"
              step="0.01"
              className="col-span-3"
              onChange={(e) =>
                setCashbackPercentage(parseFloat(e.target.value))
              }
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose ref={closeDialogRef} className="hidden" />
          <Button type="submit" onClick={handleSubmit}>
            Register Gym
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RegisterGym;
