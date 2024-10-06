"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const getUsersByGymId = async (gymId: string): Promise<User[]> => {
  const data = await fetch(`/api/users?gymId=${gymId}`).then((res) =>
    res.json()
  );
  if (data.status === "nok") {
    return [];
  }
  return data.data;
};

const GymUsers = ({ id }: { id: string }) => {
  const { data: users } = useQuery({
    queryKey: ["users", id],
    queryFn: () => getUsersByGymId(id),
    enabled: !!id,
  });
  return (
    <div className="flex flex-col gap-2 my-10 min-h-[50vh]">
      <Table>
        <TableCaption>A list of the users in your Gyat</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Monthly Cashback</TableHead>
            <TableHead>Total Cashback</TableHead>
            <TableHead>Rank</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="min-h-[50vh]">
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2 px-2">
                  <>
                    {!user.profileImage ? (
                      <DefaultUserIcon />
                    ) : (
                      <Image
                        src={user.profileImage}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.monthlyCashback}</TableCell>
              <TableCell>{user.totalCashback}</TableCell>
              <TableCell>{user.rank}</TableCell>
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

export default GymUsers;

const DefaultUserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path
      fillRule="evenodd"
      d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      clipRule="evenodd"
    />
  </svg>
);
