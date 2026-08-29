import type { Locale } from "../interface";

const zhCN: Locale = {
  code: "zh-CN",
  DatePicker: {
    placeholder: "YYYY-MM-DD",
    placeholderWithTime: "YYYY-MM-DD HH:mm",
    rangePlaceholder: "开始日期 - 结束日期",
    selectDate: "选择日期",
    selectDateRange: "选择日期范围",
    rangeTo: " 至 ",
    calendar: "日历",
    dateTimeSwitch: "日期与时间切换",
    previousMonth: "上个月",
    nextMonth: "下个月",
    previousYear: "上一年",
    nextYear: "下一年",
    selectMonthYear: "选择年月",
    closeMonthYear: "关闭年月选择",
    weekdays: ["一", "二", "三", "四", "五", "六", "日"],
    year: "年",
    month: "月",
    selectYearMonth: "选择年月",
  },
  TimePicker: {
    placeholder: "HH:mm",
    panel: "时间选择",
    selectTime: "选择时间",
    hour: "小时",
    minute: "分钟",
  },
  Pagination: {
    jumpTo: "跳转至",
    pageSize: "每页",
    items: "${size} 项",
    pagePlaceholder: "页码",
    morePages: "更多页码",
    previous: "上一页",
    next: "下一页",
    pagination: "分页",
    pageSizeAria: "每页条数",
  },
  Upload: {
    label: "上传",
    title: "将文件拖到此处上传",
    description: "或点击此处上传",
  },
  Video: {
    play: "播放",
    pause: "暂停",
    previous: "上一首",
    next: "下一首",
    speed: "倍速",
    speedAdjust: "倍速调整",
    speedRate: "${rate} 倍",
    mute: "静音",
    unmute: "取消静音",
    volume: "音量",
    settings: "设置",
    fullscreen: "全屏",
    exitFullscreen: "退出全屏",
    settingsTitle: "播放设置",
    aspectRatio: "画面比例",
    aspectOriginal: "原始",
    aspectStretch: "拉伸",
    aspectFill: "占满",
    volumeBalance: "音量平衡",
  },
  Modal: {
    close: "关闭对话框",
  },
  Drawer: {
    close: "关闭抽屉",
  },
  Feedback: {
    close: "关闭",
  },
  Alert: {
    close: "关闭提示",
  },
  ColorPicker: {
    placeholder: "选择颜色",
    hue: "色相",
    opacity: "透明度",
    saturationBrightness: "饱和度与亮度",
    pickFromScreen: "从屏幕取色",
    hex: "十六进制颜色",
    rgb: "RGB 颜色",
    hsl: "HSL 颜色",
    opacityPercent: "不透明度百分比",
  },
  Cascader: {
    placeholder: "请选择",
  },
  Loading: {
    label: "加载中",
  },
  Tag: {
    remove: "移除",
  },
  NumberInput: {
    increment: "增加",
    decrement: "减少",
  },
  Textarea: {
    resize: "调整文本框大小",
  },
  Card: {
    more: "更多",
  },
  List: {
    more: "更多",
  },
  Breadcrumb: {
    label: "面包屑",
    showMore: "显示更多面包屑项",
  },
};

export default zhCN;
