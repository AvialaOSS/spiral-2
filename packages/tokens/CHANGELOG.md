# @aviala-design/tokens

## 2.5.4

### Patch Changes

- de1fac4: Polish Switch thumb motion with an interruptible fluid inset slide and smoother checked-track press tint.

## 2.5.3

### Patch Changes

- 63b8a8b: Render the Loading spinner as an SVG 2px stroke (Figma r15−r13) so the inner edge stays hard.
- ca0e535: Add `Video` player with Default/Light bars. Speed uses a Select-style popover; volume uses a vertical Slider popover. Control bars can auto-hide via `autoHideControls`. Transport controls use animated SVGs with `currentColor`.
- ca0e535: Fix Video Light bar centering/frosted material, restore Popover arrow outline fill, and keep Segmentator thumb aligned inside scaled overlays.

## 2.5.2

### Patch Changes

- be58b17: Center Checkbox indeterminate mark by absolutely positioning the indicator and hiding the check icon in the indeterminate state.
- 59d55c4: Align Progress bar/ring geometry and track colors to Figma 589:55818 (6/8px bars, lightBackground-1 track, type-colored ring tracks).
- 4be83f2: Add nested Segmentator track hover (`segmentator-bg-hover`) and soften Level4WithLine hairline to 18% opacity.
- 7f99e83: Align Table to Figma with sticky header, cell caption / icon-place / grabber layouts, and grid border tokens.

## 2.5.1

### Patch Changes

- 9d54c05: Align List item dividers to Figma `border/border-normal-2` (was `border-normal-1`).

## 2.5.0

### Minor Changes

- f3a62a1: 同步新版 Aviala Design Colors / token-colors：更新中性与语义色阶；`border-normal-light|primary` 更名为 `border-normal-1|3`；`control` 并入 token-colors（`lightBackground-whiteOnly` → `Background-whiteOnly`）。
- 8feb56d: 再同步 NewAvialaDesignToken：中性色重调；`control` light/deep 更名为 `1/2/3`；统一 `BasicShadow-Level4WithLine`；按 Figma 交互矩阵对齐全库 Hover/Active/Focus（优先 Button/Input/Switch/Segmentator/List）。

### Patch Changes

- 11ea089: Align Segmentator nested unselected item radius with the sliding thumb (`segmentator-item-nested-radius`).

## 2.4.0

### Minor Changes

- ea23ed1: Button 新增 `outline` / `outlineCustom` 模式（对齐 Figma Outline / Outline-Custom）
- ea23ed1: Add ConfigProvider direction (LTR/RTL), logical CSS migration, and directional mirroring for navigation-heavy components.
- ea23ed1: SegmentatorGroup adds Figma-aligned `direction` (`horizontal` | `vertical`).
- ea23ed1: 新增 `Tab` / `TabItem`（对齐 Figma Structure Navigation → Tab）

  - `style`：`default`（滑动下划线）/ `card`（页签 + 侧翼）/ `tiled`（填充）
  - `background`：`none` | `default`（Card 用灰底 `lightBackground-1`，避免与 active 白底同色）
  - `startSlot` / `endSlot`；`TabItem` 复用 `buttonVariants`（与 NavigationItem 一致）
  - Default 指示条：高 4px、顶圆角 `extra-small-2`、相对 item 左右各内缩 12px；item `padding-bottom` 为 `padding-small`
  - Card 未选中 item 水平 `padding-min`（2px）；active 为稿面 2×8 侧翼 + 白底顶圆角
  - 新增 `@aviala-design/tokens/tab-effects.css`

### Patch Changes

- a2e8eb3: ColorPicker hue/alpha rails now reuse the shared Slider.

## 2.3.0

### Minor Changes

- 7a634b3: Checkbox: add size="huge", fix Huge check stroke-dasharray scaling
- 7a634b3: Segmentator: horizontal scroll when items overflow; equalWidth no longer clips labels

### Patch Changes

- 7a634b3: Checkbox: 300ms interruptible check/uncheck transitions with surface crossfade
- 7a634b3: Navigation: snappier active-indicator / expand easing
- 7a634b3: Slider: restyle (thicker track, core thumb, shadow), thumb hover/press scale, jump animation, showValueTooltip, remount on type change

## 2.2.1

### Patch Changes

- e6085de: ListItem: showTrailing (keep chevron), showTopDivider, href

## 2.2.0

### Minor Changes

- c9a451b: Add `appearance` variants to Popover: `tooltip` (shared inverted tooltip skin) and `primary` (brand primary surface, white text). ResponsiveTooltip now keeps the tooltip look on touch devices instead of showing a light popover panel. Form-control slot-icon rendering is consolidated into a shared helper (internal, no API change).

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

## 2.0.0

### Major Changes

- 54f5b37: Fix Cascader menus rendering behind Modal (z-index/pointer-events), Modalclose focus and exit animation, Cascader touch column expansion, andDatePicker keyboard/layout polish. Typeface header gap uses --gap-none.Add build:release (tsup-only) and merge-mode icon codegen so CI/publishwork without Figma or a full raw/ tree. Export supports category/name filters.

## 1.0.0

### Major Changes

- d4b53f6: Improve pickers and inputs with NumberInput, sticky wheels, and Segmentator polish.

## 0.0.4

### Patch Changes

- 38f4995: Add `NavigationItemMenu` and fix the horizontal navigation indicator animation.

  - New `NavigationItemMenu`, `NavigationItemMenuTrigger`, `NavigationItemMenuContent` and `NavigationItemMenuItem` collapse child items into a flyout menu with a Select-like `value` / `onValueChange` API. The menu is hidden by default and opens on hover (click and Enter also work), positioned to the right in vertical navigations and below in horizontal ones. Items accept left and right icons, and the selected item is highlighted without a check indicator.
  - Horizontal child groups now collapse along the inline axis by transitioning `width` between `0` and `max-content`, so sibling items shift smoothly instead of jumping.
  - The active indicator tweens frame by frame against a live re-measured target while a child group expands or collapses, replacing the previous logic that measured the destination before the layout had moved and made the indicator flash into place.

## 0.0.3

### Patch Changes

- 8a9b9a3: Ship component prop metadata as `@aviala-design/spiral/props.json` so the documentation site can render API tables without access to the monorepo source, and release the theme, DatePicker time, icon, and accessibility fixes that landed after 0.0.2.

## 0.0.2

### Patch Changes

- cd304da: Initial Spiral 2 release.
