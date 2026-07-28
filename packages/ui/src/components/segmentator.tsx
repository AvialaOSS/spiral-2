import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { cloneAvialaIconElement } from "../lib/clone-aviala-icon";
import { cn } from "../lib/utils";
import { useThemeLayoutKey } from "../theme/theme-provider";
import { typographyVariants } from "./typography";

/** Figma Components → Basic Input → Segmentator */
export type SegmentatorMode = "nested" | "tiled";

type SegmentatorContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  mode: SegmentatorMode;
  allRound: boolean;
  disabled?: boolean;
  consumeClickRef: RefObject<boolean>;
  dragPreviewValue: string | null;
  isPressing: boolean;
};

const SegmentatorContext = createContext<SegmentatorContextValue | null>(null);

function useSegmentatorContext() {
  const ctx = useContext(SegmentatorContext);
  if (!ctx) {
    throw new Error("SegmentatorItem must be used within SegmentatorGroup");
  }
  return ctx;
}

function renderIcon(node: ReactNode, dimmed?: boolean): ReactNode {
  if (!node) return null;
  const content = cloneAvialaIconElement(node, {
    level: "text",
    biggerSize: true,
  });

  return (
    <span
      className={cn(
        "aviala-segmentator-item__icon",
        dimmed && "opacity-[var(--button-disabled-opacity,0.55)]"
      )}
    >
      {content}
    </span>
  );
}

function useSegmentatorState(
  value: string | undefined,
  defaultValue: string | undefined,
  onValueChange?: (value: string) => void
) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const setValue = (next: string) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  return [current, setValue] as const;
}

type SegmentatorThumbMetrics = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const SEGMENTATOR_DRAG_THRESHOLD_PX = 4;
const SEGMENTATOR_PRESS_SCALE = 0.96;
const SEGMENTATOR_HAPTIC_PRESS_PATTERN = [20, 30, 15] as const;
const SEGMENTATOR_HAPTIC_SELECT_MS = 16;

function getPressedItemFromTarget(target: EventTarget | null): HTMLButtonElement | null {
  if (!(target instanceof Element)) return null;
  const item = target.closest<HTMLButtonElement>(".aviala-segmentator-item");
  if (!item || item.disabled) return null;
  return item;
}

function triggerSegmentatorHaptic(kind: "press" | "select") {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;

  try {
    if (kind === "press") {
      navigator.vibrate([...SEGMENTATOR_HAPTIC_PRESS_PATTERN]);
    } else {
      navigator.vibrate(SEGMENTATOR_HAPTIC_SELECT_MS);
    }
  } catch {
    // Vibration API is unavailable on iOS Safari and may be blocked without user gesture.
  }
}

type SegmentatorDragState = {
  pressing: boolean;
  active: boolean;
  metrics: SegmentatorThumbMetrics | null;
};

type SegmentatorPointerDrag = {
  pointerId: number;
  startX: number;
  moved: boolean;
  fallback: SegmentatorThumbMetrics;
  previewValue: string | null;
  cleanupWindowListeners?: () => void;
};

function buildThumbStyle(metrics: SegmentatorThumbMetrics): CSSProperties {
  return {
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 0,
    width: metrics.width,
    height: metrics.height,
    transformOrigin: "center center",
    ["--segmentator-thumb-x" as string]: `${metrics.x}px`,
    ["--segmentator-thumb-y" as string]: `${metrics.y}px`,
  };
}

function isSegmentatorDragPointer(pointerType: string): boolean {
  if (pointerType === "touch" || pointerType === "pen") return true;
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function getEnabledSegmentatorItems(group: HTMLElement): HTMLButtonElement[] {
  return Array.from(
    group.querySelectorAll<HTMLButtonElement>('.aviala-segmentator-item:not(:disabled)')
  );
}

function measureItemThumbMetrics(
  item: HTMLButtonElement,
  group: HTMLElement
): SegmentatorThumbMetrics {
  const groupRect = group.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  return {
    x: itemRect.left - groupRect.left,
    y: itemRect.top - groupRect.top,
    width: itemRect.width,
    height: itemRect.height,
  };
}

function findItemAtClientX(
  items: HTMLButtonElement[],
  clientX: number
): HTMLButtonElement | null {
  for (const item of items) {
    const rect = item.getBoundingClientRect();
    if (clientX >= rect.left && clientX <= rect.right) return item;
  }

  let nearest: HTMLButtonElement | null = null;
  let minDistance = Number.POSITIVE_INFINITY;

  for (const item of items) {
    const rect = item.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const distance = Math.abs(clientX - center);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = item;
    }
  }

  return nearest;
}

function lerpSegmentatorThumbMetrics(
  from: SegmentatorThumbMetrics,
  to: SegmentatorThumbMetrics,
  t: number
): SegmentatorThumbMetrics {
  const clamped = Math.max(0, Math.min(1, t));
  return {
    x: from.x + (to.x - from.x) * clamped,
    y: from.y + (to.y - from.y) * clamped,
    width: from.width + (to.width - from.width) * clamped,
    height: from.height + (to.height - from.height) * clamped,
  };
}

function getItemCenterX(item: HTMLButtonElement): number {
  const rect = item.getBoundingClientRect();
  return rect.left + rect.width / 2;
}

function computeDragThumbMetrics(
  group: HTMLElement,
  items: HTMLButtonElement[],
  clientX: number,
  fallback: SegmentatorThumbMetrics
): { metrics: SegmentatorThumbMetrics; item: HTMLButtonElement | null } {
  if (items.length === 0) {
    return { metrics: fallback, item: null };
  }

  const measured = items.map((item) => ({
    item,
    metrics: measureItemThumbMetrics(item, group),
  }));

  const first = measured[0];
  const last = measured[measured.length - 1];
  const firstCenter = getItemCenterX(first.item);
  const lastCenter = getItemCenterX(last.item);

  if (clientX <= firstCenter) {
    return { metrics: first.metrics, item: first.item };
  }

  if (clientX >= lastCenter) {
    return { metrics: last.metrics, item: last.item };
  }

  for (let index = 0; index < measured.length - 1; index += 1) {
    const current = measured[index];
    const next = measured[index + 1];
    const currentCenter = getItemCenterX(current.item);
    const nextCenter = getItemCenterX(next.item);

    if (clientX >= currentCenter && clientX <= nextCenter) {
      const span = nextCenter - currentCenter;
      const progress = span > 0 ? (clientX - currentCenter) / span : 0;
      const previewItem = progress < 0.5 ? current.item : next.item;
      return {
        metrics: lerpSegmentatorThumbMetrics(current.metrics, next.metrics, progress),
        item: previewItem,
      };
    }
  }

  const targetItem = findItemAtClientX(items, clientX);
  if (!targetItem) {
    return { metrics: fallback, item: null };
  }

  return {
    metrics: measureItemThumbMetrics(targetItem, group),
    item: targetItem,
  };
}

function applyThumbMetrics(
  el: HTMLSpanElement,
  metrics: SegmentatorThumbMetrics,
  instant = false
) {
  if (instant) {
    el.setAttribute("data-instant", "true");
  }
  el.style.removeProperty("transform");
  el.style.width = `${metrics.width}px`;
  el.style.height = `${metrics.height}px`;
  el.style.setProperty("--segmentator-thumb-x", `${metrics.x}px`);
  el.style.setProperty("--segmentator-thumb-y", `${metrics.y}px`);
  if (instant) {
    void el.offsetWidth;
    el.removeAttribute("data-instant");
  }
}

function metricsApproxEqual(
  a: SegmentatorThumbMetrics,
  b: SegmentatorThumbMetrics,
  epsilon = 0.5
) {
  return (
    Math.abs(a.x - b.x) < epsilon &&
    Math.abs(a.y - b.y) < epsilon &&
    Math.abs(a.width - b.width) < epsilon &&
    Math.abs(a.height - b.height) < epsilon
  );
}

function useSegmentatorThumb(
  groupRef: RefObject<HTMLDivElement | null>,
  selectedValue: string | undefined,
  layoutKey: string | null,
  dragState: SegmentatorDragState
) {
  const thumbElRef = useRef<HTMLSpanElement | null>(null);
  const metricsRef = useRef<SegmentatorThumbMetrics | null>(null);
  const dragStateRef = useRef(dragState);
  const [thumb, setThumb] = useState<SegmentatorThumbMetrics | null>(null);
  const isInitialMount = useRef(true);

  dragStateRef.current = dragState;

  const measureThumb = useCallback((): SegmentatorThumbMetrics | null => {
    const group = groupRef.current;
    if (!group) return null;

    const selected = group.querySelector<HTMLButtonElement>(
      '.aviala-segmentator-item[data-selected="true"]'
    );
    if (!selected) return null;

    const groupRect = group.getBoundingClientRect();
    const itemRect = selected.getBoundingClientRect();
    return {
      x: itemRect.left - groupRect.left,
      y: itemRect.top - groupRect.top,
      width: itemRect.width,
      height: itemRect.height,
    };
  }, [groupRef]);

  const syncThumb = useCallback(
    (metrics: SegmentatorThumbMetrics, instant = false) => {
      metricsRef.current = metrics;
      setThumb(metrics);
      const el = thumbElRef.current;
      if (el) applyThumbMetrics(el, metrics, instant);
    },
    []
  );

  const remeasureThumb = useCallback(() => {
    if (dragStateRef.current.pressing || dragStateRef.current.active) return;

    const metrics = measureThumb();
    if (!metrics) return;

    syncThumb(metrics, true);
  }, [measureThumb, syncThumb]);

  const onThumbRef = useCallback((node: HTMLSpanElement | null) => {
    thumbElRef.current = node;
    if (node && metricsRef.current && isInitialMount.current) {
      applyThumbMetrics(node, metricsRef.current, true);
      isInitialMount.current = false;
    }
  }, []);

  useLayoutEffect(() => {
    if ((dragState.pressing || dragState.active) && dragState.metrics) {
      syncThumb(dragState.metrics, true);
      return;
    }

    const next = measureThumb();
    if (!next) return;

    const el = thumbElRef.current;

    if (isInitialMount.current) {
      metricsRef.current = next;
      setThumb(next);
      if (el) {
        applyThumbMetrics(el, next, true);
        isInitialMount.current = false;
      }
      return;
    }

    if (!el) {
      syncThumb(next, true);
      return;
    }

    const startMetrics = metricsRef.current ?? next;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (metricsApproxEqual(startMetrics, next) || prefersReducedMotion) {
      syncThumb(next, true);
      return;
    }

    syncThumb(next, false);
  }, [
    selectedValue,
    measureThumb,
    syncThumb,
    dragState.active,
    dragState.pressing,
    dragState.metrics,
  ]);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const observer = new ResizeObserver(() => {
      remeasureThumb();
    });
    observer.observe(group);

    const items = group.querySelectorAll(".aviala-segmentator-item");
    items.forEach((item) => observer.observe(item));

    const layoutObserver = new MutationObserver(() => {
      requestAnimationFrame(remeasureThumb);
    });
    layoutObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-density", "data-mode"],
    });

    return () => {
      observer.disconnect();
      layoutObserver.disconnect();
    };
  }, [groupRef, remeasureThumb]);

  // ThemeProvider applies density/mode in useLayoutEffect on ancestors; remeasure after
  // layout settles so thumb width/height match the updated item metrics.
  useEffect(() => {
    if (!layoutKey) return;
    const frame = requestAnimationFrame(() => {
      remeasureThumb();
    });
    return () => cancelAnimationFrame(frame);
  }, [layoutKey, remeasureThumb]);

  return { thumb, onThumbRef, measureThumb, applyThumbImmediate: syncThumb };
}

export type SegmentatorGroupProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  mode?: SegmentatorMode;
  allRound?: boolean;
  disabled?: boolean;
};

export const SegmentatorGroup = forwardRef<HTMLDivElement, SegmentatorGroupProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      mode = "nested",
      allRound = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const [currentValue, setValue] = useSegmentatorState(value, defaultValue, onValueChange);
    const groupRef = useRef<HTMLDivElement>(null);
    const layoutKey = useThemeLayoutKey();
    const consumeClickRef = useRef(false);
    const pointerDragRef = useRef<SegmentatorPointerDrag | null>(null);
    const [dragPreviewValue, setDragPreviewValue] = useState<string | null>(null);
    const [dragState, setDragState] = useState<SegmentatorDragState>({
      pressing: false,
      active: false,
      metrics: null,
    });
    const { thumb, onThumbRef, measureThumb, applyThumbImmediate } = useSegmentatorThumb(
      groupRef,
      currentValue,
      layoutKey,
      dragState
    );

    const resetPointerInteraction = useCallback(() => {
      pointerDragRef.current?.cleanupWindowListeners?.();
      pointerDragRef.current = null;
      setDragPreviewValue(null);
      setDragState({ pressing: false, active: false, metrics: null });
    }, []);

    const finishPointerInteraction = useCallback(
      (pointerId: number) => {
        const drag = pointerDragRef.current;
        const group = groupRef.current;
        if (!drag || drag.pointerId !== pointerId || !group) return;

        drag.cleanupWindowListeners?.();
        drag.cleanupWindowListeners = undefined;

        if (group.hasPointerCapture(pointerId)) {
          group.releasePointerCapture(pointerId);
        }

        if (drag.moved) {
          consumeClickRef.current = true;
          const nextValue = drag.previewValue ?? currentValue;
          if (nextValue) {
            setValue(nextValue);
          }
        }

        resetPointerInteraction();
      },
      [currentValue, resetPointerInteraction, setValue]
    );

    const updateDragThumb = useCallback(
      (clientX: number) => {
        const group = groupRef.current;
        const drag = pointerDragRef.current;
        if (!group || !drag) return null;

        const items = getEnabledSegmentatorItems(group);
        if (items.length === 0) return null;

        const fallback =
          drag.fallback ??
          (() => {
            const selected = group.querySelector<HTMLButtonElement>(
              '.aviala-segmentator-item[data-selected="true"]'
            );
            if (selected) return measureItemThumbMetrics(selected, group);
            return measureItemThumbMetrics(items[0], group);
          })();

        const { metrics, item } = computeDragThumbMetrics(group, items, clientX, fallback);
        const nextPreviewValue = item?.dataset.value ?? drag.previewValue;

        if (nextPreviewValue && nextPreviewValue !== drag.previewValue) {
          triggerSegmentatorHaptic("select");
        }

        drag.previewValue = nextPreviewValue;
        applyThumbImmediate(metrics, true);
        setDragPreviewValue(nextPreviewValue);
        setDragState({ pressing: true, active: true, metrics });
        return item;
      },
      [applyThumbImmediate]
    );

    const attachWindowDragListeners = useCallback(
      (pointerId: number) => {
        const onPointerMove = (event: PointerEvent) => {
          const drag = pointerDragRef.current;
          if (!drag || drag.pointerId !== pointerId) return;

          if (Math.abs(event.clientX - drag.startX) < SEGMENTATOR_DRAG_THRESHOLD_PX) return;

          drag.moved = true;
          event.preventDefault();
          updateDragThumb(event.clientX);
        };

        const onPointerEnd = (event: PointerEvent) => {
          finishPointerInteraction(event.pointerId);
        };

        window.addEventListener("pointermove", onPointerMove, { capture: true, passive: false });
        window.addEventListener("pointerup", onPointerEnd, { capture: true });
        window.addEventListener("pointercancel", onPointerEnd, { capture: true });

        return () => {
          window.removeEventListener("pointermove", onPointerMove, { capture: true });
          window.removeEventListener("pointerup", onPointerEnd, { capture: true });
          window.removeEventListener("pointercancel", onPointerEnd, { capture: true });
        };
      },
      [finishPointerInteraction, updateDragThumb]
    );

    const finishPointerDrag = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        finishPointerInteraction(event.pointerId);
      },
      [finishPointerInteraction]
    );

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || !isSegmentatorDragPointer(event.pointerType)) return;

      const pressedItem = getPressedItemFromTarget(event.target);
      if (!pressedItem) return;

      const group = groupRef.current;
      if (!group) return;

      const metrics = measureThumb();
      if (!metrics) return;

      const pressedValue = pressedItem.dataset.value ?? currentValue;

      triggerSegmentatorHaptic("press");
      event.preventDefault();

      pointerDragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        moved: false,
        fallback: metrics,
        previewValue: pressedValue,
      };
      pointerDragRef.current.cleanupWindowListeners = attachWindowDragListeners(
        event.pointerId
      );

      setDragPreviewValue(pressedValue);
      setDragState({ pressing: true, active: false, metrics });
      group.setPointerCapture(event.pointerId);
    };

    const thumbStyle: CSSProperties | undefined = thumb ? buildThumbStyle(thumb) : undefined;

    return (
      <SegmentatorContext.Provider
        value={{
          value: currentValue,
          onValueChange: setValue,
          mode,
          allRound,
          disabled,
          consumeClickRef,
          dragPreviewValue,
          isPressing: dragState.pressing,
        }}
      >
        <div
          ref={(node) => {
            groupRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          role="radiogroup"
          {...props}
          className={cn("aviala-segmentator-group", className)}
          data-all-round={allRound ? "true" : "false"}
          data-mode={mode}
          data-dragging={dragState.active ? "true" : undefined}
          data-pressing={dragState.pressing ? "true" : undefined}
          onPointerDown={handlePointerDown}
          onPointerUp={finishPointerDrag}
          onPointerCancel={finishPointerDrag}
        >
          {children}
          {thumb && (
            <span
              ref={onThumbRef}
              aria-hidden
              className="aviala-segmentator-thumb"
              data-mode={mode}
              data-all-round={allRound ? "true" : "false"}
              data-pressing={dragState.pressing ? "true" : undefined}
              style={thumbStyle}
            />
          )}
        </div>
      </SegmentatorContext.Provider>
    );
  }
);
SegmentatorGroup.displayName = "SegmentatorGroup";

export type SegmentatorItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
  value: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
};

export const SegmentatorItem = forwardRef<HTMLButtonElement, SegmentatorItemProps>(
  (
    {
      className,
      value,
      leftIcon,
      rightIcon,
      iconOnly: iconOnlyProp,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const ctx = useSegmentatorContext();
    const selected = ctx.value === value;
    const iconOnly =
      iconOnlyProp ?? (!!(leftIcon ?? rightIcon) && !children);
    const isDisabled = disabled || ctx.disabled;
    const dimmed = isDisabled;
    const icon = iconOnly ? (leftIcon ?? rightIcon) : leftIcon;

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={selected}
        data-selected={selected ? "true" : "false"}
        data-value={value}
        data-mode={ctx.mode}
        data-drag-preview={
          ctx.isPressing && ctx.dragPreviewValue === value ? "true" : undefined
        }
        data-all-round={ctx.allRound ? "true" : "false"}
        disabled={isDisabled}
        className={cn("aviala-segmentator-item aviala-focus-ring", iconOnly && "min-w-0", className)}
        onClick={(e) => {
          if (ctx.consumeClickRef.current) {
            ctx.consumeClickRef.current = false;
            return;
          }
          ctx.onValueChange?.(value);
          onClick?.(e);
        }}
        {...props}
      >
        {renderIcon(icon, dimmed && !!icon)}
        {!iconOnly && (
          <span
            className={cn(
              "relative z-[1] shrink-0 [word-break:break-word]",
              typographyVariants({ level: "text" }),
              dimmed && "opacity-[var(--button-disabled-opacity,0.55)]"
            )}
          >
            {children}
          </span>
        )}
        {!iconOnly && renderIcon(rightIcon, dimmed && !!rightIcon)}
      </button>
    );
  }
);
SegmentatorItem.displayName = "SegmentatorItem";
