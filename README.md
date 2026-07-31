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
pnpm --filter @spiral/playground dev
```

No build step is needed before dev: `@aviala-design/tokens/vite-plugin` serves
the theme engine and every token stylesheet straight from source (the generated
`styles.css` / `ald-theme.css` are produced on the fly, and edits to
`packages/tokens/src/semantic/*.css` or `source/ald/**` hot-reload). Run
`pnpm sync:ald` only when refreshing the committed ALD tokens from a local ALD
checkout, and `pnpm build` when you need publishable `dist/` artifacts.

## Playground

```bash
pnpm --filter @spiral/playground dev
```

Open http://localhost:5173 — theme switcher, color palette, icon gallery, Basic Input & System Composition demos.

## Storybook

```bash
pnpm --filter @spiral/docs dev
```

Storybook uses the same zero-build setup (the tokens Vite plugin in
`.storybook/main.ts`), so it starts without `turbo build` and hot-reloads
token CSS changes.

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

## Publishing

Release uses [changesets](https://github.com/changesets/changesets) (Version PR → merge → npm publish). **CI and Release never call Figma.**

1. Feature work → `pnpm changeset` → PR → merge to `main`
2. Release Action opens **Version PR** (versions / changelogs only — no Figma, no publish-time build)
3. Merge Version PR → Release runs `pnpm release:publish` (build tokens / icons from committed `src` / spiral → `changeset publish`)

Batch several changesets before merging the Version PR to avoid extra Version↔Publish round-trips. Optional: enable auto-merge on `chore: version packages`.

### Icons

Sync from Figma only when icons change; commit `packages/icons/src/**` only (`raw/` stays gitignored). Full maintenance guide: [`packages/icons/README.md`](packages/icons/README.md).

```bash
pnpm icons:sync                                      # full export + build + tsup
pnpm icons:export --name=direction_arrowLeft         # then icons:build:merge for partial updates
```

CI: Actions → **Icons Sync** (`icons-sync.yml`).
## Environment

Copy `.env.example` to `.env.local` and set `FIGMA_ACCESS_TOKEN` for Figma exports. See [docs/figma-mcp.md](docs/figma-mcp.md). Only needed for icon sync, not for normal build/release.

## MVP components

Phase 2 delivery order (Components Figma):

1. **Basic Input** — Input, Textarea, Checkbox, Radio, Switch, Label, Button
2. **System Composition** — FormField, InputGroup, Stack, Fieldset

## License

MIT
