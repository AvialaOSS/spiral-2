import type { Direction } from "./context";

export type PhysicalSide = "left" | "right";

/** Mirror a physical side under RTL (left ↔ right). */
export function mirrorSide(side: PhysicalSide, rtl: boolean): PhysicalSide {
  if (!rtl) return side;
  return side === "left" ? "right" : "left";
}

/** Same as `mirrorSide` but from a Direction value. */
export function mirrorSideForDirection(
  side: PhysicalSide,
  direction: Direction
): PhysicalSide {
  return mirrorSide(side, direction === "rtl");
}

/**
 * Chevron that points toward "forward" / "expand" / "next" in the reading direction.
 * LTR → right; RTL → left.
 */
export function forwardChevronSide(direction: Direction): PhysicalSide {
  return direction === "rtl" ? "left" : "right";
}

/**
 * Chevron that points toward "back" / "previous" in the reading direction.
 * LTR → left; RTL → right.
 */
export function backChevronSide(direction: Direction): PhysicalSide {
  return direction === "rtl" ? "right" : "left";
}
