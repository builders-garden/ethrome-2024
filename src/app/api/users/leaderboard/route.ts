import { getUsersLeaderboard } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // get limit from query params
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");
    const users = await getUsersLeaderboard(
      limit ? parseInt(limit) : undefined,
    );
    return NextResponse.json({ status: "ok", data: users }, { status: 200 });
  } catch (error) {
    console.error("Error getting gyms:", error);
    return NextResponse.json(
      { status: "nok", error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
