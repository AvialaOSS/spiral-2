# Monorepo 命令参考

Spiral 2 使用 **pnpm workspace** + **Turborepo** 管理 monorepo。本文档汇总根目录与各 workspace 包的全部 npm scripts，以及独立 CLI 脚本与 CI 流程。

> Figma 导出、MCP 配置等设计侧细节见 [figma-mcp.md](./figma-mcp.md)。

## 概述与前置条件

| 项 | 要求 |
|---|---|
| Node.js | `>= 20`（见根 `package.json` `engines`） |
| 包管理器 | `pnpm@9.15.4`（见根 `packageManager`，推荐 Corepack） |
| 工作区 | `apps/*`、`packages/*`（见 `pnpm-workspace.yaml`） |

**首次克隆后：**

```bash
pnpm install
pnpm sync:ald          # 同步 ALD 设计 token 到 packages/tokens/source/ald
pnpm build             # 构建全部 workspace（Turbo 拓扑排序）
```

**Workspace 包一览（7 个 `package.json`）：**

| 路径 | 包名 | 说明 |
|---|---|---|
| `/` | `spiral2` | 根 monorepo，Turbo 编排与跨包脚本 |
| `apps/spiral-docs` | `@spiral/spiral-docs` | 中文组件文档站（Vite + MDX） |
| `apps/docs` | `@spiral/docs` | Storybook 组件预览 |
| `apps/playground` | `@spiral/playground` | 本地开发 playground |
| `packages/ui` | `@aviala/spiral` | React 组件库 |
| `packages/tokens` | `@aviala/tokens` | 设计 token 与主题引擎 |
| `packages/icons` | `@aviala/icons` | 图标 React 组件 |

**在任意 workspace 运行脚本：**

```bash
pnpm --filter <包名> <script>
# 例：pnpm --filter @aviala/spiral dev
```

---

## 根目录 Monorepo 命令

在仓库根目录执行 `pnpm <script>`。

| 命令 | 说明 |
|---|---|
| `pnpm build` | Turbo 并行构建全部 workspace（`dependsOn: ^build`） |
| `pnpm dev` | Turbo 启动各包 `dev`（持久任务，不缓存） |
| `pnpm lint` | Turbo 运行各包 `lint`（**当前无子包定义 `lint` script**） |
| `pnpm typecheck` | Turbo 运行各包 `typecheck`（依赖上游 `build`） |
| `pnpm clean` | Turbo 清理各包产物，并删除根 `node_modules` |
| `pnpm sync:ald` | 从本地 ALD 仓库复制 token 到 `packages/tokens/source/ald` |
| `pnpm docs:dev` | 启动 `@spiral/spiral-docs` 开发服务器 |
| `pnpm docs:build` | 依次构建 tokens → spiral → spiral-docs（生产文档站） |
| `pnpm docs:copy-hugo` | 将 spiral-docs 构建产物复制到 Hugo 静态目录 |
| `pnpm icons:export` | 从 Figma 导出 SVG 到 `packages/icons/raw/` |
| `pnpm icons:export:dry` | 图标导出预检（不写入文件） |
| `pnpm icons:build` | 仅运行 `@aviala/icons` 的 SVGR 构建 |
| `pnpm icons:sync` | 图标导出 + `@aviala/icons` 完整构建 |

---

## Apps

### `@spiral/spiral-docs`（`apps/spiral-docs`）

中文公开文档站，部署路径 `/docs/spiral/`。

| 命令 | 说明 |
|---|---|
| `pnpm --filter @spiral/spiral-docs dev` | Vite 开发服务器，**http://localhost:5175/docs/spiral/** |
| `pnpm --filter @spiral/spiral-docs build` | 生成 props 注册表 + Vite 生产构建 |
| `pnpm --filter @spiral/spiral-docs preview` | 预览生产构建 |
| `pnpm --filter @spiral/spiral-docs typecheck` | TypeScript 项目引用检查 |
| `pnpm --filter @spiral/spiral-docs generate:props` | 从 `@aviala/spiral` 源码生成 `props-registry`（build 时自动执行） |

开发模式下提供图标同步 API（`/__spiral/icon-sync/*`），可在文档页触发 Figma 导出，等效于根目录 `icons:export` + `icons:build`。

**根目录快捷命令：** `pnpm docs:dev`、`pnpm docs:build`、`pnpm docs:copy-hugo`

### `@spiral/docs`（`apps/docs`）

Storybook 8 组件预览。

| 命令 | 说明 |
|---|---|
| `pnpm --filter @spiral/docs dev` | Storybook 开发，**http://localhost:6006** |
| `pnpm --filter @spiral/docs build` | 构建静态 Storybook（`storybook-static/`） |
| `pnpm --filter @spiral/docs typecheck` | TypeScript 检查 |

### `@spiral/playground`（`apps/playground`）

本地组件与主题调试 playground。

| 命令 | 说明 |
|---|---|
| `pnpm --filter @spiral/playground dev` | Vite 开发服务器，**http://localhost:5173** |
| `pnpm --filter @spiral/playground build` | `tsc -b` + Vite 生产构建 |
| `pnpm --filter @spiral/playground preview` | 预览生产构建 |
| `pnpm --filter @spiral/playground typecheck` | TypeScript 项目引用检查 |

---

## Packages

### `@aviala/spiral`（`packages/ui`）

React 组件库（源码在 `packages/ui`，包名 `@aviala/spiral`）。

| 命令 | 说明 |
|---|---|
| `pnpm --filter @aviala/spiral build` | tsup 打包 + 复制 CSS 到 `dist/` |
| `pnpm --filter @aviala/spiral dev` | tsup watch 模式 |
| `pnpm --filter @aviala/spiral typecheck` | TypeScript 检查 |
| `pnpm --filter @aviala/spiral clean` | 删除 `dist/` |

### `@aviala/tokens`（`packages/tokens`）

ALD 设计 token 与主题引擎。

| 命令 | 说明 |
|---|---|
| `pnpm --filter @aviala/tokens build` | tsup 打包 + 生成 CSS 产物（`build-css.mjs`） |
| `pnpm --filter @aviala/tokens dev` | tsup watch 模式 |
| `pnpm --filter @aviala/tokens typecheck` | TypeScript 检查 |
| `pnpm --filter @aviala/tokens clean` | 删除 `dist/` |

构建前需确保 `source/ald` 存在（`pnpm sync:ald` 或 CI 中已提交）。

### `@aviala/icons`（`packages/icons`）

Figma 图标 → SVGR → React 组件。

| 命令 | 说明 |
|---|---|
| `pnpm --filter @aviala/icons build` | SVGR 生成组件 + tsup 打包 |
| `pnpm --filter @aviala/icons build:icons` | 仅 SVGR 步骤（根 `icons:build` 调用此命令） |
| `pnpm --filter @aviala/icons dev` | tsup watch 模式 |
| `pnpm --filter @aviala/icons typecheck` | TypeScript 检查 |
| `pnpm --filter @aviala/icons clean` | 删除 `dist/`、`src/components/`、`src/catalog.ts` |

图标导出 workflow 详见 [figma-mcp.md](./figma-mcp.md#icons-export-workflow)。

---

## 常用工作流

### 日常组件开发

```bash
pnpm sync:ald                    # token 有更新时
pnpm --filter @aviala/tokens build
pnpm --filter @aviala/spiral dev # 或 build 一次后：
pnpm --filter @spiral/playground dev
```

### Storybook 预览

```bash
pnpm build                       # 确保依赖包已构建
pnpm --filter @spiral/docs dev
```

### 文档站开发与发布

```bash
pnpm docs:dev                    # 本地 http://localhost:5175/docs/spiral/
pnpm docs:build                  # 生产构建
pnpm docs:copy-hugo              # 复制到 ../avialaWebsite/static/docs/spiral/
```

Hugo 站点需为 `/docs/spiral/*` 配置 SPA fallback（回退到 `index.html`）。

### 图标同步（Figma → 代码）

```bash
pnpm icons:export:dry            # 预检
pnpm icons:sync                  # 导出 + 构建 @aviala/icons
pnpm build                       # 刷新依赖图标的包
```

可选过滤器与 CLI 参数见 [figma-mcp.md](./figma-mcp.md#icons-export-workflow)。

### ALD token 更新

```bash
pnpm sync:ald
pnpm --filter @aviala/tokens build
pnpm build
```

### 全量验证（与 CI 一致）

```bash
pnpm install --frozen-lockfile
pnpm sync:ald || true            # CI 无 ALD 时跳过
pnpm build
pnpm typecheck
```

---

## 独立 CLI 脚本

以下脚本**未**注册为根 `package.json` script，需直接用 `node` 调用。

| 脚本 | 用法 | 说明 |
|---|---|---|
| `scripts/sync-ald.mjs` | `pnpm sync:ald` | 复制 ALD → `packages/tokens/source/ald` |
| `scripts/copy-docs-to-hugo.mjs` | `pnpm docs:copy-hugo` | 复制 spiral-docs 构建产物到 Hugo |
| `scripts/figma-export/export-icons.mjs` | `pnpm icons:export` / `:dry` | Figma 图标 SVG 导出 |
| `scripts/figma-export/export-icons-audit.mjs` | `node scripts/figma-export/export-icons-audit.mjs --out=<dir>` | 导出到自定义目录并生成同步问题报告 |
| `scripts/figma-export/analyze-icons-metadata.mjs` | `node scripts/figma-export/analyze-icons-metadata.mjs <file>` | 分析 Figma 元数据 XML 中的图标帧 |
| `scripts/figma-export/test-icon-utils.mjs` | `node scripts/figma-export/test-icon-utils.mjs` | `icon-utils` 单元断言 |
| `packages/icons/scripts/build-icons.mjs` | 经 `icons:build` / `icons:sync` 调用 | SVGR → `src/components/` + `catalog.ts` |
| `packages/tokens/scripts/build-css.mjs` | 经 `@aviala/tokens build` 调用 | 生成各 `*-effects.css` 等 CSS 产物 |
| `packages/ui/scripts/copy-css.mjs` | 经 `@aviala/spiral build` 调用 | 复制样式到 `dist/styles.css` |
| `apps/spiral-docs/scripts/generate-props.mjs` | 经 spiral-docs `build` 调用 | react-docgen-typescript 生成 props 表 |

**`export-icons.mjs` 额外 CLI 参数：**

```bash
node scripts/figma-export/export-icons.mjs --thickness=Regular --mode=default
node scripts/figma-export/export-icons.mjs --no-clean   # 保留旧 raw SVG（不推荐）
```

---

## CI / Release

### CI（`.github/workflows/ci.yml`）

触发：`push` / `pull_request` → `main`

| 步骤 | 命令 / 动作 |
|---|---|
| 准备 ALD | 若存在 sibling `../ALD` 则复制；否则使用已提交的 `source/ald` |
| 安装 | `pnpm install --frozen-lockfile` |
| 同步 ALD | `pnpm sync:ald \|\| true` |
| 构建 | `pnpm build` |
| 类型检查 | `pnpm typecheck` |

### Release（`.github/workflows/release.yml`）

触发：`push` → `main`（Changesets Action）

| 步骤 | 命令 |
|---|---|
| 安装 + 构建 | `pnpm install --frozen-lockfile`、`pnpm build` |
| 版本 PR / 发布 | `pnpm changeset version`、`pnpm changeset publish` |

**本地 Changesets 工作流：**

```bash
pnpm changeset              # 创建变更集（选择 @aviala/* 等可发布包）
pnpm changeset version      # 应用版本 bump 与 CHANGELOG
pnpm changeset publish      # 发布到 npm（需 NPM_TOKEN）
```

Changesets 配置（`.changeset/config.json`）忽略 `@spiral/playground` 与 `@spiral/docs`（私有 app，不发布）。

---

## 环境变量

复制 `.env.example` → `.env.local`（**勿提交**）。CLI 脚本从仓库根自动加载 `.env.local` / `.env`（见 `scripts/figma-export/lib/load-env.mjs`）。

| 变量 | 必需 | 说明 |
|---|---|---|
| `FIGMA_ACCESS_TOKEN` | 图标导出时 | Figma Personal Access Token，见 [figma-mcp.md](./figma-mcp.md#environment) |
| `FIGMA_FILE_COLOUR` | 否 | Colour For Design 文件 key（默认已填） |
| `FIGMA_FILE_COMPONENTS` | 否 | Components 文件 key（默认已填） |
| `FIGMA_FILE_ICONS` | 否 | Icons 文件 key（默认已填） |
| `ICONS_THICKNESS` | 否 | 导出过滤器，逗号分隔，如 `Regular,Bold` |
| `ICONS_MODE` | 否 | 导出过滤器，如 `default` |
| `ALD_PATH` | 否 | 本地 ALD 仓库路径（默认见 `.env.example`） |
| `HUGO_WEBSITE_PATH` | 否 | Hugo 站点根目录（`docs:copy-hugo` 用，默认 `../avialaWebsite`） |

**CI / Release secrets（GitHub Actions）：**

| Secret | 用途 |
|---|---|
| `GITHUB_TOKEN` | Changesets 创建版本 PR |
| `NPM_TOKEN` | `changeset publish` 发布 npm 包 |
