---
name: spiral-component
description: How to add or modify Spiral 2 React components aligned with Aviala Design Components Figma. Use when implementing UI components in packages/ui.
---

# Spiral Component Workflow

## Steps

1. Read component spec from Components Figma (`aykyMmGyzVPkAsf8oRBZg0`) — start with **Basic Input**, then **System Composition**
2. Map variants to `@aviala-design/tokens` CSS variables (no magic numbers)
3. Use `@aviala-design/icons` for icons
4. Base on Radix primitives where applicable (shadcn pattern)
5. Add `*.stories.tsx` under `packages/ui/src/components/`
6. Export from `packages/ui/src/index.ts`
7. If the change is user-visible: update `packages/ui/changelogs/{DisplayName}.md` **and** add a changeset — follow skill `spiral-changelog` for Unreleased / Chinese bullets / stamping rules

## File layout

```
packages/ui/src/components/{name}/
  {name}.tsx
  {name}.stories.tsx

packages/ui/changelogs/{DisplayName}.md   # e.g. Button.md, DatePickerField.md
```

`DisplayName` must match the docs `nav.component` / export name (`Button`, `SegmentatorGroup`, `CascaderField`, …).

## Component changelog

条目正文统一使用**中文**（API 名、代码标识符、枚举值保持原文）。Section 标题仍用英文：`Added` / `Changed` / `Fixed` / `Removed` / `Deprecated`。

Write under `## [Unreleased]` — do **not** hand-fill the next semver. `pnpm run version:packages` stamps Unreleased → the package version after `changeset version`.

Prefer the bracketed heading. Legacy `## Unreleased` (no brackets) is still stamped for compatibility.

```md
# Button

## [Unreleased]

### Added
- …

## 2.1.0
…
```

Allowed section headings: `Added` / `Changed` / `Fixed` / `Removed` / `Deprecated`.

Build emits `dist/component-changelogs.json` (export `@aviala-design/spiral/component-changelogs.json`) for the docs site.

## Forbidden

- Hardcoded hex/rgb colors
- `lucide-react`
- Inline SVG icons (use `@aviala-design/icons`)

## Storybook

Run from repo root: `pnpm --filter @spiral/docs dev`
