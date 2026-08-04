---
"@aviala-design/spiral": minor
"@aviala-design/tokens": minor
---

新增 `Tab` / `TabItem`（对齐 Figma Structure Navigation → Tab）

- `style`：`default`（滑动下划线）/ `card`（页签 + 侧翼）/ `tiled`（填充）
- `background`：`none` | `default`（Card 用灰底 `lightBackground-light`，避免与 active 白底同色）
- `startSlot` / `endSlot`；`TabItem` 复用 `buttonVariants`（与 NavigationItem 一致）
- Default 指示条：高 4px、顶圆角 `extra-small-2`、相对 item 左右各内缩 12px；item `padding-bottom` 为 `padding-small`
- Card 未选中 item 水平 `padding-min`（2px）；active 为稿面 2×8 侧翼 + 白底顶圆角
- 新增 `@aviala-design/tokens/tab-effects.css`
