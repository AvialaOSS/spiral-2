# Slider

## [Unreleased]

### Fixed
- 挂载 / 重载 / 切换场景下，拇指与进度条不再从起点动画到当前值；位移过渡仍保留给点击轨道与键盘跳变

## 2.8.0

### Added
- `orientation`：`horizontal`（默认）/ `vertical`，竖向轨道用于 Video 音量弹出层等场景

## 2.6.1

### Changed
- 拇指阴影统一为 `BasicShadow-Level4WithLine`

## 2.5.0

### Added
- `showValueTooltip`：悬停拇指、拖动或按住轨道调整时，在对应拇指上方显示数值提示
- `formatValueTooltip`：自定义数值提示文案，签名 `(value, index) => ReactNode`

### Changed
- 视觉重绘：默认宽度 70→96；轨道更粗且取消描边（Default / Big 共用填充色，仅高度与拇指尺寸不同）；拇指改为白底 + 主色实心芯 + 阴影（不再用描边环）
- 禁用态：拇指芯改用次要色，与轨道 OFF 填充对齐
- 拇指悬停略放大、按下略缩小（只作用于视觉层，不带动数值提示）
- 拇指光标由 `grab` 改为 `pointer`
- 点击轨道 / 键盘跳变时，拇指位移与进度条带过渡；拖动时关闭位移过渡以跟手
- 尊重 `prefers-reduced-motion`：关闭拇指缩放、跳变与数值提示过渡

### Fixed
- `type` 在 `default` ↔ `range` 间切换时重新挂载，避免第二拇指不显示

