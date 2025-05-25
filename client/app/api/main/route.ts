"use server";
import { connect } from "@/dbConfig/dbConfig";
import Aircraft from "@/models/flightModels"
import { NextRequest,NextResponse } from "next/server";

connect()

export async function POST(request: NextRequest) {
    try {
    const body = await request.json();

    const { tailNumber, model, status, location } = body;

    // Basic validation
    if (!tailNumber || !model || !location?.lat || !location?.lng) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Create aircraft
    const newAircraft = await Aircraft.create({
      tailNumber,
      model,
      status: status || "maintenance", // default if not provided
      location,
    });

    return NextResponse.json(newAircraft, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";

        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const aircraftList = await Aircraft.find({}).lean();
        return NextResponse.json(aircraftList, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";

        return NextResponse.json({ error: message }, { status: 500 });
    }
}