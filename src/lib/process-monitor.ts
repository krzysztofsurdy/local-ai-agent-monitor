import { execSync } from "child_process";

export interface ClaudeProcess {
  pid: number;
  ppid: number;
  command: string;
  args: string;
  cwd?: string;
  uptime?: string;
  children: ClaudeProcess[];
}

export function getClaudeProcesses(): ClaudeProcess[] {
  try {
    const output = execSync(
      "ps -eo pid,ppid,etime,command 2>/dev/null || true",
      { encoding: "utf-8", timeout: 5000 }
    );

    const lines = output.trim().split("\n").slice(1);
    const allProcesses: Array<{
      pid: number;
      ppid: number;
      uptime: string;
      command: string;
    }> = [];

    for (const line of lines) {
      const match = line
        .trim()
        .match(/^(\d+)\s+(\d+)\s+([\d:.-]+)\s+(.+)$/);
      if (!match) continue;
      allProcesses.push({
        pid: parseInt(match[1]),
        ppid: parseInt(match[2]),
        uptime: match[3].trim(),
        command: match[4],
      });
    }

    // Find claude-related processes
    const claudeProcesses = allProcesses.filter(
      (p) =>
        p.command.includes("claude") &&
        !p.command.includes("local-ai-orchestrator") &&
        !p.command.includes("grep")
    );

    // Build parent-child tree
    const rootPids = new Set(claudeProcesses.map((p) => p.pid));

    // Find children of claude processes (MCP servers, subagents)
    const childProcesses = allProcesses.filter(
      (p) => rootPids.has(p.ppid) && !rootPids.has(p.pid)
    );

    const processMap = new Map<number, ClaudeProcess>();

    for (const p of claudeProcesses) {
      const parts = p.command.split(/\s+/);
      processMap.set(p.pid, {
        pid: p.pid,
        ppid: p.ppid,
        command: parts[0],
        args: parts.slice(1).join(" "),
        uptime: p.uptime,
        children: [],
      });
    }

    for (const child of childProcesses) {
      const parts = child.command.split(/\s+/);
      const parent = processMap.get(child.ppid);
      if (parent) {
        parent.children.push({
          pid: child.pid,
          ppid: child.ppid,
          command: parts[0],
          args: parts.slice(1).join(" "),
          uptime: child.uptime,
          children: [],
        });
      }
    }

    return Array.from(processMap.values());
  } catch {
    return [];
  }
}
