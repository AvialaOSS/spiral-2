# CascaderField

## 3.0.0

### Added
- `CascaderItem`：Up / Down 在同一列的选项之间移动焦点，Home / End 跳到该列首尾；`title` 行与禁用项自动跳过，跨列仍由展开方向键负责
- `CascaderOptionsMenu` `groupTitle`：可选的列分组标题，透传给 `CascaderItemGroup` 的 `label`；默认不传即不渲染标题行

### Removed
- `CascaderOptionsMenu` 不再输出硬编码的 `Title` 分组标题
- `CascaderItem` 开启 `showBadge` 但未传 `badge` 时不再回填 `Text` 占位 Badge

## 2.8.0

### Fixed
- 菜单 Portal 挂到全屏元素或 Modal 容器，避免被对话框遮罩挡住或全屏后不可用

## 2.6.0

### Changed
- 默认 placeholder 改由 `LocaleProvider` 提供

### Fixed
- 展开箭头与键盘左右键在 RTL 下按阅读方向展开

## 2.0.0

### Fixed
- 菜单渲染在 Modal 后方（z-index / pointer-events）
- 触摸下列扩展行为
