import { createContext } from "react";

export type Direction = "ltr" | "rtl";

export type ConfigContextValue = {
  direction: Direction;
  /** True when this provider owns `document.documentElement.dir`. */
  isDocumentSyncOwner: boolean;
};

export const ConfigContext = createContext<ConfigContextValue>({
  direction: "ltr",
  isDocumentSyncOwner: false,
});
