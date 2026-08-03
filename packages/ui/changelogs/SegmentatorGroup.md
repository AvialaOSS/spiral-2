# SegmentatorGroup

## [Unreleased]

### Changed
- 内容超出容器时支持横向滚动（隐藏滚动条，触控板 / 触控仍可滑动）
- `equalWidth` 项以 `max-content` 为最小宽度，避免均分过窄裁切文案
- 溢出时触控横滑优先滚动并暂停段间拖选（点击切换仍可用）；选中项自动滚入可视区域，滑动拇指随 `scrollLeft` 同步

## 2.1.0

### Changed
- 拖拽预览改为命令式 DOM 切换，避免逐项 React 重渲染
