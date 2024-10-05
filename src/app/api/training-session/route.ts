import {
  createTrainingSession,
  getTrainingSessionById,
  updateTrainingSession,
} from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export enum TrainingSessionStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  TERMINATED = "TERMINATED",
  REJECTED = "REJECTED",
}

const postHandler = async (req: NextRequest) => {
  const { status, gymId } = await req.json();
  if (!status || !gymId) {
    return NextResponse.json(
      {
        status: "nok",
        error: "Missing required fields (status, gymId)",
      },
      { status: 400, statusText: "Bad Request" }
    );
  }
  if (!Object.values(TrainingSessionStatus).includes(status)) {
    return NextResponse.json(
      {
        status: "nok",
        error: "Invalid status",
      },
      { status: 400, statusText: "Bad Request" }
    );
  }
  try {
    const result = await createTrainingSession({
      id: uuid(),
      status,
      gymId,
    });
    return NextResponse.json(
      { status: "ok", trainingSession: result },
      {
        status: 201,
        statusText: "Created",
      }
    );
  } catch (error) {
    console.error("Error while adding new training session", error);
    return NextResponse.json(
      {
        status: "nok",
        error: "Error while adding new training session",
      },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
};

const getHandler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { status: "nok", error: "Missing required query parameter: id" },
      { status: 400, statusText: "Bad Request" }
    );
  }

  const trainingSession = await getTrainingSessionById(id);

  return NextResponse.json({ status: "ok", data: trainingSession });
};

const putHandler = async (req: NextRequest) => {
  const { id, status, userId, gymId, secret } = await req.json();
  if (!id || !status || !userId || !gymId) {
    return NextResponse.json(
      {
        status: "nok",
        error: "Missing required fields (id, status, userId, gymId)",
      },
      { status: 400, statusText: "Bad Request" }
    );
  }
  if (!Object.values(TrainingSessionStatus).includes(status)) {
    return NextResponse.json(
      {
        status: "nok",
        error: "Invalid status",
      },
      { status: 400, statusText: "Bad Request" }
    );
  }
  const existingTrainingSession = await getTrainingSessionById(id);
  if (!existingTrainingSession) {
    return NextResponse.json(
      {
        status: "nok",
        error: "Training session not found",
      },
      { status: 404, statusText: "Not Found" }
    );
  }
  try {
    if (secret) {
      if (secret !== process.env.SECRET) {
        return NextResponse.json(
          {
            status: "nok",
            error: "Invalid secret",
          },
          { status: 403, statusText: "Forbidden" }
        );
      }
    }

    const result = await updateTrainingSession(id, {
      ...existingTrainingSession,
      status,
      userId,
    });
    return NextResponse.json(
      { status: "ok", trainingSession: result },
      {
        status: 200,
        statusText: "Updated",
      }
    );
  } catch (error) {
    console.error("Error while adding new training session", error);
    return NextResponse.json(
      {
        status: "nok",
        error: "Error while adding new training session",
      },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
};

export const GET = getHandler;
export const POST = postHandler;
export const PUT = putHandler;
