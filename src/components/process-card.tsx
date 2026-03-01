import { StatusBadge } from "./status-badge";
import { CopyableId } from "./copyable-id";

interface ProcessChild {
  pid: number;
  command: string;
  args: string;
  uptime?: string;
}

interface ProcessCardProps {
  pid: number;
  command: string;
  args: string;
  uptime?: string;
  children: ProcessChild[];
}

export function ProcessCard({
  pid,
  command,
  args,
  uptime,
  children,
}: ProcessCardProps) {
  const cmdName = command.split("/").pop() || command;

  return (
    <div className="rounded-lg border border-card-border bg-card-bg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold">{cmdName}</span>
          <StatusBadge status="running" />
        </div>
        <CopyableId value={String(pid)} label="PID" className="text-foreground/50" />
      </div>
      <div className="text-xs text-foreground/60 font-mono truncate mb-1">
        {args}
      </div>
      {uptime && (
        <div className="text-xs text-foreground/40">Uptime: {uptime}</div>
      )}
      {children.length > 0 && (
        <div className="mt-3 pl-4 border-l-2 border-card-border space-y-2">
          {children.map((child) => (
            <div key={child.pid} className="text-xs">
              <span className="font-mono font-medium">
                {child.command.split("/").pop()}
              </span>
              <CopyableId value={String(child.pid)} label="PID" className="text-foreground/40 ml-2" />
              <div className="text-foreground/50 font-mono truncate">
                {child.args}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
