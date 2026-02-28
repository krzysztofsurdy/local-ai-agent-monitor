import { NextResponse } from "next/server";
import { aggregateProcesses } from "@/lib/providers";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(aggregateProcesses());
}
