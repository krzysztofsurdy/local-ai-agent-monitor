import type {
  AIProcess,
  AITeam,
  AITask,
  AISkill,
  AIConfig,
  AILogFile,
  AISession,
} from "../types";
import type { AIProviderAdapter } from "./index";
import { getClaudeProcesses } from "../process-monitor";
import { getTeams, getTeam as getTeamRaw } from "../team-reader";
import { getTasks as getTasksRaw } from "../task-reader";
import { getSkills as getSkillsRaw } from "../skill-reader";
import { getConfig as getConfigRaw } from "../config-reader";
import { getLogFiles as getLogFilesRaw, getLogContent } from "../log-reader";
import { getHistory as getHistoryRaw } from "../history-reader";
import { PATHS } from "../claude-paths";

export class ClaudeAdapter implements AIProviderAdapter {
  readonly name = "claude";
  readonly displayName = "Claude Code";

  getProcesses(): AIProcess[] {
    return getClaudeProcesses().map((p) => ({
      ...p,
      provider: "claude" as const,
      children: p.children.map((c) => ({
        ...c,
        provider: "claude" as const,
        children: [],
      })),
    }));
  }

  getTeams(): AITeam[] {
    return getTeams().map((t) => ({ ...t, provider: "claude" as const }));
  }

  getTeam(name: string): AITeam | null {
    const t = getTeamRaw(name);
    return t ? { ...t, provider: "claude" as const } : null;
  }

  getTasks(teamFilter?: string): AITask[] {
    return getTasksRaw(teamFilter).map((t) => ({
      ...t,
      provider: "claude" as const,
    }));
  }

  getSkills(): AISkill[] {
    return getSkillsRaw().map((s) => ({ ...s, provider: "claude" as const }));
  }

  getConfig(): AIConfig {
    const raw = getConfigRaw();
    return {
      globalRules: raw.globalClaudeMd,
      settings: raw.settings,
      settingsLocal: raw.settingsLocal,
      provider: "claude" as const,
    };
  }

  getLogFiles(): AILogFile[] {
    return getLogFilesRaw().map((f) => ({
      ...f,
      provider: "claude" as const,
    }));
  }

  getLogContent(fileName: string, tailLines?: number): string {
    return getLogContent(fileName, tailLines);
  }

  getHistory(limit?: number): AISession[] {
    return getHistoryRaw(limit).map((s) => ({
      ...s,
      provider: "claude" as const,
    }));
  }

  getWatchPaths(): string[] {
    return [
      PATHS.teams,
      PATHS.tasks,
      PATHS.installedPlugins,
      PATHS.settings,
      PATHS.settingsLocal,
      PATHS.globalClaudeMd,
      PATHS.debug,
    ];
  }
}
