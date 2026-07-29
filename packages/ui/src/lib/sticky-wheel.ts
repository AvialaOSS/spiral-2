/**
 * Sticky wheel helpers — same continuous dwell curve used by Segmentator.
 * Pulls fractional progress toward item centers so slow scrolls linger, then
 * settle animates onto the sticky-biased nearest item.
 */

/** 0 = linear, higher = stronger dwell near item centers. */
export const WHEEL_STICKY_AMOUNT = 0.45;

/** Debounce after the last scroll event before settling. */
export const WHEEL_SCROLL_END_MS = 100;

/**
 * Mouse-wheel step threshold as a fraction of item pitch.
 * Base 0.5 + sticky bias → need a clearer intent to leave the current item.
 */
export const WHEEL_STEP_THRESHOLD_FACTOR = 0.5 + WHEEL_STICKY_AMOUNT * 0.35;

/**
 * Continuous sticky remap: dwells near 0 / 1 and moves faster through the midpoint.
 */
export function stickyRemapProgress(t: number, amount: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  if (amount <= 0) return clamped;

  const exponent = 1 + amount * 2;
  if (clamped <= 0.5) {
    return 0.5 * Math.pow(2 * clamped, exponent);
  }
  return 1 - 0.5 * Math.pow(2 * (1 - clamped), exponent);
}

/** Map a fractional scroll index onto a sticky-biased integer item index. */
export function stickyRoundIndex(
  fractionalIndex: number,
  stickiness: number = WHEEL_STICKY_AMOUNT
): number {
  const base = Math.floor(fractionalIndex);
  const frac = fractionalIndex - base;
  const sticky = stickyRemapProgress(frac, stickiness);
  return sticky < 0.5 ? base : base + 1;
}
