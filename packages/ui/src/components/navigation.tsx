import * as PopoverPrimitive from "@radix-ui/react-popover";

import { Slot } from "@radix-ui/react-slot";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import { cloneAvialaIconElement } from "../lib/clone-aviala-icon";

import { cn } from "../lib/utils";

import { useThemeLayoutKey } from "../theme/theme-provider";

import { buttonVariants, type ButtonMode } from "./button";

import { Popover } from "./popover";

import { Typography } from "./typography";

function navigationItemButtonMode(active: boolean): ButtonMode {
  return active ? "second" : "noBackgroundCustom";
}

/** Figma Navigation `Background` variant (624:61777) */

export type NavigationBackground = "none" | "default";

/** Figma Navigation `direction` variant */

export type NavigationDirection = "horizontal" | "vertical";

const NavigationDirectionContext =
  createContext<NavigationDirection>("vertical");

function useNavigationDirection() {
  return useContext(NavigationDirectionContext);
}

type IndicatorMetrics = {
  x: number;

  y: number;

  width: number;

  height: number;

  visible: boolean;
};

const NAVIGATION_ANIMATION_MS_FALLBACK = 300;

const NAVIGATION_ANIMATION_EASING_FALLBACK = "cubic-bezier(0.33, 1, 0.68, 1)";

function parseDurationMs(value: string): number {
  const trimmed = value.trim();

  if (!trimmed) return NAVIGATION_ANIMATION_MS_FALLBACK;

  if (trimmed.endsWith("ms"))
    return parseFloat(trimmed) || NAVIGATION_ANIMATION_MS_FALLBACK;

  if (trimmed.endsWith("s")) {
    return (parseFloat(trimmed) || 0.3) * 1000;
  }

  const parsed = parseFloat(trimmed);

  return Number.isFinite(parsed) ? parsed : NAVIGATION_ANIMATION_MS_FALLBACK;
}

function getNavigationAnimationTiming(el: HTMLElement) {
  const style = getComputedStyle(el);

  const durationMs = parseDurationMs(
    style.getPropertyValue("--navigation-transition-duration")
  );

  const easing =
    style.getPropertyValue("--navigation-transition-easing").trim() ||
    NAVIGATION_ANIMATION_EASING_FALLBACK;

  return { durationMs, easing };
}

function readIndicatorToken(el: HTMLElement, name: string, fallback: number) {
  const value = getComputedStyle(el).getPropertyValue(name).trim();

  const parsed = parseFloat(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function isInsideCollapsedGroup(item: HTMLElement): boolean {
  return (
    item.closest('.aviala-navigation-item-group[data-expanded="false"]') !== null
  );
}

function findActiveNavigationItem(group: HTMLElement): HTMLElement | null {
  const activeItems = Array.from(
    group.querySelectorAll<HTMLElement>(
      '.aviala-navigation-item[data-active="true"]'
    )
  ).filter((item) => !isInsideCollapsedGroup(item));

  if (activeItems.length === 0) return null;

  const activeChild = activeItems.find(
    (item) => item.getAttribute("data-item-type") === "child"
  );

  return activeChild ?? activeItems[0]!;
}

function measureNavigationIndicator(
  group: HTMLElement,

  direction: NavigationDirection
): IndicatorMetrics | null {
  const item = findActiveNavigationItem(group);

  if (!item) {
    return { x: 0, y: 0, width: 0, height: 0, visible: false };
  }

  const groupRect = group.getBoundingClientRect();

  const itemRect = item.getBoundingClientRect();

  const railLeft = readIndicatorToken(group, "--navigation-rail-left", 1);

  const railInset = readIndicatorToken(group, "--navigation-rail-inset", 6);

  const railWidth = readIndicatorToken(group, "--navigation-rail-width", 3);

  const horizontalWidth = readIndicatorToken(
    group,

    "--navigation-indicator-width-horizontal",

    50
  );

  if (direction === "vertical") {
    let inset = railInset;

    // Grow / shrink the rail on the active item only (hover taller, press shorter).
    if (item.matches(":active")) {
      inset = readIndicatorToken(group, "--navigation-rail-inset-press", 9);
    } else if (item.matches(":hover")) {
      inset = readIndicatorToken(group, "--navigation-rail-inset-hover", 3);
    }

    return {
      x: railLeft,

      y: itemRect.top - groupRect.top + inset,

      width: railWidth,

      height: Math.max(0, itemRect.height - inset * 2),

      visible: true,
    };
  }

  const itemCenterX = itemRect.left + itemRect.width / 2;

  return {
    x: itemCenterX - groupRect.left - horizontalWidth / 2,

    y: itemRect.bottom - groupRect.top - railWidth,

    width: horizontalWidth,

    height: railWidth,

    visible: true,
  };
}

function resetIndicatorMotion(el: HTMLSpanElement) {
  el.getAnimations().forEach((animation) => animation.cancel());
}

function applyIndicatorMetrics(
  el: HTMLSpanElement,

  metrics: IndicatorMetrics,

  instant = false
) {
  resetIndicatorMotion(el);

  if (instant) {
    el.setAttribute("data-instant", "true");
  }

  el.style.width = `${metrics.width}px`;

  el.style.height = `${metrics.height}px`;

  el.style.transform = `translate(${metrics.x}px, ${metrics.y}px)`;

  el.dataset.visible = metrics.visible ? "true" : "false";

  if (instant) {
    void el.offsetWidth;

    el.removeAttribute("data-instant");
  }
}

function measureIndicatorFromElement(
  indicatorEl: HTMLElement,

  groupEl: HTMLElement
): IndicatorMetrics {
  const groupRect = groupEl.getBoundingClientRect();

  const indicatorRect = indicatorEl.getBoundingClientRect();

  return {
    x: indicatorRect.left - groupRect.left,

    y: indicatorRect.top - groupRect.top,

    width: indicatorRect.width,

    height: indicatorRect.height,

    visible: indicatorEl.dataset.visible === "true",
  };
}

/** Matches the `--navigation-transition-easing` fallback cubic-bezier(0.33, 1, 0.68, 1). */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function metricsApproxEqual(
  a: IndicatorMetrics,
  b: IndicatorMetrics,
  epsilon = 0.5
) {
  return (
    Math.abs(a.x - b.x) < epsilon &&
    Math.abs(a.y - b.y) < epsilon &&
    Math.abs(a.width - b.width) < epsilon &&
    Math.abs(a.height - b.height) < epsilon &&
    a.visible === b.visible
  );
}

function runIndicatorAnimation(
  el: HTMLSpanElement,
  group: HTMLElement,
  start: IndicatorMetrics,
  next: IndicatorMetrics,
  durationMs: number,
  easing: string,
  generation: number,
  animationGenerationRef: RefObject<number>,
  animationRef: RefObject<Animation | null>,
  isAnimatingRef: RefObject<boolean>,
  syncIndicator: (metrics: IndicatorMetrics, instant?: boolean) => void
) {
  animationRef.current?.cancel();
  animationRef.current = null;
  isAnimatingRef.current = false;

  if (metricsApproxEqual(start, next)) {
    syncIndicator(next, true);
    return;
  }

  isAnimatingRef.current = true;
  applyIndicatorMetrics(el, start, true);
  el.setAttribute("data-instant", "true");

  const animation = el.animate(
    [
      {
        transform: `translate(${start.x}px, ${start.y}px)`,
        width: `${start.width}px`,
        height: `${start.height}px`,
      },
      {
        transform: `translate(${next.x}px, ${next.y}px)`,
        width: `${next.width}px`,
        height: `${next.height}px`,
      },
    ],
    {
      duration: durationMs,
      easing,
      fill: "forwards",
    }
  );

  animationRef.current = animation;

  const finish = () => {
    if (generation !== animationGenerationRef.current) return;

    animationRef.current = null;
    isAnimatingRef.current = false;
    el.removeAttribute("data-instant");
    syncIndicator(next, true);
  };

  animation.addEventListener("finish", finish, { once: true });

  return () => {
    animation.removeEventListener("finish", finish);
  };
}

function useNavigationIndicator(
  groupRef: RefObject<HTMLDivElement | null>,

  direction: NavigationDirection,

  layoutKey: string | null
) {
  const indicatorRef = useRef<HTMLSpanElement | null>(null);

  const metricsRef = useRef<IndicatorMetrics | null>(null);

  const animationRef = useRef<Animation | null>(null);

  const animationGenerationRef = useRef(0);

  const isAnimatingRef = useRef(false);

  const layoutTrackingFrameRef = useRef<number | null>(null);

  const isLayoutTrackingRef = useRef(false);

  const isInitialMount = useRef(true);
  const [activeRevision, setActiveRevision] = useState(0);

  const measureIndicator = useCallback((): IndicatorMetrics | null => {
    const group = groupRef.current;

    if (!group) return null;

    return measureNavigationIndicator(group, direction);
  }, [direction, groupRef]);

  const syncIndicator = useCallback(
    (metrics: IndicatorMetrics, instant = false) => {
      metricsRef.current = metrics;

      const el = indicatorRef.current;

      if (el) applyIndicatorMetrics(el, metrics, instant);
    },
    []
  );

  const cancelLayoutTracking = useCallback(() => {
    if (layoutTrackingFrameRef.current != null) {
      cancelAnimationFrame(layoutTrackingFrameRef.current);
      layoutTrackingFrameRef.current = null;
    }

    isLayoutTrackingRef.current = false;
  }, []);

  const remeasureIndicator = useCallback(() => {
    if (isLayoutTrackingRef.current) return;

    const metrics = measureIndicator();

    if (!metrics) return;

    animationRef.current?.cancel();

    animationRef.current = null;

    isAnimatingRef.current = false;

    syncIndicator(metrics, true);
  }, [measureIndicator, syncIndicator]);

  /**
   * While a child group's grid transition reflows the layout, tween the
   * indicator from its current visual position toward a live re-measured
   * target. Measuring the final position up-front is wrong (the layout has
   * not moved yet when `data-expanded` flips), which used to make the
   * indicator snap without animation once the transition ended.
   */
  const startExpandCollapseTracking = useCallback(() => {
    const group = groupRef.current;
    const el = indicatorRef.current;

    if (!group || !el) return;

    cancelLayoutTracking();

    animationRef.current?.cancel();
    animationRef.current = null;
    isAnimatingRef.current = false;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      const metrics = measureIndicator();
      if (metrics) syncIndicator(metrics, true);
      return;
    }

    const { durationMs } = getNavigationAnimationTiming(group);

    // Capture the start in viewport coordinates: when a horizontal group
    // resizes, the whole navigation group can shift, so group-relative
    // start metrics would ride along with the moving origin.
    const startRect = el.getBoundingClientRect();
    const startVisible = el.dataset.visible === "true";
    const startTime = performance.now();

    isLayoutTrackingRef.current = true;

    const finish = () => {
      layoutTrackingFrameRef.current = null;
      isLayoutTrackingRef.current = false;
      const final = measureIndicator();
      if (final) syncIndicator(final, true);
    };

    const tick = (now: number) => {
      if (!isLayoutTrackingRef.current) return;

      const progress = Math.min(1, (now - startTime) / durationMs);

      if (progress >= 1) {
        finish();
        return;
      }

      const target = measureIndicator();

      if (target) {
        if (!startVisible || !target.visible) {
          syncIndicator(target, true);
        } else {
          const eased = easeOutCubic(progress);
          const groupRect = group.getBoundingClientRect();
          const targetAbsX = groupRect.left + target.x;
          const targetAbsY = groupRect.top + target.y;

          syncIndicator(
            {
              x:
                startRect.left +
                (targetAbsX - startRect.left) * eased -
                groupRect.left,
              y:
                startRect.top +
                (targetAbsY - startRect.top) * eased -
                groupRect.top,
              width: startRect.width + (target.width - startRect.width) * eased,
              height:
                startRect.height + (target.height - startRect.height) * eased,
              visible: true,
            },
            true
          );
        }
      }

      layoutTrackingFrameRef.current = requestAnimationFrame(tick);
    };

    layoutTrackingFrameRef.current = requestAnimationFrame(tick);
  }, [cancelLayoutTracking, groupRef, measureIndicator, syncIndicator]);

  const onIndicatorRef = useCallback((node: HTMLSpanElement | null) => {
    indicatorRef.current = node;

    if (node && metricsRef.current && isInitialMount.current) {
      applyIndicatorMetrics(node, metricsRef.current, true);

      isInitialMount.current = false;
    }
  }, []);

  useLayoutEffect(() => {
    const group = groupRef.current;

    const next = measureIndicator();

    if (!next) return;

    const el = indicatorRef.current;

    if (isInitialMount.current) {
      metricsRef.current = next;

      if (el) {
        applyIndicatorMetrics(el, next, true);

        isInitialMount.current = false;
      }

      return;
    }

    if (isLayoutTrackingRef.current) return;

    if (!el || !group) {
      syncIndicator(next, true);

      return;
    }

    const generation = ++animationGenerationRef.current;

    const hadActiveAnimation = animationRef.current != null;

    const start =
      hadActiveAnimation || isAnimatingRef.current
        ? measureIndicatorFromElement(el, group)
        : metricsRef.current ?? next;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      syncIndicator(next, true);
      return;
    }

    const { durationMs, easing } = getNavigationAnimationTiming(el);

    return (
      runIndicatorAnimation(
        el,
        group,
        start,
        next,
        durationMs,
        easing,
        generation,
        animationGenerationRef,
        animationRef,
        isAnimatingRef,
        syncIndicator
      ) ?? undefined
    );
  }, [
    activeRevision,
    direction,
    layoutKey,
    measureIndicator,
    syncIndicator,
    groupRef,
  ]);

  useLayoutEffect(() => {
    const group = groupRef.current;

    if (!group) return;

    const observer = new MutationObserver((mutations) => {
      const expandCollapseChanged = mutations.some(
        (mutation) =>
          mutation.type === "attributes" &&
          mutation.attributeName === "data-expanded" &&
          mutation.target instanceof HTMLElement
      );

      if (expandCollapseChanged) {
        startExpandCollapseTracking();
      }

      setActiveRevision((revision) => revision + 1);
    });

    observer.observe(group, {
      subtree: true,

      attributes: true,

      attributeFilter: ["data-active", "data-expanded"],

      childList: true,
    });

    const resizeObserver = new ResizeObserver(() => {
      remeasureIndicator();
    });

    resizeObserver.observe(group);

    group
      .querySelectorAll<HTMLElement>(
        ".aviala-navigation-item-group__inner"
      )
      .forEach((inner) => {
        resizeObserver.observe(inner);
      });

    const onTransitionEnd = (event: TransitionEvent) => {
      if (
        event.propertyName !== "grid-template-rows" &&
        event.propertyName !== "width"
      ) {
        return;
      }
      if (!(event.target instanceof HTMLElement)) return;
      if (!event.target.classList.contains("aviala-navigation-item-group")) {
        return;
      }

      cancelLayoutTracking();
      animationRef.current?.cancel();
      animationRef.current = null;
      isAnimatingRef.current = false;

      const metrics = measureIndicator();
      if (metrics) syncIndicator(metrics, true);
    };

    group.addEventListener("transitionend", onTransitionEnd);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      group.removeEventListener("transitionend", onTransitionEnd);
      cancelLayoutTracking();
    };
  }, [
    cancelLayoutTracking,
    groupRef,
    measureIndicator,
    remeasureIndicator,
    startExpandCollapseTracking,
    syncIndicator,
  ]);

  // Vertical rail: resize when hovering / pressing the active item.
  useEffect(() => {
    if (direction !== "vertical") return;

    const group = groupRef.current;
    if (!group) return;

    const refreshInteractionMetrics = () => {
      if (isLayoutTrackingRef.current || isAnimatingRef.current) return;

      const metrics = measureIndicator();
      if (!metrics) return;
      if (metricsRef.current && metricsApproxEqual(metrics, metricsRef.current)) {
        return;
      }

      syncIndicator(metrics, false);
    };

    group.addEventListener("pointerover", refreshInteractionMetrics);
    group.addEventListener("pointerout", refreshInteractionMetrics);
    group.addEventListener("pointerdown", refreshInteractionMetrics);
    group.addEventListener("pointerup", refreshInteractionMetrics);
    group.addEventListener("pointercancel", refreshInteractionMetrics);

    return () => {
      group.removeEventListener("pointerover", refreshInteractionMetrics);
      group.removeEventListener("pointerout", refreshInteractionMetrics);
      group.removeEventListener("pointerdown", refreshInteractionMetrics);
      group.removeEventListener("pointerup", refreshInteractionMetrics);
      group.removeEventListener("pointercancel", refreshInteractionMetrics);
    };
  }, [direction, groupRef, measureIndicator, syncIndicator]);

  return onIndicatorRef;
}

/** Figma Structure Navigation → Navigation root (624:92194) */

export type NavigationProps = HTMLAttributes<HTMLElement> & {
  as?: "nav" | "div";

  background?: NavigationBackground;

  direction?: NavigationDirection;

  /** Figma `Dividing line` variant */

  dividingLine?: boolean;
};

export const Navigation = forwardRef<HTMLElement, NavigationProps>(
  (
    {
      className,

      as: Tag = "nav",

      background = "default",

      direction = "vertical",

      dividingLine = false,

      ...props
    },

    ref
  ) => (
    <NavigationDirectionContext.Provider value={direction}>
      <Tag
        ref={ref as never}
        className={cn("aviala-navigation", className)}
        data-background={background}
        data-direction={direction}
        data-dividing-line={dividingLine ? "true" : "false"}
        {...props}
      />
    </NavigationDirectionContext.Provider>
  )
);

Navigation.displayName = "Navigation";

export type NavigationBrandProps = HTMLAttributes<HTMLDivElement>;

/** Figma Navigation Items `Content=Brand` (624:119379) */

export const NavigationBrand = forwardRef<HTMLDivElement, NavigationBrandProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("aviala-navigation-brand", className)}
      {...props}
    />
  )
);

NavigationBrand.displayName = "NavigationBrand";

export type NavigationBrandTitleProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children"
> & {
  asChild?: boolean;

  children: ReactNode;
};

export const NavigationBrandTitle = forwardRef<
  HTMLAnchorElement,
  NavigationBrandTitleProps
>(({ className, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      className={cn("aviala-navigation-brand__title aviala-focus-ring", className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <Typography level="text" as="span">
          {children}
        </Typography>
      )}
    </Comp>
  );
});

NavigationBrandTitle.displayName = "NavigationBrandTitle";

export type NavigationSectionProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/** Section label — docs grouping above tab items */

export const NavigationSection = forwardRef<
  HTMLDivElement,
  NavigationSectionProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("aviala-navigation-section", className)}
    {...props}
  >
    <Typography level="caption" as="p">
      {children}
    </Typography>
  </div>
));

NavigationSection.displayName = "NavigationSection";

export type NavigationGroupProps = HTMLAttributes<HTMLDivElement>;

/** Figma Navigation Tab Items Group (1651:20222) */

export const NavigationGroup = forwardRef<HTMLDivElement, NavigationGroupProps>(
  ({ className, children, ...props }, ref) => {
    const direction = useNavigationDirection();

    const layoutKey = useThemeLayoutKey();

    const groupRef = useRef<HTMLDivElement>(null);

    const onIndicatorRef = useNavigationIndicator(
      groupRef,
      direction,
      layoutKey
    );

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        groupRef.current = node;

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },

      [ref]
    );

    return (
      <div
        ref={setRefs}
        className={cn("aviala-navigation-group", className)}
        {...props}
      >
        <span
          ref={onIndicatorRef}
          className="aviala-navigation-indicator"
          aria-hidden
          data-visible="false"
        />

        {children}
      </div>
    );
  }
);

NavigationGroup.displayName = "NavigationGroup";

export type NavigationItemGroupProps = HTMLAttributes<HTMLDivElement> & {
  /** When set, animates expand/collapse. Omit for always-visible groups. */
  expanded?: boolean;
};

/** Figma Navigation Vertical Tab Child Items Group (643:127007) */

export const NavigationItemGroup = forwardRef<
  HTMLDivElement,
  NavigationItemGroupProps
>(({ className, expanded, children, ...props }, ref) => {
  const isCollapsible = expanded !== undefined;
  const isCollapsed = isCollapsible && !expanded;
  const innerRef = useRef<HTMLDivElement>(null);

  // Collapsed children stay in the DOM for the height transition, so `inert`
  // is what keeps them out of the tab order and the accessibility tree. Set it
  // imperatively: React 18 and 19 disagree on the JSX prop type.
  useLayoutEffect(() => {
    const inner = innerRef.current;

    if (!inner) return;

    if (isCollapsed) inner.setAttribute("inert", "");
    else inner.removeAttribute("inert");
  }, [isCollapsed]);

  return (
    <div
      ref={ref}
      className={cn("aviala-navigation-item-group", className)}
      data-expanded={
        isCollapsible ? (expanded ? "true" : "false") : undefined
      }
      aria-hidden={isCollapsed ? true : undefined}
      {...props}
    >
      {isCollapsible ? (
        <div ref={innerRef} className="aviala-navigation-item-group__inner">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
});

NavigationItemGroup.displayName = "NavigationItemGroup";

/** Figma Navigation Items `Type` variant */

export type NavigationItemType = "default" | "child";

export type NavigationItemProps = ComponentPropsWithoutRef<"a"> & {
  /** Figma `Starting=Active` — also inferred from `aria-current="page"` */

  active?: boolean;

  itemType?: NavigationItemType;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;

  asChild?: boolean;

  children: ReactNode;
};

function renderItemIcon(node: ReactNode): ReactNode {
  if (!node) return null;

  const content = cloneAvialaIconElement(node, {
    level: "text",
    biggerSize: true,
  });

  return <span className="aviala-navigation-item__icon">{content}</span>;
}

/** Figma Navigation Items `Content=Tab Item` (624:119382, 624:119385, 643:118728) */

export const NavigationItem = forwardRef<
  HTMLAnchorElement,
  NavigationItemProps
>(
  (
    {
      className,

      active,

      itemType = "default",

      leftIcon,

      rightIcon,

      asChild = false,

      children,

      "aria-current": ariaCurrent,

      ...props
    },

    ref
  ) => {
    const Comp = asChild ? Slot : "a";

    const isActive = active ?? ariaCurrent === "page";

    const mode = navigationItemButtonMode(isActive);

    const controlContent = (
      <>
        {renderItemIcon(leftIcon)}

        <Typography
          level="text"
          as="span"
          className="aviala-navigation-item__label"
        >
          {children}
        </Typography>

        {rightIcon ? (
          <span className="aviala-navigation-item__chevron">
            {renderItemIcon(rightIcon)}
          </span>
        ) : null}
      </>
    );

    return (
      <span
        className={cn("aviala-navigation-item", className)}
        data-item-type={itemType}
        data-active={isActive ? "true" : "false"}
      >
        <Comp
          ref={ref}
          className={cn(
            buttonVariants({ mode }),
            "aviala-navigation-item__control whitespace-normal"
          )}
          data-size="regular"
          aria-current={isActive ? "page" : undefined}
          {...props}
        >
          {asChild ? children : controlContent}
        </Comp>
      </span>
    );
  }
);

NavigationItem.displayName = "NavigationItem";

export type NavigationActionsProps = HTMLAttributes<HTMLDivElement>;

/** Figma Navigation Items `Content=Aciton Group` (624:119388) */

export const NavigationActions = forwardRef<
  HTMLDivElement,
  NavigationActionsProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("aviala-navigation-actions", className)}
    {...props}
  >
    {children}
  </div>
));

NavigationActions.displayName = "NavigationActions";

export type NavigationActionsSlotProps = HTMLAttributes<HTMLDivElement>;

export const NavigationActionsSlot = forwardRef<
  HTMLDivElement,
  NavigationActionsSlotProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("aviala-navigation-actions__slot", className)}
    {...props}
  />
));

NavigationActionsSlot.displayName = "NavigationActionsSlot";

/* -------------------------------------------------------------------------
 * NavigationItemMenu — child items collapsed into a hover flyout menu.
 * Select-like API: value/defaultValue/onValueChange on the root, `value` on
 * each item. Hidden by default, shown on hover (or click/Enter on the
 * trigger). Selected item gets a highlight, no check icon.
 * ---------------------------------------------------------------------- */

const NAVIGATION_MENU_CLOSE_DELAY_MS = 150;

type NavigationItemMenuContextValue = {
  value: string | undefined;

  hasSelection: boolean;

  select: (value: string) => void;

  openMenu: (viaHover: boolean) => void;

  scheduleClose: () => void;

  cancelClose: () => void;

  openedByHoverRef: RefObject<boolean>;
};

const NavigationItemMenuContext =
  createContext<NavigationItemMenuContextValue | null>(null);

function useNavigationItemMenuContext(component: string) {
  const context = useContext(NavigationItemMenuContext);

  if (!context) {
    throw new Error(`${component} must be used within <NavigationItemMenu>`);
  }

  return context;
}

export type NavigationItemMenuProps = {
  /** Selected child value — similar to Select `value`. */
  value?: string;

  defaultValue?: string;

  onValueChange?: (value: string) => void;

  open?: boolean;

  onOpenChange?: (open: boolean) => void;

  children: ReactNode;
};

export function NavigationItemMenu({
  value: valueProp,

  defaultValue,

  onValueChange,

  open: openProp,

  onOpenChange,

  children,
}: NavigationItemMenuProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isValueControlled = valueProp !== undefined;

  const value = isValueControlled ? valueProp : internalValue;

  const [internalOpen, setInternalOpen] = useState(false);

  const isOpenControlled = openProp !== undefined;

  const open = isOpenControlled ? openProp : internalOpen;

  const closeTimerRef = useRef<number | null>(null);

  const openedByHoverRef = useRef(false);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) setInternalOpen(nextOpen);

      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, onOpenChange]
  );

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current != null) {
      window.clearTimeout(closeTimerRef.current);

      closeTimerRef.current = null;
    }
  }, []);

  const openMenu = useCallback(
    (viaHover: boolean) => {
      cancelClose();

      openedByHoverRef.current = viaHover;

      setOpen(true);
    },
    [cancelClose, setOpen]
  );

  const scheduleClose = useCallback(() => {
    cancelClose();

    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;

      setOpen(false);
    }, NAVIGATION_MENU_CLOSE_DELAY_MS);
  }, [cancelClose, setOpen]);

  const select = useCallback(
    (nextValue: string) => {
      if (!isValueControlled) setInternalValue(nextValue);

      onValueChange?.(nextValue);

      cancelClose();

      setOpen(false);
    },
    [cancelClose, isValueControlled, onValueChange, setOpen]
  );

  useEffect(() => cancelClose, [cancelClose]);

  const contextValue = useMemo<NavigationItemMenuContextValue>(
    () => ({
      value,

      hasSelection: value != null && value !== "",

      select,

      openMenu,

      scheduleClose,

      cancelClose,

      openedByHoverRef,
    }),
    [cancelClose, openMenu, scheduleClose, select, value]
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) openedByHoverRef.current = false;

      cancelClose();

      setOpen(nextOpen);
    },
    [cancelClose, setOpen]
  );

  return (
    <NavigationItemMenuContext.Provider value={contextValue}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        {children}
      </Popover>
    </NavigationItemMenuContext.Provider>
  );
}

export type NavigationItemMenuTriggerProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
> & {
  /** Defaults to highlighted when the menu has a selected child. */
  active?: boolean;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;

  children: ReactNode;
};

/** Parent item — renders as a Navigation tab item and anchors the flyout. */

export const NavigationItemMenuTrigger = forwardRef<
  HTMLButtonElement,
  NavigationItemMenuTriggerProps
>(
  (
    {
      className,

      active,

      leftIcon,

      rightIcon,

      children,

      ...props
    },

    ref
  ) => {
    const menu = useNavigationItemMenuContext("NavigationItemMenuTrigger");

    const isActive = active ?? menu.hasSelection;

    const mode = navigationItemButtonMode(isActive);

    return (
      <span
        className={cn("aviala-navigation-item", className)}
        data-item-type="default"
        data-active={isActive ? "true" : "false"}
        onMouseEnter={() => menu.openMenu(true)}
        onMouseLeave={menu.scheduleClose}
      >
        <PopoverPrimitive.Trigger asChild>
          <button
            ref={ref}
            type="button"
            className={cn(
              buttonVariants({ mode }),
              "aviala-navigation-item__control whitespace-normal"
            )}
            data-size="regular"
            {...props}
          >
            {renderItemIcon(leftIcon)}

            <Typography
              level="text"
              as="span"
              className="aviala-navigation-item__label"
            >
              {children}
            </Typography>

            {rightIcon ? (
              <span className="aviala-navigation-item__chevron">
                {renderItemIcon(rightIcon)}
              </span>
            ) : null}
          </button>
        </PopoverPrimitive.Trigger>
      </span>
    );
  }
);

NavigationItemMenuTrigger.displayName = "NavigationItemMenuTrigger";

export type NavigationItemMenuContentProps = ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
>;

/** Flyout surface — right of the item in vertical, below it in horizontal. */

export const NavigationItemMenuContent = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  NavigationItemMenuContentProps
>(
  (
    {
      className,

      side,

      align = "start",

      sideOffset = 6,

      collisionPadding = 8,

      onOpenAutoFocus,

      ...props
    },

    ref
  ) => {
    const direction = useNavigationDirection();

    const menu = useNavigationItemMenuContext("NavigationItemMenuContent");

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          side={side ?? (direction === "vertical" ? "right" : "bottom")}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          className={cn("aviala-navigation-menu", className)}
          onMouseEnter={menu.cancelClose}
          onMouseLeave={menu.scheduleClose}
          onOpenAutoFocus={(event) => {
            // Hover-open must not steal focus; keyboard/click open should.
            if (menu.openedByHoverRef.current) event.preventDefault();

            onOpenAutoFocus?.(event);
          }}
          {...props}
        />
      </PopoverPrimitive.Portal>
    );
  }
);

NavigationItemMenuContent.displayName = "NavigationItemMenuContent";

export type NavigationItemMenuItemProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "value"
> & {
  value: string;

  /** Defaults to highlighted when it matches the menu value. */
  selected?: boolean;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;

  children: ReactNode;
};

/** Child option — highlighted when selected, no check icon by default. */

export const NavigationItemMenuItem = forwardRef<
  HTMLButtonElement,
  NavigationItemMenuItemProps
>(
  (
    {
      className,

      value,

      selected,

      leftIcon,

      rightIcon,

      disabled,

      onClick,

      children,

      ...props
    },

    ref
  ) => {
    const menu = useNavigationItemMenuContext("NavigationItemMenuItem");

    const isSelected = selected ?? menu.value === value;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          "aviala-navigation-menu-item aviala-focus-ring",
          className
        )}
        data-selected={isSelected ? "true" : "false"}
        data-disabled={disabled ? "" : undefined}
        aria-current={isSelected ? "true" : undefined}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented) menu.select(value);
        }}
        {...props}
      >
        {renderItemIcon(leftIcon)}

        <Typography
          level="text"
          as="span"
          className="aviala-navigation-menu-item__label"
        >
          {children}
        </Typography>

        {rightIcon ? (
          <span className="aviala-navigation-menu-item__trailing">
            {renderItemIcon(rightIcon)}
          </span>
        ) : null}
      </button>
    );
  }
);

NavigationItemMenuItem.displayName = "NavigationItemMenuItem";
