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

## Environment

Copy `.env.example` to `.env.local` and set `FIGMA_ACCESS_TOKEN` for Figma exports. See [docs/figma-mcp.md](docs/figma-mcp.md).

## MVP components

Phase 2 delivery order (Components Figma):

1. **Basic Input** — Input, Textarea, Checkbox, Radio, Switch, Label, Button
2. **System Composition** — FormField, InputGroup, Stack, Fieldset

## License

MIT
