import {
  DirectionArrowRightLight,
  GeneralSetting,
} from "@aviala/icons";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { Button } from "./button";
import { Switch, type SwitchProps } from "./switch";
import { Typeface } from "./typeface";
import { typographyVariants } from "./typography";
import { cn } from "../lib/utils";

/** Figma List item `Type` variant (738:148304, 647:87555) */
export type ListItemType = "action" | "switch" | "select";

/** Figma List item `left icon setting` variant */
export type ListItemLeading = "shaped" | "default" | "none";

export type ListProps = HTMLAttributes<HTMLDivElement> & {
  /** Optional section title above the list card */
  title?: ReactNode;
};

/** Figma Structure Navigation → List root */
export const List = forwardRef<HTMLDivElement, ListProps>(
  ({ className, title, children, ...props }, ref) => (
    <div ref={ref} className={cn("aviala-list", className)} role="list" {...props}>
      {title != null ? <ListTitle>{title}</ListTitle> : null}
      <ListGroup>{children}</ListGroup>
    </div>
  )
);
List.displayName = "List";

export type ListTitleProps = HTMLAttributes<HTMLDivElement>;

/** Figma List title row — Typography text level */
export const ListTitle = forwardRef<HTMLDivElement, ListTitleProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("aviala-list-title", className)} {...props}>
      <span className={cn(typographyVariants({ level: "text" }))}>{children}</span>
    </div>
  )
);
ListTitle.displayName = "ListTitle";

export type ListGroupProps = HTMLAttributes<HTMLDivElement>;

/** Figma List card container — rounded white surface for items */
export const ListGroup = forwardRef<HTMLDivElement, ListGroupProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("aviala-list-group", className)} {...props}>
      {children}
    </div>
  )
);
ListGroup.displayName = "ListGroup";

export type ListItemGroupProps = {
  label?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Convenience wrapper — titled list section (Figma List title + card) */
export function ListItemGroup({ label, children, className }: ListItemGroupProps) {
  return (
    <div className={cn("aviala-list", className)}>
      {label != null ? <ListTitle>{label}</ListTitle> : null}
      <ListGroup>{children}</ListGroup>
    </div>
  );
}

export type ListDividerProps = HTMLAttributes<HTMLSpanElement>;

/** Vertical divider between trailing actions (Figma `last` separator) */
export const ListDivider = forwardRef<HTMLSpanElement, ListDividerProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("aviala-list-item__divider", className)}
      aria-hidden
      {...props}
    />
  )
);
ListDivider.displayName = "ListDivider";

export type ListSeparatorProps = HTMLAttributes<HTMLHRElement>;

/** Horizontal separator between list groups */
export const ListSeparator = forwardRef<HTMLHRElement, ListSeparatorProps>(
  ({ className, ...props }, ref) => (
    <hr ref={ref} className={cn("aviala-list-separator", className)} {...props} />
  )
);
ListSeparator.displayName = "ListSeparator";

function renderLeadingIcon(node: ReactNode, leading: ListItemLeading): ReactNode {
  if (leading === "none") return null;

  const iconSize = leading === "shaped" ? 20 : 22;
  const content =
    node ??
    (leading === "shaped" ? (
      <GeneralSetting aria-hidden />
    ) : (
      <GeneralSetting aria-hidden />
    ));

  const rendered =
    isValidElement(content) && typeof content.type !== "string"
      ? cloneElement(content as ReactElement<{ width?: number; height?: number; className?: string }>, {
          width: iconSize,
          height: iconSize,
          className: cn(
            (content as ReactElement<{ className?: string }>).props.className,
            "shrink-0"
          ),
        })
      : content;

  return (
    <span className="aviala-list-item__icon">
      <span
        className={cn(
          leading === "shaped"
            ? "aviala-list-item__icon--shaped"
            : "aviala-list-item__icon--default"
        )}
      >
        {rendered}
      </span>
    </span>
  );
}

export type ListItemProps = ComponentPropsWithoutRef<"div"> & {
  /** Figma `Type` variant */
  itemType?: ListItemType;
  /** Figma `left icon setting` variant */
  leading?: ListItemLeading;
  /** Leading icon node — defaults to GeneralSetting */
  icon?: ReactNode;
  /** Primary line (Typeface text) */
  title: ReactNode;
  /** Secondary line (Typeface caption) */
  subtitle?: ReactNode;
  /** Primary trailing button label */
  actionLabel?: ReactNode;
  /** Override primary trailing button */
  action?: ReactNode;
  /** Secondary icon-only button for `action` type */
  secondaryAction?: ReactNode;
  /** Trailing select slot for `select` type */
  select?: ReactNode;
  /** Trailing switch props for `switch` type */
  switchProps?: Omit<SwitchProps, "size">;
  /** Fully custom trailing region — overrides type presets */
  trailing?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  /** Enables hover highlight (auto when `onClick` is set) */
  interactive?: boolean;
};

/** Figma Structure Navigation → List item */
export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      className,
      itemType = "select",
      leading = "shaped",
      icon,
      title,
      subtitle,
      actionLabel = "Text",
      action,
      secondaryAction,
      select,
      switchProps,
      trailing,
      selected = false,
      disabled = false,
      interactive,
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = interactive ?? onClick != null;

    const primaryAction =
      action ??
      (
        <Button mode="primary" size="regular" leftIcon={<GeneralSetting aria-hidden />}>
          {actionLabel}
        </Button>
      );

    const renderTrailing = () => {
      if (trailing !== undefined) return trailing;

      switch (itemType) {
        case "action":
          return (
            <div className="aviala-list-item__more">
              <div className="aviala-list-item__trailing">
                {primaryAction}
                {secondaryAction ?? (
                  <Button
                    mode="default"
                    size="regular"
                    iconOnly
                    aria-label="More"
                    leftIcon={<GeneralSetting aria-hidden />}
                  />
                )}
              </div>
              <ListDivider />
              <span className="aviala-list-item__chevron" aria-hidden>
                <DirectionArrowRightLight width={18} height={18} />
              </span>
            </div>
          );
        case "switch":
          return (
            <div className="aviala-list-item__trailing">
              {primaryAction}
              <ListDivider />
              <Switch defaultChecked {...switchProps} />
            </div>
          );
        case "select":
        default:
          return (
            <div className="aviala-list-item__trailing">
              {primaryAction}
              <ListDivider />
              <span className="aviala-list-item__select">{select}</span>
            </div>
          );
      }
    };

    return (
      <div
        ref={ref}
        role="listitem"
        className={cn("aviala-list-item", className)}
        data-leading={leading}
        data-type={itemType}
        data-selected={selected ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        data-interactive={isInteractive ? "true" : undefined}
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {renderLeadingIcon(icon, leading)}
        <div className="aviala-list-item__body">
          <div className="aviala-list-item__content">
            <div className="aviala-list-item__head">
              <Typeface content="textCaption" primary={title} secondary={subtitle} />
            </div>
            {renderTrailing()}
          </div>
        </div>
      </div>
    );
  }
);
ListItem.displayName = "ListItem";
