"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "barko-notifications";

export function useNotifications() {
  const [enabled, setEnabledState] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setEnabledState(true);
    }
  }, []);

  const toggle = useCallback(async () => {
    if (enabled) {
      setEnabledState(false);
      localStorage.setItem(STORAGE_KEY, "false");
      return;
    }

    if (typeof Notification === "undefined") return;

    let perm = Notification.permission;
    if (perm === "default") {
      perm = await Notification.requestPermission();
      setPermission(perm);
    }

    if (perm === "granted") {
      setEnabledState(true);
      localStorage.setItem(STORAGE_KEY, "true");
    }
  }, [enabled]);

  const notify = useCallback(
    (title: string, body?: string) => {
      if (!enabled || typeof Notification === "undefined") return;
      if (Notification.permission !== "granted") return;
      new Notification(title, { body, icon: "/logo.png" });
    },
    [enabled]
  );

  return { enabled, permission, toggle, notify };
}
