/** Spiral locale pack — Semi-style component dictionaries + BCP 47 `code` for Intl. */

export type LocaleDatePicker = {
  placeholder: string;
  placeholderWithTime: string;
  rangePlaceholder: string;
  selectDate: string;
  selectDateRange: string;
  rangeTo: string;
  calendar: string;
  dateTimeSwitch: string;
  previousMonth: string;
  nextMonth: string;
  previousYear: string;
  nextYear: string;
  selectMonthYear: string;
  closeMonthYear: string;
  /** Monday-first weekday short labels (7). */
  weekdays: readonly [string, string, string, string, string, string, string];
  year: string;
  month: string;
  selectYearMonth: string;
};

export type LocaleTimePicker = {
  placeholder: string;
  panel: string;
  selectTime: string;
  hour: string;
  minute: string;
};

export type LocalePagination = {
  jumpTo: string;
  pageSize: string;
  /** Template: `${size}` */
  items: string;
  pagePlaceholder: string;
  morePages: string;
  previous: string;
  next: string;
  pagination: string;
  pageSizeAria: string;
};

export type LocaleUpload = {
  label: string;
  title: string;
  description: string;
};

export type LocaleVideo = {
  play: string;
  pause: string;
  previous: string;
  next: string;
  speed: string;
  speedAdjust: string;
  /** Template: `${rate}` */
  speedRate: string;
  mute: string;
  unmute: string;
  volume: string;
  settings: string;
  fullscreen: string;
  exitFullscreen: string;
  settingsTitle: string;
  aspectRatio: string;
  aspectOriginal: string;
  aspectStretch: string;
  aspectFill: string;
  volumeBalance: string;
};

export type LocaleColorPicker = {
  placeholder: string;
  hue: string;
  opacity: string;
  saturationBrightness: string;
  pickFromScreen: string;
  hex: string;
  rgb: string;
  hsl: string;
  opacityPercent: string;
};

export type Locale = {
  code: string;
  DatePicker: LocaleDatePicker;
  TimePicker: LocaleTimePicker;
  Pagination: LocalePagination;
  Upload: LocaleUpload;
  Video: LocaleVideo;
  Modal: { close: string };
  Feedback: { close: string };
  Alert: { close: string };
  ColorPicker: LocaleColorPicker;
  Cascader: { placeholder: string };
  Loading: { label: string };
  Tag: { remove: string };
  NumberInput: { increment: string; decrement: string };
  Textarea: { resize: string };
  Card: { more: string };
  List: { more: string };
  Breadcrumb: { label: string; showMore: string };
};

export type LocaleComponentName = Exclude<keyof Locale, "code">;
