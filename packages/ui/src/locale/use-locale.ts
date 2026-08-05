import { useContext } from "react";
import { LocaleContext } from "./context";
import type { Locale, LocaleComponentName } from "./interface";

/** Current locale pack (falls back to zh-CN when no Provider). */
export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Messages for one component block (e.g. `Pagination`). */
export function useLocaleMessages<K extends LocaleComponentName>(
  component: K
): Locale[K] {
  return useLocale()[component];
}
