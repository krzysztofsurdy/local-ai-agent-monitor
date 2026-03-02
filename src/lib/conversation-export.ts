import type { AIMessage, AIMessageContent } from "./types";

function contentToText(content: AIMessageContent[] | string): string {
  if (typeof content === "string") return content;

  return content
    .map((block) => {
      if (block.type === "text") return block.text || "";
      if (block.type === "thinking") return `[Thinking] ${block.thinking || block.text || ""}`;
      if (block.type === "tool_use")
        return `[Tool: ${block.name}] ${JSON.stringify(block.input, null, 2)}`;
      if (block.type === "tool_result")
        return `[Result] ${typeof block.content === "string" ? block.content : ""}`;
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export function exportAsMarkdown(messages: AIMessage[], sessionId: string): string {
  const lines: string[] = [`# Conversation ${sessionId}`, ""];

  for (const msg of messages) {
    if (msg.type === "file-history-snapshot") continue;
    const role = msg.type === "user" ? "User" : "Assistant";
    const time = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : "";
    lines.push(`## ${role}${time ? ` (${time})` : ""}${msg.model ? ` [${msg.model}]` : ""}`);
    lines.push("");
    lines.push(contentToText(msg.content));
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

export function exportAsHtml(messages: AIMessage[], sessionId: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const rows = messages
    .filter((m) => m.type !== "file-history-snapshot")
    .map((msg) => {
      const role = msg.type === "user" ? "User" : "Assistant";
      const bg = msg.type === "user" ? "#dbeafe" : "#f1f5f9";
      const time = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : "";
      const text = escape(contentToText(msg.content));
      return `<div style="margin:8px 0;padding:12px;border-radius:8px;background:${bg};">
  <div style="font-size:12px;color:#64748b;margin-bottom:4px;"><strong>${role}</strong>${time ? ` &mdash; ${time}` : ""}${msg.model ? ` <code>${escape(msg.model)}</code>` : ""}</div>
  <pre style="white-space:pre-wrap;font-size:14px;margin:0;">${text}</pre>
</div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Conversation ${escape(sessionId)}</title>
<style>body{font-family:system-ui;max-width:900px;margin:0 auto;padding:24px;background:#fff;color:#1e293b;}pre{font-family:'SF Mono',Menlo,monospace;}</style>
</head><body>
<h1>Conversation ${escape(sessionId)}</h1>
${rows}
</body></html>`;
}
