# `@aviala-design/icons`

Aviala Design Icons as React SVG components. Figma is the design source of truth; this package commits the generated React components, not the raw SVG scratch files.

**CI and Release never call Figma.** Sync from Figma only when the icon set changes.

## Source of truth

| Path | In git? | Role |
|---|---|---|
| `raw/` | **No** (gitignore) | Local / CI sync scratch from Figma |
| `src/components/` + `src/catalog.ts` | **Yes** | What CI and `release:publish` build (`tsup` / `build:release`) |

```
raw/direction/direction_arrowLeft-light-default.svg   # gitignored
src/components/DirectionArrowLeft.tsx                 # committed
src/catalog.ts                                        # committed
```

## Figma → React model

Icons live in Figma **component sets**:

| Layer | Example |
|---|---|
| Component set | `direction/arrowLeft` |
| Variant | `thickness=Regular, mode=default, name=direction_arrowLeft` |
| Exported SVG | `raw/direction/direction_arrowLeft-regular-default.svg` |

One React component per icon **name**. Switch variants via props:

```tsx
import { DirectionArrowLeft, Icon } from "@aviala-design/icons";

<DirectionArrowLeft thickness="Bold" mode="fill" width={20} />
<Icon icon={DirectionArrowLeft} size={20} thickness="Light" mode="default" />
```

| Prop | Values | Default |
|---|---|---|
| `thickness` | `Light` \| `Regular` \| `Medium` \| `Bold` | `Medium` |
| `mode` | `default` \| `fill` | `default` |
| `level` | typography level for token-based sizing | — |
| `biggerSize` | bump one ALD size step for the given `level` | `false` |

Component name = PascalCase of icon `name` (`direction_arrowLeft` → `DirectionArrowLeft`).

Missing variant combinations fall back to `Medium/default`, then any available variant.

Artboard is **120×120**; built SVGs use `viewBox="0 0 120 120"` with no fixed width/height — size via `width` / `height`, `Icon` `size`, or `level`. Stroke uses `currentColor`.

## Setup (local export only)

Copy `.env.example` to `.env.local` at the repo root:

```bash
FIGMA_ACCESS_TOKEN=your_token
```

Optional file key override: `FIGMA_FILE_ICONS` (default is in `.env.example`). Not needed for normal `pnpm build` or publish.

## Pipeline

From the **repo root**:

```bash
pnpm icons:export       # clean raw/ then export → raw/{category}/
pnpm icons:build        # raw → React components (full replace of generated set)
pnpm icons:build:merge  # raw → React (update icons present in raw/; keep others)
pnpm icons:sync         # export + build:icons + build:release (tsup)
```

Each full export **wipes `raw/` first** (unless `--no-clean`) so deduped `-2` / `-3` files from prior runs do not linger as legacy components.

### Optional export filters

| Flag / env | Example |
|---|---|
| `--thickness=` / `ICONS_THICKNESS` | `Regular,Medium` |
| `--mode=` / `ICONS_MODE` | `default,fill` |
| `--category=` / `ICONS_CATEGORY` | `direction,ai` |
| `--name=` or `--only=` / `ICONS_NAME` | `direction_arrowLeft` |
| `--dry-run` | list matches, write nothing |
| `--no-clean` | do not wipe `raw/` before write |

```bash
pnpm icons:export --category=direction --thickness=Regular
pnpm icons:export --name=direction_arrowLeft
pnpm icons:export:dry --category=ai
```

**After a filtered export, use `pnpm icons:build:merge`** so other committed icons are not deleted. Full export → `pnpm icons:build` (or `pnpm icons:sync`).

### Package scripts (`@aviala-design/icons`)

| Script | Meaning |
|---|---|
| `build` | `build-icons` (no-op if `raw/` empty) + `tsup` |
| `build:icons` | SVG → components |
| `build:release` | `tsup` only (CI / publish) |

## How to update icons

### Local — full sync

1. Ensure `FIGMA_ACCESS_TOKEN` in `.env.local`
2. `pnpm icons:sync`
3. Commit **`packages/icons/src/**` only** (never `raw/`)
4. `pnpm changeset` → select `@aviala-design/icons`
5. PR → merge → Version PR → Publish (same as other packages)

### Local — partial update

```bash
pnpm icons:export --name=direction_arrowLeft
pnpm icons:build:merge
```

Then commit `src`, add a changeset, and publish as above.

### GitHub Actions

Workflow **[Icons Sync](../../.github/workflows/icons-sync.yml)** (`workflow_dispatch`):

1. Actions → **Icons Sync** → run with optional thickness / mode / category / name filters
2. Job exports from Figma, builds React components (merge when any filter is set, full replace otherwise)
3. Opens a PR that touches `packages/icons/src/**` only
4. Add a changeset for `@aviala-design/icons` on that PR before merge if it should publish

Repository secret required: `FIGMA_ACCESS_TOKEN`.

## Rules

- Parse variant strings order-independently (`parseVariantName`)
- Never use canvas frame names for export
- SVGR → `currentColor`
- Decorative: `aria-hidden`; semantic: `title` on `Icon`
