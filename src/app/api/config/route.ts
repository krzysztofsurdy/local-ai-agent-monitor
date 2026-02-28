import { NextResponse } from "next/server";
import { aggregateConfigs } from "@/lib/providers";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(aggregateConfigs());
}
