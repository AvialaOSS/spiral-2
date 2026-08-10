---
name: spiral-theme
description: Spiral 2 theme engine — generateTheme, applyTheme, ThemeProvider, ALD alias rules. Use when working on theming or @aviala-design/tokens.
---

# Spiral Theme

## API

```tsx
import { generateTheme, applyTheme, presets } from "@aviala-design/tokens";
import { ThemeProvider, useTheme } from "@aviala-design/spiral";

const vars = generateTheme({ mode: "dark", primary: "#165DFF" });
applyTheme(vars);

<ThemeProvider defaultPresetId="default">
  <App />
</ThemeProvider>
```

## Dynamic primary

Uses `@aviala-design/color` `palette.generate()` with **designer step map** (8/10/7/5/4/2) — not fixed palette index.

## Static ALD theme

Node-only entry (reads `packages/tokens/source/ald/`):

```ts
import { loadAldTheme } from "@aviala-design/tokens/node";
const vars = loadAldTheme("light");
```

Browser apps use `generateTheme` / `ThemeProvider` / CSS imports (`styles.css`, `ald-theme.css`), not `loadAldTheme`.

## Forbidden

- Hardcoded colors in components
- Bypassing ThemeProvider in apps
- Mixing shadcn default `:root` colors without `@aviala-design/tokens`
