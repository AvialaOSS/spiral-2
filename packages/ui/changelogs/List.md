# List

## 2.4.0

### Added
- `ListItem` `showTrailing`：设为 `false`（或 `trailing={null}`）可隐藏尾部操作与竖向分隔线；`action` 类型仍显示 chevron
- `ListItem` `showChevron`：控制 `action` 行尾部 chevron 的显示
- `ListItem` `showTopDivider`：强制显示/隐藏内容行顶部分割线（默认：`ListGroup` 内首个子项隐藏）
- `ListItem` `href` / `target` / `rel`：将行渲染为导航链接

### Fixed
- `ListGroup` 内首个 `ListItem` 默认不再显示顶部分割线
