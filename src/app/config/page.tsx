"use client";

import { useState, useEffect, useCallback } from "react";
import { ConfigViewer } from "@/components/config-viewer";
import { useSSE } from "@/lib/use-sse";
import type { AIConfig } from "@/lib/types";

export default function ConfigPage() {
  const [configs, setConfigs] = useState<AIConfig[]>([]);

  const fetchConfig = useCallback(async () => {
    const res = await fetch("/api/config");
    setConfigs(await res.json());
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useSSE((event) => {
    if (event === "fileChange") fetchConfig();
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuration</h1>
        <p className="text-foreground/50 text-sm mt-1">
          AI agent configuration and rules files
        </p>
      </div>

      {configs.map((config) => (
        <div key={config.provider} className="space-y-4">
          <h2 className="text-lg font-semibold capitalize">
            {config.provider}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ConfigViewer
              title="Global Rules (CLAUDE.md)"
              content={config.globalRules}
              language="markdown"
            />
            <div className="space-y-4">
              <ConfigViewer
                title="settings.json"
                content={
                  config.settings ? JSON.stringify(config.settings) : null
                }
                language="json"
              />
              <ConfigViewer
                title="settings.local.json"
                content={
                  config.settingsLocal
                    ? JSON.stringify(config.settingsLocal)
                    : null
                }
                language="json"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
