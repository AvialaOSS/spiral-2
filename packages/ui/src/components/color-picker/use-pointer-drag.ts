import { useCallback, type PointerEvent, type RefObject } from "react";
import { clamp01 } from "./color-utils";

export function usePointerDrag<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onMove: (x: number, y: number) => void,
  enabled = true
) {
  const updateFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = clamp01((clientX - rect.left) / rect.width);
      const y = clamp01((clientY - rect.top) / rect.height);
      onMove(x, y);
    },
    [onMove, ref]
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<T>) => {
      if (!enabled || !ref.current) return;
      event.preventDefault();
      ref.current.setPointerCapture(event.pointerId);
      updateFromEvent(event.clientX, event.clientY);
    },
    [enabled, ref, updateFromEvent]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<T>) => {
      if (!enabled || !ref.current || !ref.current.hasPointerCapture(event.pointerId)) return;
      updateFromEvent(event.clientX, event.clientY);
    },
    [enabled, ref, updateFromEvent]
  );

  return { handlePointerDown, handlePointerMove };
}
