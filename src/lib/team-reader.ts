import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { PATHS } from "./claude-paths";

export interface TeamMember {
  agentId: string;
  name: string;
  agentType: string;
  model?: string;
  joinedAt: number;
  cwd?: string;
  color?: string;
}

export interface Team {
  name: string;
  description?: string;
  createdAt: number;
  leadAgentId: string;
  members: TeamMember[];
}

export function getTeams(): Team[] {
  if (!existsSync(PATHS.teams)) return [];

  try {
    const dirs = readdirSync(PATHS.teams, { withFileTypes: true }).filter(
      (d) => d.isDirectory()
    );

    const teams: Team[] = [];
    for (const dir of dirs) {
      const configPath = join(PATHS.teams, dir.name, "config.json");
      if (!existsSync(configPath)) continue;

      try {
        const data = JSON.parse(readFileSync(configPath, "utf-8"));
        teams.push({
          name: data.name || dir.name,
          description: data.description,
          createdAt: data.createdAt,
          leadAgentId: data.leadAgentId,
          members: (data.members || []).map((m: TeamMember) => ({
            agentId: m.agentId,
            name: m.name,
            agentType: m.agentType,
            model: m.model,
            joinedAt: m.joinedAt,
            cwd: m.cwd,
            color: m.color,
          })),
        });
      } catch {
        // skip malformed configs
      }
    }

    return teams.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch {
    return [];
  }
}

export function getTeam(name: string): Team | null {
  const configPath = join(PATHS.teams, name, "config.json");
  if (!existsSync(configPath)) return null;

  try {
    const data = JSON.parse(readFileSync(configPath, "utf-8"));
    return {
      name: data.name || name,
      description: data.description,
      createdAt: data.createdAt,
      leadAgentId: data.leadAgentId,
      members: (data.members || []).map((m: TeamMember) => ({
        agentId: m.agentId,
        name: m.name,
        agentType: m.agentType,
        model: m.model,
        joinedAt: m.joinedAt,
        cwd: m.cwd,
        color: m.color,
      })),
    };
  } catch {
    return null;
  }
}
