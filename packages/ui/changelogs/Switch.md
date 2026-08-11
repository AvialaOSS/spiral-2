# Switch

## [Unreleased]

### Changed
- 拇指改为可打断的流体滑动（`inset-inline` 配对过渡，约 260ms），移动中轻微拉长，连点可从当前进度反转
- 选中态轨道 Hover / Active 改为可过渡的 `background-color`（高光仍用 gloss 层），避免 `background-image` 瞬切
