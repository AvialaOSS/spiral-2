export type {
  Locale,
  LocaleComponentName,
  LocaleColorPicker,
  LocaleDatePicker,
  LocalePagination,
  LocaleTimePicker,
  LocaleUpload,
} from "./interface";
export { interpolate } from "./interpolate";
export { LocaleProvider, type LocaleProviderProps } from "./locale-provider";
export { useLocale, useLocaleMessages } from "./use-locale";
export { default as zhCN } from "./source/zh-CN";
export { default as enUS } from "./source/en-US";
