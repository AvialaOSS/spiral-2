import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { typographyVariants } from "./typography";
import { cn } from "../lib/utils";
import { OverlayPointerSvg, TOOLTIP_POINTER } from "./overlay-pointer";

/** Default show delay — 300ms per ALD / Radix convention. */
export const TOOLTIP_DELAY_DURATION = 300;

export type TooltipProviderProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>;

export function TooltipProvider({
  delayDuration = TOOLTIP_DELAY_DURATION,
  skipDelayDuration = 0,
  ...props
}: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  );
}

export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
  /** Show a caret arrow pointing at the trigger (default true). */
  showArrow?: boolean;
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
        <div className={cn("aviala-tooltip-content__surface", typographyVariants({ level: "caption" }))}>
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
