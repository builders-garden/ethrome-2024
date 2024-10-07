import { NextResponse } from "next/server";
import { getGymById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      console.error("Missing params", id);
      return NextResponse.json(
        { status: "nok", error: "Missing ownerId parameter" },
        { status: 400 },
      );
    }

    const gym = await getGymById(id);
    return NextResponse.json({ data: gym, status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error getting gyms:", error);
    return NextResponse.json(
      { status: "nok", error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
