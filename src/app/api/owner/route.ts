import { NextResponse } from "next/server";
import { createOwner } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email } = body;

    // Validate input
    if (!id || !name || !email) {
      return NextResponse.json(
        { status: "nok", error: "Missing required fields" },
        { status: 400 }
      );
    }

    const owner = await createOwner({
      id,
      name,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ data: owner, status: "ok" }, { status: 201 });
  } catch (error) {
    console.error("Error creating gym:", error);
    return NextResponse.json(
      { status: "nok", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
