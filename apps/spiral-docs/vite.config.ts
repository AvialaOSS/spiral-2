import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import remarkGfm from "remark-gfm";
import { defineConfig, type Plugin } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(dirname, "../..");
const iconManifestPath = path.resolve(rootDir, "packages/icons/raw/manifest.json");
const tokensDist = path.resolve(dirname, "../../packages/tokens/dist");
const tokensSemantic = path.resolve(dirname, "../../packages/tokens/src/semantic");

type SyncMode = "sync" | "dry-run";

type SyncRunState = {
  id: number;
  running: boolean;
  mode: SyncMode;
  startedAt?: string;
  finishedAt?: string;
  exitCode?: number | null;
  currentStep?: string;
  error?: string;
  logs: string[];
};

const maxLogLines = 500;
const syncRun: SyncRunState = {
  id: 0,
  running: false,
  mode: "sync",
  logs: [],
};

function writeJson(res: ServerResponse, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function appendSyncLog(message: string) {
  const lines = message
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.length > 0);

  syncRun.logs.push(...lines);
  if (syncRun.logs.length > maxLogLines) {
    syncRun.logs.splice(0, syncRun.logs.length - maxLogLines);
  }
}

function runStep(label: string, args: string[]): Promise<void> {
  syncRun.currentStep = label;
  appendSyncLog(`\n> ${label}`);
  appendSyncLog(`${process.execPath} ${args.join(" ")}`);

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: rootDir,
      env: process.env,
      shell: false,
    });

    child.stdout.on("data", (data: Buffer) => appendSyncLog(data.toString("utf8")));
    child.stderr.on("data", (data: Buffer) => appendSyncLog(data.toString("utf8")));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${label} 失败，退出码 ${code ?? "unknown"}`));
      }
    });
  });
}

async function runIconSync(mode: SyncMode) {
  try {
    if (mode === "dry-run") {
      await runStep("Figma 图标导出预检", ["scripts/figma-export/export-icons.mjs", "--dry-run"]);
    } else {
      await runStep("从 Figma 同步 raw SVG", ["scripts/figma-export/export-icons.mjs"]);
      await runStep("生成 React 图标组件与 catalog", ["packages/icons/scripts/build-icons.mjs"]);
    }

    syncRun.exitCode = 0;
    appendSyncLog(mode === "dry-run" ? "\n预检完成。" : "\n同步完成，请刷新页面查看最新诊断。");
  } catch (error) {
    syncRun.exitCode = 1;
    syncRun.error = error instanceof Error ? error.message : String(error);
    appendSyncLog(`\n错误：${syncRun.error}`);
  } finally {
    syncRun.running = false;
    syncRun.currentStep = undefined;
    syncRun.finishedAt = new Date().toISOString();
  }
}

function startIconSync(mode: SyncMode) {
  syncRun.id += 1;
  syncRun.running = true;
  syncRun.mode = mode;
  syncRun.startedAt = new Date().toISOString();
  syncRun.finishedAt = undefined;
  syncRun.exitCode = null;
  syncRun.currentStep = undefined;
  syncRun.error = undefined;
  syncRun.logs = [];
  void runIconSync(mode);
}

const docsBasePath = "/docs/spiral";

function docsBaseRedirectPlugin(): Plugin {
  const redirectTarget = `${docsBasePath}/`;

  function maybeRedirect(req: IncomingMessage, res: ServerResponse): boolean {
    const pathname = req.url?.split("?")[0];
    if (pathname !== docsBasePath) {
      return false;
    }

    const query = req.url?.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    res.writeHead(301, { Location: `${redirectTarget}${query}` });
    res.end();
    return true;
  }

  return {
    name: "spiral-docs-base-redirect",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (maybeRedirect(req, res)) return;
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (maybeRedirect(req, res)) return;
        next();
      });
    },
  };
}

function iconSyncApiPlugin(): Plugin {
  return {
    name: "spiral-icon-sync-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next) => {
        if (!req.url?.startsWith("/__spiral/icon-sync")) {
          next();
          return;
        }

        const url = new URL(req.url, "http://localhost");

        if (req.method === "GET" && url.pathname === "/__spiral/icon-sync/status") {
          writeJson(res, 200, syncRun);
          return;
        }

        if (req.method === "GET" && url.pathname === "/__spiral/icon-sync/manifest") {
          if (!existsSync(iconManifestPath)) {
            writeJson(res, 200, { available: false, manifest: null });
            return;
          }

          try {
            const manifest = JSON.parse(readFileSync(iconManifestPath, "utf8")) as unknown;
            writeJson(res, 200, { available: true, manifest });
          } catch (error) {
            writeJson(res, 500, {
              available: false,
              manifest: null,
              error: error instanceof Error ? error.message : String(error),
            });
          }
          return;
        }

        if (req.method === "POST" && url.pathname === "/__spiral/icon-sync/start") {
          if (syncRun.running) {
            writeJson(res, 409, syncRun);
            return;
          }

          const mode = url.searchParams.get("mode") === "dry-run" ? "dry-run" : "sync";
          startIconSync(mode);
          writeJson(res, 202, syncRun);
          return;
        }

        writeJson(res, 404, { error: "Not found" });
      });
    },
  };
}

export default defineConfig({
  base: `${docsBasePath}/`,
  plugins: [
    {
      enforce: "pre",
      ...mdx({ remarkPlugins: [remarkGfm] }),
    },
    docsBaseRedirectPlugin(),
    iconSyncApiPlugin(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    // Prefer .tsx/.ts over stale compiled .js siblings under packages/ui/src
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: {
      "@aviala-design/spiral": path.resolve(dirname, "../../packages/ui/src/index.ts"),
      "@aviala-design/icons": path.resolve(dirname, "../../packages/icons/src/index.ts"),
      "@aviala-design/tokens/styles.css": path.resolve(tokensDist, "styles.css"),
      "@aviala-design/tokens/ald-theme.css": path.resolve(tokensDist, "ald-theme.css"),
      "@aviala-design/tokens/input-effects.css": path.resolve(tokensSemantic, "input-effects.css"),
      "@aviala-design/tokens/basic-input-effects.css": path.resolve(
        tokensSemantic,
        "basic-input-effects.css"
      ),
      "@aviala-design/tokens/cascader-effects.css": path.resolve(tokensSemantic, "cascader-effects.css"),
      "@aviala-design/tokens/popover-effects.css": path.resolve(tokensSemantic, "popover-effects.css"),
      "@aviala-design/tokens/modal-effects.css": path.resolve(tokensSemantic, "modal-effects.css"),
      "@aviala-design/tokens/tooltip-effects.css": path.resolve(tokensSemantic, "tooltip-effects.css"),
      "@aviala-design/tokens/color-picker-effects.css": path.resolve(
        tokensSemantic,
        "color-picker-effects.css"
      ),
      "@aviala-design/tokens/loading-effects.css": path.resolve(tokensSemantic, "loading-effects.css"),
      "@aviala-design/tokens/typeface-effects.css": path.resolve(tokensSemantic, "typeface-effects.css"),
      "@aviala-design/tokens/button-effects.css": path.resolve(tokensSemantic, "button-effects.css"),
      "@aviala-design/tokens/focus-effects.css": path.resolve(tokensSemantic, "focus-effects.css"),
      "@aviala-design/tokens/list-effects.css": path.resolve(tokensSemantic, "list-effects.css"),
      "@aviala-design/tokens/navigation-effects.css": path.resolve(
        tokensSemantic,
        "navigation-effects.css"
      ),
      "@aviala-design/tokens/feedback-effects.css": path.resolve(tokensSemantic, "feedback-effects.css"),
      "@aviala-design/tokens/alert-effects.css": path.resolve(tokensSemantic, "alert-effects.css"),
      "@aviala-design/tokens/datepicker-effects.css": path.resolve(
        tokensSemantic,
        "datepicker-effects.css"
      ),
    },
  },
  server: { port: 5175 },
});
