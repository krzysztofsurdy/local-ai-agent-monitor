import { NextResponse } from "next/server";
import { aggregateTasks } from "@/lib/providers";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const team = searchParams.get("team") || undefined;
  return NextResponse.json(aggregateTasks(team));
}
