import { NextResponse } from "next/server";
import { aggregateHistory } from "@/lib/providers";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(aggregateHistory());
}
