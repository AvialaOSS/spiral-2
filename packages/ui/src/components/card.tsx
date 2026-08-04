import {
  DirectionArrowLeftLight,
  DirectionArrowRightLight,
  GeneralSetting,
} from "@aviala-design/icons";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { useRtl } from "../config";
import { cn } from "../lib/utils";
import { useLocaleMessages } from "../locale";
import { Button } from "./button";
import { Switch, type SwitchProps } from "./switch";
import { Typeface } from "./typeface";
import { Typography } from "./typography";

/** Figma Components → Structure Navigation → Card (738:145715) */
export type CardSlotType = "action" | "switch" | "select";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("aviala-card", className)} {...props}>
      {children}
    </div>
  )
);
Card.displayName = "Card";

function renderCardIcon(node: ReactNode): ReactNode {
  if (!node) return null;
  const content =
    isValidElement(node) && typeof node.type !== "string"
      ? cloneElement(node as ReactElement<{ width?: number; height?: number; className?: string }>, {
          width: 14,
          height: 14,
          className: cn(
            (node as ReactElement<{ className?: string }>).props.className,
            "shrink-0"
          ),
        })
      : node;

  return <span className="aviala-card-head__icon">{content}</span>;
}

export type CardHeadProps = ComponentPropsWithoutRef<"div"> & {
  slotType?: CardSlotType;
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actionLabel?: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  select?: ReactNode;
  switchProps?: Omit<SwitchProps, "size">;
  trailing?: ReactNode;
};

export const CardHead = forwardRef<HTMLDivElement, CardHeadProps>(
  (
    {
      className,
      slotType = "select",
      icon,
      title,
      description,
      actionLabel = "Text",
      action,
      secondaryAction,
      select,
      switchProps,
      trailing,
      children,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("Card");
    const rtl = useRtl();
    const ChevronIcon = rtl ? DirectionArrowLeftLight : DirectionArrowRightLight;
    const primaryAction =
      action ??
      (
        <Button mode="primary" size="regular" leftIcon={<GeneralSetting aria-hidden />}>
          {actionLabel}
        </Button>
      );

    const renderTrailing = () => {
      if (trailing !== undefined) return trailing;

      switch (slotType) {
        case "action":
          return (
            <div className="aviala-card-head__trailing">
              {primaryAction}
              {secondaryAction ?? (
                <Button
                  mode="default"
                  size="regular"
                  iconOnly
                  aria-label={locale.more}
                  leftIcon={<GeneralSetting aria-hidden />}
                />
              )}
              <span className="aviala-card__divider" aria-hidden />
              <ChevronIcon width={14} height={14} aria-hidden />
            </div>
          );
        case "switch":
          return (
            <div className="aviala-card-head__trailing">
              {primaryAction}
              <span className="aviala-card__divider" aria-hidden />
              <Switch {...switchProps} />
            </div>
          );
        case "select":
        default:
          return select != null ? (
            <div className="aviala-card-head__trailing">{select}</div>
          ) : null;
      }
    };

    return (
      <div
        ref={ref}
        className={cn("aviala-card-head", className)}
        data-type={slotType}
        {...props}
      >
        <div className="aviala-card-head__main">
          {/* Figma Card item head always includes a leading icon slot */}
          {renderCardIcon(icon ?? <GeneralSetting aria-hidden />)}
          <div className="aviala-card-head__title">
            {title != null || description != null ? (
              <Typeface content="textCaption" primary={title} secondary={description} />
            ) : (
              children
            )}
          </div>
        </div>
        {renderTrailing()}
      </div>
    );
  }
);
CardHead.displayName = "CardHead";

export type CardBodyProps = HTMLAttributes<HTMLDivElement>;

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("aviala-card-body", className)} {...props}>
      <div className="aviala-card-body__content">
        {typeof children === "string" || typeof children === "number" ? (
          <Typography level="text" as="span">
            {children}
          </Typography>
        ) : (
          children
        )}
      </div>
    </div>
  )
);
CardBody.displayName = "CardBody";

export type CardBottomProps = ComponentPropsWithoutRef<"div"> & {
  slotType?: CardSlotType;
  actionLabel?: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  select?: ReactNode;
  switchProps?: Omit<SwitchProps, "size">;
  trailing?: ReactNode;
};

export const CardBottom = forwardRef<HTMLDivElement, CardBottomProps>(
  (
    {
      className,
      slotType = "action",
      actionLabel = "Text",
      action,
      secondaryAction,
      select,
      switchProps,
      trailing,
      children,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("Card");
    const rtl = useRtl();
    const ChevronIcon = rtl ? DirectionArrowLeftLight : DirectionArrowRightLight;
    const primaryAction =
      action ??
      (
        <Button mode="primary" size="regular" leftIcon={<GeneralSetting aria-hidden />}>
          {actionLabel}
        </Button>
      );

    const renderTrailing = () => {
      if (trailing !== undefined) return trailing;
      if (children != null) return children;

      switch (slotType) {
        case "switch":
          return (
            <>
              {primaryAction}
              <span className="aviala-card__divider" aria-hidden />
              <Switch {...switchProps} />
            </>
          );
        case "select":
          return select;
        case "action":
        default:
          return (
            <>
              {primaryAction}
              {secondaryAction ?? (
                <Button
                  mode="default"
                  size="regular"
                  iconOnly
                  aria-label={locale.more}
                  leftIcon={<GeneralSetting aria-hidden />}
                />
              )}
              <span className="aviala-card__divider" aria-hidden />
              <ChevronIcon width={14} height={14} aria-hidden />
            </>
          );
      }
    };

    return (
      <div
        ref={ref}
        className={cn("aviala-card-bottom", className)}
        data-type={slotType}
        {...props}
      >
        <div className="aviala-card-bottom__trailing">{renderTrailing()}</div>
      </div>
    );
  }
);
CardBottom.displayName = "CardBottom";
