# @aviala-design/spiral

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
