import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join } from "path";
import { PATHS } from "./claude-paths";

export interface RawConversationSession {
  sessionId: string;
  project: string;
  projectPath: string;
  messageCount: number;
  startTime?: string;
  endTime?: string;
  totalInputTokens: number;
  totalOutputTokens: number;
  model?: string;
}

export interface RawMessage {
  uuid: string;
  parentUuid?: string;
  type: "user" | "assistant" | "file-history-snapshot";
  sessionId: string;
  timestamp: string;
  content: unknown;
  model?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };
}

function decodeProjectDir(dirName: string): string {
  // Project dirs are encoded paths like -Users-name-project
  return dirName.replace(/^-/, "/").replace(/-/g, "/");
}

export function getConversationSessions(limit = 100): RawConversationSession[] {
  if (!existsSync(PATHS.projects)) return [];

  try {
    const projectDirs = readdirSync(PATHS.projects, {
      withFileTypes: true,
    }).filter((d) => d.isDirectory());

    const sessions: RawConversationSession[] = [];

    for (const dir of projectDirs) {
      const projectPath = join(PATHS.projects, dir.name);
      const files = readdirSync(projectPath).filter((f) =>
        f.endsWith(".jsonl")
      );

      for (const file of files) {
        const sessionId = file.replace(".jsonl", "");
        const filePath = join(projectPath, file);

        try {
          const stat = statSync(filePath);
          const content = readFileSync(filePath, "utf-8");
          const lines = content.trim().split("\n").filter(Boolean);
          if (lines.length === 0) continue;

          let startTime: string | undefined;
          let endTime: string | undefined;
          let totalInputTokens = 0;
          let totalOutputTokens = 0;
          let messageCount = 0;
          let model: string | undefined;

          // Parse first line for start time
          const firstLine = JSON.parse(lines[0]);
          startTime = firstLine.timestamp;

          // Parse all lines for token counts
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              if (parsed.type === "user" || parsed.type === "assistant") {
                messageCount++;
              }
              if (!model && parsed.type === "assistant" && parsed.message?.model) {
                model = parsed.message.model;
              }
              if (parsed.timestamp) {
                endTime = parsed.timestamp;
              }
              if (parsed.message?.usage) {
                totalInputTokens +=
                  (parsed.message.usage.input_tokens || 0) +
                  (parsed.message.usage.cache_read_input_tokens || 0);
                totalOutputTokens +=
                  parsed.message.usage.output_tokens || 0;
              }
            } catch {
              // skip malformed lines
            }
          }

          sessions.push({
            sessionId,
            project: dir.name,
            projectPath: decodeProjectDir(dir.name),
            messageCount,
            startTime,
            endTime,
            totalInputTokens,
            totalOutputTokens,
            model,
          });

          // Use file mtime as a fallback sort key if no startTime
          if (!startTime) {
            sessions[sessions.length - 1].startTime =
              stat.mtime.toISOString();
          }
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

export function getConversationMessages(
  project: string,
  sessionId: string
): RawMessage[] {
  // Validate inputs to prevent path traversal
  if (
    sessionId.includes("..") ||
    sessionId.includes("/") ||
    project.includes("..")
  ) {
    return [];
  }

  const filePath = join(PATHS.projects, project, `${sessionId}.jsonl`);
  if (!existsSync(filePath)) return [];

  try {
    const content = readFileSync(filePath, "utf-8");
    const lines = content.trim().split("\n").filter(Boolean);
    const messages: RawMessage[] = [];

    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (
          parsed.type === "user" ||
          parsed.type === "assistant" ||
          parsed.type === "file-history-snapshot"
        ) {
          messages.push({
            uuid: parsed.uuid || "",
            parentUuid: parsed.parentUuid,
            type: parsed.type,
            sessionId: parsed.sessionId || sessionId,
            timestamp: parsed.timestamp || "",
            content: parsed.message?.content || parsed.content || "",
            model: parsed.message?.model || parsed.model,
            usage: parsed.message?.usage,
          });
        }
      } catch {
        // skip malformed lines
      }
    }

    return messages;
  } catch {
    return [];
  }
}
