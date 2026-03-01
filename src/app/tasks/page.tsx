"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskRow } from "@/components/task-row";
import { useSSE } from "@/lib/use-sse";
import type { AITask } from "@/lib/types";

export default function TasksPage() {
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/tasks");
    setTasks(await res.json());
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useSSE((event) => {
    if (event === "fileChange") fetchTasks();
  });

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const statusCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-foreground/50 text-sm mt-1">
          All tasks across all teams
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "in_progress", "completed"] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === status
                  ? "bg-sidebar-active text-white"
                  : "bg-card-bg text-foreground/60 hover:text-foreground border border-card-border"
              }`}
            >
              {status === "all"
                ? "All"
                : status === "in_progress"
                  ? "In Progress"
                  : status.charAt(0).toUpperCase() + status.slice(1)}{" "}
              ({statusCounts[status]})
            </button>
          )
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-foreground/40">
          <p>No tasks found</p>
        </div>
      ) : (
        <div className="rounded-lg border border-card-border bg-card-bg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border text-left text-xs text-foreground/40">
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Subject</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Owner</th>
                <th className="py-2 px-3">Blocked</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => (
                <TaskRow
                  key={`${task.teamName}-${task.id}`}
                  id={task.id}
                  subject={task.subject}
                  status={task.status}
                  owner={task.owner}
                  teamName={task.teamName}
                  blockedBy={task.blockedBy}
                  blocks={task.blocks}
                  description={task.description}
                  activeForm={task.activeForm}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
