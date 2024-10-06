import { NextResponse } from "next/server";
import { createUser, getUserById } from "@/lib/db";

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

    if (!user) {
      return NextResponse.json(
        { status: "nok", error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user, status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { status: "nok", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, name, email, address, profileImage, gymId } =
      await request.json();

    if (!userId || !name || !email || !address || !gymId) {
      console.error("Missing params", userId, name, email, address, gymId);
      return NextResponse.json(
        { status: "nok", error: "Missing params" },
        { status: 400 }
      );
    }

    const userData = {
      id: userId,
      name: name,
      email: email,
      address: address,
      profileImage: profileImage,
      gymId: gymId,
      monthlyCashback: 0,
      totalCashback: 0,
      rank: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const user = await createUser(userData);
    console.log("User created", user);
    return NextResponse.json({ data: user, status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { status: "nok", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
