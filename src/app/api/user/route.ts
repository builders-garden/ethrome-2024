import { NextResponse } from "next/server";
import { getUserById } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      console.error("Missing params", userId);
      return NextResponse.json(
        { status: "nok", error: "Missing userId" },
        { status: 400 }
      );
    }

    const user = await getUserById(userId);

    return NextResponse.json({ data: user, status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { status: "nok", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
