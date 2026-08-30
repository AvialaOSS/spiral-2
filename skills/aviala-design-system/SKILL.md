---
name: aviala-design-system
description: Aviala Design system conventions for Spiral 2 — tokens, Figma files, naming, theme rules. Use when implementing Spiral components or tokens.
---

# Aviala Design System (Spiral 2)

## Figma sources

| File              | Key                      | URL                                                                   |
| ----------------- | ------------------------ | --------------------------------------------------------------------- |
| Colour For Design | `RbhKI6PNBWXMUmFijJ6Zuz` | https://www.figma.com/design/RbhKI6PNBWXMUmFijJ6Zuz/Colour-For-Design |
| Components        | `aykyMmGyzVPkAsf8oRBZg0` | https://www.figma.com/design/aykyMmGyzVPkAsf8oRBZg0/Components        |
| Icons             | `kLrxJHsDob2VoX7PfkD5PW` | https://www.figma.com/design/kLrxJHsDob2VoX7PfkD5PW/Icons             |

## ALD tokens

Local export: `packages/tokens/source/ald/` (sync via `pnpm sync:ald`).
`control/*` lives in `Components/token-colors/` (no separate control collection).

Semantic step mapping (designer-defined):

- Primary backgrounds/borders → step **8**
- Text primary → step **10**, secondary → **7**, light → **5**
- Secondary backgrounds → **4**, light → **2**
- Neutral borders → `border-normal-1|2|3` (aliases neutral **3|4|6**)

## Packages

- `@aviala-design/tokens` — theme engine + CSS variables
- `@aviala-design/icons` — SVG icons (no lucide-react)
- `@aviala-design/spiral` — React components + ThemeProvider

## Rules

- Never hardcode colors; use CSS variables from `@aviala-design/tokens`
- Never import `lucide-react`
- New components: follow Components Figma section order — prefer **Basic Input**, then **System Composition**, then later sections

## Quick check

When this skill triggers your attention during component or token work:

1. Run `pnpm typecheck` — must pass.
2. Open Storybook (`pnpm --filter @spiral/docs dev`) — visually compare the component against the Figma source.
3. Inspect rendered styles in DevTools: confirm all colors resolve to CSS custom properties from `@aviala-design/tokens`, not hardcoded values.
4. For detailed implementation steps, follow `spiral-component`; for theme/token work, follow `spiral-theme`.
