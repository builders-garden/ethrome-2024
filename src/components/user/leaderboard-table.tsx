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
import { Trophy } from "lucide-react";

const users = [
  {
    rank: 1,
    username: "John Doe",
    points: 100,
  },
  {
    rank: 200,
    username: "Mimmo",
    points: 140,
  },
  {
    rank: 3,
    username: "Giovanni",
    points: 160,
  },
  {
    rank: 4,
    username: "Giovanni",
    points: 170,
  },
];

const LeaderboardTable = () => {
  const sortedUsers = users.sort((a, b) => b.points - a.points);

  return (
    <div className="flex flex-col gap-2 my-10">
      <Table>
        <TableCaption>A list of the users in your league</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Username</TableHead>
            <TableHead className="w-[100px]">Rank</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user, index) => (
            <TableRow key={user.username}>
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
              <TableCell>{user.points}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.rank}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
