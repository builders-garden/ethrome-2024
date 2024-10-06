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
import { User } from "@prisma/client";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

// const users = [
//   {
//     rank: 1,
//     username: "John Doe",
//     points: 100,
//   },
//   {
//     rank: 200,
//     username: "Mimmo",
//     points: 140,
//   },
//   {
//     rank: 3,
//     username: "Giovanni",
//     points: 160,
//   },
//   {
//     rank: 4,
//     username: "Giovanni",
//     points: 170,
//   },
// ];

const LeaderboardTable = () => {
  // const sortedUsers = users.sort((a, b) => b.points - a.points);

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const res = await fetch("/api/users/leaderboard");
      const data = await res.json();
      setUsers(data.data);
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col gap-2 my-10">
      <Table>
        <TableCaption>A list of the users in your league</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Total Cashback</TableHead>
            <TableHead>Username</TableHead>
            {/* <TableHead className="w-[100px]">Rank</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {index < 3 ? (
                    <Trophy
                      className={`w-4 h-4 ${
                        index === 0
                          ? "text-yellow-500"
                          : index === 1
                            ? "text-gray-500"
                            : index === 2
                              ? "text-orange-500"
                              : "text-gray-500"
                      }`}
                    />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </TableCell>
                <TableCell>{user.totalCashback}</TableCell>
                <TableCell>{user.name}</TableCell>
                {/* <TableCell>{user.rank}</TableCell> */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>
                Loading this amazing leaderboard...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
