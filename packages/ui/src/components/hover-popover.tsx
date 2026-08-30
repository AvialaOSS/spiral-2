import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { useCoarsePointer } from "./use-coarse-pointer";

export interface HoverPopoverProps {
  /** Floating body — may hold rich / interactive content. */
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
  /** Delay before opening on hover, in ms. */
  openDelay?: number;
  /** Delay before closing on pointer leave, in ms (lets the cursor reach the content). */
  closeDelay?: number;
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
 * Popover that opens on hover (desktop) / tap (touch).
 *
 * Radix Popover is click-only, so this wraps it in a controlled shell:
 * - Desktop (`pointer: fine`): opens on `mouseenter` (after `openDelay`) via the
 *   trigger's hover handlers. Keyboard uses Radix `PopoverTrigger`'s native
 *   semantics — Tab *selects* the trigger (does not open), Enter/Space reveals
 *   the popover, and Escape closes it on the *first* press with focus returned
 *   to the trigger. Hover/click opens keep focus on the trigger; keyboard opens
 *   move focus into the content. Closes on `mouseleave`/`blur` after
 *   `closeDelay`. The delay keeps the surface open while the cursor travels the
 *   gap into the content, and cancels the close when the cursor/focus
 *   re-enters the content.
 * - Touch (`pointer: coarse`): degrades to a normal Popover — `PopoverTrigger`
 *   tap to toggle, outside tap / Escape to dismiss. No hover exists on touch.
 *
 * Use this for rich / interactive previews. For a non-essential text hint,
 * prefer `Tooltip` / `ResponsiveTooltip`.
 *
 * @example
 * <HoverPopover content={<PriceBreakdown />}>
 *   <Button>See price</Button>
 * </HoverPopover>
 */
export function HoverPopover({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 8,
  collisionPadding = 8,
  showArrow = true,
  openDelay = 150,
  closeDelay = 150,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  contentClassName,
}: HoverPopoverProps) {
  const coarse = useCoarsePointer();
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? openProp : internalOpen;

  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  useEffect(() => () => clearTimers(), [clearTimers]);

  // Radix Popover's content *forces* focus trapping (trapFocus is hard-coded to
  // `open` and cannot be turned off), and on close it returns focus to its
  // Trigger. That is exactly why we must use `PopoverTrigger` (not `PopoverAnchor`)
  // for the desktop branch: with a real trigger, the first Escape dismisses and
  // focus lands back on the trigger. Without one, the FocusScope swallows the
  // first Escape trying to return focus to a non-existent trigger.
  //
  // `keyboardOpenRef` only decides whether we *steal* focus into the content on
  // open: hover/click opens must keep focus on the trigger, keyboard opens may
  // move it into the content. Radix's Trigger handles Tab-select / Enter-Space
  // open / single-Escape-close natively.
  const keyboardOpenRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const openNow = useCallback(() => {
    keyboardOpenRef.current = false;
    clearTimers();
    openTimer.current = setTimeout(() => setOpen(true), openDelay);
  }, [clearTimers, openDelay, setOpen]);

  const closeSoon = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [clearTimers, closeDelay, setOpen]);

  if (coarse) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={openNow}
        onMouseLeave={closeSoon}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            keyboardOpenRef.current = true;
        }}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        ref={contentRef}
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        showArrow={showArrow}
        className={contentClassName}
        // Hover/click opens keep focus on the trigger; only keyboard opens move
        // focus into the content (Radix returns focus to the trigger on close).
        onOpenAutoFocus={(e) => {
          if (!keyboardOpenRef.current) e.preventDefault();
        }}
        // Escape must close on the first press. We handle it explicitly and
        // preventDefault so Radix's DismissableLayer doesn't also run its own
        // dismiss path (which, combined with focus-return bookkeeping, could
        // otherwise swallow the first press). Focus return to the trigger is
        // still handled by Radix's default onCloseAutoFocus.
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
        onMouseEnter={clearTimers}
        onMouseLeave={closeSoon}
        onBlur={(e) => {
          const next = e.relatedTarget as Node | null;
          if (next && contentRef.current?.contains(next)) return;
          closeSoon();
        }}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
