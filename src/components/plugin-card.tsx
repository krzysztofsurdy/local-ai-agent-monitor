"use client";

import { useState } from "react";
import { CopyableId } from "./copyable-id";

interface PluginCardProps {
  name: string;
  marketplace: string;
  version: string;
  scope: string;
  description?: string;
  keywords?: string[];
  author?: string;
  installPath?: string;
  installedAt: string;
  lastUpdated?: string;
  gitCommitSha?: string;
}

export function PluginCard({
  name,
  marketplace,
  version,
  scope,
  description,
  keywords,
  author,
  installPath,
  installedAt,
  lastUpdated,
  gitCommitSha,
}: PluginCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="rounded-lg border border-card-border bg-card-bg p-4 cursor-pointer hover:border-sidebar-active/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`transition-transform shrink-0 text-foreground/30 ${expanded ? "rotate-90" : ""}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <h3 className="font-semibold text-sm">{name}</h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-sidebar-active/10 text-sidebar-active">
          {scope}
        </span>
      </div>
      {description && (
        <p className="text-xs text-foreground/60 mb-2 line-clamp-2">
          {description}
        </p>
      )}
      <div className="text-xs text-foreground/50 space-y-1">
        <div className="flex items-center gap-1">
          <span className="text-foreground/40">Key:</span>
          <CopyableId
            value={`${name}@${marketplace}`}
            truncate={30}
          />
        </div>
        {version && (
          <div>
            <span className="text-foreground/40">Version: </span>
            <span className="font-mono text-foreground/70">{version}</span>
          </div>
        )}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-card-border text-xs text-foreground/50 space-y-1">
          {author && (
            <div>
              <span className="text-foreground/40">Author: </span>
              <span className="text-foreground/70">
                {typeof author === "string" ? author : (author as unknown as Record<string, unknown>).name as string || JSON.stringify(author)}
              </span>
            </div>
          )}
          {keywords && keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {keywords.map((kw, i) => {
                const label = typeof kw === "string" ? kw : (kw as Record<string, unknown>).name as string || JSON.stringify(kw);
                return (
                <span
                  key={label + i}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/5 text-foreground/40"
                >
                  {label}
                </span>
                );
              })}
            </div>
          )}
          {gitCommitSha && (
            <div className="flex items-center gap-1">
              <span className="text-foreground/40">SHA:</span>
              <CopyableId value={gitCommitSha} />
            </div>
          )}
          {installPath && (
            <div>
              <span className="text-foreground/40">Path: </span>
              <span className="font-mono text-foreground/60 break-all">
                {installPath}
              </span>
            </div>
          )}
          <div>
            <span className="text-foreground/40">Installed: </span>
            <span className="text-foreground/60">
              {new Date(installedAt).toLocaleString()}
            </span>
          </div>
          {lastUpdated && (
            <div>
              <span className="text-foreground/40">Updated: </span>
              <span className="text-foreground/60">
                {new Date(lastUpdated).toLocaleString()}
              </span>
            </div>
          )}
          <div>
            <span className="text-foreground/40">Marketplace: </span>
            <span className="text-foreground/60">{marketplace}</span>
          </div>
        </div>
      )}
    </div>
  );
}
