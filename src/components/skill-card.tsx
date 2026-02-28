interface SkillCardProps {
  name: string;
  marketplace: string;
  version: string;
  installedAt: string;
  scope: string;
}

export function SkillCard({
  name,
  marketplace,
  version,
  installedAt,
  scope,
}: SkillCardProps) {
  return (
    <div className="rounded-lg border border-card-border bg-card-bg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">{name}</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-sidebar-active/10 text-sidebar-active">
          {scope}
        </span>
      </div>
      <div className="text-xs text-foreground/50 space-y-1">
        <div>
          Marketplace: <span className="text-foreground/70">{marketplace}</span>
        </div>
        <div>
          Version:{" "}
          <span className="font-mono text-foreground/70">
            {version.length > 12 ? version.slice(0, 12) : version}
          </span>
        </div>
        <div>
          Installed:{" "}
          <span className="text-foreground/70">
            {new Date(installedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
