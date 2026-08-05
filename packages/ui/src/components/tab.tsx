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
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { cloneAvialaIconElement } from "../lib/clone-aviala-icon";
import { cn } from "../lib/utils";
import { spiralDebugId } from "../lib/spiral-debug";
import { useDirection } from "../config/use-direction";
import { useThemeLayoutKey } from "../theme/theme-provider";
import { buttonVariants, type ButtonMode } from "./button";
import { Typography } from "./typography";

/** Figma Components → Structure Navigation → Tab `Style` */
export type TabStyle = "default" | "card" | "tiled";

/** Figma Components → Structure Navigation → Tab `Background` */
export type TabBackground = "none" | "default";

type TabContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  style: TabStyle;
  disabled?: boolean;
  registerItem: (value: string, el: HTMLButtonElement | null) => void;
};

const TabContext = createContext<TabContextValue | null>(null);

function useTabContext() {
  const ctx = useContext(TabContext);
  if (!ctx) {
    throw new Error("TabItem must be used within Tab");
  }
  return ctx;
}

/** Map TabItem Style + active → nested Button mode (Figma TabItem uses Button). */
function tabItemButtonMode(style: TabStyle, active: boolean): ButtonMode {
  if (style === "tiled") return active ? "second" : "noBackgroundCustom";
  // Card active: theme text via noBackground; white top-radius fill + ears via CSS.
  if (style === "card") return active ? "noBackground" : "noBackgroundCustom";
  return active ? "noBackground" : "noBackgroundCustom";
}

function useTabState(
  value: string | undefined,
  defaultValue: string | undefined,
  onValueChange?: (value: string) => void
) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  return [current, setValue] as const;
}

type IndicatorMetrics = {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
};

function applyTabIndicatorMetrics(
  el: HTMLSpanElement,
  metrics: IndicatorMetrics,
  instant = false
) {
  if (instant) el.setAttribute("data-instant", "true");
  el.style.width = `${metrics.width}px`;
  el.style.height = `${metrics.height}px`;
  el.style.transform = `translate(${metrics.x}px, ${metrics.y}px)`;
  el.dataset.visible = metrics.visible ? "true" : "false";
  if (instant) {
    void el.offsetWidth;
    el.removeAttribute("data-instant");
  }
}

function measureTabIndicator(list: HTMLElement): IndicatorMetrics | null {
  const active = list.querySelector<HTMLElement>(
    '.aviala-tab-item[data-active="true"]:not([data-disabled="true"])'
  );
  if (!active) {
    return { x: 0, y: 0, width: 0, height: 0, visible: false };
  }

  const control =
    active.querySelector<HTMLElement>(".aviala-tab-item__control") ?? active;
  const listRect = list.getBoundingClientRect();
  const controlRect = control.getBoundingClientRect();
  const itemRect = active.getBoundingClientRect();
  const styles = getComputedStyle(list);
  const height =
    Number.parseFloat(styles.getPropertyValue("--tab-indicator-height")) || 4;
  // Figma active Default: indicator x=12, width = itemWidth - 24 (66 → 42)
  const inset =
    Number.parseFloat(styles.getPropertyValue("--tab-indicator-inset-inline")) ||
    12;

  return {
    x: controlRect.left - listRect.left + list.scrollLeft + inset,
    y: itemRect.bottom - listRect.top + list.scrollTop - height,
    width: Math.max(0, controlRect.width - inset * 2),
    height,
    visible: true,
  };
}

function useTabIndicator(
  listRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  layoutKey: string | null,
  value: string
) {
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const isInitial = useRef(true);

  const sync = useCallback(
    (instant: boolean) => {
      const list = listRef.current;
      const el = indicatorRef.current;
      if (!list || !el || !enabled) {
        if (el) el.dataset.visible = "false";
        return;
      }
      const metrics = measureTabIndicator(list);
      if (metrics) applyTabIndicatorMetrics(el, metrics, instant);
    },
    [enabled, listRef]
  );

  useLayoutEffect(() => {
    if (!enabled) {
      if (indicatorRef.current) indicatorRef.current.dataset.visible = "false";
      return;
    }
    sync(isInitial.current);
    isInitial.current = false;
  }, [enabled, layoutKey, sync, value]);

  useEffect(() => {
    if (!enabled) return;
    const list = listRef.current;
    if (!list) return;

    const onResize = () => sync(true);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    ro?.observe(list);
    list.addEventListener("scroll", onResize, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      ro?.disconnect();
      list.removeEventListener("scroll", onResize);
      window.removeEventListener("resize", onResize);
    };
  }, [enabled, listRef, sync]);

  return indicatorRef;
}

function renderTabIcon(node: ReactNode): ReactNode {
  if (!node) return null;
  const content = cloneAvialaIconElement(node, {
    level: "text",
    biggerSize: true,
  });
  return <span className="aviala-tab-item__icon">{content}</span>;
}

/** Figma Card TabItem ear vectors (1866:38024 / 1866:38019) — 8×8 in a 2×8 frame. */
function TabCardEar({ side }: { side: "start" | "end" }) {
  const d =
    side === "start"
      ? "M8 8L0 8C4 8 8 5.5 8 0L8 8Z"
      : "M0 8L8 8C4 8 0 5.5 0 0L0 8Z";
  return (
    <span className="aviala-tab-item__ear" data-side={side} aria-hidden>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
      >
        <path d={d} fill="currentColor" />
      </svg>
    </span>
  );
}

export type TabProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "style"> & {
  /** Figma `Style` */
  style?: TabStyle;
  /** Figma `Background` */
  background?: TabBackground;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  /** Leading accessory (Figma SoltRight — visual start). */
  startSlot?: ReactNode;
  /** Trailing accessory (Figma SoltLeft / SoltLeft2 — visual end). */
  endSlot?: ReactNode;
};

/** Figma Components → Structure Navigation → Tab */
export const Tab = forwardRef<HTMLDivElement, TabProps>(
  (
    {
      className,
      style: tabStyle = "default",
      background = "none",
      value: valueProp,
      defaultValue,
      onValueChange,
      disabled,
      startSlot,
      endSlot,
      children,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useTabState(valueProp, defaultValue, onValueChange);
    const layoutKey = useThemeLayoutKey();
    const direction = useDirection();
    const listRef = useRef<HTMLDivElement | null>(null);
    const itemsRef = useRef(new Map<string, HTMLButtonElement>());
    const showIndicator = tabStyle === "default";
    const indicatorRef = useTabIndicator(listRef, showIndicator, layoutKey, value);

    const registerItem = useCallback(
      (itemValue: string, el: HTMLButtonElement | null) => {
        if (el) itemsRef.current.set(itemValue, el);
        else itemsRef.current.delete(itemValue);
      },
      []
    );

    const ctx = useMemo<TabContextValue>(
      () => ({
        value,
        onValueChange: setValue,
        style: tabStyle,
        disabled,
        registerItem,
      }),
      [value, setValue, tabStyle, disabled, registerItem]
    );

    const focusAdjacent = useCallback(
      (current: string, delta: number) => {
        const entries = Array.from(itemsRef.current.entries()).filter(
          ([, el]) => !el.disabled
        );
        if (!entries.length) return;
        const idx = entries.findIndex(([v]) => v === current);
        const nextIdx =
          idx < 0
            ? 0
            : (idx + delta + entries.length) % entries.length;
        const [nextValue, el] = entries[nextIdx]!;
        setValue(nextValue);
        el.focus();
      },
      [setValue]
    );

    const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled) return;

      const rtl = direction === "rtl";
      const prevKey = rtl ? "ArrowRight" : "ArrowLeft";
      const nextKey = rtl ? "ArrowLeft" : "ArrowRight";

      if (event.key === prevKey) {
        event.preventDefault();
        focusAdjacent(value, -1);
      } else if (event.key === nextKey) {
        event.preventDefault();
        focusAdjacent(value, 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        const first = Array.from(itemsRef.current.entries()).find(
          ([, el]) => !el.disabled
        );
        if (first) {
          setValue(first[0]);
          first[1].focus();
        }
      } else if (event.key === "End") {
        event.preventDefault();
        const enabled = Array.from(itemsRef.current.entries()).filter(
          ([, el]) => !el.disabled
        );
        const last = enabled[enabled.length - 1];
        if (last) {
          setValue(last[0]);
          last[1].focus();
        }
      }
    };

    return (
      <TabContext.Provider value={ctx}>
        <div
          ref={ref}
          className={cn("aviala-tab", className)}
          data-style={tabStyle}
          data-background={background}
          {...spiralDebugId("tab")}
          {...props}
        >
          {startSlot != null && startSlot !== false ? (
            <div className="aviala-tab__slot" data-slot="start">
              {startSlot}
            </div>
          ) : null}
          <div
            ref={listRef}
            className="aviala-tab__list"
            role="tablist"
            aria-orientation="horizontal"
            onKeyDown={handleListKeyDown}
            {...spiralDebugId("tab.list")}
          >
            {showIndicator ? (
              <span
                ref={indicatorRef}
                className="aviala-tab-indicator"
                aria-hidden
                data-visible="false"
              />
            ) : null}
            {children}
          </div>
          {endSlot != null && endSlot !== false ? (
            <div className="aviala-tab__slot" data-slot="end">
              {endSlot}
            </div>
          ) : null}
        </div>
      </TabContext.Provider>
    );
  }
);
Tab.displayName = "Tab";

export type TabItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "children"
> & {
  value: string;
  leftIcon?: ReactNode;
  children?: ReactNode;
};

/** Figma Components → Structure Navigation → TabItem (nested Button). */
export const TabItem = forwardRef<HTMLButtonElement, TabItemProps>(
  (
    {
      className,
      value,
      leftIcon,
      disabled: disabledProp,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const ctx = useTabContext();
    const active = ctx.value === value;
    const disabled = Boolean(ctx.disabled || disabledProp);
    const mode = tabItemButtonMode(ctx.style, active);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        ctx.registerItem(value, node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ctx, ref, value]
    );

    const showCardEars = ctx.style === "card" && active;

    return (
      <span
        className={cn("aviala-tab-item", className)}
        data-active={active ? "true" : "false"}
        data-style={ctx.style}
        data-disabled={disabled ? "true" : undefined}
        {...spiralDebugId("tab.item")}
      >
        {showCardEars ? <TabCardEar side="start" /> : null}
        <button
          ref={setRefs}
          type="button"
          role="tab"
          data-size="regular"
          className={cn(
            buttonVariants({ mode }),
            "aviala-tab-item__control"
          )}
          aria-selected={active}
          tabIndex={active ? 0 : -1}
          disabled={disabled}
          onClick={(event) => {
            onClick?.(event);
            if (event.defaultPrevented || disabled) return;
            ctx.onValueChange(value);
          }}
          {...spiralDebugId("tab.item.control")}
          {...props}
        >
          {renderTabIcon(leftIcon)}
          {children != null && children !== false ? (
            <Typography
              level="text"
              as="span"
              className="aviala-tab-item__label"
            >
              {children}
            </Typography>
          ) : null}
        </button>
        {showCardEars ? <TabCardEar side="end" /> : null}
      </span>
    );
  }
);
TabItem.displayName = "TabItem";
