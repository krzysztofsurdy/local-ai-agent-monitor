import { homedir } from "os";
import { join } from "path";

const CLAUDE_HOME = join(homedir(), ".claude");

export const PATHS = {
  root: CLAUDE_HOME,
  teams: join(CLAUDE_HOME, "teams"),
  tasks: join(CLAUDE_HOME, "tasks"),
  plugins: join(CLAUDE_HOME, "plugins"),
  installedPlugins: join(CLAUDE_HOME, "plugins", "installed_plugins.json"),
  pluginCache: join(CLAUDE_HOME, "plugins", "cache"),
  settings: join(CLAUDE_HOME, "settings.json"),
  settingsLocal: join(CLAUDE_HOME, "settings.local.json"),
  globalClaudeMd: join(CLAUDE_HOME, "CLAUDE.md"),
  debug: join(CLAUDE_HOME, "debug"),
  projects: join(CLAUDE_HOME, "projects"),
} as const;
