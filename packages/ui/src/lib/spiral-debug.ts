/** Stable ids for docs component debugger — safe to leave on DOM in production. */
export const SPIRAL_DEBUG_ATTR = "data-spiral-debug-id" as const;

export function spiralDebugId(id: string): { [SPIRAL_DEBUG_ATTR]: string; "data-component": string } {
  const component = id.split(".")[0] ?? id;
  return {
    [SPIRAL_DEBUG_ATTR]: id,
    "data-component": component,
  };
}
