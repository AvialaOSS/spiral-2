import { useEffect, useState } from "react";

/**
 * True when the primary pointer is coarse (touch). Defaults to `false` (desktop)
 * so the first paint is already correct and there is no SSR/hydration mismatch
 * flash; the real value is read on mount and kept in sync.
 */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return coarse;
}
