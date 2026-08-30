# Select

## [Unreleased]

### Removed
- `SelectItem` / `SelectSubItem` 开启 `showBadge` 但未传 `badge` 时不再回填 `Text` 占位 Badge
- `SelectItem` / `SelectSubItem` 开启 `showMoreFunction` 但未传 `moreAction` 时不再回填 `Text` 占位 Link，尾部槽位整体不渲染

## 2.8.0

### Fixed
- 菜单与子菜单 Portal 挂到全屏元素或 Modal 容器，避免被对话框遮罩挡住或全屏后不可用
