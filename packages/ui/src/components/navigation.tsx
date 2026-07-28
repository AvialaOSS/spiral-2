import { Slot } from "@radix-ui/react-slot";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useLayoutEffect,
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
    return {
      x: railLeft,

      y: itemRect.top - groupRect.top + railInset,

      width: railWidth,

      height: Math.max(0, itemRect.height - railInset * 2),

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

  const startExpandCollapseTracking = useCallback(
    (expanded: boolean) => {
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

      const { durationMs, easing } = getNavigationAnimationTiming(group);
      const startMetrics = measureIndicatorFromElement(el, group);

      if (!expanded) {
        const next = measureIndicator();
        if (!next?.visible) {
          syncIndicator(next ?? startMetrics, true);
          return;
        }

        const generation = ++animationGenerationRef.current;
        isLayoutTrackingRef.current = true;

        runIndicatorAnimation(
          el,
          group,
          startMetrics,
          next,
          durationMs,
          easing,
          generation,
          animationGenerationRef,
          animationRef,
          isAnimatingRef,
          syncIndicator
        );

        window.setTimeout(() => {
          if (!isLayoutTrackingRef.current) return;
          isLayoutTrackingRef.current = false;
          const final = measureIndicator();
          if (final) syncIndicator(final, true);
        }, durationMs);

        return;
      }

      isLayoutTrackingRef.current = true;
      applyIndicatorMetrics(el, startMetrics, true);
      metricsRef.current = startMetrics;
      const deadline = performance.now() + durationMs;

      const tick = () => {
        if (!isLayoutTrackingRef.current) return;

        const metrics = measureIndicator();
        if (metrics) syncIndicator(metrics, true);

        if (performance.now() < deadline) {
          layoutTrackingFrameRef.current = requestAnimationFrame(tick);
        } else {
          layoutTrackingFrameRef.current = null;
          isLayoutTrackingRef.current = false;
          const final = measureIndicator();
          if (final) syncIndicator(final, true);
        }
      };

      layoutTrackingFrameRef.current = requestAnimationFrame(tick);
    },
    [cancelLayoutTracking, groupRef, measureIndicator, syncIndicator]
  );

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
      let expandCollapseChange: boolean | null = null;

      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-expanded" &&
          mutation.target instanceof HTMLElement
        ) {
          expandCollapseChange =
            mutation.target.getAttribute("data-expanded") === "true";
        }
      }

      if (expandCollapseChange !== null) {
        startExpandCollapseTracking(expandCollapseChange);
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
      if (event.propertyName !== "grid-template-rows") return;
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
