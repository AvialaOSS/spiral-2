import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TOOLTIP_DELAY_DURATION,
  type TooltipContentLevel,
} from "./tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { useCoarsePointer } from "./use-coarse-pointer";

/** Default hold duration before a touch tooltip opens. */
export const RESPONSIVE_TOOLTIP_LONG_PRESS_MS = 500;

/** Cancel the pending long-press if the pointer moves farther than this (px). */
const LONG_PRESS_MOVE_THRESHOLD_PX = 10;

export interface ResponsiveTooltipProps {
  /**
   * Tooltip body — the same content is shown on desktop (hover) and touch
   * (long-press).
   */
  content: ReactNode;
  /** The trigger element. Rendered with `asChild`, so pass a single element. */
  children: ReactNode;
  /** Preferred placement of the floating content. */
  side?: "top" | "right" | "bottom" | "left";
  /** Cross-axis alignment relative to the trigger. */
  align?: "start" | "center" | "end";
  /** Gap between trigger and content, in px. */
  sideOffset?: number;
  /** Distance from viewport edges before collision flipping, in px. */
  collisionPadding?: number;
  /** Show the caret arrow pointing at the trigger. */
  showArrow?: boolean;
  /** Typography level for the content surface (default `caption`). */
  level?: TooltipContentLevel;
  /**
   * Hover open delay on desktop, in ms (ignored on touch).
   * Defaults to 300 (`TOOLTIP_DELAY_DURATION`). Pass `0` for instant open on hover.
   * Requires a TooltipProvider ancestor for shared delay context.
   */
  delayDuration?: number;
  /**
   * Hold duration on touch before the tip opens, in ms.
   * Defaults to 500 (`RESPONSIVE_TOOLTIP_LONG_PRESS_MS`).
   */
  longPressMs?: number;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Open-state change callback. */
  onOpenChange?: (open: boolean) => void;
  /** Extra class on the inner content surface. */
  contentClassName?: string;
}

/**
 * Tooltip with a mobile-friendly trigger.
 *
 * Radix Tooltip is hover/focus only and deliberately ignores touch, so it has
 * no trigger on phones. `ResponsiveTooltip` renders the SAME content through the
 * right primitive for the device:
 * - Desktop (`pointer: fine`): Radix Tooltip — opens on hover and keyboard focus.
 * - Touch (`pointer: coarse`): Radix Popover with `appearance="tooltip"` — opens on
 *   **long-press** (short tap still reaches the trigger’s own `onClick`), dismisses
 *   on outside tap / Escape, and keeps the tooltip visual skin (dark surface,
 *   caption text, solid caret) so it looks identical to desktop.
 *
 * The consumer API and the look are unchanged between devices; only the trigger
 * gesture differs. Animations are handled by the respective effect CSS
 * (tooltip-effects / popover-effects), so direction-aware scale-in/out works on
 * both branches.
 *
 * @example
 * <TooltipProvider> // needed for the desktop hover-delay; Popover needs none
 *   <ResponsiveTooltip content="Save changes">
 *     <Button>Save</Button>
 *   </ResponsiveTooltip>
 * </TooltipProvider>
 */
export function ResponsiveTooltip({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 4,
  collisionPadding = 8,
  showArrow = true,
  level = "caption",
  delayDuration = TOOLTIP_DELAY_DURATION,
  longPressMs = RESPONSIVE_TOOLTIP_LONG_PRESS_MS,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  contentClassName,
}: ResponsiveTooltipProps) {
  const coarse = useCoarsePointer();
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? openProp! : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressOriginRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearLongPressTimer(), [clearLongPressTimer]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (event.pointerType === "mouse") return;
      clearLongPressTimer();
      suppressClickRef.current = false;
      pressOriginRef.current = { x: event.clientX, y: event.clientY };
      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = null;
        suppressClickRef.current = true;
        setOpen(true);
      }, longPressMs);
    },
    [clearLongPressTimer, longPressMs, setOpen]
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent) => {
      const origin = pressOriginRef.current;
      if (!origin || longPressTimerRef.current == null) return;
      const dx = event.clientX - origin.x;
      const dy = event.clientY - origin.y;
      if (dx * dx + dy * dy > LONG_PRESS_MOVE_THRESHOLD_PX ** 2) {
        clearLongPressTimer();
        pressOriginRef.current = null;
      }
    },
    [clearLongPressTimer]
  );

  const handlePointerEnd = useCallback(() => {
    clearLongPressTimer();
    pressOriginRef.current = null;
  }, [clearLongPressTimer]);

  if (coarse) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          asChild
          // Capture: swallow the synthetic click after a successful long-press
          // so the trigger’s action (e.g. navigate / copy) does not also fire.
          onClickCapture={(event) => {
            if (!suppressClickRef.current) return;
            suppressClickRef.current = false;
            event.preventDefault();
            event.stopPropagation();
          }}
          // Bubble: always block Radix’s click-to-toggle — open is long-press only.
          onClick={(event) => {
            event.preventDefault();
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onContextMenu={(event) => {
            // Avoid the OS callout competing with the long-press tip.
            event.preventDefault();
          }}
        >
          {children as ReactElement}
        </PopoverTrigger>
        <PopoverContent
          appearance="tooltip"
          level={level}
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          showArrow={showArrow}
          className={contentClassName}
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Tooltip
      delayDuration={delayDuration}
      open={openProp}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        showArrow={showArrow}
        level={level}
        className={contentClassName}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
