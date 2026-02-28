import { watch, type FSWatcher } from "chokidar";
import { PATHS } from "./claude-paths";

export type WatchEvent = {
  type: "teams" | "tasks" | "plugins" | "config" | "logs";
  path: string;
  event: "add" | "change" | "unlink";
};

type EventCallback = (event: WatchEvent) => void;

let watcher: FSWatcher | null = null;
const listeners = new Set<EventCallback>();

function classifyPath(path: string): WatchEvent["type"] | null {
  if (path.includes("/teams/")) return "teams";
  if (path.includes("/tasks/")) return "tasks";
  if (path.includes("/plugins/")) return "plugins";
  if (path.includes("/debug/")) return "logs";
  if (
    path.endsWith("CLAUDE.md") ||
    path.endsWith("settings.json") ||
    path.endsWith("settings.local.json")
  )
    return "config";
  return null;
}

export function startWatcher() {
  if (watcher) return;

  watcher = watch(
    [
      PATHS.teams,
      PATHS.tasks,
      PATHS.installedPlugins,
      PATHS.settings,
      PATHS.settingsLocal,
      PATHS.globalClaudeMd,
      PATHS.debug,
    ],
    {
      ignoreInitial: true,
      persistent: true,
      depth: 3,
      ignorePermissionErrors: true,
    }
  );

  const handleEvent =
    (event: WatchEvent["event"]) => (filePath: string) => {
      const type = classifyPath(filePath);
      if (!type) return;
      const watchEvent: WatchEvent = { type, path: filePath, event };
      listeners.forEach((cb) => cb(watchEvent));
    };

  watcher.on("add", handleEvent("add"));
  watcher.on("change", handleEvent("change"));
  watcher.on("unlink", handleEvent("unlink"));
}

export function onFileChange(callback: EventCallback): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function stopWatcher() {
  watcher?.close();
  watcher = null;
  listeners.clear();
}
