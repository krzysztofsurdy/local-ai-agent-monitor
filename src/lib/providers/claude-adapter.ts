import type {
  AIProcess,
  AITeam,
  AITask,
  AISkill,
  AIConfig,
  AILogFile,
  AISession,
  AIConversationSession,
  AIMessage,
  AIMessageContent,
  AIMCPServer,
  AIPluginDetail,
  AIMarketplace,
} from "../types";
import type { AIProviderAdapter } from "./index";
import { getClaudeProcesses } from "../process-monitor";
import { getTeams, getTeam as getTeamRaw } from "../team-reader";
import { getTasks as getTasksRaw } from "../task-reader";
import { getSkills as getSkillsRaw } from "../skill-reader";
import { getConfig as getConfigRaw } from "../config-reader";
import { getLogFiles as getLogFilesRaw, getLogContent } from "../log-reader";
import { getHistory as getHistoryRaw } from "../history-reader";
import {
  getConversationSessions as getConvSessionsRaw,
  getConversationMessages as getConvMessagesRaw,
} from "../conversation-reader";
import {
  getMCPServers as getMCPServersRaw,
  getPluginDetails as getPluginDetailsRaw,
  getMarketplaces as getMarketplacesRaw,
} from "../agent-reader";
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

  getConversationSessions(limit?: number): AIConversationSession[] {
    return getConvSessionsRaw(limit).map((s) => ({
      ...s,
      provider: "claude" as const,
    }));
  }

  getConversationMessages(project: string, sessionId: string): AIMessage[] {
    return getConvMessagesRaw(project, sessionId).map((m) => {
      let content: AIMessageContent[] | string;
      if (typeof m.content === "string") {
        content = m.content;
      } else if (Array.isArray(m.content)) {
        content = (m.content as Record<string, unknown>[]).map((block) => ({
          type: (block.type as string) || "text",
          text: block.text as string | undefined,
          id: block.id as string | undefined,
          name: block.name as string | undefined,
          input: block.input as Record<string, unknown> | undefined,
          content: block.content as string | undefined,
          thinking: block.thinking as string | undefined,
        })) as AIMessageContent[];
      } else {
        content = String(m.content || "");
      }

      return {
        uuid: m.uuid,
        parentUuid: m.parentUuid,
        type: m.type,
        sessionId: m.sessionId,
        timestamp: m.timestamp,
        content,
        model: m.model,
        usage: m.usage,
      };
    });
  }

  getMCPServers(): AIMCPServer[] {
    return getMCPServersRaw().map((s) => ({
      ...s,
      provider: "claude" as const,
    }));
  }

  getPluginDetails(): AIPluginDetail[] {
    return getPluginDetailsRaw().map((p) => ({
      ...p,
      provider: "claude" as const,
    }));
  }

  getMarketplaces(): AIMarketplace[] {
    return getMarketplacesRaw().map((m) => ({
      ...m,
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
      PATHS.projects,
    ];
  }
}
