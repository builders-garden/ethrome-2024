import { NextResponse } from "next/server";
import { getUsersByGymId } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gymId = searchParams.get("gymId");

    if (!gymId) {
      console.error("Missing params", gymId);
      return NextResponse.json(
        { status: "nok", error: "Missing gymId" },
        { status: 400 }
      );
    }

    const users = await getUsersByGymId(gymId);

    return NextResponse.json({ data: users, status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error getting gym users:", error);
    return NextResponse.json(
      { status: "nok", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
