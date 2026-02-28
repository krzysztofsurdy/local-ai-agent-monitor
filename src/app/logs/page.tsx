"use client";

import { useState, useEffect, useCallback } from "react";
import { LogViewer } from "@/components/log-viewer";
import { useSSE } from "@/lib/use-sse";
import type { AILogFile } from "@/lib/types";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LogsPage() {
  const [logFiles, setLogFiles] = useState<AILogFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [logContent, setLogContent] = useState<string>("");

  const fetchLogFiles = useCallback(async () => {
    const res = await fetch("/api/logs");
    const files = await res.json();
    setLogFiles(files);
  }, []);

  const fetchLogContent = useCallback(async (fileName: string) => {
    const res = await fetch(`/api/logs?file=${encodeURIComponent(fileName)}`);
    const data = await res.json();
    setLogContent(data.content);
  }, []);

  useEffect(() => {
    fetchLogFiles();
  }, [fetchLogFiles]);

  useEffect(() => {
    if (selectedFile) {
      fetchLogContent(selectedFile);
    }
  }, [selectedFile, fetchLogContent]);

  useSSE((event) => {
    if (event === "fileChange") {
      fetchLogFiles();
      if (selectedFile) fetchLogContent(selectedFile);
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Debug Logs</h1>
        <p className="text-foreground/50 text-sm mt-1">
          Browse debug log files ({logFiles.length} files)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* File list */}
        <div className="rounded-lg border border-card-border bg-card-bg overflow-hidden">
          <div className="p-3 border-b border-card-border text-sm font-medium">
            Log Files
          </div>
          <div className="max-h-[600px] overflow-auto">
            {logFiles.slice(0, 50).map((file) => (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file.name)}
                className={`w-full text-left px-3 py-2 text-xs border-b border-card-border hover:bg-card-bg/80 transition-colors ${
                  selectedFile === file.name
                    ? "bg-sidebar-active/10 text-sidebar-active"
                    : ""
                }`}
              >
                <div className="font-mono truncate">{file.name}</div>
                <div className="text-foreground/30 flex justify-between mt-0.5">
                  <span>{formatSize(file.size)}</span>
                  <span>
                    {new Date(file.modified).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Log content */}
        <div className="lg:col-span-2">
          {selectedFile ? (
            <div>
              <div className="text-sm font-mono text-foreground/40 mb-2">
                {selectedFile}
              </div>
              <LogViewer content={logContent} />
            </div>
          ) : (
            <div className="text-center py-16 text-foreground/40">
              <p>Select a log file to view its contents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
