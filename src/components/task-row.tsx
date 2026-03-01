"use client";

import { useState } from "react";
import { StatusBadge } from "./status-badge";
import { CopyableId } from "./copyable-id";

interface TaskRowProps {
  id: string;
  subject: string;
  status: string;
  owner?: string;
  teamName: string;
  blockedBy: string[];
  blocks?: string[];
  description?: string;
  activeForm?: string;
}

export function TaskRow({
  id,
  subject,
  status,
  owner,
  teamName,
  blockedBy,
  blocks,
  description,
  activeForm,
}: TaskRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        className="border-b border-card-border hover:bg-card-bg/50 transition-colors cursor-pointer"
      >
        <td className="py-2.5 px-3">
          <CopyableId
            value={`${teamName}/${id}`}
            className="text-foreground/50"
          />
        </td>
        <td className="py-2.5 px-3 text-sm">
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
            {subject}
          </div>
        </td>
        <td className="py-2.5 px-3">
          <StatusBadge status={status} />
        </td>
        <td className="py-2.5 px-3 text-sm text-foreground/60">
          {owner || "-"}
        </td>
        <td className="py-2.5 px-3 text-xs text-foreground/40">
          {blockedBy.length > 0 ? `Blocked by: ${blockedBy.join(", ")}` : ""}
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-card-border bg-card-bg/30">
          <td colSpan={5} className="px-3 py-3">
            <div className="pl-6 space-y-2 text-sm">
              {description && (
                <div>
                  <span className="text-foreground/40 text-xs">
                    Description:
                  </span>
                  <p className="text-foreground/70 whitespace-pre-wrap mt-0.5">
                    {description}
                  </p>
                </div>
              )}
              {activeForm && (
                <div className="text-xs">
                  <span className="text-foreground/40">Active form: </span>
                  <span className="text-foreground/60">{activeForm}</span>
                </div>
              )}
              {blocks && blocks.length > 0 && (
                <div className="text-xs">
                  <span className="text-foreground/40">Blocks: </span>
                  <span className="text-foreground/60">
                    {blocks.join(", ")}
                  </span>
                </div>
              )}
              <div className="text-xs">
                <span className="text-foreground/40">Team: </span>
                <CopyableId
                  value={teamName}
                  className="text-foreground/60"
                />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
