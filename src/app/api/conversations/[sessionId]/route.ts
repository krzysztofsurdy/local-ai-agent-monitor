import { NextResponse } from "next/server";
import { aggregateConversationMessages } from "@/lib/providers";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const { searchParams } = new URL(request.url);
  const project = searchParams.get("project") || "";

  if (!project || !sessionId) {
    return NextResponse.json(
      { error: "project and sessionId are required" },
      { status: 400 }
    );
  }

  const messages = aggregateConversationMessages(project, sessionId);
  return NextResponse.json(messages);
}
