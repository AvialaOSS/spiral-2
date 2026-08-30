/** Which axis a composite widget answers arrow keys on. */
export type RovingOrientation = "horizontal" | "vertical" | "both";

export type RovingMove = "next" | "prev" | "first" | "last";

/** Item selectors used by menu-style widgets; disabled rows must stay skippable. */
const DISABLED_SELECTOR = '[disabled], [aria-disabled="true"], [data-disabled]';

/**
 * Map a key to a roving move for the given orientation.
 * Returns null when the key is not part of the widget's keyboard model.
 */
export function resolveRovingMove(
  key: string,
  orientation: RovingOrientation,
  rtl = false
): RovingMove | null {
  switch (key) {
    case "ArrowRight":
      if (orientation === "vertical") return null;
      return rtl ? "prev" : "next";
    case "ArrowLeft":
      if (orientation === "vertical") return null;
      return rtl ? "next" : "prev";
    case "ArrowDown":
      return orientation === "horizontal" ? null : "next";
    case "ArrowUp":
      return orientation === "horizontal" ? null : "prev";
    case "Home":
      return "first";
    case "End":
      return "last";
    default:
      return null;
  }
}

/**
 * Index a roving move lands on. `current` may be -1 when nothing is focused yet,
 * in which case `next` enters at the start and `prev` at the end.
 */
export function resolveRovingIndex(
  current: number,
  count: number,
  move: RovingMove,
  loop = true
): number {
  if (count <= 0) return -1;

  switch (move) {
    case "first":
      return 0;
    case "last":
      return count - 1;
    case "next": {
      const next = current + 1;
      if (next < count) return next;
      return loop ? 0 : count - 1;
    }
    case "prev": {
      const prev = current - 1;
      if (prev >= 0) return prev;
      return loop ? count - 1 : 0;
    }
  }
}

export function isRovingItemEnabled(item: Element): boolean {
  return !item.matches(DISABLED_SELECTOR);
}

export type RovingItemOptions<T extends HTMLElement> = {
  loop?: boolean;
  /** Extra scoping, e.g. to drop items that belong to a nested panel. */
  filter?: (item: T) => boolean;
};

/** Enabled items inside `container`, in DOM order. */
export function collectRovingItems<T extends HTMLElement = HTMLElement>(
  container: Element | null | undefined,
  selector: string,
  filter?: (item: T) => boolean
): T[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<T>(selector)).filter(
    (item) => isRovingItemEnabled(item) && (filter?.(item) ?? true)
  );
}

/**
 * Move DOM focus to the sibling a roving move points at.
 * Returns the newly focused item, or null when there is nothing to move to.
 */
export function focusRovingSibling<T extends HTMLElement = HTMLElement>(
  container: Element | null | undefined,
  current: Element | null,
  move: RovingMove,
  selector: string,
  { loop = true, filter }: RovingItemOptions<T> = {}
): T | null {
  const items = collectRovingItems<T>(container, selector, filter);
  if (items.length === 0) return null;

  const currentIndex = current instanceof HTMLElement ? items.indexOf(current as T) : -1;
  const next = items[resolveRovingIndex(currentIndex, items.length, move, loop)];
  if (!next) return null;

  next.focus();
  return next;
}
