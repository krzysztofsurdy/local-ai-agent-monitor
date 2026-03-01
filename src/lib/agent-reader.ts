import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { PATHS } from "./claude-paths";

export interface RawMCPServer {
  name: string;
  command: string;
  args: string[];
  envKeys: string[];
}

export interface RawPluginDetail {
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
}

export interface RawMarketplace {
  name: string;
  repoUrl: string;
  installLocation?: string;
  lastUpdated?: string;
}

export function getMCPServers(): RawMCPServer[] {
  try {
    if (!existsSync(PATHS.settings)) return [];

    const content = readFileSync(PATHS.settings, "utf-8");
    const settings = JSON.parse(content);

    if (!settings.mcpServers || typeof settings.mcpServers !== "object") {
      return [];
    }

    return Object.entries(settings.mcpServers).map(
      ([name, config]: [string, unknown]) => {
        const cfg = config as Record<string, unknown>;
        return {
          name,
          command: (cfg.command as string) || "",
          args: Array.isArray(cfg.args) ? (cfg.args as string[]) : [],
          envKeys: cfg.env && typeof cfg.env === "object"
            ? Object.keys(cfg.env as Record<string, unknown>)
            : [],
        };
      }
    );
  } catch {
    return [];
  }
}

export function getPluginDetails(): RawPluginDetail[] {
  try {
    if (!existsSync(PATHS.installedPlugins)) return [];

    const content = readFileSync(PATHS.installedPlugins, "utf-8");
    const data = JSON.parse(content);

    if (!data.plugins || typeof data.plugins !== "object") return [];

    const plugins: RawPluginDetail[] = [];

    for (const [key, installs] of Object.entries(data.plugins)) {
      const parts = key.split("@");
      const pluginName = parts[0] || key;
      const marketplace = parts.length > 1 ? parts.slice(1).join("@") : "";

      if (!Array.isArray(installs)) continue;

      for (const install of installs as Record<string, unknown>[]) {
        const installPath = (install.installPath as string) || "";

        // Try to read plugin.json for description/keywords/author
        let description: string | undefined;
        let keywords: string[] | undefined;
        let author: string | undefined;

        const pluginJsonPath = join(installPath, ".claude-plugin", "plugin.json");
        if (installPath && existsSync(pluginJsonPath)) {
          try {
            const pluginJson = JSON.parse(readFileSync(pluginJsonPath, "utf-8"));
            description = typeof pluginJson.description === "string" ? pluginJson.description : undefined;
            keywords = Array.isArray(pluginJson.keywords)
              ? pluginJson.keywords.map((k: unknown) => typeof k === "string" ? k : (k as Record<string, unknown>)?.name || String(k))
              : undefined;
            author = typeof pluginJson.author === "string"
              ? pluginJson.author
              : typeof pluginJson.author === "object" && pluginJson.author
                ? (pluginJson.author as Record<string, unknown>).name as string || undefined
                : undefined;
          } catch {
            // skip
          }
        }

        // Also check in cache directory
        if (!description) {
          const cacheDirs = existsSync(PATHS.pluginCache)
            ? readdirSync(PATHS.pluginCache, { withFileTypes: true }).filter(
                (d) => d.isDirectory()
              )
            : [];

          for (const cacheDir of cacheDirs) {
            const cachePath = join(
              PATHS.pluginCache,
              cacheDir.name,
              ".claude-plugin",
              "plugin.json"
            );
            if (existsSync(cachePath)) {
              try {
                const pluginJson = JSON.parse(
                  readFileSync(cachePath, "utf-8")
                );
                if (
                  pluginJson.name === pluginName ||
                  cacheDir.name.includes(pluginName)
                ) {
                  description = typeof pluginJson.description === "string" ? pluginJson.description : undefined;
                  keywords = Array.isArray(pluginJson.keywords)
                    ? pluginJson.keywords.map((k: unknown) => typeof k === "string" ? k : (k as Record<string, unknown>)?.name || String(k))
                    : undefined;
                  author = typeof pluginJson.author === "string"
                    ? pluginJson.author
                    : typeof pluginJson.author === "object" && pluginJson.author
                      ? (pluginJson.author as Record<string, unknown>).name as string || undefined
                      : undefined;
                  break;
                }
              } catch {
                // skip
              }
            }
          }
        }

        plugins.push({
          name: pluginName,
          marketplace,
          version: (install.version as string) || "",
          description,
          keywords,
          author,
          scope: (install.scope as string) || "user",
          installPath,
          installedAt: (install.installedAt as string) || "",
          lastUpdated: (install.lastUpdated as string) || "",
          gitCommitSha: install.gitCommitSha as string | undefined,
        });
      }
    }

    return plugins;
  } catch {
    return [];
  }
}

export function getMarketplaces(): RawMarketplace[] {
  try {
    const marketplacePath = join(PATHS.plugins, "known_marketplaces.json");
    if (!existsSync(marketplacePath)) return [];

    const content = readFileSync(marketplacePath, "utf-8");
    const data = JSON.parse(content);

    if (Array.isArray(data)) {
      return data.map((m: Record<string, unknown>) => ({
        name: (m.name as string) || (m.url as string) || "",
        repoUrl: (m.url as string) || (m.repoUrl as string) || "",
        installLocation: m.installLocation as string | undefined,
        lastUpdated: m.lastUpdated as string | undefined,
      }));
    }

    if (typeof data === "object" && data !== null) {
      return Object.entries(data).map(
        ([name, config]: [string, unknown]) => {
          const cfg = config as Record<string, unknown>;
          return {
            name,
            repoUrl: (cfg.url as string) || (cfg.repoUrl as string) || "",
            installLocation: cfg.installLocation as string | undefined,
            lastUpdated: cfg.lastUpdated as string | undefined,
          };
        }
      );
    }

    return [];
  } catch {
    return [];
  }
}
