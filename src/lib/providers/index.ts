// Provider abstraction layer
// Each AI tool (Claude, Gemini, Cursor) implements this interface
// Currently only Claude is implemented

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
  AIMCPServer,
  AIPluginDetail,
  AIMarketplace,
} from "../types";

export interface AIProviderAdapter {
  readonly name: string;
  readonly displayName: string;
  getProcesses(): AIProcess[];
  getTeams(): AITeam[];
  getTeam(name: string): AITeam | null;
  getTasks(teamFilter?: string): AITask[];
  getSkills(): AISkill[];
  getConfig(): AIConfig;
  getLogFiles(): AILogFile[];
  getLogContent(fileName: string, tailLines?: number): string;
  getHistory(limit?: number): AISession[];
  getConversationSessions(limit?: number): AIConversationSession[];
  getConversationMessages(project: string, sessionId: string): AIMessage[];
  getMCPServers(): AIMCPServer[];
  getPluginDetails(): AIPluginDetail[];
  getMarketplaces(): AIMarketplace[];
  getWatchPaths(): string[];
}

import { ClaudeAdapter } from "./claude-adapter";

const adapters: AIProviderAdapter[] = [new ClaudeAdapter()];

export function getAllAdapters(): AIProviderAdapter[] {
  return adapters;
}

// Aggregate data from all providers
export function aggregateProcesses(): AIProcess[] {
  return adapters.flatMap((a) => a.getProcesses());
}

export function aggregateTeams(): AITeam[] {
  return adapters.flatMap((a) => a.getTeams());
}

export function aggregateTasks(teamFilter?: string): AITask[] {
  return adapters.flatMap((a) => a.getTasks(teamFilter));
}

export function aggregateSkills(): AISkill[] {
  return adapters.flatMap((a) => a.getSkills());
}

export function aggregateConfigs(): AIConfig[] {
  return adapters.map((a) => a.getConfig());
}

export function aggregateLogFiles(): AILogFile[] {
  return adapters.flatMap((a) => a.getLogFiles());
}

export function aggregateHistory(limit?: number): AISession[] {
  return adapters
    .flatMap((a) => a.getHistory(limit))
    .sort(
      (a, b) =>
        new Date(b.startTime || 0).getTime() -
        new Date(a.startTime || 0).getTime()
    )
    .slice(0, limit || 50);
}

export function aggregateConversationSessions(
  limit?: number
): AIConversationSession[] {
  return adapters
    .flatMap((a) => a.getConversationSessions(limit))
    .sort(
      (a, b) =>
        new Date(b.startTime || 0).getTime() -
        new Date(a.startTime || 0).getTime()
    )
    .slice(0, limit || 100);
}

export function aggregateConversationMessages(
  project: string,
  sessionId: string
): AIMessage[] {
  for (const a of adapters) {
    const messages = a.getConversationMessages(project, sessionId);
    if (messages.length > 0) return messages;
  }
  return [];
}

export function aggregateMCPServers(): AIMCPServer[] {
  return adapters.flatMap((a) => a.getMCPServers());
}

export function aggregatePluginDetails(): AIPluginDetail[] {
  return adapters.flatMap((a) => a.getPluginDetails());
}

export function aggregateMarketplaces(): AIMarketplace[] {
  return adapters.flatMap((a) => a.getMarketplaces());
}

export function aggregateWatchPaths(): string[] {
  return adapters.flatMap((a) => a.getWatchPaths());
}
