# Tab

## 2.6.0

### Added

- `Tab` / `TabItem`（Figma Structure Navigation → Tab）
  - `style`：`default` | `card` | `tiled`
  - `background`：`none` | `default`
  - `startSlot` / `endSlot`；受控 / 非受控 `value`；键盘左右切换
  - Default：滑动下划线指示条（高 4px、顶圆角 `border-radius-extra-small-2`、相对 TabItem 左右各内缩 12px；item / slot `padding-bottom` 为 `padding-small`）
  - Card：active 白底顶圆角 + 稿面 2×8 侧翼矢量；`background="default"` 使用 `control-normal-lightBackground-light` 灰底；未选中水平 `padding-min`
  - Tiled：active 使用 Button `second` 表面
  - `TabItem` 复用 `buttonVariants`（对齐 Figma 嵌套 Button / NavigationItem）
  - 列表内容 hug 宽度（`inline-flex` / `width: max-content`）
  - tokens：`@aviala-design/tokens/tab-effects.css`
