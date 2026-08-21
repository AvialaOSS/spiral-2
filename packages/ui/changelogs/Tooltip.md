# Tooltip

## 2.8.0

### Fixed
- Portal 挂到全屏元素或 Modal 容器，避免被对话框遮罩挡住

## 2.6.0

### Changed
- `ResponsiveTooltip` 触摸端改为**长按**打开（短按仍触发按钮自身点击）；可用 `longPressMs` 调整按住时长（默认 500ms）

## 2.5.0

### Added
- `TooltipContent` / `ResponsiveTooltip` 支持 `level`：`"caption"`（默认）或 `"text"`

## 2.2.0

### Changed
- `ResponsiveTooltip` 在触摸设备上保持 tooltip 外观，不再显示浅色 popover 面板

## 2.1.0

### Added
- `ResponsiveTooltip`：桌面为 Tooltip（悬停 + 键盘焦点），触摸自动切为 Popover（点按）
