"use client";

import { useState, useEffect, useCallback } from "react";
import type { AISession } from "@/lib/types";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<AISession[]>([]);
  const [search, setSearch] = useState("");

  const fetchHistory = useCallback(async () => {
    const res = await fetch("/api/history");
    setSessions(await res.json());
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filtered = search
    ? sessions.filter(
        (s) =>
          s.sessionId.toLowerCase().includes(search.toLowerCase()) ||
          s.project?.toLowerCase().includes(search.toLowerCase()) ||
          s.summary?.toLowerCase().includes(search.toLowerCase())
      )
    : sessions;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Session History</h1>
        <p className="text-foreground/50 text-sm mt-1">
          Past AI agent sessions ({sessions.length} total)
        </p>
      </div>

      <input
        type="text"
        placeholder="Search sessions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-3 py-2 text-sm rounded-lg border border-card-border bg-card-bg focus:outline-none focus:border-sidebar-active"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-foreground/40">
          <p>No sessions found</p>
        </div>
      ) : (
        <div className="rounded-lg border border-card-border bg-card-bg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border text-left text-xs text-foreground/40">
                <th className="py-2 px-3">Session</th>
                <th className="py-2 px-3">Project</th>
                <th className="py-2 px-3">Provider</th>
                <th className="py-2 px-3">Started</th>
                <th className="py-2 px-3">Summary</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((session) => (
                <tr
                  key={session.sessionId}
                  className="border-b border-card-border hover:bg-card-bg/50 transition-colors"
                >
                  <td className="py-2.5 px-3 text-xs font-mono text-foreground/50">
                    {session.sessionId.slice(0, 8)}...
                  </td>
                  <td className="py-2.5 px-3 text-sm">
                    {session.project
                      ? decodeURIComponent(
                          session.project.replace(/-/g, "/")
                        ).slice(0, 40)
                      : "-"}
                  </td>
                  <td className="py-2.5 px-3 text-xs capitalize">
                    {session.provider}
                  </td>
                  <td className="py-2.5 px-3 text-xs text-foreground/50">
                    {session.startTime
                      ? new Date(session.startTime).toLocaleString()
                      : "-"}
                  </td>
                  <td className="py-2.5 px-3 text-xs text-foreground/50 max-w-xs truncate">
                    {session.summary?.slice(0, 100) || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
