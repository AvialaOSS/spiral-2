---
"@aviala-design/tokens": minor
"@aviala-design/spiral": minor
---

Zero-build dev, direction-aware overlay animations, and hover / responsive tooltips.

**Tokens**

- Add `@aviala-design/tokens/vite-plugin` so Storybook and the playground serve
  token CSS/JS straight from source — no `turbo build` before dev, and edits to
  `packages/tokens/src/semantic/*.css` hot-reload. Extract the CSS-generation
  logic into `scripts/css-lib.mjs` and rewrite `scripts/build-css.mjs` to
  delegate to it. Remove stale emitted `.js`/`.d.ts` products from `src/`.
- Make popover & tooltip enter/exit direction-aware: scale `0.96 → 1` + fade,
  growing from the invocation point via Radix's `--radix-*-content-transform-origin`.
  The arrow now follows the panel body on every side (rotation-invariant `50% 50%`
  origin, so it no longer desyncs on right/bottom/left during exit). Add a `flush`
  surface option (no padding) and align the arrow stroke token.

**Spiral**

- New `HoverPopover`: opens on hover/focus (desktop) with hover-intent + close
  delay, degrades to tap on touch. Reuses Popover's arrow/surface/animation.
- New `ResponsiveTooltip`: Tooltip on desktop (hover + keyboard focus),
  automatically a Popover (tap) on touch — gives hover-only tooltips a mobile
  trigger. Shared `useCoarsePointer` hook backs both.
- Fix Popover requiring two Escapes to close (removed a window-blur close
  suppression that swallowed the first close); keyboard open now moves focus into
  the content and returns it to the trigger on close.
- Pagination ellipsis opens a page-jump Popover; `Button` gains a `compact`
  variant (`min-w-0`); Navigation vertical rail grows/shrinks on hover/press;
  Segmentator drag-preview rewritten to imperative DOM toggles (no per-item
  React re-render); Popover content supports `flush`.
- Storybook + playground adopt the tokens vite-plugin and exact-match aliases.
