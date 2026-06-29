---
name: spiral-icons
description: Aviala Design Icons pipeline for @aviala/icons — SVG export, SVGR build, naming. Use when adding or updating icons.
---

# Spiral Icons

## Pipeline

```
Figma Icons → packages/icons/raw/*.svg → pnpm icons:build → packages/icons/src/components/
```

## Export from Figma

```bash
FIGMA_ACCESS_TOKEN=... node scripts/figma-export/export-icons.mjs
pnpm icons:build
```

## Usage

```tsx
import { ArrowRight, Icon } from "@aviala/icons";
<Icon icon={ArrowRight} size={20} className="text-primary" />
```

## Rules

- React component name = PascalCase of SVG filename
- Default `currentColor`; decorative icons use `aria-hidden`
- Semantic icons: pass `title` to `Icon` wrapper
