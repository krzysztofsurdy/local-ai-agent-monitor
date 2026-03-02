"use client";

import { useState, useEffect, useCallback } from "react";
import { AgentTimeline } from "@/components/agent-timeline";
import { buildTeamTimeline } from "@/lib/timeline-builder";
import { useSSE } from "@/lib/use-sse";
import type { AITeam, AITask } from "@/lib/types";
import type { TeamTimeline as TeamTimelineType } from "@/lib/timeline-builder";

export default function TimelinePage() {
  const [timelines, setTimelines] = useState<TeamTimelineType[]>([]);

  const fetchData = useCallback(async () => {
    const [teamsRes, tasksRes] = await Promise.all([
      fetch("/api/teams"),
      fetch("/api/tasks"),
    ]);
    const teams: AITeam[] = await teamsRes.json();
    const tasks: AITask[] = await tasksRes.json();

    const result = teams.map((team) => {
      const teamTasks = tasks.filter((t) => t.teamName === team.name);
      return buildTeamTimeline(team, teamTasks);
    });
    setTimelines(result);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useSSE((event) => {
    if (event === "fileChange") fetchData();
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agent Timeline</h1>
        <p className="text-foreground/50 text-sm mt-1">
          Task distribution across agents per team
        </p>
      </div>

      {timelines.length === 0 ? (
        <div className="text-center py-16 text-foreground/40">
          No active teams found
        </div>
      ) : (
        <div className="space-y-6">
          {timelines.map((tl) => (
            <div key={tl.teamName}>
              <h2 className="text-lg font-semibold mb-3">{tl.teamName}</h2>
              <AgentTimeline timeline={tl} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
