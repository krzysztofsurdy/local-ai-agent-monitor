"use client";

import { BellIcon, BellOffIcon } from "./icons";

interface NotificationToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function NotificationToggle({ enabled, onToggle }: NotificationToggleProps) {
  return (
    <button
      onClick={onToggle}
      title={enabled ? "Notifications on" : "Notifications off"}
      className={`p-1.5 rounded-md transition-colors ${
        enabled
          ? "text-yellow-400 hover:bg-white/10"
          : "text-white/30 hover:text-white/50 hover:bg-white/5"
      }`}
    >
      {enabled ? <BellIcon size={14} /> : <BellOffIcon size={14} />}
    </button>
  );
}
