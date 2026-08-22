# `@aviala-design/icons` — Agent Instructions

> Monorepo-wide context (build commands, release flow, coding conventions): see root `AGENTS.md`.
> This file covers only the icons package internals.

## Package role

`@aviala-design/icons` converts Figma icon SVGs into typed React components. Figma is the design source of truth; this package **commits the generated React components**, not the raw SVG scratch files.

CI and Release **never call Figma**. Sync from Figma only when the icon set changes.

## Source layout

```
packages/icons/
├── scripts/
│   ├── build-icons.mjs      # SVGR codegen: raw/ SVGs → src/components/*.tsx + src/catalog.ts + src/index.ts
│   └── icon-utils.mjs        # Shared naming helpers (Figma variant ↔ file name ↔ React component name)
├── src/
│   ├── components/           # Generated — one .tsx per icon name (committed)
│   ├── catalog.ts            # Generated — iconCatalog array + IconName type (committed)
│   ├── index.ts              # Generated — barrel re-exports (committed)
│   ├── icon.tsx              # <Icon> wrapper component (hand-written)
│   ├── icon-size.ts          # Level → CSS var sizing, applyAvialaIconProps (hand-written)
│   ├── resolve-variant.ts    # Thickness/mode fallback resolution (hand-written)
│   └── types.ts              # AvialaIconProps, IconThickness, IconMode, IconLevel (hand-written)
├── raw/                      # Gitignored — local/CI scratch from Figma export
├── dist/                     # Gitignored — tsup output (ESM + CJS + .d.ts)
├── tsup.config.ts
└── tsconfig.json
```

## Two-stage pipeline

### Stage 1: Figma export (`scripts/figma-export/export-icons.mjs`)

Discovery uses the **published library catalog** of the Icons Figma file (`FIGMA_FILE_ICONS`). New icons must be **Publish library**'d in Figma before they appear in export. SVG bytes are rendered from the **live file** via `/images`.

```
Figma API → published component sets/variants
        → fetch SVG URLs per variant node
        → download into raw/.staging/{category}/{name}-{thickness}-{mode}.svg
        → promote staging → raw/ (atomic: abort leaves existing raw/ unchanged)
```

- Staging-first: export writes to `raw/.staging/`, promotes only after success.
- Full promote **replaces** `raw/` (unless `--no-clean`).
- Rate-limit (429) retries with exponential backoff; exhaustion hard-fails without promoting.
- Local TTY: recoverable failures prompt `(r)etry` / `(s)kip` / `(a)bort`. CI / `--non-interactive` treats failures as abort.

### Stage 2: SVGR codegen (`scripts/build-icons.mjs`)

```
raw/**/*.svg → parse variant file names → group by icon name
            → SVGR transform (TypeScript, SVGO, currentColor)
            → normalize viewBox to 0 0 120 120
            → write src/components/{ComponentName}.tsx (one per icon name)
            → write src/catalog.ts (iconCatalog array)
            → write src/index.ts (barrel exports)
```

Two modes:
- **Full replace** (`pnpm icons:build`): regenerates all components, removes orphans from `src/components/`.
- **Merge** (`pnpm icons:build:merge` or `pnpm build` with `--merge`): regenerates only icons present in `raw/`, keeps other committed components untouched. Use after filtered exports.

If `raw/` is empty, codegen is a no-op and existing committed `src/components/` are preserved.

## Naming conventions

### Figma model → file name → React component

| Layer | Figma example | File name | React component |
|---|---|---|---|
| Component set | `direction/arrowLeft` | — | — |
| Variant | `thickness=Regular, mode=default, name=direction_arrowLeft` | `direction_arrowLeft-regular-default.svg` | — |
| Icon (grouped) | — | `raw/direction/direction_arrowLeft-regular-default.svg` | `DirectionArrowLeft` |

**Icon name → component name**: PascalCase via `iconNameToComponentName()` in `icon-utils.mjs`.
- `direction_arrowLeft` → `DirectionArrowLeft`
- `ai_cloudIntelligent` → `AICloudIntelligent`

**SVG variant file name format**: `{icon_name}-{thickness}-{mode}.svg`
- Thickness in file: lowercase (`regular`, `medium`, `light`, `bold`, `black`; legacy: `standard` → Regular, `semilight` → Medium)
- Mode in file: `default` or `fill`
- Export dedup suffix: `-2`, `-3`, … (stripped during parsing)

**Variant parsing is order-independent** — `parseVariantName()` splits on `,` then `=`, handling any variant property order.

### Inner component naming

Each variant becomes an inner (non-exported) component named `{Thickness}{Mode}`:
- `Medium` + `default` → `MediumDefault`
- `Bold` + `fill` → `BoldFill`

## SVGR configuration

```
@svgr/core transform with:
  - plugins: @svgr/plugin-svgo, @svgr/plugin-jsx
  - typescript: true
  - dimensions: false (strip fixed width/height; scale via viewBox + props)
  - SVGO: keep viewBox, removeDimensions, convertColors → currentColor, prefixIds (per-variant unique clipPath/mask IDs)
```

After SVGR, `normalizeIconSvg()` forces `viewBox="0 0 120 120"` on the root `<svg>` tag (Figma artboard canonical size).

## Generated component model

Each generated component:
1. Imports inner variant components (one per thickness × mode combination)
2. Builds a `variants` map: `{ Light: { default: LightDefault, fill: LightFill }, Medium: { … }, … }`
3. Exports `{ComponentName}({ thickness, mode, ...props })` that calls `resolveIconVariant()` to pick the best match
4. Applies `applyAvialaIconProps()` for sizing (CSS var tokens via `level`, or explicit `width`/`height`)

Fallback chain: exact match → `Medium/default` → any available variant.

## Package scripts

| Script | Pipeline step | What it does |
|---|---|---|
| `build` | Full codegen + bundle | `build-icons.mjs --merge` then `tsup` |
| `build:icons` | Codegen only | `build-icons.mjs` (full replace) |
| `build:release` | Bundle only | `tsup` (CI / publish — no codegen) |
| `dev` | Watch bundle | `tsup --watch` |
| `typecheck` | Type check | `tsc --noEmit` |
| `clean` | Reset | Remove `dist/`, `src/components/`, `src/catalog.ts` |

## Common operations

### Add a new icon from Figma

1. Design in Figma component set, **Publish library**
2. `pnpm icons:export --name={category}_{iconName}` (or full sync: `pnpm icons:sync`)
3. Commit `packages/icons/src/**` only (never `raw/`)
4. `pnpm changeset` → select `@aviala-design/icons`
5. PR → merge → Version PR → Publish

### Update a single icon variant

```bash
pnpm icons:export --name=direction_arrowLeft
pnpm icons:build:merge     # merge mode: keep other committed icons
```

### Full resync all icons

```bash
pnpm icons:sync            # export (full replace) + codegen + tsup
```

### Via GitHub Actions

Workflow **Icons Sync** (`icons-sync.yml`): `workflow_dispatch` with optional filters → non-interactive Figma export → build → PR with `packages/icons/src/**` only.

## Key invariants

- Figma artboard is **120×120**; build normalizes `viewBox` to `0 0 120 120` and strips fixed width/height
- SVGR converts all colors to `currentColor`
- Decorative icons: `aria-hidden`; semantic icons: pass `title` to `<Icon>`
- `raw/` is gitignored — never commit it
- `src/components/`, `src/catalog.ts`, `src/index.ts` are auto-generated — do not hand-edit
- Hand-written files in `src/`: `icon.tsx`, `icon-size.ts`, `resolve-variant.ts`, `types.ts`
