interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { color: string; label: string }> = {
  running: { color: "bg-status-active", label: "Running" },
  active: { color: "bg-status-active", label: "Active" },
  in_progress: { color: "bg-status-working", label: "In Progress" },
  completed: { color: "bg-status-completed", label: "Completed" },
  pending: { color: "bg-status-pending", label: "Pending" },
  idle: { color: "bg-status-idle", label: "Idle" },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    color: "bg-status-idle",
    label: status,
  };
  const dotSize = size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span className={`inline-flex items-center gap-1.5 ${textSize}`}>
      <span
        className={`${dotSize} rounded-full ${config.color} ${
          status === "running" || status === "in_progress" || status === "active"
            ? "animate-pulse"
            : ""
        }`}
      />
      {config.label}
    </span>
  );
}
