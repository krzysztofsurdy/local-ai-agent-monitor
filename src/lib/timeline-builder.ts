import type { AITeam, AITask } from "./types";

export interface TimelineEntry {
  agentName: string;
  agentColor: string;
  taskId: string;
  taskSubject: string;
  status: "pending" | "in_progress" | "completed";
}

export interface TeamTimeline {
  teamName: string;
  agents: {
    name: string;
    color: string;
    tasks: { id: string; subject: string; status: string }[];
  }[];
}

export function buildTeamTimeline(team: AITeam, tasks: AITask[]): TeamTimeline {
  const agentMap = new Map<
    string,
    { name: string; color: string; tasks: { id: string; subject: string; status: string }[] }
  >();

  for (const member of team.members) {
    agentMap.set(member.name, {
      name: member.name,
      color: member.color || "slate",
      tasks: [],
    });
  }

  for (const task of tasks) {
    if (!task.owner) continue;
    const agent = agentMap.get(task.owner);
    if (agent) {
      agent.tasks.push({
        id: task.id,
        subject: task.subject,
        status: task.status,
      });
    }
  }

  return {
    teamName: team.name,
    agents: [...agentMap.values()],
  };
}
