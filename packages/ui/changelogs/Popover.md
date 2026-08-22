# Popover

## 2.8.0

### Fixed
- 箭头 outline 路径恢复填充（去掉 `fill: none`），与面板底色一致，描边仍保留
- 浮层 Portal 挂到全屏元素或 Modal 容器，避免全屏 / 对话框内看不见、点不到

## 2.6.1

### Changed
- 浮层阴影统一为 `BasicShadow-Level4WithLine`

## 2.5.0

### Added
- `PopoverContent` 支持 `level`（`"caption"` | `"text"`）；未传时：`appearance="tooltip"` 默认为 `caption`，其余外观默认为 `text`

## 2.2.0

### Added
- `appearance` 变体：`tooltip`（反色提示皮肤）、`primary`（品牌主色表面、白字）

## 2.1.0

### Added
- `HoverPopover`：桌面悬停/焦点打开，触摸降级为点按；复用箭头、表面与动画
- 内容支持 `flush`（无内边距）

### Changed
- 进出场动画改为方向感知（自触发点缩放 + 淡入淡出）；箭头跟随各边
- 键盘打开时焦点移入内容，关闭后归还触发器

### Fixed
- 修复需按两次 Escape 才能关闭（移除吞掉首次关闭的 window-blur 抑制）
