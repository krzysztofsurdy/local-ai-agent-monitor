// Provider-agnostic types for multi-AI-tool support
// Currently implements Claude Code, designed to support Gemini CLI, Cursor, etc.

export type AIProvider = "claude" | "gemini" | "cursor" | "copilot";

export interface AIProcess {
  pid: number;
  ppid: number;
  command: string;
  args: string;
  uptime?: string;
  provider: AIProvider;
  children: AIProcess[];
}

export interface AITeam {
  name: string;
  description?: string;
  createdAt: number;
  leadAgentId: string;
  members: AITeamMember[];
  provider: AIProvider;
}

export interface AITeamMember {
  agentId: string;
  name: string;
  agentType: string;
  model?: string;
  joinedAt: number;
  cwd?: string;
  color?: string;
}

export interface AITask {
  id: string;
  subject: string;
  description?: string;
  activeForm?: string;
  status: "pending" | "in_progress" | "completed";
  blocks: string[];
  blockedBy: string[];
  owner?: string;
  teamName: string;
  provider: AIProvider;
}

export interface AISkill {
  name: string;
  marketplace: string;
  scope: string;
  installPath: string;
  version: string;
  installedAt: string;
  lastUpdated: string;
  gitCommitSha?: string;
  provider: AIProvider;
}

export interface AIConfig {
  globalRules: string | null;
  settings: Record<string, unknown> | null;
  settingsLocal: Record<string, unknown> | null;
  provider: AIProvider;
}

export interface AILogFile {
  name: string;
  path: string;
  size: number;
  modified: number;
  provider: AIProvider;
}

export interface AISession {
  sessionId: string;
  project?: string;
  startTime?: string;
  summary?: string;
  model?: string;
  provider: AIProvider;
}

export interface AIConversationSession {
  sessionId: string;
  project: string;
  projectPath: string;
  messageCount: number;
  startTime?: string;
  endTime?: string;
  totalInputTokens: number;
  totalOutputTokens: number;
  provider: AIProvider;
}

export interface AIMessageContent {
  type: "text" | "tool_use" | "tool_result" | "thinking";
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
  content?: string;
  thinking?: string;
}

export interface AIMessage {
  uuid: string;
  parentUuid?: string;
  type: "user" | "assistant" | "file-history-snapshot";
  sessionId: string;
  timestamp: string;
  content: AIMessageContent[] | string;
  model?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };
}

export interface AIMCPServer {
  name: string;
  command: string;
  args: string[];
  envKeys: string[];
  provider: AIProvider;
}

export interface AIPluginDetail {
  name: string;
  marketplace: string;
  version: string;
  description?: string;
  keywords?: string[];
  author?: string;
  scope: string;
  installPath: string;
  installedAt: string;
  lastUpdated: string;
  gitCommitSha?: string;
  provider: AIProvider;
}

export interface AIMarketplace {
  name: string;
  repoUrl: string;
  installLocation?: string;
  lastUpdated?: string;
  provider: AIProvider;
}
