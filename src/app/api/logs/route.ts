import { NextResponse } from "next/server";
import { aggregateLogFiles, getAllAdapters } from "@/lib/providers";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  if (file) {
    // Try all adapters for log content
    for (const adapter of getAllAdapters()) {
      const content = adapter.getLogContent(file);
      if (content) {
        return NextResponse.json({ content });
      }
    }
    return NextResponse.json({ content: "" });
  }

  return NextResponse.json(aggregateLogFiles());
}
