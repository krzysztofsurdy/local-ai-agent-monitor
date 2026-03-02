import type { AIMessage, AIMessageContent } from "./types";

export interface FileChange {
  path: string;
  operation: "created" | "modified";
}

export function extractFileChanges(messages: AIMessage[]): FileChange[] {
  const seen = new Map<string, FileChange>();

  for (const msg of messages) {
    if (msg.type !== "assistant" || typeof msg.content === "string") continue;

    for (const block of msg.content as AIMessageContent[]) {
      if (block.type !== "tool_use" || !block.input) continue;

      const name = block.name || "";
      const filePath = (block.input.file_path as string) || (block.input.path as string) || "";
      if (!filePath) continue;

      if (name === "Write" || name === "write") {
        if (!seen.has(filePath)) {
          seen.set(filePath, { path: filePath, operation: "created" });
        }
      } else if (name === "Edit" || name === "edit") {
        const existing = seen.get(filePath);
        if (!existing) {
          seen.set(filePath, { path: filePath, operation: "modified" });
        }
      }
    }
  }

  return [...seen.values()].sort((a, b) => a.path.localeCompare(b.path));
}
