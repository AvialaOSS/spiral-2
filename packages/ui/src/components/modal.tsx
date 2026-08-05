import * as DialogPrimitive from "@radix-ui/react-dialog";
import { SymbolWrong } from "@aviala-design/icons";
import { cva, type VariantProps } from "class-variance-authority";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { useLocaleMessages } from "../locale";
import { Button } from "./button";
import { Typeface } from "./typeface";
import { Typography } from "./typography";

/** Figma Components → Information Display → Modal (553:58593) */
export type ModalSize = "default" | "large";

const MODAL_ICON_SIZE = 16;

const modalContentVariants = cva("aviala-modal-content", {
  variants: {
    size: {
      default: "aviala-modal-content--size-default",
      large: "aviala-modal-content--size-large",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

function renderModalIcon(node: ReactNode): ReactNode {
  if (!node) return null;
  const content =
    isValidElement(node) && typeof node.type !== "string"
      ? cloneElement(node as ReactElement<{ width?: number; height?: number; className?: string }>, {
          width: MODAL_ICON_SIZE,
          height: MODAL_ICON_SIZE,
          className: cn(
            (node as ReactElement<{ className?: string }>).props.className,
            "shrink-0"
          ),
        })
      : node;

  return (
    <span className="aviala-modal__icon" aria-hidden>
      {content}
    </span>
  );
}

export type ModalProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;

export const Modal = DialogPrimitive.Root;

export const ModalTrigger = DialogPrimitive.Trigger;

export const ModalPortal = DialogPrimitive.Portal;

export const ModalClose = DialogPrimitive.Close;

export type ModalOverlayProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

export const ModalOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  ModalOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("aviala-modal-overlay", className)}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

export type ModalContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof modalContentVariants> & {
    /** Render without Portal — use inside nested overlays. */
    portalled?: boolean;
    /** Show the default overlay scrim. */
    showOverlay?: boolean;
  };

export const ModalContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(
  (
    {
      className,
      children,
      size = "default",
      portalled = true,
      showOverlay = true,
      onOpenAutoFocus,
      ...props
    },
    ref
  ) => {
    // Overlay + Content must be direct Portal children (not a Fragment) so Radix
    // Presence can keep each mounted through the exit `data-state="closed"` animation.
    const overlay = showOverlay ? <ModalOverlay /> : null;
    const panel = (
      <DialogPrimitive.Content
        ref={ref}
        className={cn(modalContentVariants({ size }), className)}
        onOpenAutoFocus={onOpenAutoFocus}
        {...props}
      >
        <div className="aviala-modal-content__surface">{children}</div>
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
ModalContent.displayName = DialogPrimitive.Content.displayName;

export type ModalHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /** Optional leading status icon */
  icon?: ReactNode;
  /** Show the leading icon slot */
  showIcon?: boolean;
  /** Show the header close control */
  showClose?: boolean;
  closeLabel?: string;
};

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
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
    const locale = useLocaleMessages("Modal");
    const resolvedCloseLabel = closeLabel ?? locale.close;

    return (
      <div ref={ref} className={cn("aviala-modal__header", className)} {...props}>
        <div className="aviala-modal__header-row">
          {showIcon ? renderModalIcon(icon) : null}
          <div className="aviala-modal__header-main">{children}</div>
          {showClose ? (
            <DialogPrimitive.Close asChild>
              <Button
                type="button"
                mode="noBackgroundCustom"
                iconOnly
                aria-label={resolvedCloseLabel}
                className="aviala-modal__close"
                leftIcon={<SymbolWrong aria-hidden />}
              />
            </DialogPrimitive.Close>
          ) : null}
        </div>
      </div>
    );
  }
);
ModalHeader.displayName = "ModalHeader";

export type ModalTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

export const ModalTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  ModalTitleProps
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} asChild {...props}>
    <Typography level="text" className={cn("aviala-modal__title", className)}>
      {children}
    </Typography>
  </DialogPrimitive.Title>
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

export type ModalDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

export const ModalDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  ModalDescriptionProps
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} asChild {...props}>
    <Typography level="caption" className={cn("aviala-modal__description", className)}>
      {children}
    </Typography>
  </DialogPrimitive.Description>
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

/** Convenience wrapper — Figma header Typeface (text + caption). */
export type ModalHeaderTextProps = Omit<ModalHeaderProps, "children"> & {
  title: ReactNode;
  description?: ReactNode;
};

export function ModalHeaderText({
  title,
  description,
  ...props
}: ModalHeaderTextProps) {
  return (
    <ModalHeader {...props}>
      <div className="aviala-modal__header-typeface">
        <ModalTitle>{title}</ModalTitle>
        {description ? <ModalDescription>{description}</ModalDescription> : null}
      </div>
    </ModalHeader>
  );
}

export type ModalBodyProps = HTMLAttributes<HTMLDivElement> & {
  /** Figma `Content=Text` — title + body copy preset */
  layout?: "default" | "text";
  title?: ReactNode;
  description?: ReactNode;
};

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, layout = "default", title, description, ...props }, ref) => (
    <div ref={ref} className={cn("aviala-modal__body", className)} {...props}>
      {layout === "text" ? (
        <Typeface
          className="aviala-modal__body-typeface"
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
ModalBody.displayName = "ModalBody";

export type ModalFooterProps = HTMLAttributes<HTMLDivElement>;

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("aviala-modal__footer", className)} {...props} />
  )
);
ModalFooter.displayName = "ModalFooter";

export { modalContentVariants };
