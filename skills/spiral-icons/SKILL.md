---
name: spiral-icons
description: Aviala Design Icons pipeline for @aviala-design/icons — SVG export, SVGR build, naming. Use when adding or updating icons.
---

# Spiral Icons

## Source of truth

| Path | In git? | Role |
|---|---|---|
| `packages/icons/raw/` | **No** (gitignore) | Local / CI sync scratch from Figma |
| `packages/icons/src/components/` + `catalog.ts` | **Yes** | What CI and `release:publish` build (`tsup` / `build:release`) |

Normal `pnpm build`, CI, and Release **do not** call Figma. Sync icons only when the set changes.

## Figma source model

Discovery uses the **published library catalog** of the Icons file (`FIGMA_FILE_ICONS`). New icons must be **Publish library**’d in Figma before they appear in export. SVG bytes are rendered from the **live file**.

Icons live in **component sets**:

| Layer | Example |
|---|---|
| Component set | `direction/arrowLeft` |
| Variant (order varies) | `thickness=Regular, mode=default, name=direction_arrowLeft` |
| Exported SVG | `raw/direction/direction_arrowLeft-regular-default.svg` |

## React component model

One React component per icon **name** — switch variants via props:

```tsx
import { DirectionArrowLeft, Icon } from "@aviala-design/icons";

<DirectionArrowLeft thickness="Bold" mode="fill" width={20} />
<Icon icon={DirectionArrowLeft} size={20} thickness="Light" mode="default" />
```

| Prop | Values | Default |
|---|---|---|
| `thickness` | `Light` \| `Regular` \| `Medium` \| `Bold` \| `Black` | `Medium` |
| `mode` | `default` \| `fill` | `default` |
| `Icon` `size` | number \| CSS length | typography token when unset |
| `Icon` `level` | `display` \| `headline1` \| `headline2` \| `title` \| `subtitle` \| `text` \| `caption` | — (maps to icon size tokens) |

Component name = PascalCase of icon `name` (`direction_arrowLeft` → `DirectionArrowLeft`).

Missing variant combinations fall back to `Medium/default`, then any available variant.

## Pipeline

```bash
pnpm icons:export       # stage → promote into raw/{category}/
pnpm icons:build        # raw → React components (full replace of generated set)
pnpm icons:build:merge  # raw → React (update icons present in raw/; keep others)
pnpm icons:sync         # export + build:icons + build:release (tsup)
```

Export writes to `raw/.staging/` first and promotes only after success (or after interactive skip). Abort / rate-limit exhaustion leave existing `raw/` unchanged. Full promote replaces `raw/` (unless `--no-clean`).

Local TTY: recoverable failures (null URL / download error) prompt `(r)etry` / `(s)kip` / `(a)bort`. CI and `--non-interactive` treat remaining failures as abort (`exit 1`). Rate-limit exhaustion always hard-fails.

### Optional export filters

| Flag / env | Example |
|---|---|
| `--thickness=` / `ICONS_THICKNESS` | `Regular,Medium` |
| `--mode=` / `ICONS_MODE` | `default,fill` |
| `--category=` / `ICONS_CATEGORY` | `direction,ai` |
| `--name=` or `--only=` / `ICONS_NAME` | `direction_arrowLeft` |
| `--dry-run` | list matches, write nothing |
| `--no-clean` | merge into existing `raw/` on promote |
| `--non-interactive` / `ICONS_NON_INTERACTIVE` | no prompts; failures abort |
| `--max-retries=` / `ICONS_MAX_RETRIES` | 429 retry budget (default 6) |

```bash
pnpm icons:export --category=direction --thickness=Regular
pnpm icons:export --name=direction_arrowLeft
pnpm icons:export:dry --category=ai
```

After a **filtered** export, use `pnpm icons:build:merge` so other committed icons are not deleted. Full export → `pnpm icons:build`.

### GitHub Actions

Workflow **Icons Sync** (`.github/workflows/icons-sync.yml`): `workflow_dispatch` with the same optional filters → Figma export (`ICONS_NON_INTERACTIVE=1`, fails on skips / rate-limit exhaustion) → build → PR with `packages/icons/src/**` only (never `raw/`).

Commit generated **src**, add a changeset for `@aviala-design/icons`, then follow the normal Version → Publish path (still no Figma on publish).

## Setup

`.env.local`:

```bash
FIGMA_ACCESS_TOKEN=your_token
```

## Output layout

```
raw/direction/direction_arrowLeft-light-default.svg   # gitignored
src/components/DirectionArrowLeft.tsx                 # committed
src/catalog.ts                                        # committed
```

## Package scripts

| Script | Meaning |
|---|---|
| `build` | `build-icons` (no-op if `raw/` empty) + `tsup` |
| `build:icons` | SVG → components |
| `build:release` | `tsup` only (CI / publish) |

## Rules

- Figma artboard is **120×120**; build normalizes SVG `viewBox` to `0 0 120 120` (and strips fixed width/height) — set size via props (`width`, `height`, `Icon` `size`, or `Icon` `level`)
- Parse variant strings order-independently (`parseVariantName`)
- Never use canvas frame names for export
- SVGR → `currentColor`
- Decorative: `aria-hidden`; semantic: `title` on `Icon`

## Verify

After adding or updating icons:

1. Run `pnpm --filter @aviala-design/icons build` — must complete without errors.
2. Confirm new icon component(s) exist in `packages/icons/src/components/` and are registered in `src/catalog.ts`.
3. Run `pnpm typecheck` — must pass with no new errors.
4. In the playground or Storybook, render a new icon component and confirm it displays at the expected size.
5. If the icon set changed: confirm a changeset for `@aviala-design/icons` exists.
