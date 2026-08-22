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

- Match existing `packages/ui` structure: flat `components/{name}.tsx` + `{name}.stories.tsx` (subfolders only for compound components like `date-picker/`).
- Style via `@aviala-design/tokens` CSS variables — no magic hex/rgb.
- Icons from `@aviala-design/icons` only — no `lucide-react`, no inline SVG.
- Prefer Radix / shadcn patterns already used in the package.
- Comments: **English**, sparse — explain non-obvious intent, not what the code already says.

## Verify

After implementing or refactoring code in `packages/ui`:

1. Run `pnpm typecheck` — must pass with no new errors.
2. Run `pnpm --filter @spiral/playground dev` and `pnpm --filter @spiral/docs dev` — confirm the component renders without console errors.
3. Grep the changed files for forbidden patterns: no hardcoded hex/rgb colors, no `lucide-react` imports, no inline SVG.
4. Confirm file naming matches the flat layout: `components/{name}.tsx` + `{name}.stories.tsx` (subfolder only for compound components).
5. Review commit message: English subject, correct scope (`fix(ui):`, `fix(tokens):`, etc.), no Chinese subject line.

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
