---
"@aviala-design/spiral": minor
---

Stop rendering placeholder copy when content props are missing.

- `Typeface`: no fallback `Text` lines when no content is provided
- `CascaderOptionsMenu`: new optional `groupTitle`; the hardcoded `Title` group header is gone
- `Select` / `Cascader` items: `showBadge` without `badge` renders no Badge; `showMoreFunction` without `moreAction` renders no trailing slot
- `CardHead` / `CardBottom` / `ListItem`: `actionLabel` no longer defaults to `Text`; the primary action button is omitted when neither `actionLabel` nor `action` is provided
- `TableCell`: no placeholder Badge for `content="badge"`, and the `people` avatar falls back to a `users_user` icon instead of the letter `A`
