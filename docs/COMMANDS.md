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

**Workspace 包一览（6 个 `package.json`）：**

| 路径 | 包名 | 说明 |
|---|---|---|
| `/` | `spiral2` | 根 monorepo，Turbo 编排与跨包脚本 |
| `apps/docs` | `@spiral/docs` | Storybook 组件预览 |
| `apps/playground` | `@spiral/playground` | 本地开发 playground |
| `packages/ui` | `@aviala-design/spiral` | React 组件库 |
| `packages/tokens` | `@aviala-design/tokens` | 设计 token 与主题引擎 |
| `packages/icons` | `@aviala-design/icons` | 图标 React 组件 |

**在任意 workspace 运行脚本：**

```bash
pnpm --filter <包名> <script>
# 例：pnpm --filter @aviala-design/spiral dev
```

---

## 根目录 Monorepo 命令

在仓库根目录执行 `pnpm <script>`。

| 命令 | 说明 |
|---|---|
| `pnpm build` | Turbo 并行构建全部 workspace（`dependsOn: ^build`） |
| `pnpm dev` | Turbo 启动各包 `dev`（持久任务，不缓存） |
| `pnpm lint` | Turbo 运行各包 `eslint .`，再补跑根 `scripts/` 与 `eslint.config.mjs`（见 [LINTING.md](./LINTING.md)） |
| `pnpm lint:fix` | 单次全仓 `eslint --fix` |
| `pnpm format` | `prettier --write .` |
| `pnpm format:check` | `prettier --check .`（CI 门禁） |
| `pnpm typecheck` | Turbo 运行各包 `typecheck`（依赖上游 `build`） |
| `pnpm clean` | Turbo 清理各包产物，并删除根 `node_modules` |
| `pnpm sync:ald` | 从本地 ALD 仓库复制 token 到 `packages/tokens/source/ald` |
| `pnpm icons:export` | 从 Icons File **已发布 library catalog** 导出 SVG（经 `raw/.staging/` 再 promote）；TTY 可对失败项 retry/skip/abort |
| `pnpm icons:export:dry` | 图标导出预检（不写入文件） |
| `pnpm icons:build` | 仅运行 `@aviala-design/icons` 的 SVGR 构建 |
| `pnpm icons:sync` | 图标导出 + `@aviala-design/icons` 完整构建 |

---

## Apps

### Spiral Docs（已迁出本仓库）

公开文档站源码现位于 `avialaWebsite/apps/spiral-docs`，通过 npm 上已发布的 `@aviala-design/*` 消费本库，并随 Hugo 站部署到 `/docs/spiral/`。

在 `avialaWebsite` 仓库运行：

| 命令 | 说明 |
|---|---|
| `npm run dev:spiral-docs` | Vite 开发服务器，**http://localhost:5175/docs/spiral/** |
| `npm run build:spiral-docs` | 构建到 `static/docs/spiral/` 并写入 `data/spiraldocs.json` |

原先的 dev-only 图标同步 API（`/__spiral/icon-sync/*`）已移除，改用本仓库的 `pnpm icons:export` + `pnpm icons:build`。

### `@spiral/docs`（`apps/docs`）

Storybook 8 组件预览。

| 命令 | 说明 |
|---|---|
| `pnpm --filter @spiral/docs dev` | Storybook 开发，**http://localhost:6006** |
| `pnpm --filter @spiral/docs build` | 构建静态 Storybook（`storybook-static/`） |
| `pnpm --filter @spiral/docs lint` | ESLint（含 `.storybook/`） |
| `pnpm --filter @spiral/docs typecheck` | TypeScript 检查 |

### `@spiral/playground`（`apps/playground`）

本地组件与主题调试 playground。

| 命令 | 说明 |
|---|---|
| `pnpm --filter @spiral/playground dev` | Vite 开发服务器，**http://localhost:5173** |
| `pnpm --filter @spiral/playground build` | `tsc -b` + Vite 生产构建 |
| `pnpm --filter @spiral/playground preview` | 预览生产构建 |
| `pnpm --filter @spiral/playground lint` | ESLint |
| `pnpm --filter @spiral/playground typecheck` | TypeScript 项目引用检查 |

---

## Packages

### `@aviala-design/spiral`（`packages/ui`）

React 组件库（源码在 `packages/ui`，包名 `@aviala-design/spiral`）。

| 命令 | 说明 |
|---|---|
| `pnpm --filter @aviala-design/spiral build` | tsup 打包 + 复制 CSS 到 `dist/` + 生成 `dist/props.json` |
| `pnpm --filter @aviala-design/spiral dev` | tsup watch 模式 |
| `pnpm --filter @aviala-design/spiral lint` | ESLint |
| `pnpm --filter @aviala-design/spiral typecheck` | TypeScript 检查 |
| `pnpm --filter @aviala-design/spiral clean` | 删除 `dist/` |

`dist/props.json` 通过 `./props.json` 导出随包发布，供文档站渲染组件 API 表格。

### `@aviala-design/tokens`（`packages/tokens`）

ALD 设计 token 与主题引擎。

| 命令 | 说明 |
|---|---|
| `pnpm --filter @aviala-design/tokens build` | tsup 打包 + 生成 CSS 产物（`build-css.mjs`） |
| `pnpm --filter @aviala-design/tokens dev` | tsup watch 模式 |
| `pnpm --filter @aviala-design/tokens lint` | ESLint |
| `pnpm --filter @aviala-design/tokens typecheck` | TypeScript 检查 |
| `pnpm --filter @aviala-design/tokens clean` | 删除 `dist/` |

构建前需确保 `source/ald` 存在（`pnpm sync:ald` 或 CI 中已提交）。

新增 `*-effects.css` 时，除了 `build-css.mjs` 的产物，还需在 `package.json` 的 `exports` 里补上对应子路径，否则下游（如文档站）无法 `import`。

### `@aviala-design/icons`（`packages/icons`）

Figma 图标 → SVGR → React 组件。

| 命令 | 说明 |
|---|---|
| `pnpm --filter @aviala-design/icons build` | SVGR 生成组件 + tsup 打包 |
| `pnpm --filter @aviala-design/icons build:icons` | 仅 SVGR 步骤（根 `icons:build` 调用此命令） |
| `pnpm --filter @aviala-design/icons dev` | tsup watch 模式 |
| `pnpm --filter @aviala-design/icons lint` | ESLint（跳过 SVGR 产物） |
| `pnpm --filter @aviala-design/icons typecheck` | TypeScript 检查 |
| `pnpm --filter @aviala-design/icons clean` | 删除 `dist/`、`src/components/`、`src/catalog.ts` |

图标导出 workflow 详见 [figma-mcp.md](./figma-mcp.md#icons-export-workflow)。

---

## 常用工作流

### 日常组件开发

```bash
pnpm sync:ald                    # token 有更新时
pnpm --filter @aviala-design/tokens build
pnpm --filter @aviala-design/spiral dev # 或 build 一次后：
pnpm --filter @spiral/playground dev
```

### Storybook 预览

```bash
pnpm build                       # 确保依赖包已构建
pnpm --filter @spiral/docs dev
```

### 公开文档站

组件改动需要先发版，文档站才会更新：

```bash
pnpm changeset                   # 记录版本变更
# 合并到 main 后由 release.yml 发布到 npm
```

发布成功后 Spiral2 会向 avialaWebsite 派发 `spiral-released`：脚手架自动开 docs PR（manifest / stubs、workspace 依赖 + lockfile bump）。人工按 bot checklist 补文档后把 manifest 标为 `ready` 并更新 `default`。详见 `avialaWebsite/docs/SPIRAL_DOCS_DISPATCH.md`。

### 图标同步（Figma → 代码）

```bash
pnpm icons:export:dry            # 预检
pnpm icons:sync                  # 导出 + 构建 @aviala-design/icons
pnpm build                       # 刷新依赖图标的包
```

可选过滤器与 CLI 参数见 [figma-mcp.md](./figma-mcp.md#icons-export-workflow)。

### ALD token 更新

```bash
pnpm sync:ald
pnpm --filter @aviala-design/tokens build
pnpm build
```

### 全量验证（与 CI 一致）

```bash
pnpm install --frozen-lockfile
pnpm sync:ald || true            # CI 无 ALD 时跳过
pnpm build
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
```

---

## 独立 CLI 脚本

以下脚本**未**注册为根 `package.json` script，需直接用 `node` 调用。

| 脚本 | 用法 | 说明 |
|---|---|---|
| `scripts/sync-ald.mjs` | `pnpm sync:ald` | 复制 ALD → `packages/tokens/source/ald` |
| `scripts/figma-export/export-icons.mjs` | `pnpm icons:export` / `:dry` | Figma 图标 SVG 导出 |
| `scripts/figma-export/export-icons-audit.mjs` | `node scripts/figma-export/export-icons-audit.mjs --out=<dir>` | 导出到自定义目录并生成同步问题报告 |
| `scripts/figma-export/analyze-icons-metadata.mjs` | `node scripts/figma-export/analyze-icons-metadata.mjs <file>` | 分析 Figma 元数据 XML 中的图标帧 |
| `scripts/figma-export/test-icon-utils.mjs` | `node scripts/figma-export/test-icon-utils.mjs` | `icon-utils` 单元断言 |
| `packages/icons/scripts/build-icons.mjs` | 经 `icons:build` / `icons:sync` 调用 | SVGR → `src/components/` + `catalog.ts` |
| `packages/tokens/scripts/build-css.mjs` | 经 `@aviala-design/tokens build` 调用 | 生成各 `*-effects.css` 等 CSS 产物 |
| `packages/ui/scripts/copy-css.mjs` | 经 `@aviala-design/spiral build` 调用 | 复制样式到 `dist/styles.css` |
| `packages/ui/scripts/generate-props.mjs` | 经 `@aviala-design/spiral build` 调用 | react-docgen-typescript 生成 `dist/props.json`，随包发布给文档站 |

**`export-icons.mjs` 额外 CLI 参数：**

```bash
node scripts/figma-export/export-icons.mjs --thickness=Regular --mode=default
node scripts/figma-export/export-icons.mjs --no-clean   # 保留旧 raw SVG（不推荐）
```

---

## CI / Release

### CI（`.github/workflows/ci.yml`）

触发：`push` / `pull_request` → `main`（Node 22 + pnpm 9）

| 步骤 | 命令 / 动作 |
|---|---|
| 准备 ALD | 若存在 sibling `../ALD` 则复制；否则使用已提交的 `source/ald` |
| 安装 | `pnpm install --frozen-lockfile` |
| 同步 ALD | `pnpm sync:ald \|\| true` |
| 构建 | `pnpm build`（icons 从已提交的 `packages/icons/src` 构建，**不调 Figma**） |
| 类型检查 | `pnpm typecheck` |
| Lint | `pnpm lint`（零 error 门禁，warning 见 [LINTING.md](./LINTING.md)） |
| 格式检查 | `pnpm format:check` |
| 测试 | `pnpm test` |

### Release（`.github/workflows/release.yml`）

触发：`push` → `main`（Changesets Action，Node 22 + pnpm 9）

| 步骤 | 命令 |
|---|---|
| 安装 | `pnpm install --frozen-lockfile` |
| 版本 PR 或发布 | `changesets/action`：`version:packages` 或 `release:publish` |
| `release:publish` | build tokens → icons `build:release` → spiral → `changeset publish`（**不调 Figma**） |
| Docs scaffold | 若发布了 `@aviala-design/spiral`，用 GitHub App token 向 avialaWebsite 派发 `spiral-released` |

发布走 **npm Trusted Publishing（OIDC）**，工作流声明 `id-token: write` 并升级 npm，因此 **CI 不需要 `NPM_TOKEN`**；新包需先在 npmjs.com → Settings → Trusted publishing 配置。

**本地 Changesets 工作流：**

```bash
pnpm changeset              # 创建变更集（选择 @aviala-design/* 等可发布包）
pnpm changeset version      # 应用版本 bump 与 CHANGELOG
pnpm changeset publish      # 本地发布需先 npm login（CI 走 OIDC，无需 token）
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

**CI / Release secrets & vars（GitHub Actions）：**

| Name | 类型 | 用途 |
|---|---|---|
| `GITHUB_TOKEN` | 内置 | Changesets 创建版本 PR |
| `AVIALA_WEBSITE_APP_CLIENT_ID` | Variable | 跨仓 docs scaffold（GitHub App Client ID） |
| `AVIALA_WEBSITE_APP_PRIVATE_KEY` | Secret | 跨仓 docs scaffold（App private key `.pem`） |
| `FIGMA_ACCESS_TOKEN` | Secret | Icons Sync / 本地 `pnpm icons:export`（CI/Release 不调 Figma） |

跨仓 dispatch 配置说明见 https://github.com/AvialaOSS/avialaWebsite/blob/main/docs/SPIRAL_DOCS_DISPATCH.md。
