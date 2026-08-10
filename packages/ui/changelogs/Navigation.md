# Navigation

## Unreleased

### Changed
- 激活项 second 面 Hover/Active 改为 token 换色（不再依赖 brightness）

## 2.6.0

### Fixed
- 垂直指示条读取 `--navigation-rail-inline-start`，RTL 下贴在 inline-start 侧
- 垂直 flyout 默认 `side` 随 `ConfigProvider` 方向翻转

## 2.5.0

### Changed
- 激活指示条与展开 / 收拢动效改用更干脆的 ease-out（`--navigation-transition-easing`: `cubic-bezier(0.16, 1, 0.3, 1)`；指示条脚本插值同步）

## 2.1.0

### Changed
- 垂直轨道在悬停/按下时伸展与收缩
