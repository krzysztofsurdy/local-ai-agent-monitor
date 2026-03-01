import { NextResponse } from "next/server";
import {
  aggregateMCPServers,
  aggregatePluginDetails,
  aggregateMarketplaces,
} from "@/lib/providers";

export const dynamic = "force-dynamic";

export async function GET() {
  const mcpServers = aggregateMCPServers();
  const plugins = aggregatePluginDetails();
  const marketplaces = aggregateMarketplaces();

  return NextResponse.json({ mcpServers, plugins, marketplaces });
}
