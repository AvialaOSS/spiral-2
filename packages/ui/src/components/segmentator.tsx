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
/** Max finger-follow offset while stuck on an item (px), keeps drag feeling tactile. */
const SEGMENTATOR_STICKY_OFFSET_PX = 10;
/** If a drag update jumps farther than this, animate instead of teleporting. */
const SEGMENTATOR_DRAG_ANIMATE_JUMP_PX = 6;
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
};

type SegmentatorPointerDrag = {
  pointerId: number;
  startX: number;
  moved: boolean;
  fallback: SegmentatorThumbMetrics;
  previewValue: string | null;
  lastMetrics?: SegmentatorThumbMetrics;
  /** While settling onto a new item, keep writes animated so live offset can't cut the snap. */
  snapUntil?: number;
  cleanupWindowListeners?: () => void;
};

/** Geometry (x/y/width/height) is always written imperatively — React must not own those. */
function buildThumbStyle(): CSSProperties {
  return {
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 0,
    transformOrigin: "center center",
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

function getItemCenterX(item: HTMLButtonElement): number {
  const rect = item.getBoundingClientRect();
  return rect.left + rect.width / 2;
}

/**
 * Map finger X onto the nearest item, with a small tactile offset while stuck.
 * Crossing items is a discrete jump in metrics — callers should animate those.
 * Edge limits only apply on the first/last item (outward side); mid-track sticky
 * offset stays free.
 */
function computeDragThumbMetrics(
  group: HTMLElement,
  items: HTMLButtonElement[],
  clientX: number,
  fallback: SegmentatorThumbMetrics
): { metrics: SegmentatorThumbMetrics; item: HTMLButtonElement | null } {
  if (items.length === 0) {
    return { metrics: fallback, item: null };
  }

  const item = findItemAtClientX(items, clientX);
  if (!item) {
    return { metrics: fallback, item: null };
  }

  const base = measureItemThumbMetrics(item, group);
  const center = getItemCenterX(item);
  const rawOffset = Math.max(
    -SEGMENTATOR_STICKY_OFFSET_PX,
    Math.min(SEGMENTATOR_STICKY_OFFSET_PX, clientX - center)
  );
  let x = base.x + rawOffset;

  const isFirst = item === items[0];
  const isLast = item === items[items.length - 1];
  // Only block dragging past the outer edge of the end items.
  if (isFirst && x < base.x) x = base.x;
  if (isLast && x > base.x) x = base.x;

  return {
    metrics: {
      ...base,
      x,
    },
    item,
  };
}

function applyThumbMetrics(
  el: HTMLSpanElement,
  metrics: SegmentatorThumbMetrics,
  instant = false
) {
  if (instant) {
    el.setAttribute("data-instant", "true");
  } else {
    el.removeAttribute("data-instant");
  }
  el.style.width = `${metrics.width}px`;
  el.style.height = `${metrics.height}px`;
  el.style.setProperty("--segmentator-thumb-x", `${metrics.x}px`);
  el.style.setProperty("--segmentator-thumb-y", `${metrics.y}px`);
  if (instant) {
    // Flush the instant paint, then leave data-instant on only if the caller
    // keeps it (drag session). Default: clear so settle animations can run.
    void el.offsetWidth;
    el.removeAttribute("data-instant");
  }
}

/** Drag-follow write: keep transitions off for the whole gesture (no per-frame toggle). */
function applyThumbMetricsLive(el: HTMLSpanElement, metrics: SegmentatorThumbMetrics) {
  el.setAttribute("data-instant", "true");
  el.style.width = `${metrics.width}px`;
  el.style.height = `${metrics.height}px`;
  el.style.setProperty("--segmentator-thumb-x", `${metrics.x}px`);
  el.style.setProperty("--segmentator-thumb-y", `${metrics.y}px`);
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

  /** Imperative-only write — safe during drag (avoids React style thrashing / flicker). */
  const writeThumbMetrics = useCallback(
    (metrics: SegmentatorThumbMetrics, instant = false) => {
      metricsRef.current = metrics;
      const el = thumbElRef.current;
      if (el) applyThumbMetrics(el, metrics, instant);
    },
    []
  );

  /** Continuous drag follow — transitions stay disabled until gesture ends. */
  const writeThumbMetricsLive = useCallback((metrics: SegmentatorThumbMetrics) => {
    metricsRef.current = metrics;
    const el = thumbElRef.current;
    if (el) applyThumbMetricsLive(el, metrics);
  }, []);

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
    // Press/drag owns the thumb via writeThumbMetrics — do not sync from React here.
    if (dragState.pressing || dragState.active) return;

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

    if (prefersReducedMotion) {
      syncThumb(next, true);
      return;
    }

    if (metricsApproxEqual(startMetrics, next)) {
      // Already targeting this geometry (e.g. press started the slide). Do not
      // re-apply with data-instant — that forced the in-flight transition to finish
      // the moment the finger lifted.
      metricsRef.current = next;
      setThumb(next);
      return;
    }

    syncThumb(next, false);
  }, [selectedValue, measureThumb, syncThumb, dragState.active, dragState.pressing]);

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

  return { thumb, onThumbRef, writeThumbMetrics, writeThumbMetricsLive };
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
  /** When true, the group fills its container and items split the width equally. */
  equalWidth?: boolean;
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
      equalWidth = false,
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
    });
    const { thumb, onThumbRef, writeThumbMetrics, writeThumbMetricsLive } =
      useSegmentatorThumb(groupRef, currentValue, layoutKey, dragState);

    const resetPointerInteraction = useCallback(() => {
      pointerDragRef.current?.cleanupWindowListeners?.();
      pointerDragRef.current = null;
      setDragPreviewValue(null);
      setDragState({ pressing: false, active: false });
      const thumbEl = groupRef.current?.querySelector<HTMLSpanElement>(
        ".aviala-segmentator-thumb"
      );
      if (thumbEl) {
        thumbEl.removeAttribute("data-pressing");
        // Leave data-instant cleared so the settle animation can run.
        thumbEl.removeAttribute("data-instant");
      }
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
        } else if (drag.previewValue && drag.previewValue !== currentValue) {
          consumeClickRef.current = true;
          setValue(drag.previewValue);
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

        const { metrics, item } = computeDragThumbMetrics(
          group,
          items,
          clientX,
          fallback
        );
        const nextPreviewValue = item?.dataset.value ?? drag.previewValue;
        const itemChanged =
          !!nextPreviewValue && nextPreviewValue !== drag.previewValue;

        if (itemChanged) {
          triggerSegmentatorHaptic("select");
          // Hold animated writes long enough for the cross-item settle to play.
          drag.snapUntil = performance.now() + 540;
          if (nextPreviewValue) {
            setDragPreviewValue(nextPreviewValue);
          }
        }
        drag.previewValue = nextPreviewValue;

        const prev = drag.lastMetrics;
        const jumpDistance = prev
          ? Math.abs(metrics.x - prev.x) + Math.abs(metrics.width - prev.width)
          : Number.POSITIVE_INFINITY;
        const settling = performance.now() < (drag.snapUntil ?? 0);
        const shouldAnimate =
          itemChanged || settling || jumpDistance >= SEGMENTATOR_DRAG_ANIMATE_JUMP_PX;

        drag.lastMetrics = metrics;

        if (shouldAnimate) {
          writeThumbMetrics(metrics, false);
        } else {
          writeThumbMetricsLive(metrics);
        }
        return item;
      },
      [writeThumbMetrics, writeThumbMetricsLive]
    );

    const attachWindowDragListeners = useCallback(
      (pointerId: number) => {
        const onPointerMove = (event: PointerEvent) => {
          const drag = pointerDragRef.current;
          if (!drag || drag.pointerId !== pointerId) return;

          if (Math.abs(event.clientX - drag.startX) < SEGMENTATOR_DRAG_THRESHOLD_PX) {
            return;
          }

          if (!drag.moved) {
            drag.moved = true;
            setDragState({ pressing: true, active: true });
          }
          event.preventDefault();
          updateDragThumb(event.clientX);
        };

        const onPointerEnd = (event: PointerEvent) => {
          if (event.pointerId !== pointerId) return;
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

      const metrics = measureItemThumbMetrics(pressedItem, group);
      const pressedValue = pressedItem.dataset.value ?? currentValue;

      triggerSegmentatorHaptic("press");
      event.preventDefault();

      pointerDragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        moved: false,
        fallback: metrics,
        previewValue: pressedValue,
        lastMetrics: metrics,
      };
      pointerDragRef.current.cleanupWindowListeners = attachWindowDragListeners(
        event.pointerId
      );

      // Animate onto the pressed item (including when it wasn't selected), and
      // let press-scale transition run — do not use live/instant writes here.
      writeThumbMetrics(metrics, false);
      setDragPreviewValue(pressedValue);
      setDragState({ pressing: true, active: false });
      group.setPointerCapture(event.pointerId);
    };

    const thumbStyle: CSSProperties | undefined = thumb ? buildThumbStyle() : undefined;

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
          data-equal-width={equalWidth ? "true" : undefined}
          data-mode={mode}
          data-dragging={dragState.active ? "true" : undefined}
          data-pressing={dragState.pressing ? "true" : undefined}
          onPointerDown={handlePointerDown}
          onPointerUp={finishPointerDrag}
          onPointerCancel={finishPointerDrag}
          onLostPointerCapture={finishPointerDrag}
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
        <span className="aviala-segmentator-item__content">
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
        </span>
      </button>
    );
  }
);
SegmentatorItem.displayName = "SegmentatorItem";
