import { useCallback, useEffect, useRef, type MutableRefObject } from "react";

export type UseCloseSuppressionOptions = {
  /** Current open state of the overlay. */
  open: boolean;
  /** When true, requests to open are refused before any listener bookkeeping. */
  disabled?: boolean;
  /**
   * Keep `pointerDownCloseRef` set after a close so a later handler (Radix
   * `onCloseAutoFocus`) can still tell a pointer dismissal from a keyboard one.
   * Select needs this; the popover-based pickers clear the flag eagerly.
   */
  keepPointerDownFlagAfterClose?: boolean;
};

export type CloseSuppression = {
  /** True while a pointer-down happened during the current open session. */
  pointerDownCloseRef: MutableRefObject<boolean>;
  /**
   * Call at the top of `onOpenChange`. Returns false when the transition must be
   * swallowed (blur-initiated close, or opening while disabled) and true when the
   * caller should commit the new state.
   */
  shouldCommitOpenChange: (nextOpen: boolean) => boolean;
};

/**
 * Radix overlays close on `window` blur (focusing DevTools, switching apps).
 * Suppress only blur-initiated closes; pointer-down (outside click, item select,
 * trigger toggle) and Escape must still dismiss on the first interaction.
 */
export function useCloseSuppression({
  open,
  disabled = false,
  keepPointerDownFlagAfterClose = false,
}: UseCloseSuppressionOptions): CloseSuppression {
  const windowBlurCloseRef = useRef(false);
  const pointerDownCloseRef = useRef(false);

  useEffect(() => {
    const markWindowBlur = () => {
      windowBlurCloseRef.current = true;
    };
    window.addEventListener("blur", markWindowBlur, true);
    return () => window.removeEventListener("blur", markWindowBlur, true);
  }, []);

  useEffect(() => {
    if (!open) {
      if (!keepPointerDownFlagAfterClose) {
        pointerDownCloseRef.current = false;
      }
      return;
    }

    const markPointerDown = () => {
      pointerDownCloseRef.current = true;
    };
    document.addEventListener("pointerdown", markPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", markPointerDown, true);
  }, [keepPointerDownFlagAfterClose, open]);

  const shouldCommitOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (disabled && nextOpen) return false;
      if (
        !nextOpen &&
        windowBlurCloseRef.current &&
        !pointerDownCloseRef.current
      ) {
        windowBlurCloseRef.current = false;
        return false;
      }
      windowBlurCloseRef.current = false;
      if (nextOpen || !keepPointerDownFlagAfterClose) {
        pointerDownCloseRef.current = false;
      }
      return true;
    },
    [disabled, keepPointerDownFlagAfterClose]
  );

  return { pointerDownCloseRef, shouldCommitOpenChange };
}
