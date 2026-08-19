# DatePickerField

## [Unreleased]

### Fixed
- 面板 Portal 挂到全屏元素或 Modal 容器，避免被对话框遮罩挡住或全屏后不可用

## 2.6.1

### Changed
- 日历面板上一月 / 下一月导航图标改为 `direction/arrowLeftLight` 与 `direction/arrowRightLight`
- 导航箭头按压缩小，松开后沿翻页方向飞出并由对侧飞入
- 月/年与时间滚轮：鼠标滚轮步进更灵敏，可一次跨多格，并允许打断进行中的平滑滚动
- loop 滚轮按当前位置最短路径滚动，跨 0/末项不再整段甩回；选中字色经固定高亮框裁切随列表滚动，停稳后对准居中

## 2.6.0

### Changed
- 周标题、页脚、导航 aria 与 `Intl` 格式化改读当前 locale（默认 zh-CN）

### Fixed
- 月/年上一页、下一页箭头在 RTL 下随阅读方向翻转

## 2.0.0

### Changed
- 键盘与布局细节打磨
