import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { PATHS } from "./claude-paths";

export interface Task {
  id: string;
  subject: string;
  description?: string;
  activeForm?: string;
  status: "pending" | "in_progress" | "completed";
  blocks: string[];
  blockedBy: string[];
  owner?: string;
  teamName: string;
}

export function getTasks(teamFilter?: string): Task[] {
  if (!existsSync(PATHS.tasks)) return [];

  try {
    const dirs = readdirSync(PATHS.tasks, { withFileTypes: true }).filter(
      (d) => d.isDirectory()
    );

    const tasks: Task[] = [];
    for (const dir of dirs) {
      if (teamFilter && dir.name !== teamFilter) continue;

      const teamDir = join(PATHS.tasks, dir.name);
      const files = readdirSync(teamDir).filter(
        (f) => f.endsWith(".json") && !f.startsWith(".")
      );

      for (const file of files) {
        try {
          const data = JSON.parse(
            readFileSync(join(teamDir, file), "utf-8")
          );
          tasks.push({
            id: data.id || file.replace(".json", ""),
            subject: data.subject || "Untitled",
            description: data.description,
            activeForm: data.activeForm,
            status: data.status || "pending",
            blocks: data.blocks || [],
            blockedBy: data.blockedBy || [],
            owner: data.owner,
            teamName: dir.name,
          });
        } catch {
          // skip malformed tasks
        }
      }
    }

    return tasks;
  } catch {
    return [];
  }
}
