# List

## 2.4.0

### Added
- `ListItem` `showTrailing` — set `false` (or `trailing={null}`) to hide trailing actions and the vertical divider; `action` type still shows the chevron
- `ListItem` `showChevron` — control the trailing chevron on `action` rows
- `ListItem` `showTopDivider` — force show/hide the content-row top hairline (default: hidden on the first child in a `ListGroup`)
- `ListItem` `href` / `target` / `rel` — render the row as a link for navigation

### Fixed
- First `ListItem` in a `ListGroup` no longer shows a top hairline by default
