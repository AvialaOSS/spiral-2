# TimePickerField

## [Unreleased]

### Fixed
- 时间面板不再使用 `role="application"`，改为 `role="group"`；面板内的时 / 分列仍是可 Tab 到达的 listbox，支持 Up / Down / Home / End

## 2.8.0

### Fixed
- 面板 Portal 挂到全屏元素或 Modal 容器，避免被对话框遮罩挡住或全屏后不可用

## 2.6.1

### Changed
- 时分滚轮：鼠标滚轮步进更灵敏，可一次跨多格，并允许打断进行中的平滑滚动
- loop 滚轮按当前位置最短路径滚动，跨 0/末项不再整段甩回；选中字色经固定高亮框裁切随列表滚动，停稳后对准居中
