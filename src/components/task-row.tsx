import { StatusBadge } from "./status-badge";

interface TaskRowProps {
  id: string;
  subject: string;
  status: string;
  owner?: string;
  teamName: string;
  blockedBy: string[];
}

export function TaskRow({
  id,
  subject,
  status,
  owner,
  teamName,
  blockedBy,
}: TaskRowProps) {
  return (
    <tr className="border-b border-card-border hover:bg-card-bg/50 transition-colors">
      <td className="py-2.5 px-3 text-xs font-mono text-foreground/50">
        {teamName}/{id}
      </td>
      <td className="py-2.5 px-3 text-sm">{subject}</td>
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
  );
}
