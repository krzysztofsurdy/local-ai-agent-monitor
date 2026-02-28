import { readFileSync, existsSync } from "fs";
import { PATHS } from "./claude-paths";

export interface ConfigData {
  globalClaudeMd: string | null;
  settings: Record<string, unknown> | null;
  settingsLocal: Record<string, unknown> | null;
}

export function getConfig(): ConfigData {
  return {
    globalClaudeMd: readFileSafe(PATHS.globalClaudeMd),
    settings: readJsonSafe(PATHS.settings),
    settingsLocal: readJsonSafe(PATHS.settingsLocal),
  };
}

function readFileSafe(path: string): string | null {
  if (!existsSync(path)) return null;
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}

function readJsonSafe(path: string): Record<string, unknown> | null {
  const content = readFileSafe(path);
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}
