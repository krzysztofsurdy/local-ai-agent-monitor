"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSSE } from "./use-sse";
import type { AITask } from "./types";

interface TaskNotificationOptions {
  notify: (title: string, body?: string) => void;
  addToast: (message: string) => void;
}

export function useTaskNotifications({ notify, addToast }: TaskNotificationOptions) {
  const prevTasksRef = useRef<Map<string, string>>(new Map());

  const fetchAndCheck = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      const tasks: AITask[] = await res.json();
      const prev = prevTasksRef.current;

      for (const task of tasks) {
        const key = `${task.teamName}-${task.id}`;
        const prevStatus = prev.get(key);

        if (prevStatus === "in_progress" && task.status === "completed") {
          const msg = `Task #${task.id} completed: ${task.subject}`;
          notify("Barko: Task Completed", msg);
          addToast(msg);
        }
      }

      const next = new Map<string, string>();
      for (const task of tasks) {
        next.set(`${task.teamName}-${task.id}`, task.status);
      }
      prevTasksRef.current = next;
    } catch {
      // ignore
    }
  }, [notify, addToast]);

  useEffect(() => {
    fetchAndCheck();
  }, [fetchAndCheck]);

  useSSE((event) => {
    if (event === "fileChange") {
      fetchAndCheck();
    }
  });
}
