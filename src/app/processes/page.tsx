"use client";

import { useState } from "react";
import { ProcessCard } from "@/components/process-card";
import { useSSE } from "@/lib/use-sse";
import type { AIProcess } from "@/lib/types";

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<AIProcess[]>([]);

  useSSE((event, data) => {
    if (event === "processes") {
      setProcesses(data as AIProcess[]);
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Processes</h1>
        <p className="text-foreground/50 text-sm mt-1">
          Running AI agent CLI processes and their children
        </p>
      </div>

      {processes.length === 0 ? (
        <div className="text-center py-16 text-foreground/40">
          <p className="text-lg">No AI agent processes running</p>
          <p className="text-sm mt-1">
            Processes will appear here automatically when detected
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {processes.map((proc) => (
            <ProcessCard
              key={proc.pid}
              pid={proc.pid}
              command={proc.command}
              args={proc.args}
              uptime={proc.uptime}
              children={proc.children}
            />
          ))}
        </div>
      )}

      <div className="text-xs text-foreground/30">
        Auto-refreshing every 3 seconds via SSE
      </div>
    </div>
  );
}
