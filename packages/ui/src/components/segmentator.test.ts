import { describe, expect, it } from "vitest";
import {
  isSegmentatorDragPointer,
  metricsApproxEqual,
  type SegmentatorThumbMetrics,
} from "./segmentator";

describe("segmentator metricsApproxEqual", () => {
  const base: SegmentatorThumbMetrics = {
    x: 10,
    y: 20,
    width: 80,
    height: 40,
  };

  it("returns true for identical metrics", () => {
    expect(metricsApproxEqual(base, base)).toBe(true);
  });

  it("returns true within default epsilon", () => {
    expect(
      metricsApproxEqual(base, { x: 10.2, y: 20.3, width: 80.1, height: 40.4 })
    ).toBe(true);
  });

  it("returns false when x differs beyond epsilon", () => {
    expect(metricsApproxEqual(base, { ...base, x: 11 })).toBe(false);
  });

  it("returns false when width differs beyond epsilon", () => {
    expect(metricsApproxEqual(base, { ...base, width: 82 })).toBe(false);
  });

  it("accepts custom epsilon", () => {
    expect(metricsApproxEqual(base, { ...base, x: 13 }, 5)).toBe(true);
    expect(metricsApproxEqual(base, { ...base, x: 16 }, 5)).toBe(false);
  });
});

describe("isSegmentatorDragPointer", () => {
  it("returns true for touch", () => {
    expect(isSegmentatorDragPointer("touch")).toBe(true);
  });

  it("returns true for pen", () => {
    expect(isSegmentatorDragPointer("pen")).toBe(true);
  });
});
