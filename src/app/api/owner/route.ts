import { NextResponse } from "next/server";
import { createOwner, getOwnerById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      console.error("Missing required fields");
      return NextResponse.json(
        { status: "nok", error: "Missing required fields" },
        { status: 400 },
      );
    }
    const owner = await getOwnerById(id);

    if (owner) {
      return NextResponse.json({ data: owner, status: "ok" }, { status: 200 });
    } else {
      return NextResponse.json(
        { status: "nok", error: "Owner not found" },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("Error getting owner:", error);
    return NextResponse.json(
      { status: "nok", error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email } = body;

    // Validate input
    if (!id || !name || !email) {
      return NextResponse.json(
        { status: "nok", error: "Missing required fields" },
        { status: 400 },
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
      { status: 500 },
    );
  }
}
