"use client";

import { FilterIcon } from "./icons";

interface ModelFilterProps {
  models: string[];
  selected: string | null;
  onChange: (model: string | null) => void;
}

export function ModelFilter({ models, selected, onChange }: ModelFilterProps) {
  if (models.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <FilterIcon size={14} className="text-foreground/40" />
      <select
        value={selected || ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="px-2 py-1.5 text-sm rounded-lg border border-card-border bg-card-bg focus:outline-none focus:border-sidebar-active"
      >
        <option value="">All models</option>
        {models.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}
