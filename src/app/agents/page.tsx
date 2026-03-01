"use client";

import { useState, useEffect, useCallback } from "react";
import { MCPServerCard } from "@/components/mcp-server-card";
import { PluginCard } from "@/components/plugin-card";
import type { AIMCPServer, AIPluginDetail, AIMarketplace } from "@/lib/types";

interface AgentsData {
  mcpServers: AIMCPServer[];
  plugins: AIPluginDetail[];
  marketplaces: AIMarketplace[];
}

export default function AgentsPage() {
  const [data, setData] = useState<AgentsData>({
    mcpServers: [],
    plugins: [],
    marketplaces: [],
  });

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/agents");
    setData(await res.json());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Agents & Tools</h1>
        <p className="text-foreground/50 text-sm mt-1">
          MCP servers, plugins, and marketplaces
        </p>
      </div>

      {/* MCP Servers */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          MCP Servers ({data.mcpServers.length})
        </h2>
        {data.mcpServers.length === 0 ? (
          <div className="text-sm text-foreground/40 py-8 text-center rounded-lg border border-card-border bg-card-bg">
            No MCP servers configured
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.mcpServers.map((server) => (
              <MCPServerCard
                key={server.name}
                name={server.name}
                command={server.command}
                args={server.args}
                envKeys={server.envKeys}
              />
            ))}
          </div>
        )}
      </section>

      {/* Plugins */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          Plugins ({data.plugins.length})
        </h2>
        {data.plugins.length === 0 ? (
          <div className="text-sm text-foreground/40 py-8 text-center rounded-lg border border-card-border bg-card-bg">
            No plugins installed
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.plugins.map((plugin) => (
              <PluginCard
                key={`${plugin.name}@${plugin.marketplace}`}
                name={plugin.name}
                marketplace={plugin.marketplace}
                version={plugin.version}
                scope={plugin.scope}
                description={plugin.description}
                keywords={plugin.keywords}
                author={plugin.author}
                installPath={plugin.installPath}
                installedAt={plugin.installedAt}
                lastUpdated={plugin.lastUpdated}
                gitCommitSha={plugin.gitCommitSha}
              />
            ))}
          </div>
        )}
      </section>

      {/* Marketplaces */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          Marketplaces ({data.marketplaces.length})
        </h2>
        {data.marketplaces.length === 0 ? (
          <div className="text-sm text-foreground/40 py-8 text-center rounded-lg border border-card-border bg-card-bg">
            No marketplaces configured
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.marketplaces.map((mp) => (
              <div
                key={mp.name}
                className="rounded-lg border border-card-border bg-card-bg p-4"
              >
                <h3 className="font-semibold text-sm mb-1">{mp.name}</h3>
                <div className="text-xs text-foreground/50 space-y-1">
                  <div className="font-mono truncate">{mp.repoUrl}</div>
                  {mp.lastUpdated && (
                    <div>
                      Updated:{" "}
                      {new Date(mp.lastUpdated).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
