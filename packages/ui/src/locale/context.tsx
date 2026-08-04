import { createContext } from "react";
import type { Locale } from "./interface";
import zhCN from "./source/zh-CN";

export const LocaleContext = createContext<Locale>(zhCN);
