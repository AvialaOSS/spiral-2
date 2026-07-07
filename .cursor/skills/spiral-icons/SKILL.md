---
name: spiral-icons
description: Aviala Design Icons pipeline for @aviala-design/icons — SVG export, SVGR build, naming. Use when adding or updating icons.
---

# Spiral Icons

## Figma source model

Icons live in **component sets**:

| Layer | Example |
|---|---|
| Component set | `direction/arrowLeft` |
| Variant (order varies) | `thickness=Regular, mode=default, name=direction_arrowLeft` |
| Exported SVG | `raw/direction/direction_arrowLeft-regular-default.svg` |

Export defaults to **all variants** (no filter unless `ICONS_THICKNESS` / `ICONS_MODE` set).

## React component model

One React component per icon **name** — switch variants via props:

```tsx
import { DirectionArrowLeft, Icon } from "@aviala-design/icons";

<DirectionArrowLeft thickness="Bold" mode="fill" width={20} />
<Icon icon={DirectionArrowLeft} size={20} thickness="Light" mode="default" />
```

| Prop | Values | Default |
|---|---|---|
| `thickness` | `Light` \| `Regular` \| `Medium` \| `Bold` | `Medium` |
| `mode` | `default` \| `fill` | `default` |

Component name = PascalCase of icon `name` (`direction_arrowLeft` → `DirectionArrowLeft`).

Missing variant combinations fall back to `Medium/default`, then any available variant.

## Pipeline

```bash
pnpm icons:export    # clean raw/ then export all variants → raw/{category}/
pnpm icons:build     # group by icon name → React components
pnpm icons:sync      # export + build
```

Each export **wipes `packages/icons/raw/` first** (unless `--no-clean`) so deduped `-2` / `-3` files from prior runs do not linger as legacy components.

## Setup

`.env.local`:

```bash
FIGMA_ACCESS_TOKEN=your_token
```

## Output layout

```
raw/direction/direction_arrowLeft-light-default.svg
raw/direction/direction_arrowLeft-regular-fill.svg
src/components/DirectionArrowLeft.tsx   # one component, all variants inside
src/catalog.ts                          # iconCatalog with thicknesses/modes[]
```

## Rules

- Figma artboard is **120×120**; built SVGs use `viewBox="0 0 120 120"` with no fixed width/height — set size via props (`width`, `height`, or `Icon` `size`)
- Parse variant strings order-independently (`parseVariantName`)
- Never use canvas frame names for export
- SVGR → `currentColor`
- Decorative: `aria-hidden`; semantic: `title` on `Icon`
