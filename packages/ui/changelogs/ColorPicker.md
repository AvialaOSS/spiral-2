# ColorPicker

## 2.6.0

### Changed
- 色相 / 透明度轨道改为复用共享 `Slider`（新拇指视觉与交互），轨道仍为光谱 / 透明度渐变
- ColorPicker 内轨道使用 `size="big"`（16px，与拇指同高）+ inset ring；透明度渐变用同色 `rgba(…,0)` 避免脏插值，棋盘格与渐变均 `100%` 铺满
- 色相状态改为本地 HSVA 保真：拖到 360°（与 0° 同为红色）时拇指不再被 hex 往返弹回起点
- 占位与控件 aria 文案改由 `LocaleProvider` 提供
