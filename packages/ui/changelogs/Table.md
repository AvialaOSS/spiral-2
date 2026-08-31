# Table

## 3.0.0

### Changed
- `TableCell` `content="people"` 未传 `people` 时，默认头像改用 `users_user` 图标，不再显示 `A` 占位字母

### Removed
- `TableCell` `content="badge"` 未传 `badge` / `badgeLabel` 时不再回填 `Text` 占位 Badge
- `TableCell` `content="icon-place+text"` 未传 `iconPlace` / `icon` 时不再渲染 `A` 占位形底，图标位整体省略

## 2.7.0

### Added
- `Table` `stickyHeader`：表头在表格滚动区域内吸顶
- `TableCell` `caption`：主文案下方次要说明
- `TableCell` `iconPlace` / `content="icon-place+text"`：带形底的图标位 + 文案布局
- `TableCell` `grabber`：可选前置拖拽/把手控件
- `TableHead` `actions` / `checkboxProps`：表头操作区与全选 Checkbox 配置

### Changed
- 单元格改为网格边框与表头底色 token（含 `--table-head-bg`、非对称左右内边距等）
