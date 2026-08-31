# SegmentatorGroup

## 3.0.0

### Added
- 键盘操作对齐 radiogroup 规范：方向键（horizontal 用 Left/Right，vertical 用 Up/Down，RTL 自动镜像）在项之间移动并同步选中，Home/End 跳到首尾

### Changed
- 改为 roving tabindex：仅选中项参与 Tab 序列（未选中时由首个可用项接管），进入分段控件后用方向键切换

## 2.8.0

### Fixed
- 指示器改用布局 offset 测量，避免 Popover 入场 `scale` 让 `getBoundingClientRect` 叠乘导致拇指偏移（点选后才复位）

## 2.7.0

### Changed
- nested 模式轨道 Hover 使用 `segmentator-bg-hover`（filled-hover）；项级 Hover/Active 仍独立
- 共享 elevation `BasicShadow-Level4WithLine` 发丝线透明度调整为 18%

## 2.6.1

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
