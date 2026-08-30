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
  type Ref,
} from "react";
import { useRtl } from "../config";
import { Button } from "./button";
import { Switch, type SwitchProps } from "./switch";
import { Typeface } from "./typeface";
import { typographyVariants } from "./typography";
import { cn } from "../lib/utils";
import { useLocaleMessages } from "../locale";

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
    <div ref={ref} className={cn("aviala-list", className)} {...props}>
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
    <div ref={ref} className={cn("aviala-list-group", className)} role="list" {...props}>
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
  const content = node ?? <GeneralSetting aria-hidden />;

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

type ListItemSharedProps = {
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
  /**
   * Fully custom trailing region — overrides type presets.
   * Pass `null` to hide trailing actions + divider (same as `showTrailing={false}`).
   * For `action` type, the chevron is still shown unless `showChevron={false}`.
   */
  trailing?: ReactNode;
  /**
   * When false, hide trailing actions and the vertical divider.
   * `action` type still shows the chevron unless `showChevron={false}`.
   * Default true.
   */
  showTrailing?: boolean;
  /**
   * Show the trailing chevron for `action` type. Default true when `itemType="action"`.
   */
  showChevron?: boolean;
  /**
   * Show the top hairline on the content row (between items).
   * Default: auto — hidden for the first child in a `ListGroup`, shown otherwise.
   * Set explicitly to force show/hide.
   */
  showTopDivider?: boolean;
  selected?: boolean;
  disabled?: boolean;
  /** Enables hover highlight (auto when `onClick` / `href` is set) */
  interactive?: boolean;
  /** Render as a link — navigates when the row is activated */
  href?: string;
  target?: ComponentPropsWithoutRef<"a">["target"];
  rel?: string;
};

export type ListItemProps = Omit<ComponentPropsWithoutRef<"div">, "title"> &
  ListItemSharedProps;

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
      actionLabel,
      action,
      secondaryAction,
      select,
      switchProps,
      trailing,
      showTrailing = true,
      showChevron,
      showTopDivider,
      selected = false,
      disabled = false,
      interactive,
      href,
      target,
      rel,
      onClick,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("List");
    const rtl = useRtl();
    const ChevronIcon = rtl ? DirectionArrowLeftLight : DirectionArrowRightLight;
    const isInteractive = interactive ?? (onClick != null || href != null);
    const chevronVisible = showChevron ?? itemType === "action";

    const primaryAction =
      action ??
      (actionLabel != null ? (
        <Button mode="primary" size="regular" leftIcon={<GeneralSetting aria-hidden />}>
          {actionLabel}
        </Button>
      ) : null);

    const chevron = chevronVisible ? (
      <span className="aviala-list-item__chevron" aria-hidden>
        <ChevronIcon width={18} height={18} />
      </span>
    ) : null;

    const renderTrailing = () => {
      const hideActions = !showTrailing || trailing === null;

      if (hideActions) {
        // Keep action-type chevron when trailing actions / divider are hidden.
        return chevron && itemType === "action" ? (
          <div className="aviala-list-item__more">{chevron}</div>
        ) : null;
      }
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
                    aria-label={locale.more}
                    leftIcon={<GeneralSetting aria-hidden />}
                  />
                )}
              </div>
              <ListDivider />
              {chevron}
            </div>
          );
        case "switch":
          return (
            <div className="aviala-list-item__trailing">
              {primaryAction}
              <ListDivider />
              <Switch {...switchProps} />
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

    const sharedClassName = cn("aviala-list-item", className);
    const sharedData = {
      "data-leading": leading,
      "data-type": itemType,
      "data-selected": selected ? ("true" as const) : undefined,
      "data-disabled": disabled ? ("true" as const) : undefined,
      "data-interactive": isInteractive ? ("true" as const) : undefined,
      "data-top-divider":
        showTopDivider === undefined
          ? undefined
          : showTopDivider
            ? ("true" as const)
            : ("false" as const),
    };
    const trailingNode = renderTrailing();
    const body = (
      <>
        {renderLeadingIcon(icon, leading)}
        <div className="aviala-list-item__body">
          <div className="aviala-list-item__content">
            <div className="aviala-list-item__head">
              <Typeface content="textCaption" primary={title} secondary={subtitle} />
            </div>
            {trailingNode}
          </div>
        </div>
      </>
    );

    if (href && !disabled) {
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          role="listitem"
          className={sharedClassName}
          href={href}
          target={target}
          rel={rel}
          onClick={onClick as ComponentPropsWithoutRef<"a">["onClick"]}
          {...sharedData}
          {...(props as ComponentPropsWithoutRef<"a">)}
        >
          {body}
        </a>
      );
    }

    return (
      <div
        ref={ref}
        role="listitem"
        className={sharedClassName}
        onClick={disabled ? undefined : onClick}
        {...sharedData}
        {...props}
      >
        {body}
      </div>
    );
  }
);
ListItem.displayName = "ListItem";
