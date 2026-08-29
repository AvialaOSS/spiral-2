import type { Locale } from "../interface";

const enUS: Locale = {
  code: "en-US",
  DatePicker: {
    placeholder: "YYYY-MM-DD",
    placeholderWithTime: "YYYY-MM-DD HH:mm",
    rangePlaceholder: "Start date - End date",
    selectDate: "Select date",
    selectDateRange: "Select date range",
    rangeTo: " to ",
    calendar: "Calendar",
    dateTimeSwitch: "Date and time",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    previousYear: "Previous year",
    nextYear: "Next year",
    selectMonthYear: "Select month and year",
    closeMonthYear: "Close month and year picker",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    year: "Year",
    month: "Month",
    selectYearMonth: "Select year and month",
  },
  TimePicker: {
    placeholder: "HH:mm",
    panel: "Time picker",
    selectTime: "Select time",
    hour: "Hour",
    minute: "Minute",
  },
  Pagination: {
    jumpTo: "Go to",
    pageSize: "Per page",
    items: "${size} items",
    pagePlaceholder: "Page",
    morePages: "More pages",
    previous: "Previous page",
    next: "Next page",
    pagination: "Pagination",
    pageSizeAria: "Page size",
  },
  Upload: {
    label: "Upload",
    title: "Drag the file here to upload the file",
    description: "Or click here to upload",
  },
  Video: {
    play: "Play",
    pause: "Pause",
    previous: "Previous",
    next: "Next",
    speed: "Speed",
    speedAdjust: "Playback speed",
    speedRate: "${rate}×",
    mute: "Mute",
    unmute: "Unmute",
    volume: "Volume",
    settings: "Settings",
    fullscreen: "Enter fullscreen",
    exitFullscreen: "Exit fullscreen",
    settingsTitle: "Playback settings",
    aspectRatio: "Aspect ratio",
    aspectOriginal: "Original",
    aspectStretch: "Stretch",
    aspectFill: "Fill",
    volumeBalance: "Volume balance",
  },
  Modal: {
    close: "Close dialog",
  },
  Drawer: {
    close: "Close drawer",
  },
  Feedback: {
    close: "Dismiss",
  },
  Alert: {
    close: "Dismiss alert",
  },
  ColorPicker: {
    placeholder: "Select color",
    hue: "Hue",
    opacity: "Opacity",
    saturationBrightness: "Saturation and brightness",
    pickFromScreen: "Pick color from screen",
    hex: "Hex color",
    rgb: "RGB color",
    hsl: "HSL color",
    opacityPercent: "Opacity percent",
  },
  Cascader: {
    placeholder: "Select",
  },
  Loading: {
    label: "Loading",
  },
  Tag: {
    remove: "Remove",
  },
  NumberInput: {
    increment: "Increment",
    decrement: "Decrement",
  },
  Textarea: {
    resize: "Resize textarea",
  },
  Card: {
    more: "More",
  },
  List: {
    more: "More",
  },
  Breadcrumb: {
    label: "Breadcrumb",
    showMore: "Show more breadcrumb items",
  },
};

export default enUS;
