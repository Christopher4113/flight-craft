"use server";
import { connect } from "@/dbConfig/dbConfig";
import Aircraft from "@/models/flightModels";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const { tailNumber } = await context.params; 
    await connect();

    const aircraft = await Aircraft.findOne({ tailNumber }).lean();

    if (!aircraft) {
      return NextResponse.json({ error: "Aircraft not found" }, { status: 404 });
    }

    return NextResponse.json(aircraft, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch aircraft";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const { tailNumber } = await context.params; 
    await connect();

    const body = await request.json();
    const { status, model, location } = body;

    const updatedAircraft = await Aircraft.findOneAndUpdate(
      { tailNumber },
      { $set: { ...(status && { status }), ...(model && { model }), ...(location && { location }) } },
      { new: true }
    );

    if (!updatedAircraft) {
      return NextResponse.json({ error: "Aircraft not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAircraft, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update aircraft";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const { tailNumber } = await context.params; 
    await connect();

    const deleted = await Aircraft.findOneAndDelete({ tailNumber });

    if (!deleted) {
      return NextResponse.json({ error: "Aircraft not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Aircraft deleted" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete aircraft";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
