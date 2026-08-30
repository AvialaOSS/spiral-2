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
├── .agents/audit/   → Repo audit findings + fix plan (agent-reusable reference)
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
pnpm icons:export:dry   # export dry run (no writes to raw/)
pnpm icons:build        # raw SVGs → React components (full replace, drops orphans)
pnpm icons:build:merge  # regenerate only icons present in raw/ (use after a filtered export)
pnpm icons:sync         # export + build + release build

# Release
pnpm version:packages   # changeset version + stamp changelogs
pnpm release:publish    # build all + changeset publish
```

## Agent skills

`skills/` is the **single source of truth** for all agent skills. Each skill is a folder containing a `SKILL.md` file (YAML frontmatter + Markdown instructions) plus optional resources.

`.cursor/skills/` contains thin **redirector** files — they carry the `name` + `description` frontmatter that tools need for discovery, then point the agent to `skills/{name}/SKILL.md` for the full instructions. No junctions, no scripts, cross-platform.

When editing skills, always edit the file in `skills/` — the redirectors only need updating when a new skill is added.

Tool-specific agent directories other than `.cursor/` are **not tracked**. `.qoder/` is gitignored: it used to carry a duplicate redirector set plus a generated `repowiki/`, which drifted from `skills/` and bloated the tree. If another agent tool needs discovery stubs, add a redirector set under that tool's directory and register it here rather than committing generated caches.

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
  - Exempt (structure-coupled graphics, not icons) — **6 files, 9 occurrences**, all under `packages/ui/src/components/`. These SVGs are driven by component geometry (masks, animated paths, sized pointers) and cannot be replaced by catalog icons:

    | File | Occurrences | Why it stays inline |
    |---|---|---|
    | `checkbox-check-icon.tsx` | 1 | Checkmark path is stroke-dash animated with the checkbox state |
    | `loading.tsx` | 1 | `<mask>` that clips the conic-gradient spinner |
    | `overlay-pointer.tsx` | 1 | Arrow geometry is recomputed from overlay placement/size |
    | `progress.tsx` | 1 | Track/indicator geometry follows the measured bar |
    | `tab.tsx` | 1 | Active-tab notch shape depends on adjacent tab widths |
    | `video/video-animated-icon-markup.ts` | 4 | play/pause/next/previous animation markup injected at runtime with `__UID__` substitution |

    This is a closed list. Adding an inline SVG means adding a row here in the same change, with the geometric reason — otherwise use a catalog icon.
- **Components**: Prefer Radix primitives (shadcn pattern). Use `cn()` from `src/lib/utils` for class merging. Use `class-variance-authority` for variant management.
- **Changelogs**: User-visible changes get a `packages/ui/changelogs/{DisplayName}.md` entry (Chinese bullets, English section titles) **and** a changeset.
- **Exports**: Every public component must be re-exported from `packages/ui/src/index.ts`.

## Commit and PR conventions

- One semantic scope per commit subject, imperative mood, English: `fix(ui):`, `fix(tokens):`, `fix(playground):`, `fix(icons):`, `refactor(ui):`, `chore:`, `docs:`.
- The subject says what changed and where. Bare status words are not commit messages — `Skill maintain`, `update`, `wip`, `fix`, and `misc` all fail review.
- **This includes edits under `skills/` and `.cursor/skills/`.** Skill and doc maintenance is still a semantic change: `docs: clarify changelog stamping in spiral-changelog skill`, not `Skill maintain`.
- Breaking changes get a `!` marker and a major changeset: `fix(ui)!: move form components to subpath export`.
- Keep unrelated cleanups out of a focused commit. Record out-of-scope findings in the PR description instead of fixing them in passing.

## Known pitfalls

Collected from the repo-wide audit in `.agents/audit/`. Read this before touching packaging, the slider, or class names.

### `react-hook-form` belongs to the `/form` subpath

`react-hook-form` is a peer dependency, and tsup externalizes it, so any top-level `import` of it leaves a dangling import in the published bundle. Consumers who never use forms then crash on importing the library at all.

- Form components (`Form`, `FormField`, …) are exported from `@aviala-design/spiral/form` — **not** the main entry.
- Never re-export a form component from `packages/ui/src/index.ts`, and never import `react-hook-form` from a module that the main entry pulls in.
- Verification: `rg "react-hook-form" packages/ui/dist/index.js packages/ui/dist/index.cjs` must return nothing after a build. `dist/form.js` is the only bundle allowed to reference it.
- Status: the subpath split is Wave 4a. Until it lands, `src/index.ts` still re-exports form components — treat that as the bug, not the contract.

### Radix Slider depends on `unstable_*` APIs

`packages/ui/src/components/slider.tsx` uses `unstable_ThumbProvider`, `unstable_ThumbTrigger`, and `unstable_BubbleInput` from `@radix-ui/react-slider`. These carry no semver guarantee and have changed within patch releases.

- Pin the exact version in `packages/ui/package.json` (no `^`, no `~`).
- Bumping `@radix-ui/react-slider` requires a manual slider regression pass — single and range modes, keyboard stepping, and the value bubble — before the bump is committed.
- Status: the pin is Wave 4b. Until it lands the range is still a caret, so a fresh `pnpm install` can resolve a slider-breaking patch.

### Class names and CSS must stay in sync, both directions

Component class names live in `packages/ui/src` (mostly `cva` variant maps); their styles live in `packages/tokens/src`. Nothing enforces the link, and the audit found drift in both directions: 21 `aviala-*` classes emitted with no CSS anywhere (since removed), plus CSS selectors no component ever emits.

- A variant that has no styling should map to `""`, not to a semantically-empty class name.
- When you rename or add a class, grep both sides in the same change.
- Deleting CSS means checking that no component still emits the selector.

## Class ↔ CSS cross-check

Run both directions after any change to class names or semantic CSS.

```bash
# 1. Classes emitted by components
rg -o --no-filename "aviala-[a-z0-9_-]+" packages/ui/src -g "*.tsx" | sort -u > /tmp/emitted.txt

# 2. Classes styled by tokens CSS
rg -o --no-filename "aviala-[a-z0-9_-]+" packages/tokens/src -g "*.css" | sort -u > /tmp/styled.txt

# 3a. Ghost classes — emitted but never styled
comm -23 /tmp/emitted.txt /tmp/styled.txt

# 3b. Dead CSS — styled but never emitted (review; some are consumer-facing hooks)
comm -13 /tmp/emitted.txt /tmp/styled.txt
```

PowerShell equivalent for step 3:

```powershell
$emitted = rg -o --no-filename "aviala-[a-z0-9_-]+" packages/ui/src -g "*.tsx" | Sort-Object -Unique
$styled  = rg -o --no-filename "aviala-[a-z0-9_-]+" packages/tokens/src -g "*.css" | Sort-Object -Unique
Compare-Object $emitted $styled | Format-Table -AutoSize   # "<=" ghost class, "=>" dead CSS
```

Triage the ghost list rather than expecting literal zero — the regex also matches non-class strings. The current known-clean baseline is 5 hits, all false positives: `aviala-design` and `aviala-theme` (package scope and storage-key strings), `aviala-link--` and `aviala-loading-ring-` (template-literal prefixes that are completed at runtime), and `aviala-neutral-neutral-12` (a token name, not a class). Anything beyond those five is a real ghost class.

Hardcoded-color check, same trigger:

```bash
rg -n "#[0-9a-fA-F]{3,8}\b|rgba?\(" packages/ui/src -g "*.tsx" -g "!*.stories.tsx"
```

The only expected hit is `color-picker/color-picker-slider.tsx`, where the track gradient is computed from the user's channel values. Story files are excluded because demo palettes are legitimate fixture data. Everything else must resolve through a `@aviala-design/tokens` variable.

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
