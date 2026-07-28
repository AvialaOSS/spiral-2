# Spiral 2

Aviala Design aligned React component library built on shadcn/ui, Radix UI, and Tailwind CSS v4.

## Packages

| Package | Description |
|---|---|
| `@aviala-design/tokens` | Theme engine + design tokens (ALD + `@aviala-design/color`) |
| `@aviala-design/icons` | Aviala Design Icons as React SVG components |
| `@aviala-design/spiral` | React components + `ThemeProvider` |

## Quick start

```bash
pnpm install
pnpm sync:ald
pnpm build
pnpm --filter @spiral/playground dev
```

## Playground

```bash
pnpm --filter @spiral/playground dev
```

Open http://localhost:5173 — theme switcher, color palette, icon gallery, Basic Input & System Composition demos.

## Storybook

```bash
pnpm --filter @spiral/docs dev
```

## 公开文档站（Spiral Docs）

中文组件文档已迁出本仓库，源码位于 [avialaWebsite/apps/spiral-docs](../avialaWebsite/apps/spiral-docs)，通过 npm 上已发布的 `@aviala-design/*` 消费本库，随 Hugo 站一起部署到 `https://www.aviala.top/docs/spiral/`。

```bash
# 在 avialaWebsite 仓库
npm run dev:spiral-docs     # http://localhost:5175/docs/spiral/
npm run build:spiral-docs
```

因此**文档展示的是已发布版本**：组件改动需要先 `pnpm changeset` 并合并到 `main`，由 [release.yml](.github/workflows/release.yml) 发布后，文档站才会同步。

组件 API 表格数据由 `packages/ui` 构建时生成，随包发布为 `@aviala-design/spiral/props.json`。

GitHub Pages 发布步骤见：[avialaWebsite/docs/GITHUB_DEPLOY.md](../avialaWebsite/docs/GITHUB_DEPLOY.md)。

## Environment

Copy `.env.example` to `.env.local` and set `FIGMA_ACCESS_TOKEN` for Figma exports. See [docs/figma-mcp.md](docs/figma-mcp.md).

## MVP components

Phase 2 delivery order (Components Figma):

1. **Basic Input** — Input, Textarea, Checkbox, Radio, Switch, Label, Button
2. **System Composition** — FormField, InputGroup, Stack, Fieldset

## License

MIT
