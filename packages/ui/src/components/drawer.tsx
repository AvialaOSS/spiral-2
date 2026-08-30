import * as DialogPrimitive from "@radix-ui/react-dialog";
import { SymbolWrong } from "@aviala-design/icons";
import { cva, type VariantProps } from "class-variance-authority";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useState,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "../lib/utils";
import { OverlayContainerProvider } from "../overlay/overlay-container";
import { useLocaleMessages } from "../locale";
import { Button } from "./button";
import { Typeface } from "./typeface";
import { Typography } from "./typography";

/** Figma Components → Drawer (2051:26823) */
export type DrawerPosition = "left" | "right" | "top" | "bottom";

const DRAWER_ICON_SIZE = 22;

const drawerContentVariants = cva("aviala-drawer-content", {
  variants: {
    position: {
      left: "aviala-drawer-content--position-left",
      right: "aviala-drawer-content--position-right",
      top: "aviala-drawer-content--position-top",
      bottom: "aviala-drawer-content--position-bottom",
    },
  },
  defaultVariants: {
    position: "right",
  },
});

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  (ref as { current: T | null }).current = value;
}

function renderDrawerIcon(node: ReactNode): ReactNode {
  if (!node) return null;
  const content =
    isValidElement(node) && typeof node.type !== "string"
      ? cloneElement(
          node as ReactElement<{
            width?: number;
            height?: number;
            className?: string;
          }>,
          {
            width: DRAWER_ICON_SIZE,
            height: DRAWER_ICON_SIZE,
            className: cn(
              (node as ReactElement<{ className?: string }>).props.className,
              "shrink-0"
            ),
          }
        )
      : node;

  return (
    <span className="aviala-drawer__icon" aria-hidden>
      {content}
    </span>
  );
}

export type DrawerProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;

export const Drawer = DialogPrimitive.Root;

export const DrawerTrigger = DialogPrimitive.Trigger;

export const DrawerPortal = DialogPrimitive.Portal;

export const DrawerClose = DialogPrimitive.Close;

export type DrawerOverlayProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Overlay
>;

export const DrawerOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DrawerOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("aviala-drawer-overlay", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

export type DrawerContentProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> &
  VariantProps<typeof drawerContentVariants> & {
    /** Render without Portal — use inside nested overlays. */
    portalled?: boolean;
    /** Show the default overlay scrim. */
    showOverlay?: boolean;
  };

export const DrawerContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      children,
      position = "right",
      portalled = true,
      showOverlay = true,
      onOpenAutoFocus,
      ...props
    },
    ref
  ) => {
    const [overlayContainer, setOverlayContainer] =
      useState<HTMLElement | null>(null);
    // Overlay + Content must be direct Portal children (not a Fragment) so Radix
    // Presence can keep each mounted through the exit `data-state="closed"` animation.
    const overlay = showOverlay ? <DrawerOverlay /> : null;
    const panel = (
      <DialogPrimitive.Content
        ref={(node) => {
          assignRef(ref, node);
          setOverlayContainer(node);
        }}
        className={cn(drawerContentVariants({ position }), className)}
        data-position={position ?? "right"}
        onOpenAutoFocus={onOpenAutoFocus}
        {...props}
      >
        <OverlayContainerProvider container={overlayContainer}>
          <div className="aviala-drawer-content__surface">{children}</div>
        </OverlayContainerProvider>
      </DialogPrimitive.Content>
    );

    if (!portalled) {
      return (
        <>
          {overlay}
          {panel}
        </>
      );
    }

    return (
      <DialogPrimitive.Portal>
        {overlay}
        {panel}
      </DialogPrimitive.Portal>
    );
  }
);
DrawerContent.displayName = DialogPrimitive.Content.displayName;

export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /** Optional leading status icon */
  icon?: ReactNode;
  /** Show the leading icon slot */
  showIcon?: boolean;
  /** Show the header close control */
  showClose?: boolean;
  closeLabel?: string;
};

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  (
    {
      className,
      children,
      icon,
      showIcon = false,
      showClose = true,
      closeLabel,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("Drawer");
    const resolvedCloseLabel = closeLabel ?? locale.close;

    return (
      <div
        ref={ref}
        className={cn("aviala-drawer__header", className)}
        {...props}
      >
        <div className="aviala-drawer__header-row">
          {showIcon ? renderDrawerIcon(icon) : null}
          <div className="aviala-drawer__header-main">{children}</div>
          {showClose ? (
            <DialogPrimitive.Close asChild>
              <Button
                type="button"
                mode="noBackgroundCustom"
                iconOnly
                aria-label={resolvedCloseLabel}
                className="aviala-drawer__close"
                leftIcon={<SymbolWrong aria-hidden />}
              />
            </DialogPrimitive.Close>
          ) : null}
        </div>
      </div>
    );
  }
);
DrawerHeader.displayName = "DrawerHeader";

export type DrawerTitleProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Title
>;

export const DrawerTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DrawerTitleProps
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} asChild {...props}>
    <Typography level="text" className={cn("aviala-drawer__title", className)}>
      {children}
    </Typography>
  </DialogPrimitive.Title>
));
DrawerTitle.displayName = DialogPrimitive.Title.displayName;

export type DrawerDescriptionProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

export const DrawerDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DrawerDescriptionProps
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} asChild {...props}>
    <Typography
      level="caption"
      className={cn("aviala-drawer__description", className)}
    >
      {children}
    </Typography>
  </DialogPrimitive.Description>
));
DrawerDescription.displayName = DialogPrimitive.Description.displayName;

/** Convenience wrapper — Figma header Typeface (text + caption). */
export type DrawerHeaderTextProps = Omit<DrawerHeaderProps, "children"> & {
  title: ReactNode;
  description?: ReactNode;
};

export function DrawerHeaderText({
  title,
  description,
  ...props
}: DrawerHeaderTextProps) {
  return (
    <DrawerHeader {...props}>
      <div className="aviala-drawer__header-typeface">
        <DrawerTitle>{title}</DrawerTitle>
        {description ? (
          <DrawerDescription>{description}</DrawerDescription>
        ) : null}
      </div>
    </DrawerHeader>
  );
}

export type DrawerBodyProps = HTMLAttributes<HTMLDivElement> & {
  /** Figma `Content=Text` — title + body copy preset */
  layout?: "default" | "text";
  title?: ReactNode;
  description?: ReactNode;
};

export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  (
    { className, children, layout = "default", title, description, ...props },
    ref
  ) => (
    <div ref={ref} className={cn("aviala-drawer__body", className)} {...props}>
      {layout === "text" ? (
        <Typeface
          className="aviala-drawer__body-typeface"
          content="textTitle"
          primary={title}
          secondary={description ?? children}
        />
      ) : (
        children
      )}
    </div>
  )
);
DrawerBody.displayName = "DrawerBody";

export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>;

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("aviala-drawer__footer", className)}
      {...props}
    />
  )
);
DrawerFooter.displayName = "DrawerFooter";

export { drawerContentVariants };
