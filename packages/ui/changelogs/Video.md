# Video

## [Unreleased]

### Fixed
- 倍速菜单补齐 listbox 键盘模型：roving tabindex 让当前倍速成为唯一 Tab 落点，Up / Down / Home / End 在选项间移动，`aria-activedescendant` 指向焦点项

## 2.8.0

### Added
- 新增 `Video` 视频播放器，对齐 Figma Information Display → Video（`Style=default` / `light`）
- 控件栏复用 `Button`、`Input`、`Slider`、`Popover`、`Select` 菜单样式、`SegmentatorGroup`、`Switch`
- 支持播放/暂停、跳转、倍速、音量、画面比例、音量平衡与全屏
- 画面外区域默认使用 Black token（`--box-box-normal-background-blackonly`），可通过 `stageBackground` 传入其它 token / 色值
- `volume` / `defaultVolume` / `onVolumeChange`：线性音量 0–1
- `autoHideControls` / `autoHideDelay`：播放中空闲后控件栏下滑淡出；指针移动或点按播放器可重新呼出（暂停时始终显示）
- 播放 / 暂停 / 上一首 / 下一首使用交付的动画 SVG（`currentColor` 填充）；点击时播一次形变，静止时停在结束帧

### Changed
- 倍速弹出层改为 Figma Speed Popover（`1963:4438`）：标题「倍速调整」+ Select 菜单项，选中项尾随 `SymbolRight`；菜单项固定宽度 160px
- 音量改为 Figma Volume Popover（`1963:4424`）：竖向 `Slider` + 百分比；默认档位 `0.5 / 1 / 1.5 / 2 / 3`

### Fixed
- 播放/暂停图标双层叠放：暂停中显示 play，播放中显示 pause；切换时先把目标层 seek 到形变起点再显示，避免换 SVG 闪动
- Default 全屏时控件栏铺满播放器宽度（`max-width` 仅用于 Light 悬浮栏）
- 全屏时倍速 / 音量 / 设置等浮层挂到全屏节点，避免 Portal 到 `body` 后不可用
- 时间 `Input` 未聚焦时无背景；聚焦后使用普通 Input 选中态（白底 + 主题描边）
- Light 全屏时控件栏水平居中（对齐 Figma Controls Container `items-center`）
- Light 浮层控件栏补齐磨砂材质：`backdrop-filter` + 半透明 `lightBackground-1`（`<video>` 上纯 `mix-blend-mode: luminosity` 常无法采样画面）
