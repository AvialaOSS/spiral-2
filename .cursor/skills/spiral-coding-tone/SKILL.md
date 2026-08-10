---
name: spiral-coding-tone
description: >-
  Spiral 2 coding conventions for packages/ui naming, English comments, token
  and icon usage, and English commit/PR messaging. Use when implementing or
  refactoring Spiral UI packages, writing commits or PRs in Spiral2, or when
  the user mentions coding style, naming, or commit tone.
---

# Spiral Coding Tone

## Code

- Match existing `packages/ui` structure and naming (`{name}/{name}.tsx`, stories beside source).
- Style via `@aviala-design/tokens` CSS variables — no magic hex/rgb.
- Icons from `@aviala-design/icons` only — no `lucide-react`, no inline SVG.
- Prefer Radix / shadcn patterns already used in the package.
- Comments: **English**, sparse — explain non-obvious intent, not what the code already says.

## Local verify

- Playground: `pnpm --filter @spiral/playground dev`
- Storybook: `pnpm --filter @spiral/docs dev`
- Figma only for icon sync (`spiral-icons` skill), not for normal build/release

## Commits and PRs (Spiral2)

- **English** subjects and bodies; why-focused, concise.
- Prefer scopes seen in history: `fix(ui):`, `fix(tokens):`, `fix(playground):`, `chore:`, `docs:`.
- Do **not** invent Chinese commit subjects unless the user explicitly asks.
- Release flow: feature + changeset → merge → Version PR (`chore: version packages`) → merge to publish. Do not auto-merge Version PRs when multiple feature forks are in flight.
- Cross-repo docs dispatch uses a GitHub App after spiral publishes — see avialaWebsite `docs/SPIRAL_DOCS_DISPATCH.md`.

## Related skills

- User-visible UI work → `spiral-component` + `spiral-changelog`
- Theme / tokens → `spiral-theme`
- Icons → `spiral-icons`
