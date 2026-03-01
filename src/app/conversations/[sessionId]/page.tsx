"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { MessageBubble } from "@/components/message-bubble";
import { CopyableId } from "@/components/copyable-id";
import type { AIMessage } from "@/lib/types";

function formatTokens(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function ConversationDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;
  const project = searchParams.get("project") || "";
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!project || !sessionId) return;
    setLoading(true);
    const res = await fetch(
      `/api/conversations/${sessionId}?project=${encodeURIComponent(project)}`
    );
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [sessionId, project]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const visibleMessages = messages.filter(
    (m) => m.type === "user" || m.type === "assistant"
  );

  const totalInput = messages.reduce(
    (sum, m) =>
      sum +
      (m.usage?.input_tokens || 0) +
      (m.usage?.cache_read_input_tokens || 0),
    0
  );
  const totalOutput = messages.reduce(
    (sum, m) => sum + (m.usage?.output_tokens || 0),
    0
  );

  const startTime = messages[0]?.timestamp;
  const endTime = messages[messages.length - 1]?.timestamp;
  const projectPath = project
    ? decodeURIComponent(project).replace(/^-/, "/").replace(/-/g, "/")
    : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-card-border bg-card-bg p-4">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-lg font-bold">Conversation</h1>
          <CopyableId value={sessionId} truncate={16} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-foreground/40 text-xs">Project</div>
            <div className="font-mono text-xs truncate" title={projectPath}>
              {projectPath || "-"}
            </div>
          </div>
          <div>
            <div className="text-foreground/40 text-xs">Messages</div>
            <div>{visibleMessages.length}</div>
          </div>
          <div>
            <div className="text-foreground/40 text-xs">Total Tokens</div>
            <div className="font-mono text-xs">
              {formatTokens(totalInput)} in / {formatTokens(totalOutput)} out
            </div>
          </div>
          <div>
            <div className="text-foreground/40 text-xs">Time</div>
            <div className="text-xs">
              {startTime
                ? new Date(startTime).toLocaleString()
                : "-"}
              {endTime && startTime && endTime !== startTime && (
                <span className="text-foreground/30">
                  {" "}
                  ({Math.round(
                    (new Date(endTime).getTime() -
                      new Date(startTime).getTime()) /
                      60000
                  )}
                  m)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="text-center py-16 text-foreground/40">
          Loading messages...
        </div>
      ) : visibleMessages.length === 0 ? (
        <div className="text-center py-16 text-foreground/40">
          No messages found
        </div>
      ) : (
        <div className="space-y-2">
          {visibleMessages.map((msg) => (
            <MessageBubble key={msg.uuid || msg.timestamp} message={msg} />
          ))}
        </div>
      )}
    </div>
  );
}
