# SegmentatorGroup

## [Unreleased]

### Changed
- 未选项 Hover/Active 使用共享 filled 交互 token

### Fixed
- nested 模式下未选项圆角改为与滑动指示器一致（`segmentator-item-nested-radius`），避免 hover / focus 填充与选中拇指圆角不一致

## 2.6.0

### Added
- `direction`：`horizontal`（默认）/ `vertical`，对齐 Figma SegmentatorGroup；竖向布局下拇指与触控拖选沿主轴（Y）工作

## 2.5.0

### Changed
- 内容超出容器时支持横向滚动（隐藏滚动条，触控板 / 触控仍可滑动）
- `equalWidth` 项以 `max-content` 为最小宽度，避免均分过窄裁切文案
- 溢出时触控横滑优先滚动并暂停段间拖选（点击切换仍可用）；选中项自动滚入可视区域，滑动拇指随 `scrollLeft` 同步

## 2.1.0

### Changed
- 拖拽预览改为命令式 DOM 切换，避免逐项 React 重渲染
