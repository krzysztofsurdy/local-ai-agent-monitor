import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { PATHS } from "./claude-paths";

export interface HistorySession {
  sessionId: string;
  project?: string;
  startTime?: string;
  lastActiveAt?: string;
  summary?: string;
  model?: string;
  totalCost?: number;
  totalDuration?: number;
}

export function getHistory(limit = 50): HistorySession[] {
  // Claude Code stores session history in projects directories
  if (!existsSync(PATHS.projects)) return [];

  try {
    const projectDirs = readdirSync(PATHS.projects, {
      withFileTypes: true,
    }).filter((d) => d.isDirectory());

    const sessions: HistorySession[] = [];

    for (const dir of projectDirs) {
      const projectPath = join(PATHS.projects, dir.name);
      const files = readdirSync(projectPath).filter((f) =>
        f.endsWith(".jsonl")
      );

      for (const file of files) {
        const sessionId = file.replace(".jsonl", "");
        const filePath = join(projectPath, file);

        try {
          const content = readFileSync(filePath, "utf-8");
          const lines = content.trim().split("\n").filter(Boolean);
          if (lines.length === 0) continue;

          // Parse first line for session start info
          const firstLine = JSON.parse(lines[0]);

          sessions.push({
            sessionId,
            project: dir.name,
            startTime: firstLine.timestamp || firstLine.createdAt,
            summary: firstLine.message?.content?.substring(0, 200),
            model: firstLine.model,
          });
        } catch {
          // skip malformed files
        }
      }
    }

    return sessions
      .sort(
        (a, b) =>
          new Date(b.startTime || 0).getTime() -
          new Date(a.startTime || 0).getTime()
      )
      .slice(0, limit);
  } catch {
    return [];
  }
}
