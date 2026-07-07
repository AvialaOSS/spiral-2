import { DEFAULT_SEMANTIC_COLORS } from "@aviala-design/tokens";
import type { ColorEntry } from "./types";

/** Default semantic color families shown on first load. */
export const INITIAL_COLOR_ENTRIES: ColorEntry[] = [
  {
    id: "primary",
    name: "Primary",
    subtitle: "主题色",
    baseColor: DEFAULT_SEMANTIC_COLORS.primary,
    isDefault: true,
  },
  {
    id: "success",
    name: "Success",
    subtitle: "表意色 成功",
    baseColor: DEFAULT_SEMANTIC_COLORS.success,
    isDefault: true,
  },
  {
    id: "warning",
    name: "Warning",
    subtitle: "表意色 警告",
    baseColor: DEFAULT_SEMANTIC_COLORS.warning,
    isDefault: true,
  },
  {
    id: "error",
    name: "Error",
    subtitle: "表意色 错误",
    baseColor: DEFAULT_SEMANTIC_COLORS.error,
    isDefault: true,
  },
  {
    id: "info",
    name: "Info",
    subtitle: "表意色 信息",
    baseColor: DEFAULT_SEMANTIC_COLORS.info,
    isDefault: true,
  },
];
