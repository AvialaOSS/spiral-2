import {
  SymbolInformationCircle,
  SymbolRightCircle,
  SymbolWarningCircle,
  SymbolWrong,
  SymbolWrongCircle,
} from "@aviala/icons";
import { cva, type VariantProps } from "class-variance-authority";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { Link } from "./link";
import { Typeface } from "./typeface";
import { Typography } from "./typography";

/** Figma Components → Response And Feedback → Alert (527:56855) */
export type AlertType = "info" | "warning" | "error" | "success" | "neutral";
export type AlertSize = "default" | "small";
/** Figma `Style` — bordered light surface vs filled secondary surface */
export type AlertAppearance = "default" | "light";

const ALERT_ICON_SIZE = 16;

const alertVariants = cva("aviala-alert", {
  variants: {
    type: {
      info: "aviala-alert--type-info",
      warning: "aviala-alert--type-warning",
      error: "aviala-alert--type-error",
      success: "aviala-alert--type-success",
      neutral: "aviala-alert--type-neutral",
    },
    size: {
      default: "aviala-alert--size-default",
      small: "aviala-alert--size-small",
    },
    appearance: {
      default: "aviala-alert--appearance-default",
      light: "aviala-alert--appearance-light",
    },
  },
  defaultVariants: {
    type: "info",
    size: "default",
    appearance: "default",
  },
});

function renderAlertIcon(node: ReactNode): ReactNode {
  if (!node) return null;
  const content =
    isValidElement(node) && typeof node.type !== "string"
      ? cloneElement(node as ReactElement<{ width?: number; height?: number; className?: string }>, {
          width: ALERT_ICON_SIZE,
          height: ALERT_ICON_SIZE,
          className: cn(
            (node as ReactElement<{ className?: string }>).props.className,
            "shrink-0"
          ),
        })
      : node;

  return (
    <span className="aviala-alert__icon" aria-hidden>
      {content}
    </span>
  );
}

function defaultStatusIcon(type: AlertType): ReactNode {
  const iconProps = { thickness: "Regular" as const, mode: "fill" as const, "aria-hidden": true };

  switch (type) {
    case "info":
    case "neutral":
      return <SymbolInformationCircle {...iconProps} />;
    case "warning":
      return <SymbolWarningCircle {...iconProps} />;
    case "error":
      return <SymbolWrongCircle {...iconProps} />;
    case "success":
      return <SymbolRightCircle {...iconProps} />;
  }
}

export type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    /** Primary line — bold on default size */
    title: ReactNode;
    /** Secondary caption line — default size only */
    description?: ReactNode;
    /** Status icon override */
    icon?: ReactNode;
    /** Show the leading status icon */
    showIcon?: boolean;
    /** Figma `Show Close Button` */
    dismissible?: boolean;
    onDismiss?: (event: MouseEvent<HTMLAnchorElement>) => void;
    closeLabel?: string;
    /** Figma `Show Quick Action` — inline link in body row */
    quickAction?: ReactNode;
    onQuickAction?: (event: MouseEvent<HTMLAnchorElement>) => void;
    /** Figma footer primary action */
    action?: ReactNode;
    onAction?: (event: MouseEvent<HTMLAnchorElement>) => void;
    /** Figma footer secondary action */
    secondaryAction?: ReactNode;
    onSecondaryAction?: (event: MouseEvent<HTMLAnchorElement>) => void;
    /** Figma `Show Action` — footer action row */
    showActions?: boolean;
  };

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      type = "info",
      size = "default",
      appearance = "default",
      title,
      description,
      icon,
      showIcon = true,
      dismissible = true,
      onDismiss,
      closeLabel = "Dismiss alert",
      quickAction,
      onQuickAction,
      action,
      onAction,
      secondaryAction,
      onSecondaryAction,
      showActions = false,
      ...props
    },
    ref
  ) => {
    const isSmall = size === "small";
    const resolvedType = type ?? "info";
    const resolvedRole = resolvedType === "error" ? "alert" : "status";
    const hasActions = showActions && (action || secondaryAction);

    return (
      <div
        ref={ref}
        role={resolvedRole}
        aria-live={resolvedType === "error" ? "assertive" : "polite"}
        className={cn(alertVariants({ type, size, appearance }), className)}
        data-type={resolvedType}
        data-size={size}
        data-appearance={appearance}
        {...props}
      >
        <div className="aviala-alert__body">
          {showIcon ? renderAlertIcon(icon ?? defaultStatusIcon(resolvedType)) : null}

          {isSmall ? (
            <Typography level="text" className="aviala-alert__title">
              {title}
            </Typography>
          ) : (
            <Typeface
              className="aviala-alert__typeface"
              content="textCaption"
              primary={title}
              secondary={description}
            />
          )}

          {quickAction ? (
            <Link
              level="text"
              mode="noBackground"
              href={onQuickAction ? "#" : undefined}
              className="aviala-alert__quick-action"
              onClick={(event) => {
                if (onQuickAction) {
                  event.preventDefault();
                  onQuickAction(event);
                }
              }}
            >
              {quickAction}
            </Link>
          ) : null}

          {dismissible ? (
            <Link
              level="text"
              mode="noBackgroundCustom"
              iconOnly
              href={onDismiss ? "#" : undefined}
              aria-label={closeLabel}
              className="aviala-alert__close"
              leftIcon={<SymbolWrong aria-hidden />}
              onClick={(event) => {
                if (onDismiss) {
                  event.preventDefault();
                  onDismiss(event);
                }
              }}
            />
          ) : null}
        </div>

        {hasActions ? (
          <div className="aviala-alert__actions">
            {action ? (
              <Link
                level="caption"
                mode="noBackground"
                href={onAction ? "#" : undefined}
                className="aviala-alert__action"
                onClick={(event) => {
                  if (onAction) {
                    event.preventDefault();
                    onAction(event);
                  }
                }}
              >
                {action}
              </Link>
            ) : null}
            {secondaryAction ? (
              <Link
                level="caption"
                mode="noBackgroundCustom"
                href={onSecondaryAction ? "#" : undefined}
                className="aviala-alert__action aviala-alert__action--secondary"
                onClick={(event) => {
                  if (onSecondaryAction) {
                    event.preventDefault();
                    onSecondaryAction(event);
                  }
                }}
              >
                {secondaryAction}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { alertVariants };
