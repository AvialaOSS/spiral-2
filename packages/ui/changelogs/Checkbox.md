# Checkbox

## [Unreleased]

### Added
- `size="huge"`：对应 Figma Checkbox `Size=Huge`（26px / `--size-large`，圆角 `--border-radius-small`，勾选与半选标记 14px，勾选描边 2px）

### Changed
- 勾选图标改用 Figma `symbol_right` Black 描边动效：打钩 / 取消均为 300ms CSS transition（可中途打断），`vector-effect: non-scaling-stroke` 保持线宽
- 取消勾选时橙色表面与灰色底交叉淡入淡出，避免背景硬切
- 非圆角 Checkbox 圆角改为 `--border-radius-extra-small-2`（6px）

### Fixed
- Huge 尺寸下勾选路径画不全：`stroke-dasharray` / `stroke-dashoffset` 按 `iconSize / 12` 换算，避免 CSS 将无单位 `1` 解析为 `1px` 导致路径短一截
