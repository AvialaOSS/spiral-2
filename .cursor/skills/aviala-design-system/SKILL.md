---
name: aviala-design-system
description: Aviala Design system conventions for Spiral 2 — tokens, Figma files, naming, theme rules. Use when implementing Spiral components or tokens.
---

# Aviala Design System (Spiral 2)

## Figma sources

| File | Key | URL |
|---|---|---|
| Colour For Design | `RbhKI6PNBWXMUmFijJ6Zuz` | https://www.figma.com/design/RbhKI6PNBWXMUmFijJ6Zuz/Colour-For-Design |
| Components | `aykyMmGyzVPkAsf8oRBZg0` | https://www.figma.com/design/aykyMmGyzVPkAsf8oRBZg0/Components |
| Icons | `kLrxJHsDob2VoX7PfkD5PW` | https://www.figma.com/design/kLrxJHsDob2VoX7PfkD5PW/Icons |

## ALD tokens

Local export: `packages/tokens/source/ald/` (sync via `pnpm sync:ald`).

Semantic step mapping (designer-defined):
- Primary backgrounds/borders → step **8**
- Text primary → step **10**, secondary → **7**, light → **5**
- Secondary backgrounds → **4**, light → **2**

## Packages

- `@aviala-design/tokens` — theme engine + CSS variables
- `@aviala-design/icons` — SVG icons (no lucide-react)
- `@aviala-design/spiral` — React components + ThemeProvider

## Rules

- Never hardcode colors; use CSS variables from `@aviala-design/tokens`
- Never import `lucide-react`
- MVP order: **Basic Input** → **System Composition** (Components Figma)
