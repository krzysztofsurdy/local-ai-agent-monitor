import { NextResponse } from "next/server";
import { aggregateTeams } from "@/lib/providers";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(aggregateTeams());
}
