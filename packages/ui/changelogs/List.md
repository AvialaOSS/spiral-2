# List

## [Unreleased]

### Fixed
- 行间顶部分割线与尾部竖向分隔线颜色对齐 Figma `border/border-normal-2`（此前误用 `border-normal-1`，中性色重调后几乎不可见）

## 2.6.1

### Changed
- 可交互行 Hover/Active 对齐共享 filled 交互 token（lightBackground-2 / Background-3）

## 2.6.0

### Changed
- 默认「更多」aria 文案改由 `LocaleProvider` 提供

### Fixed
- `action` 类型尾部 chevron 在 RTL 下指向阅读方向前方

## 2.4.0

### Added
- `ListItem` `showTrailing`：设为 `false`（或 `trailing={null}`）可隐藏尾部操作与竖向分隔线；`action` 类型仍显示 chevron
- `ListItem` `showChevron`：控制 `action` 行尾部 chevron 的显示
- `ListItem` `showTopDivider`：强制显示/隐藏内容行顶部分割线（默认：`ListGroup` 内首个子项隐藏）
- `ListItem` `href` / `target` / `rel`：将行渲染为导航链接

### Fixed
- `ListGroup` 内首个 `ListItem` 默认不再显示顶部分割线
