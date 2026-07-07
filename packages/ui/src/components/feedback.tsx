import { cva, type VariantProps } from "class-variance-authority";
import {
  GeneralNotification,
  SymbolInformationCircle,
  SymbolRightCircle,
  SymbolWarningCircle,
  SymbolWrong,
  SymbolWrongCircle,
} from "@aviala-design/icons";
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

/** Figma Components → Response And Feedback → Feedback (553:58620) */
export type FeedbackType = "information" | "warning" | "wrong" | "success" | "normal";
export type FeedbackSize = "default" | "small";
export type FeedbackMode = "default" | "primary";

const FEEDBACK_ICON_SIZE = 22;

const feedbackVariants = cva("aviala-feedback", {
  variants: {
    type: {
      information: "aviala-feedback--type-information",
      warning: "aviala-feedback--type-warning",
      wrong: "aviala-feedback--type-wrong",
      success: "aviala-feedback--type-success",
      normal: "aviala-feedback--type-normal",
    },
    size: {
      default: "aviala-feedback--size-default",
      small: "aviala-feedback--size-small",
    },
    mode: {
      default: "aviala-feedback--mode-default",
      primary: "aviala-feedback--mode-primary",
    },
  },
  defaultVariants: {
    type: "information",
    size: "default",
    mode: "default",
  },
});

function renderFeedbackIcon(node: ReactNode): ReactNode {
  if (!node) return null;
  const content =
    isValidElement(node) && typeof node.type !== "string"
      ? cloneElement(node as ReactElement<{ width?: number; height?: number; className?: string }>, {
          width: FEEDBACK_ICON_SIZE,
          height: FEEDBACK_ICON_SIZE,
          className: cn(
            (node as ReactElement<{ className?: string }>).props.className,
            "shrink-0"
          ),
        })
      : node;

  return (
    <span className="aviala-feedback__icon" aria-hidden>
      {content}
    </span>
  );
}

function defaultStatusIcon(type: FeedbackType, mode: FeedbackMode): ReactNode {
  const iconMode = mode === "primary" ? "fill" : "fill";
  const thickness = "Regular";

  switch (type) {
    case "information":
      return (
        <SymbolInformationCircle thickness={thickness} mode={iconMode} aria-hidden />
      );
    case "warning":
      return <SymbolWarningCircle thickness={thickness} mode={iconMode} aria-hidden />;
    case "wrong":
      return <SymbolWrongCircle thickness={thickness} mode={iconMode} aria-hidden />;
    case "success":
      return <SymbolRightCircle thickness={thickness} mode={iconMode} aria-hidden />;
    case "normal":
      return <GeneralNotification thickness={thickness} mode="default" aria-hidden />;
  }
}

export type FeedbackProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof feedbackVariants> & {
    /** Primary line — bold on default size */
    title: ReactNode;
    /** Secondary caption line — default size only */
    description?: ReactNode;
    /** Status icon override */
    icon?: ReactNode;
    /** Figma `Show Close Button` */
    showClose?: boolean;
    onClose?: (event: MouseEvent<HTMLAnchorElement>) => void;
    closeLabel?: string;
    /** Figma `Show Quick Action` — inline link in body row */
    action?: ReactNode;
    onAction?: (event: MouseEvent<HTMLAnchorElement>) => void;
  };

export const Feedback = forwardRef<HTMLDivElement, FeedbackProps>(
  (
    {
      className,
      type = "information",
      size = "default",
      mode: modeProp = "default",
      title,
      description,
      icon,
      showClose = true,
      onClose,
      closeLabel = "Dismiss",
      action,
      onAction,
      ...props
    },
    ref
  ) => {
    const resolvedType = type ?? "information";
    const resolvedSize = size ?? "default";
    const mode = resolvedType === "normal" ? "default" : (modeProp ?? "default");
    const tone = mode === "primary" ? "white" : "default";
    const isSmall = resolvedSize === "small";
    const resolvedRole = resolvedType === "wrong" ? "alert" : "status";

    return (
      <div
        ref={ref}
        role={resolvedRole}
        aria-live={resolvedType === "wrong" ? "assertive" : "polite"}
        className={cn(
          feedbackVariants({ type: resolvedType, size: resolvedSize, mode }),
          className
        )}
        data-type={resolvedType}
        data-size={resolvedSize}
        data-mode={mode}
        {...props}
      >
        <div className="aviala-feedback__body">
          {renderFeedbackIcon(icon ?? defaultStatusIcon(resolvedType, mode))}

          {isSmall ? (
            <Typography level="text" tone={tone} className="aviala-feedback__title">
              {title}
            </Typography>
          ) : (
            <Typeface
              className="aviala-feedback__typeface"
              content="textCaption"
              primary={title}
              secondary={description}
              tone={tone}
            />
          )}

          {action ? (
            <Link
              level="text"
              mode="noBackground"
              href={onAction ? "#" : undefined}
              className="aviala-feedback__action"
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

          {showClose ? (
            <Link
              level="text"
              mode="noBackgroundCustom"
              iconOnly
              href={onClose ? "#" : undefined}
              aria-label={closeLabel}
              className="aviala-feedback__close"
              leftIcon={<SymbolWrong aria-hidden />}
              onClick={(event) => {
                if (onClose) {
                  event.preventDefault();
                  onClose(event);
                }
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
);
Feedback.displayName = "Feedback";
