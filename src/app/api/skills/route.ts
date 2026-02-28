import { NextResponse } from "next/server";
import { aggregateSkills } from "@/lib/providers";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(aggregateSkills());
}
