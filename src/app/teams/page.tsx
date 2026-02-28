"use client";

import { useState, useEffect, useCallback } from "react";
import { TeamCard } from "@/components/team-card";
import { useSSE } from "@/lib/use-sse";
import type { AITeam } from "@/lib/types";

export default function TeamsPage() {
  const [teams, setTeams] = useState<AITeam[]>([]);

  const fetchTeams = useCallback(async () => {
    const res = await fetch("/api/teams");
    setTeams(await res.json());
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useSSE((event) => {
    if (event === "fileChange") {
      fetchTeams();
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Teams</h1>
        <p className="text-foreground/50 text-sm mt-1">
          Agent teams and their members
        </p>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-16 text-foreground/40">
          <p className="text-lg">No teams found</p>
          <p className="text-sm mt-1">
            Teams will appear here when agents collaborate
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <TeamCard
              key={team.name}
              name={team.name}
              description={team.description}
              members={team.members}
              createdAt={team.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
