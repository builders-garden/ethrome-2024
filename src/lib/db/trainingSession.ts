import { TrainingSession } from "@prisma/client";
import prisma from "./prisma";

export async function getTrainingSessionsByUserId(
  userId: string
): Promise<TrainingSession[] | null> {
  return await prisma.trainingSession.findMany({
    where: {
      userId,
    },
  });
}

export async function getTrainingSessionById(
  id: string
): Promise<TrainingSession | null> {
  return await prisma.trainingSession.findUnique({
    where: {
      id,
    },
  });
}

export async function updateTrainingSession(
  id: string,
  data: TrainingSession
): Promise<TrainingSession> {
  return await prisma.trainingSession.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteTrainingSession(
  id: string
): Promise<TrainingSession> {
  return await prisma.trainingSession.delete({
    where: {
      id,
    },
  });
}
