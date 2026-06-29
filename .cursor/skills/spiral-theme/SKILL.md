---
name: spiral-theme
description: Spiral 2 theme engine — generateTheme, applyTheme, ThemeProvider, ALD alias rules. Use when working on theming or @aviala/tokens.
---

# Spiral Theme

## API

```tsx
import { generateTheme, applyTheme, presets } from "@aviala/tokens";
import { ThemeProvider, useTheme } from "@aviala/spiral";

const vars = generateTheme({ mode: "dark", primary: "#165DFF" });
applyTheme(vars);

<ThemeProvider defaultPresetId="default">
  <App />
</ThemeProvider>
```

## Dynamic primary

Uses `@aviala-design/color` `palette.generate()` with **designer step map** (8/10/7/5/4/2) — not fixed palette index.

## Static ALD theme

```ts
import { loadAldTheme } from "@aviala/tokens";
const vars = loadAldTheme("light");
```

## Forbidden

- Hardcoded colors in components
- Bypassing ThemeProvider in apps
- Mixing shadcn default `:root` colors without `@aviala/tokens`
