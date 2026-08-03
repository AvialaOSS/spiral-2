import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { typographyVariants } from "./typography";
import { cn } from "../lib/utils";
import { OverlayPointerSvg, TOOLTIP_POINTER } from "./overlay-pointer";

/** Default show delay — 300ms per ALD / Radix convention. */
export const TOOLTIP_DELAY_DURATION = 300;

export interface TooltipProviderProps {
  children: ReactNode;
  /**
   * Delay before the tooltip opens on hover, in ms.
   * Defaults to `TOOLTIP_DELAY_DURATION` (300). Pass `0` for instant open on hover.
   */
  delayDuration?: number;
  /**
   * When moving between tooltips, skip the open delay within this window (ms).
   */
  skipDelayDuration?: number;
  /** When true, hovering the tooltip content itself does not keep it open. */
  disableHoverableContent?: boolean;
}

/**
 * Provides shared hover-delay state for nested Tooltips.
 * Pass `delayDuration={0}` for instant open on hover.
 */
export function TooltipProvider({
  children,
  delayDuration = TOOLTIP_DELAY_DURATION,
  skipDelayDuration = 0,
  ...props
}: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    >
      {children}
    </TooltipPrimitive.Provider>
  );
}

export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export type TooltipContentLevel = "caption" | "text";

export type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
  /** Show a caret arrow pointing at the trigger (default true). */
  showArrow?: boolean;
  /**
   * Typography level for the surface copy.
   * Figma default is `caption`; pass `text` for body-sized tooltip copy.
   */
  level?: TooltipContentLevel;
};

export const TooltipContent = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      className,
      children,
      sideOffset = 4,
      collisionPadding = 8,
      showArrow = true,
      level = "caption",
      ...props
    },
    ref
  ) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn("aviala-tooltip-content", className)}
        {...props}
      >
        <div
          className={cn(
            "aviala-tooltip-content__surface",
            typographyVariants({ level })
          )}
        >
          {children}
        </div>
        {showArrow ? (
          <TooltipPrimitive.Arrow
            asChild
            width={TOOLTIP_POINTER.width}
            height={TOOLTIP_POINTER.height}
          >
            <OverlayPointerSvg
              className="aviala-tooltip-content__arrow"
              width={TOOLTIP_POINTER.width}
              height={TOOLTIP_POINTER.height}
              path={TOOLTIP_POINTER.path}
            />
          </TooltipPrimitive.Arrow>
        ) : null}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
