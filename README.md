# Spiral 2

Aviala Design aligned React component library built on shadcn/ui, Radix UI, and Tailwind CSS v4.

## Packages

| Package | Description |
|---|---|
| `@aviala/tokens` | Theme engine + design tokens (ALD + `@aviala-design/color`) |
| `@aviala/icons` | Aviala Design Icons as React SVG components |
| `@aviala/spiral` | React components + `ThemeProvider` |

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

中文组件文档，Semi 风格侧栏 + Live Demo + API，部署到 Hugo 站 `/docs/spiral/`。

```bash
pnpm docs:build
pnpm docs:dev          # http://localhost:5175/docs/spiral/
pnpm docs:copy-hugo    # 复制到 ../avialaWebsite/static/docs/spiral/
```

Hugo 入口：[avialaWebsite/content/docs/_index.md](../avialaWebsite/content/docs/_index.md) → `https://www.aviala.top/docs/spiral/start/introduction`

Hosting 需为 `/docs/spiral/*` 配置 SPA fallback（回退到 `index.html`）。

## Environment

Copy `.env.example` to `.env.local` and set `FIGMA_ACCESS_TOKEN` for Figma exports. See [docs/figma-mcp.md](docs/figma-mcp.md).

## MVP components

Phase 2 delivery order (Components Figma):

1. **Basic Input** — Input, Textarea, Checkbox, Radio, Switch, Label, Button
2. **System Composition** — FormField, InputGroup, Stack, Fieldset

## License

MIT
