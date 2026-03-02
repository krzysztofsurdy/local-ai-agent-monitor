"use client";

import { useState, useRef, useEffect } from "react";
import { DownloadIcon } from "./icons";
import { exportAsMarkdown, exportAsHtml } from "@/lib/conversation-export";
import type { AIMessage } from "@/lib/types";

interface ExportButtonProps {
  messages: AIMessage[];
  sessionId: string;
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportButton({ messages, sessionId }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const shortId = sessionId.slice(0, 8);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border border-card-border bg-card-bg hover:bg-background transition-colors"
      >
        <DownloadIcon size={14} />
        Export
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-card-bg border border-card-border rounded-md shadow-lg z-20 py-1 min-w-[140px]">
          <button
            onClick={() => {
              download(
                exportAsMarkdown(messages, sessionId),
                `conversation-${shortId}.md`,
                "text/markdown"
              );
              setOpen(false);
            }}
            className="block w-full text-left px-3 py-1.5 text-xs hover:bg-background transition-colors"
          >
            Markdown (.md)
          </button>
          <button
            onClick={() => {
              download(
                exportAsHtml(messages, sessionId),
                `conversation-${shortId}.html`,
                "text/html"
              );
              setOpen(false);
            }}
            className="block w-full text-left px-3 py-1.5 text-xs hover:bg-background transition-colors"
          >
            HTML (.html)
          </button>
        </div>
      )}
    </div>
  );
}
