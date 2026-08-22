# Spiral 2 — Agent Instructions

Spiral 2 is a design-system monorepo for the **Aviala Design** component library. It publishes three packages under the `@aviala-design` scope and two private apps for development and documentation.

## Monorepo layout

```
spiral2/
├── packages/
│   ├── ui/          → @aviala-design/spiral    React component library (Radix + shadcn pattern)
│   ├── icons/       → @aviala-design/icons     SVG icon pipeline (Figma → SVGR → React)
│   └── tokens/      → @aviala-design/tokens    CSS variables, theme engine, Tailwind preset
├── apps/
│   ├── playground/  → @spiral/playground       Vite dev app for manual component testing
│   └── docs/        → @spiral/docs             Storybook (component documentation)
├── scripts/         → Figma export & ALD sync utilities
├── skills/          → Shared agent skills (SKILL.md format, tool-agnostic)
└── .changeset/      → Pending changesets for next release
```

## Package responsibilities

| Package | Source root | Role |
|---|---|---|
| `packages/ui` | `packages/ui/src/` | React components. Flat file layout: `components/{name}.tsx` + `{name}.stories.tsx`. Compound components use subfolders (`date-picker/`, `color-picker/`, `time-picker/`, `video/`). All exports go through `src/index.ts`. |
| `packages/icons` | `packages/icons/src/` | React icon components generated from Figma SVGs. `src/components/` holds one component per icon; `src/catalog.ts` is the barrel. `scripts/build-icons.mjs` drives SVGR. |
| `packages/tokens` | `packages/tokens/src/` | CSS variables and theme engine. `src/semantic/` holds per-component effect CSS. `source/ald/` is synced from an external ALD token source. |
| `apps/playground` | `apps/playground/src/` | Vite + React sandbox. Imports all three packages for interactive testing. |
| `apps/docs` | `apps/docs/` | Storybook 8. Stories live alongside components in `packages/ui/src/components/`. |

## Key commands

```bash
# Full monorepo
pnpm build              # turbo run build (all packages)
pnpm dev                # turbo run dev (all packages, watch mode)
pnpm typecheck          # turbo run typecheck
pnpm lint               # turbo run lint

# Per-package (filter)
pnpm --filter @aviala-design/spiral build
pnpm --filter @spiral/docs dev          # Storybook on :6006
pnpm --filter @spiral/playground dev    # Vite playground

# Icons (Figma pipeline — requires FIGMA_ACCESS_TOKEN in .env.local)
pnpm icons:export       # Figma → raw SVGs
pnpm icons:build        # raw SVGs → React components
pnpm icons:sync         # export + build + release build

# Release
pnpm version:packages   # changeset version + stamp changelogs
pnpm release:publish    # build all + changeset publish
```

## Agent skills

`skills/` is the **single source of truth** for all agent skills. Each skill is a folder containing a `SKILL.md` file (YAML frontmatter + Markdown instructions) plus optional resources.

`.cursor/skills/` and `.qoder/skills/` contain thin **redirector** files — they carry the `name` + `description` frontmatter that tools need for discovery, then point the agent to `skills/{name}/SKILL.md` for the full instructions. No junctions, no scripts, cross-platform.

When editing skills, always edit the file in `skills/` — the redirectors only need updating when a new skill is added.

| Skill | Purpose |
|---|---|
| `spiral-component` | How to add/modify components aligned with Figma |
| `spiral-coding-tone` | Naming, comments, token usage conventions |
| `spiral-changelog` | Changelog + changeset workflow |
| `spiral-theme` | Theme engine, generateTheme, applyTheme |
| `aviala-design-system` | Design system reference |
| `spiral-icons` | Icon pipeline usage |

## Coding conventions

- **Language**: English comments, English commit messages. Scopes: `fix(ui):`, `fix(tokens):`, `fix(playground):`, `chore:`, `docs:`.
- **Styling**: CSS variables from `@aviala-design/tokens` only. No hardcoded hex/rgb colors.
- **Icons**: `@aviala-design/icons` only. No `lucide-react`, no inline SVG.
- **Components**: Prefer Radix primitives (shadcn pattern). Use `cn()` from `src/lib/utils` for class merging. Use `class-variance-authority` for variant management.
- **Changelogs**: User-visible changes get a `packages/ui/changelogs/{DisplayName}.md` entry (Chinese bullets, English section titles) **and** a changeset.
- **Exports**: Every public component must be re-exported from `packages/ui/src/index.ts`.

## Release flow

Feature branch + changeset → merge to main → `pnpm version:packages` creates a Version PR → merge Version PR → `pnpm release:publish` publishes to npm.

## CI

GitHub Actions (`.github/workflows/`):
- **CI** (`ci.yml`): build + typecheck on push/PR to main.
- **Icons Sync** (`icons-sync.yml`): manual Figma export → build → PR.
- **Release** (`release.yml`): changeset-based publish.

## Tech stack

- **Runtime**: React ≥18, Radix UI primitives, Tailwind CSS v4
- **Build**: tsup (packages), Vite (apps), Turbo (orchestration)
- **Package manager**: pnpm 9.x with workspace protocol
- **TypeScript**: 5.x, strict mode, ES2022 target
- **Testing**: vitest (minimal setup — pure-function tests for date-utils)
- **Releases**: Changesets
