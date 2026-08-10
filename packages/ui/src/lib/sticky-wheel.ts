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
 * Decoupled from stickiness so drag dwell and wheel notches can be tuned apart.
 */
export const WHEEL_STEP_THRESHOLD_FACTOR = 0.35;

/** Clear leftover wheel delta after this idle gap (touchpad residual). */
export const WHEEL_ACCUM_IDLE_MS = 140;

/** Default number of repeated copies for infinite loop lists. */
export const WHEEL_LOOP_SECTIONS = 3;

/** Middle copy index for a 3-section loop buffer. */
export const WHEEL_LOOP_MIDDLE_SECTION = 1;

/**
 * Fold a wheel delta into an accumulator and consume whole steps.
 * Reversing direction resets the accumulator so leftover opposite delta
 * cannot immediately bounce back.
 */
export function consumeWheelSteps(
  accum: number,
  deltaY: number,
  threshold: number
): { nextAccum: number; steps: number } {
  if (!(threshold > 0) || !Number.isFinite(deltaY) || deltaY === 0) {
    return { nextAccum: accum, steps: 0 };
  }

  let nextAccum = accum;
  if (nextAccum !== 0 && Math.sign(nextAccum) !== Math.sign(deltaY)) {
    nextAccum = 0;
  }
  nextAccum += deltaY;

  const steps = Math.trunc(nextAccum / threshold);
  if (steps === 0) {
    return { nextAccum, steps: 0 };
  }

  nextAccum -= steps * threshold;
  return { nextAccum, steps };
}

export function normalizeWheelIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

/**
 * Map a raw index onto the middle loop copy while keeping the same value slot.
 */
export function recenterLoopIndex(
  rawIndex: number,
  length: number,
  middleSection: number = WHEEL_LOOP_MIDDLE_SECTION
): number {
  if (length <= 0) return 0;
  return middleSection * length + normalizeWheelIndex(rawIndex, length);
}

/**
 * Pick the absolute loop copy of `valueIndex` closest to `currentRawIndex`.
 * `preferDelta` breaks ties toward the scroll direction (+1 / -1).
 */
export function nearestLoopIndex(
  currentRawIndex: number,
  valueIndex: number,
  length: number,
  sections: number = WHEEL_LOOP_SECTIONS,
  preferDelta: number = 0
): number {
  if (length <= 0 || sections <= 0) return 0;

  const slot = normalizeWheelIndex(valueIndex, length);
  let best = slot;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let section = 0; section < sections; section += 1) {
    const candidate = section * length + slot;
    const distance = Math.abs(candidate - currentRawIndex);
    const directionBias =
      preferDelta === 0
        ? 0
        : Math.sign(candidate - currentRawIndex) === Math.sign(preferDelta)
          ? -0.25
          : 0.25;
    const score = distance + directionBias;
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return best;
}

/**
 * Step a raw loop index by `steps`. If already on an outer copy, recenter into
 * the middle copy first so the gesture still has buffer room. Landing on an
 * outer copy is allowed — settle handles the silent wrap.
 */
export function stepLoopRawIndex(
  currentRawIndex: number,
  steps: number,
  length: number,
  sections: number = WHEEL_LOOP_SECTIONS,
  middleSection: number = WHEEL_LOOP_MIDDLE_SECTION
): { rawIndex: number; didRecenter: boolean } {
  if (length <= 0) return { rawIndex: 0, didRecenter: false };

  const maxIndex = sections * length - 1;
  let rawIndex = currentRawIndex;
  let didRecenter = false;

  const section = Math.floor(rawIndex / length);
  if (section !== middleSection) {
    rawIndex = recenterLoopIndex(rawIndex, length, middleSection);
    didRecenter = true;
  }

  const next = rawIndex + steps;
  if (next < 0 || next > maxIndex) {
    return {
      rawIndex: recenterLoopIndex(next, length, middleSection),
      didRecenter: true,
    };
  }

  return { rawIndex: next, didRecenter };
}

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
