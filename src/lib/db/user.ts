import { User } from "@prisma/client";
import prisma from "./prisma";

export async function getUsersByGymId(gymId: string): Promise<User[]> {
  return await prisma.user.findMany({
    where: {
      gymId: gymId,
    },
  });
}

export async function getUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(data: User): Promise<User | null> {
  return await prisma.user.create({
    data,
  });
}

export async function updateUser(id: string, data: User): Promise<User | null> {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string): Promise<User | null> {
  return await prisma.user.delete({
    where: { id },
  });
}
