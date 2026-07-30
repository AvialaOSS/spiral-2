import { type ReactNode } from "react";
import { cn } from "../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TOOLTIP_DELAY_DURATION,
} from "./tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { useCoarsePointer } from "./use-coarse-pointer";

export interface ResponsiveTooltipProps {
  /** Tooltip body — the same content is shown on desktop (hover) and touch (tap). */
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
  /** Hover open delay on desktop, in ms (ignored on touch). Requires a TooltipProvider ancestor. */
  delayDuration?: number;
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
 * - Touch (`pointer: coarse`): Radix Popover — opens on tap, dismisses on outside
 *   tap / Escape, like any other popover.
 *
 * The consumer API is unchanged between devices; only the trigger gesture differs.
 * Animations are handled by the respective effect CSS (tooltip-effects /
 * popover-effects), so direction-aware scale-in/out works on both branches.
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
  delayDuration = TOOLTIP_DELAY_DURATION,
  open,
  defaultOpen,
  onOpenChange,
  contentClassName,
}: ResponsiveTooltipProps) {
  const coarse = useCoarsePointer();

  if (coarse) {
    return (
      <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
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
    <Tooltip
      delayDuration={delayDuration}
      open={open}
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
        className={contentClassName}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
