import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createGym, getGymsByOwnerId } from "@/lib/db";
import { parseEther } from "viem";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId");

    if (!ownerId) {
      console.error("Missing params", ownerId);
      return NextResponse.json(
        { status: "nok", error: "Missing ownerId parameter" },
        { status: 400 }
      );
    }

    const gyms = await getGymsByOwnerId(ownerId);
    return NextResponse.json({ data: gyms, status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error getting gyms:", error);
    return NextResponse.json(
      { status: "nok", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, monthlyFee, cashbackPercentage, address, ownerId } = body;

    // Validate input
    if (!name || !monthlyFee || !cashbackPercentage || !address || !ownerId) {
      console.error("Missing required fields", body);
      return NextResponse.json(
        { status: "nok", error: "Missing required fields" },
        { status: 400 }
      );
    }

    if(cashbackPercentage < 0 || cashbackPercentage > 100) {
      console.error("Cashback percentage must be between 0 and 100", cashbackPercentage);
      return NextResponse.json(
        { status: "nok", error: "Cashback percentage must be between 0 and 100" },
        { status: 400 }
      );
    }

    const gym = await createGym({
      id: uuidv4(),
      name,
      monthlyFee,
      cashbackPercentage: cashbackPercentage / 100,
      address,
      ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      flowRate: parseEther((monthlyFee * (cashbackPercentage/100) / (365/12 * 24 * 60 * 60)).toFixed(18)).toString(),
    });
    console.log("Gym created", gym);
    return NextResponse.json({ data: gym, status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error creating gym:", error);
    return NextResponse.json(
      { status: "nok", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
