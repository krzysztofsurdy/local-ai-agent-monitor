import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join } from "path";
import { PATHS } from "./claude-paths";

export interface LogFile {
  name: string;
  path: string;
  size: number;
  modified: number;
}

export function getLogFiles(): LogFile[] {
  if (!existsSync(PATHS.debug)) return [];

  try {
    const files = readdirSync(PATHS.debug).filter((f) =>
      f.endsWith(".txt")
    );

    return files
      .map((f) => {
        const fullPath = join(PATHS.debug, f);
        const stat = statSync(fullPath);
        return {
          name: f,
          path: fullPath,
          size: stat.size,
          modified: stat.mtimeMs,
        };
      })
      .sort((a, b) => b.modified - a.modified);
  } catch {
    return [];
  }
}

export function getLogContent(
  fileName: string,
  tailLines = 200
): string {
  const filePath = join(PATHS.debug, fileName);
  if (!existsSync(filePath)) return "";

  // Validate filename to prevent path traversal
  if (fileName.includes("/") || fileName.includes("..")) return "";

  try {
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    return lines.slice(-tailLines).join("\n");
  } catch {
    return "";
  }
}
