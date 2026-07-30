import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  forwardRef,
  useCallback,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { typographyVariants } from "./typography";
import { cn } from "../lib/utils";
import { OverlayPointerSvg, POPOVER_POINTER, TOOLTIP_POINTER } from "./overlay-pointer";

export type PopoverProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>;

/**
 * Thin controlled/uncontrolled wrapper around Radix `Popover.Root`. We don't add
 * any custom close-suppression: a non-modal Popover already prevents focus-outside
 * from dismissing (`onFocusOutside` is default-prevented by Radix), so a window
 * blur never closes it — no extra bookkeeping needed, and it keeps Escape a
 * single, predictable dismiss.
 */
export function Popover({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  modal = false,
  ...props
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={handleOpenChange}
      modal={modal}
      {...props}
    />
  );
}

export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export type PopoverAppearance = "default" | "tooltip" | "primary";

export type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
  /** Render without Portal — use inside nested overlays. */
  portalled?: boolean;
  /** Show a caret arrow pointing at the trigger (Figma with-arrow variant). */
  showArrow?: boolean;
  /** Strip surface padding — consumer controls inner spacing. */
  flush?: boolean;
  /**
   * Visual skin of the surface:
   * - `default` — light bordered panel (select-menu aligned), text typography, stroked caret.
   * - `tooltip` — shared inverted tooltip skin (dark, caption text, borderless, solid caret).
   * - `primary` — brand primary surface with white text, borderless, solid caret.
   */
  appearance?: PopoverAppearance;
};

export const PopoverContent = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      children,
      align = "center",
      sideOffset = 8,
      collisionPadding = 8,
      portalled = true,
      showArrow = false,
      flush = false,
      appearance = "default",
      ...props
    },
    ref
  ) => {
    const isDefaultAppearance = appearance === "default";
    const surfaceLevel = appearance === "tooltip" ? "caption" : "text";
    const pointer = isDefaultAppearance ? POPOVER_POINTER : TOOLTIP_POINTER;

    const content = (
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        data-appearance={appearance}
        className={cn("aviala-popover-content", className)}
        {...props}
      >
        <div
          className={cn(
            "aviala-popover-content__surface",
            typographyVariants({ level: surfaceLevel })
          )}
          data-flush={flush ? "true" : undefined}
        >
          {children}
        </div>
        {showArrow ? (
          <PopoverPrimitive.Arrow
            asChild
            width={pointer.width}
            height={pointer.height}
          >
            <OverlayPointerSvg
              variant={isDefaultAppearance ? "popover" : "default"}
              className="aviala-popover-content__arrow"
              width={pointer.width}
              height={pointer.height}
              path={pointer.path}
            />
          </PopoverPrimitive.Arrow>
        ) : null}
      </PopoverPrimitive.Content>
    );

    if (!portalled) return content;

    return <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal>;
  }
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
