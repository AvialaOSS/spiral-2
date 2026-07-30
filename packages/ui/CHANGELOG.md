# @aviala-design/spiral

## 2.2.0

### Minor Changes

- c9a451b: Add `appearance` variants to Popover: `tooltip` (shared inverted tooltip skin) and `primary` (brand primary surface, white text). ResponsiveTooltip now keeps the tooltip look on touch devices instead of showing a light popover panel. Form-control slot-icon rendering is consolidated into a shared helper (internal, no API change).

### Patch Changes

- Updated dependencies [c9a451b]
  - @aviala-design/tokens@2.2.0

## 2.1.0

### Minor Changes

- b91564c: Zero-build dev, direction-aware overlay animations, and hover / responsive tooltips.

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

### Patch Changes

- Updated dependencies [b91564c]
  - @aviala-design/tokens@2.1.0

## 2.0.0

### Major Changes

- 54f5b37: Fix Cascader menus rendering behind Modal (z-index/pointer-events), Modalclose focus and exit animation, Cascader touch column expansion, andDatePicker keyboard/layout polish. Typeface header gap uses --gap-none.Add build:release (tsup-only) and merge-mode icon codegen so CI/publishwork without Figma or a full raw/ tree. Export supports category/name filters.

### Patch Changes

- Updated dependencies [54f5b37]
  - @aviala-design/tokens@2.0.0
  - @aviala-design/icons@2.0.2

## 1.0.0

### Major Changes

- d4b53f6: Improve pickers and inputs with NumberInput, sticky wheels, and Segmentator polish.

### Patch Changes

- Updated dependencies [d4b53f6]
  - @aviala-design/tokens@1.0.0

## 0.2.0

### Minor Changes

- 38f4995: Add `NavigationItemMenu` and fix the horizontal navigation indicator animation.

  - New `NavigationItemMenu`, `NavigationItemMenuTrigger`, `NavigationItemMenuContent` and `NavigationItemMenuItem` collapse child items into a flyout menu with a Select-like `value` / `onValueChange` API. The menu is hidden by default and opens on hover (click and Enter also work), positioned to the right in vertical navigations and below in horizontal ones. Items accept left and right icons, and the selected item is highlighted without a check indicator.
  - Horizontal child groups now collapse along the inline axis by transitioning `width` between `0` and `max-content`, so sibling items shift smoothly instead of jumping.
  - The active indicator tweens frame by frame against a live re-measured target while a child group expands or collapses, replacing the previous logic that measured the destination before the layout had moved and made the indicator flash into place.

### Patch Changes

- Updated dependencies [38f4995]
  - @aviala-design/tokens@0.0.4

## 0.1.0

### Minor Changes

- 8a9b9a3: Ship component prop metadata as `@aviala-design/spiral/props.json` so the documentation site can render API tables without access to the monorepo source, and release the theme, DatePicker time, icon, and accessibility fixes that landed after 0.0.2.

### Patch Changes

- Updated dependencies [8a9b9a3]
  - @aviala-design/tokens@0.0.3
  - @aviala-design/icons@2.0.1

## 0.0.2

### Patch Changes

- cd304da: Initial Spiral 2 release.
- Updated dependencies [cd304da]
  - @aviala-design/tokens@0.0.2
  - @aviala-design/icons@2.0.0
