import { NextResponse } from "next/server";
import { aggregateConversationSessions } from "@/lib/providers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  const sessions = aggregateConversationSessions(limit);
  return NextResponse.json(sessions);
}
