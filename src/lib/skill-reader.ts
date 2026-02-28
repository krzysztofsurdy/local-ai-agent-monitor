import { readFileSync, existsSync } from "fs";
import { PATHS } from "./claude-paths";

export interface Skill {
  name: string;
  marketplace: string;
  scope: string;
  installPath: string;
  version: string;
  installedAt: string;
  lastUpdated: string;
  gitCommitSha?: string;
}

export function getSkills(): Skill[] {
  if (!existsSync(PATHS.installedPlugins)) return [];

  try {
    const data = JSON.parse(
      readFileSync(PATHS.installedPlugins, "utf-8")
    );

    const skills: Skill[] = [];
    const plugins = data.plugins || {};

    for (const [key, entries] of Object.entries(plugins)) {
      const [name, marketplace] = key.split("@");
      const entryList = entries as Array<{
        scope: string;
        installPath: string;
        version: string;
        installedAt: string;
        lastUpdated: string;
        gitCommitSha?: string;
      }>;

      for (const entry of entryList) {
        skills.push({
          name,
          marketplace: marketplace || "unknown",
          scope: entry.scope,
          installPath: entry.installPath,
          version: entry.version,
          installedAt: entry.installedAt,
          lastUpdated: entry.lastUpdated,
          gitCommitSha: entry.gitCommitSha,
        });
      }
    }

    return skills.sort(
      (a, b) =>
        new Date(b.installedAt).getTime() -
        new Date(a.installedAt).getTime()
    );
  } catch {
    return [];
  }
}
