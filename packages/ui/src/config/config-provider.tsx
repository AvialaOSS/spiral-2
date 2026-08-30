import {
  useContext,
  useLayoutEffect,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import { LocaleProvider } from "../locale/locale-provider";
import type { Locale } from "../locale/interface";
import { ConfigContext, type Direction } from "./context";

export type ConfigProviderProps = {
  children: ReactNode;
  /** Writing direction. Defaults to `ltr`. */
  direction?: Direction;
  /**
   * When true (default), the outermost ConfigProvider that opts in writes
   * `document.documentElement.dir` so portalled overlays inherit direction.
   * Nested providers only set `dir` on their local wrapper.
   */
  syncDocumentDir?: boolean;
  /** Optional locale pack — nests `LocaleProvider` when provided. */
  locale?: Locale;
  className?: string;
  style?: CSSProperties;
};

export function ConfigProvider({
  children,
  direction = "ltr",
  syncDocumentDir = true,
  locale,
  className,
  style,
}: ConfigProviderProps) {
  const parent = useContext(ConfigContext);
  const isDocumentSyncOwner = syncDocumentDir && !parent.isDocumentSyncOwner;

  const value = useMemo(
    () => ({
      direction,
      isDocumentSyncOwner,
    }),
    [direction, isDocumentSyncOwner]
  );

  useLayoutEffect(() => {
    if (!isDocumentSyncOwner || typeof document === "undefined") return;
    const root = document.documentElement;
    const previous = root.getAttribute("dir");
    root.setAttribute("dir", direction);
    return () => {
      if (previous == null || previous === "") {
        root.removeAttribute("dir");
      } else {
        root.setAttribute("dir", previous);
      }
    };
  }, [direction, isDocumentSyncOwner]);

  let content = children;
  if (locale) {
    content = <LocaleProvider locale={locale}>{content}</LocaleProvider>;
  }

  return (
    <ConfigContext.Provider value={value}>
      <div className={className} dir={direction} style={style}>
        {content}
      </div>
    </ConfigContext.Provider>
  );
}
