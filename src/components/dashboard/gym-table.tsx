"use client";

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

const getGymsByOwnerId = async (ownerId: string): Promise<Gym[]> => {
  const data = await fetch(`/api/gym?ownerId=${ownerId}`).then((res) =>
    res.json()
  );
  if (data.status === "nok") {
    return [];
  }
  return data.data;
};

const GymTable = ({ ownerId }: { ownerId: string }) => {
  const { data: gyms } = useQuery({
    queryKey: ["gyms"],
    queryFn: () => getGymsByOwnerId(ownerId),
  });

  return (
    <div className="flex flex-col gap-2 my-10">
      <Table>
        <TableCaption>A list of the users in your league</TableCaption>
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
                <Button>Edit</Button>
                <Button>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GymTable;
