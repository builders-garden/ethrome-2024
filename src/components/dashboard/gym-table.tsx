"use client";

import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Gym } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";

const getGymsByOwnerId = async (ownerId: string): Promise<Gym[]> => {
  const data = await fetch(`/api/gym?ownerId=${ownerId}`).then((res) =>
    res.json()
  );
  if (data.status === "nok") {
    return [];
  }
  return data.data;
};

const GymTable = ({
  ownerId,
  refetchGym,
  setRefetchGym,
  setGyms,
}: {
  ownerId: string;
  refetchGym: boolean;
  setRefetchGym: (refetch: boolean) => void;
  setGyms: (gyms: Gym[]) => void;
}) => {
  const { data: gyms, isSuccess } = useQuery({
    queryKey: ["gyms"],
    queryFn: () => getGymsByOwnerId(ownerId),
    enabled: refetchGym,
  });

  useEffect(() => {
    if (isSuccess) {
      setRefetchGym(false);
      setGyms(gyms);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <div className="flex flex-col gap-2 my-10">
      <Table>
        <TableCaption>A list of your gyms</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Monthly Fee</TableHead>
            <TableHead>Cashback Percentage</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gyms?.map((gym) => (
            <TableRow key={gym.id}>
              <TableCell className="font-medium">{gym.name}</TableCell>
              <TableCell>{gym.monthlyFee}</TableCell>
              <TableCell>{gym.cashbackPercentage}</TableCell>
              <TableCell>
                <Button variant="ghost">
                  <Pencil size={16} className="text-primary" />
                </Button>
                <Button variant="ghost">
                  <X size={16} className="text-primary" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GymTable;
