# Select

## 3.0.0

### Added
- `SelectSubItem`：焦点在子菜单行上时可用 Up / Down / Home / End 在同层菜单项之间移动；展开方向键（RTL 下镜像）打开子菜单并把焦点送入首项，收起方向键或 Esc 关闭并把焦点送回该行
- 主菜单在 `SelectSubItem` 与 Radix `SelectItem` 混排时，方向键会把焦点送入/送出子菜单行（Radix 集合本身会跳过这些行）
- 子菜单面板内同样支持 Up / Down / Home / End，导航范围限定在当前面板

### Removed
- `SelectItem` / `SelectSubItem` 开启 `showBadge` 但未传 `badge` 时不再回填 `Text` 占位 Badge
- `SelectItem` / `SelectSubItem` 开启 `showMoreFunction` 但未传 `moreAction` 时不再回填 `Text` 占位 Link，尾部槽位整体不渲染

## 2.8.0

### Fixed
- 菜单与子菜单 Portal 挂到全屏元素或 Modal 容器，避免被对话框遮罩挡住或全屏后不可用
