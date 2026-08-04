import { useContext } from "react";
import { ConfigContext, type Direction } from "./context";

/** Current writing direction (`ltr` when no ConfigProvider). */
export function useDirection(): Direction {
  return useContext(ConfigContext).direction;
}

/** Convenience: `true` when direction is `rtl`. */
export function useRtl(): boolean {
  return useDirection() === "rtl";
}
