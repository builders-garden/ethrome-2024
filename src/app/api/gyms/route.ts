import { NextResponse } from "next/server";
import { getGyms } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log({ searchParams });
    const gyms = await getGyms();
    return NextResponse.json({ data: gyms, status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error getting gyms:", error);
    return NextResponse.json(
      { status: "nok", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
