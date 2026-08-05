import type { ReactNode } from "react";
import { LocaleContext } from "./context";
import type { Locale } from "./interface";
import zhCN from "./source/zh-CN";

export type LocaleProviderProps = {
  children: ReactNode;
  /** Locale pack. Defaults to `zhCN`. */
  locale?: Locale;
};

export function LocaleProvider({ children, locale = zhCN }: LocaleProviderProps) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
