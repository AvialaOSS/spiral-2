# Modal

## 2.8.0

### Fixed
- Modal 内的 Popover / Select / Tooltip 等浮层改为挂到对话框内容节点，避免被遮罩挡住或因 `body` 的 `pointer-events` 无法交互

## 2.6.0

### Changed
- 默认关闭按钮文案改由 `LocaleProvider` 提供（`closeLabel` 仍可覆盖）

## 2.0.0

### Fixed
- 关闭后焦点归还
- 退场动画
