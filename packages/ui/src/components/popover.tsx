import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { typographyVariants } from "./typography";
import { cn } from "../lib/utils";
import { OverlayPointerSvg, POPOVER_POINTER } from "./overlay-pointer";

export type PopoverProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>;

/**
 * Radix Popover closes on `window` blur (e.g. focusing DevTools). Suppress only
 * blur-initiated closes; pointer-down (outside click, trigger toggle) and Escape
 * must still dismiss on the first interaction.
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
      pointerDownCloseRef.current = false;
      return;
    }

    const markPointerDown = () => {
      pointerDownCloseRef.current = true;
    };
    document.addEventListener("pointerdown", markPointerDown, true);
    return () => document.removeEventListener("pointerdown", markPointerDown, true);
  }, [open]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen && windowBlurCloseRef.current && !pointerDownCloseRef.current) {
        windowBlurCloseRef.current = false;
        return;
      }
      windowBlurCloseRef.current = false;
      pointerDownCloseRef.current = false;
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
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

export type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
  /** Render without Portal — use inside nested overlays. */
  portalled?: boolean;
  /** Show a caret arrow pointing at the trigger (Figma with-arrow variant). */
  showArrow?: boolean;
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
      ...props
    },
    ref
  ) => {
    const content = (
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn("aviala-popover-content", className)}
        {...props}
      >
        <div className={cn("aviala-popover-content__surface", typographyVariants({ level: "text" }))}>
          {children}
        </div>
        {showArrow ? (
          <PopoverPrimitive.Arrow
            asChild
            width={POPOVER_POINTER.width}
            height={POPOVER_POINTER.height}
          >
            <OverlayPointerSvg
              variant="popover"
              className="aviala-popover-content__arrow"
              width={POPOVER_POINTER.width}
              height={POPOVER_POINTER.height}
              path={POPOVER_POINTER.path}
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
