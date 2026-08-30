import {
  DirectionArrowLeftLight,
  DirectionArrowRightLight,
  SymbolMore,
} from "@aviala-design/icons";
import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { useRtl } from "../config";
import { cn } from "../lib/utils";
import { useLocaleMessages } from "../locale";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Typography, type TypographyLevel } from "./typography";

/** Figma Components → Structure Navigation → Breadcrumb (622:7883) */
export type BreadcrumbSize = "default" | "small";

const BreadcrumbSizeContext = createContext<BreadcrumbSize>("default");

function breadcrumbTypeLevel(size: BreadcrumbSize): TypographyLevel {
  /* Figma: Default → Typography Text; Small → Typography Caption */
  return size === "small" ? "caption" : "text";
}

const breadcrumbVariants = cva("aviala-breadcrumb", {
  variants: {
    size: {
      default: "aviala-breadcrumb--size-default",
      small: "aviala-breadcrumb--size-small",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type BreadcrumbProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof breadcrumbVariants>;

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, size = "default", children, ...props }, ref) => {
    const locale = useLocaleMessages("Breadcrumb");
    const resolvedSize = size ?? "default";
    return (
      <BreadcrumbSizeContext.Provider value={resolvedSize}>
        <nav
          ref={ref}
          aria-label={props["aria-label"] ?? locale.label}
          className={cn(breadcrumbVariants({ size: resolvedSize }), className)}
          data-size={resolvedSize}
          {...props}
        >
          <ol className="aviala-breadcrumb__list">{children}</ol>
        </nav>
      </BreadcrumbSizeContext.Provider>
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";

export type BreadcrumbItemProps = ComponentPropsWithoutRef<"li"> & {
  href?: string;
  current?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
};

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  (
    { className, href, current = false, icon, onClick, children, ...props },
    ref
  ) => {
    const size = useContext(BreadcrumbSizeContext);
    const label = (
      <>
        {icon ? (
          <span className="aviala-breadcrumb-item__icon">{icon}</span>
        ) : null}
        {children != null ? (
          <Typography
            level={breadcrumbTypeLevel(size)}
            as="span"
            className="aviala-breadcrumb-item__label"
          >
            {children}
          </Typography>
        ) : null}
      </>
    );

    return (
      <li
        ref={ref}
        className={cn("aviala-breadcrumb-item-wrap", className)}
        {...props}
      >
        {href != null ? (
          <a
            href={href}
            className="aviala-breadcrumb-item aviala-focus-ring"
            data-current={current ? "true" : undefined}
            aria-current={current ? "page" : undefined}
          >
            {label}
          </a>
        ) : onClick != null ? (
          <button
            type="button"
            className="aviala-breadcrumb-item aviala-focus-ring"
            data-current={current ? "true" : undefined}
            aria-current={current ? "page" : undefined}
            onClick={onClick}
          >
            {label}
          </button>
        ) : (
          <span
            className="aviala-breadcrumb-item"
            data-current={current ? "true" : undefined}
            aria-current={current ? "page" : undefined}
          >
            {label}
          </span>
        )}
      </li>
    );
  }
);
BreadcrumbItem.displayName = "BreadcrumbItem";

export type BreadcrumbSeparatorProps = HTMLAttributes<HTMLLIElement> & {
  children?: ReactNode;
};

export const BreadcrumbSeparator = forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ className, children = "/", ...props }, ref) => {
  const size = useContext(BreadcrumbSizeContext);
  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden
      className={cn("aviala-breadcrumb-separator", className)}
      {...props}
    >
      <Typography level={breadcrumbTypeLevel(size)} as="span">
        {children}
      </Typography>
    </li>
  );
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export type BreadcrumbEllipsisItemProps = Omit<
  ComponentPropsWithoutRef<"a">,
  "type"
> & {
  href?: string;
  onClick?: () => void;
  /** Figma Select Menu Item trailing chevron — default true */
  showChevron?: boolean;
};

/** Figma Select Menu Item inside Storage item button activated=ON */
export const BreadcrumbEllipsisItem = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  BreadcrumbEllipsisItemProps
>(
  (
    { className, href, onClick, showChevron = true, children, ...props },
    ref
  ) => {
    const rtl = useRtl();
    const ChevronIcon = rtl
      ? DirectionArrowLeftLight
      : DirectionArrowRightLight;
    const content = (
      <>
        <Typography
          level="text"
          as="span"
          className="aviala-breadcrumb-ellipsis-item__label"
        >
          {children}
        </Typography>
        {showChevron ? (
          <span
            className="aviala-breadcrumb-ellipsis-item__chevron"
            aria-hidden
          >
            <ChevronIcon width={14} height={14} thickness="Light" />
          </span>
        ) : null}
      </>
    );

    if (href != null) {
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          className={cn(
            "aviala-breadcrumb-ellipsis-item aviala-focus-ring",
            className
          )}
          onClick={onClick}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        className={cn(
          "aviala-breadcrumb-ellipsis-item aviala-focus-ring",
          className
        )}
        onClick={onClick}
        {...(props as ComponentPropsWithoutRef<"button">)}
      >
        {content}
      </button>
    );
  }
);
BreadcrumbEllipsisItem.displayName = "BreadcrumbEllipsisItem";

export type BreadcrumbEllipsisProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "type"
> & {
  className?: string;
  /**
   * Figma `activated` on Storage item button.
   * OFF = muted ellipsis; ON = full opacity + open Select Menu (when `menu` is set).
   */
  activated?: boolean;
  defaultActivated?: boolean;
  onActivatedChange?: (activated: boolean) => void;
  /** Collapsed middle-path items shown in the Select Menu when activated */
  menu?: ReactNode;
};

/** Figma `Storage item button` — collapsed middle path */
export const BreadcrumbEllipsis = forwardRef<
  HTMLLIElement,
  BreadcrumbEllipsisProps
>(
  (
    {
      className,
      children,
      activated: activatedProp,
      defaultActivated = false,
      onActivatedChange,
      menu,
      onClick,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("Breadcrumb");
    const size = useContext(BreadcrumbSizeContext);
    const [uncontrolledActivated, setUncontrolledActivated] =
      useState(defaultActivated);
    const isControlled = activatedProp !== undefined;
    const activated = isControlled
      ? Boolean(activatedProp)
      : uncontrolledActivated;

    const setActivated = useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledActivated(next);
        onActivatedChange?.(next);
      },
      [isControlled, onActivatedChange]
    );

    /* Figma Small Storage item button still uses 14px SymbolMore */
    const iconSize = 14;
    const icon = children ?? (
      <SymbolMore
        width={iconSize}
        height={iconSize}
        thickness="Light"
        aria-hidden
      />
    );

    const trigger = (
      <button
        type="button"
        className="aviala-breadcrumb-ellipsis aviala-focus-ring"
        data-size={size}
        data-activated={activated ? "true" : undefined}
        aria-label={ariaLabel ?? locale.showMore}
        aria-expanded={menu != null ? activated : undefined}
        aria-haspopup={menu != null ? "menu" : undefined}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (menu == null) setActivated(!activated);
        }}
        {...props}
      >
        {icon}
      </button>
    );

    return (
      <li
        ref={ref}
        className={cn("aviala-breadcrumb-ellipsis-wrap", className)}
      >
        {menu != null ? (
          <Popover open={activated} onOpenChange={setActivated}>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent
              className="aviala-breadcrumb-ellipsis-menu"
              align="center"
              side="bottom"
              sideOffset={7}
              showArrow={false}
              role="menu"
            >
              <div className="aviala-breadcrumb-ellipsis-menu__items">
                {menu}
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          trigger
        )}
      </li>
    );
  }
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";
