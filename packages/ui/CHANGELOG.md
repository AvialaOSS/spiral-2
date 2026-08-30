# @aviala-design/spiral

## 3.0.0

### Major Changes

- 96c12fc: Move `Form` and `FormField` to the `@aviala-design/spiral/form` subpath entry.

  The main entry no longer references `react-hook-form`, so consumers without that
  peer installed can import from `@aviala-design/spiral` again. `react-hook-form`
  stays on `>=7.50` and is now marked optional — it is only required by `/form`.

  Migration: `import { Form, FormField } from "@aviala-design/spiral/form";`

### Minor Changes

- 33fd505: Stop rendering placeholder copy when content props are missing.

  - `Typeface`: no fallback `Text` lines when no content is provided
  - `CascaderOptionsMenu`: new optional `groupTitle`; the hardcoded `Title` group header is gone
  - `Select` / `Cascader` items: `showBadge` without `badge` renders no Badge; `showMoreFunction` without `moreAction` renders no trailing slot
  - `CardHead` / `CardBottom` / `ListItem`: `actionLabel` no longer defaults to `Text`; the primary action button is omitted when neither `actionLabel` nor `action` is provided
  - `TableCell`: no placeholder Badge for `content="badge"`, and the `people` avatar falls back to a `users_user` icon instead of the letter `A`

- 9b803f1: Replace `role="application"` panels with real widget semantics and fill in the missing keyboard models.

  - `DatePickerCalendar` / `TimePickerPanel`: `role="application"` is gone (`role="group"` instead), and the day grid gains `role="row"` wrappers so its existing gridcell + arrow / Home / End / PageUp / PageDown model is exposed correctly
  - `SegmentatorGroup`: a true radiogroup — roving tabindex (only the checked item is a tab stop), arrow keys move and select along the group's axis (RTL mirrored), Home / End jump to the ends
  - `VideoSpeed`: listbox roving tabindex plus Up / Down / Home / End and `aria-activedescendant`
  - `ListItem`: interactive rows without `href` are now focusable (`tabIndex`, `role="button"`, Enter / Space); nested controls keep their own activation and the `href` anchor branch is unchanged
  - `ScrollPickerColumn`: a non-looping column pinned to either end no longer calls `preventDefault` on wheel, so the page keeps scrolling
  - `CascaderItem`: Up / Down / Home / End move focus within a column, skipping titles and disabled rows
  - `SelectSubItem`: Up / Down / Home / End across menu rows (including mixed Radix items), expand key opens the sub-menu and moves focus into it, collapse key / Esc returns focus to the parent row

### Patch Changes

- 3c7f23a: Remove ghost BEM class outputs that had no matching CSS (Progress, Scroll, Breadcrumb, Modal, Tag, Slider, Avatar, Pagination ellipsis, Loading mode, ConfigProvider), emit the documented `aviala-link--caption` / `aviala-link--text` level classes on Link, and replace hardcoded colors with token variables. Adds `--loading-mask-reveal` so the Loading ring mask no longer needs an inline hex. No visual change.
- Updated dependencies [3c7f23a]
  - @aviala-design/tokens@2.6.0

## 2.9.0

### Minor Changes

- 91f2b00: Add `Drawer` overlay panel with left/right/top/bottom positions, matching Figma Components → Drawer. Tokens gain `drawer-effects.css` and BasicShadow-Level5 elevation.

  Skip Slider thumb/range position transitions until after first layout so remount and reload no longer animate from the unset position to the current value.

### Patch Changes

- Updated dependencies [91f2b00]
  - @aviala-design/tokens@2.5.5

## 2.8.1

### Patch Changes

- de1fac4: Polish Switch thumb motion with an interruptible fluid inset slide and smoother checked-track press tint.
- Updated dependencies [de1fac4]
  - @aviala-design/tokens@2.5.4

## 2.8.0

### Minor Changes

- ca0e535: Add `Video` player with Default/Light bars. Speed uses a Select-style popover; volume uses a vertical Slider popover. Control bars can auto-hide via `autoHideControls`. Transport controls use animated SVGs with `currentColor`.

### Patch Changes

- 63b8a8b: Render the Loading spinner as an SVG 2px stroke (Figma r15−r13) so the inner edge stays hard.
- ca0e535: Portal Select, Cascader, DatePicker, TimePicker, ColorPicker, Navigation, Popover, and Tooltip into the fullscreen element or Modal content so overlays stay visible and interactive.
- ca0e535: Fix Video Light bar centering/frosted material, restore Popover arrow outline fill, and keep Segmentator thumb aligned inside scaled overlays.
- Updated dependencies [ca0e535]
- Updated dependencies [63b8a8b]
- Updated dependencies [ca0e535]
- Updated dependencies [ca0e535]
  - @aviala-design/icons@2.4.0
  - @aviala-design/tokens@2.5.3

## 2.7.2

### Patch Changes

- e72725c: FormField error tips now sync invalid styling to nested input-series controls via context; explicit `error` on the control still wins.
- Updated dependencies [e72725c]
  - @aviala-design/icons@2.3.0

## 2.7.1

### Patch Changes

- 48eca2e: Backfill Chinese component changelogs for Checkbox, SegmentatorGroup, Progress, and Table 2.7.0 notes.

## 2.7.0

### Minor Changes

- 59d55c4: Align Progress bar/ring geometry and track colors to Figma 589:55818 (6/8px bars, lightBackground-1 track, type-colored ring tracks).
- 7f99e83: Align Table to Figma with sticky header, cell caption / icon-place / grabber layouts, and grid border tokens.

### Patch Changes

- be58b17: Center Checkbox indeterminate mark by absolutely positioning the indicator and hiding the check icon in the indeterminate state.
- 4be83f2: Add nested Segmentator track hover (`segmentator-bg-hover`) and soften Level4WithLine hairline to 18% opacity.
- Updated dependencies [be58b17]
- Updated dependencies [59d55c4]
- Updated dependencies [4be83f2]
- Updated dependencies [7f99e83]
  - @aviala-design/tokens@2.5.2

## 2.6.2

### Patch Changes

- 9d54c05: Align List item dividers to Figma `border/border-normal-2` (was `border-normal-1`).
- Updated dependencies [9d54c05]
  - @aviala-design/tokens@2.5.1

## 2.6.1

### Patch Changes

- e60b1fb: Fix component changelogs that shipped as `Unreleased` in 2.6.0: stamp now accepts legacy `## Unreleased` (without brackets) and those entries are labeled `2.6.0`.
- 11ea089: Align Segmentator nested unselected item radius with the sliding thumb (`segmentator-item-nested-radius`).
- 8feb56d: 再同步 NewAvialaDesignToken：中性色重调；`control` light/deep 更名为 `1/2/3`；统一 `BasicShadow-Level4WithLine`；按 Figma 交互矩阵对齐全库 Hover/Active/Focus（优先 Button/Input/Switch/Segmentator/List）。
- 6b67c5b: Improve picker wheels: multi-step mouse wheel, shortest-path loop wrapping, and selected chrome that scrolls with the active item.
- Updated dependencies [f3a62a1]
- Updated dependencies [11ea089]
- Updated dependencies [8feb56d]
  - @aviala-design/tokens@2.5.0

## 2.6.0

### Minor Changes

- ea23ed1: Button 新增 `outline` / `outlineCustom` 模式（对齐 Figma Outline / Outline-Custom）
- ea23ed1: Add ConfigProvider direction (LTR/RTL), logical CSS migration, and directional mirroring for navigation-heavy components.
- ea23ed1: Add Semi-style LocaleProvider (zh-CN default, en-US) for built-in component copy; props still override.
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
- ea23ed1: ResponsiveTooltip on touch opens via long-press instead of tap (short tap still reaches the trigger action).
- Updated dependencies [ea23ed1]
- Updated dependencies [a2e8eb3]
- Updated dependencies [ea23ed1]
- Updated dependencies [ea23ed1]
- Updated dependencies [ea23ed1]
  - @aviala-design/tokens@2.4.0

## 2.5.0

### Minor Changes

- 7a634b3: Checkbox: add size="huge", fix Huge check stroke-dasharray scaling
- 7a634b3: Segmentator: horizontal scroll when items overflow; equalWidth no longer clips labels

### Patch Changes

- 7a634b3: Checkbox: 300ms interruptible check/uncheck transitions with surface crossfade
- 7a634b3: Navigation: snappier active-indicator / expand easing
- 7a634b3: Slider: restyle (thicker track, core thumb, shadow), thumb hover/press scale, jump animation, showValueTooltip, remount on type change
- 7a634b3: TooltipContent / ResponsiveTooltip / PopoverContent: typography `level` (`caption` | `text`)
- Updated dependencies [7a634b3]
- Updated dependencies [7a634b3]
- Updated dependencies [7a634b3]
- Updated dependencies [7a634b3]
- Updated dependencies [7a634b3]
  - @aviala-design/tokens@2.3.0

## 2.4.1

### Patch Changes

- 96614a2: Verify release action can open the version PR (no user-facing change).

## 2.4.0

### Minor Changes

- e6085de: ListItem: showTrailing (keep chevron), showTopDivider, href

### Patch Changes

- Updated dependencies [e6085de]
  - @aviala-design/tokens@2.2.1

## 2.3.1

### Patch Changes

- Updated dependencies [f0f9155]
  - @aviala-design/icons@2.2.0

## 2.3.0

### Minor Changes

- e611b87: Fix icon package externals and feedback mode

### Patch Changes

- Updated dependencies [e611b87]
  - @aviala-design/icons@2.1.0

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
