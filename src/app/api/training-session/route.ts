import {
  createTrainingSession,
  getTrainingSessionById,
  getUserById,
  updateTrainingSession,
  updateUser,
  getGymById,
} from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export const dynamic = "force-dynamic";

const postHandler = async (req: NextRequest) => {
  const { gymId, status } = await req.json();
  if (!gymId || !status) {
    return NextResponse.json(
      {
        status: "nok",
        error: "Missing params!",
      },
      { status: 400, statusText: "Bad Request" },
    );
  }
  const gym = await getGymById(gymId);
  if (!gym) {
    return NextResponse.json(
      {
        status: "nok",
        error: "Gym not found",
      },
      { status: 404, statusText: "Not Found" },
    );
  }
  try {
    const trainingSession = await createTrainingSession({
      id: uuid(),
      status,
      gymId,
      // userId,
    });
    return NextResponse.json(
      { status: "ok", data: trainingSession },
      {
        status: 201,
        statusText: "Created",
      },
    );
  } catch (error) {
    console.error("Error while adding new training session", error);
    return NextResponse.json(
      {
        status: "nok",
        error: "Error while adding new training session",
      },
      { status: 500, statusText: "Internal Server Error" },
    );
  }
};

const getHandler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { status: "nok", error: "Missing required query parameter: id" },
      { status: 400, statusText: "Bad Request" },
    );
  }

  const trainingSession = await getTrainingSessionById(id);

  return NextResponse.json({ status: "ok", data: trainingSession });
};

const putHandler = async (req: NextRequest) => {
  const { id, userId, status } = await req.json();
  if (!id || !userId || !status) {
    return NextResponse.json(
      {
        status: "nok",
        error: "Missing params!",
      },
      { status: 400, statusText: "Bad Request" },
    );
  }
  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json(
      {
        status: "nok",
        error: "User not found",
      },
      { status: 404, statusText: "Not Found" },
    );
  }
  const existingTrainingSession = await getTrainingSessionById(id);
  if (!existingTrainingSession) {
    return NextResponse.json(
      {
        status: "nok",
        error: "Training session not found",
      },
      { status: 404, statusText: "Not Found" },
    );
  }
  try {
    // TODO: calculate here the stream AMOUNT
    const cashback = 1;
    const result = await updateTrainingSession(id, {
      status,
      userId,
    });
    // update user cashback fields
    // check if it's a new month
    const now = new Date();
    await updateUser(userId, {
      monthlyCashback:
        now.getMonth() != new Date(user.updatedAt).getMonth()
          ? cashback
          : user.monthlyCashback + cashback,
      totalCashback: user.totalCashback + cashback,
    });
    return NextResponse.json(
      { status: "ok", trainingSession: result },
      {
        status: 200,
        statusText: "Updated",
      },
    );
  } catch (error) {
    console.error("Error while adding new training session", error);
    return NextResponse.json(
      {
        status: "nok",
        error: "Error while adding new training session",
      },
      { status: 500, statusText: "Internal Server Error" },
    );
  }
};

export const GET = getHandler;
export const POST = postHandler;
export const PUT = putHandler;
