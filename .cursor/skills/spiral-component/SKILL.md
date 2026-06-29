---
name: spiral-component
description: How to add or modify Spiral 2 React components aligned with Aviala Design Components Figma. Use when implementing UI components in packages/ui.
---

# Spiral Component Workflow

## Steps

1. Read component spec from Components Figma (`aykyMmGyzVPkAsf8oRBZg0`) — start with **Basic Input**, then **System Composition**
2. Map variants to `@aviala/tokens` CSS variables (no magic numbers)
3. Use `@aviala/icons` for icons
4. Base on Radix primitives where applicable (shadcn pattern)
5. Add `*.stories.tsx` under `packages/ui/src/components/`
6. Export from `packages/ui/src/index.ts`

## File layout

```
packages/ui/src/components/{name}/
  {name}.tsx
  {name}.stories.tsx
```

## Forbidden

- Hardcoded hex/rgb colors
- `lucide-react`
- Inline SVG icons (use `@aviala/icons`)

## Storybook

Run from repo root: `pnpm --filter @spiral/docs dev`
