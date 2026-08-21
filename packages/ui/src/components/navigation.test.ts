import { describe, expect, it } from "vitest";
import {
  easeOutQuint,
  metricsApproxEqual,
  navigationItemButtonMode,
  parseDurationMs,
  type IndicatorMetrics,
} from "./navigation";

describe("navigationItemButtonMode", () => {
  it("returns second when active", () => {
    expect(navigationItemButtonMode(true)).toBe("second");
  });

  it("returns noBackgroundCustom when not active", () => {
    expect(navigationItemButtonMode(false)).toBe("noBackgroundCustom");
  });
});

describe("parseDurationMs", () => {
  it("parses millisecond values", () => {
    expect(parseDurationMs("300ms")).toBe(300);
    expect(parseDurationMs("0ms")).toBe(300); // NaN fallback
  });

  it("parses second values", () => {
    expect(parseDurationMs("0.3s")).toBe(300);
    expect(parseDurationMs("1s")).toBe(1000);
    expect(parseDurationMs("0s")).toBe(300); // 0 * 1000 = 0, but 0 is falsy → fallback
  });

  it("parses bare numbers", () => {
    expect(parseDurationMs("250")).toBe(250);
  });

  it("returns fallback for empty or whitespace strings", () => {
    expect(parseDurationMs("")).toBe(300);
    expect(parseDurationMs("  ")).toBe(300);
  });

  it("returns fallback for non-numeric values", () => {
    expect(parseDurationMs("abc")).toBe(300);
  });
});

describe("easeOutQuint", () => {
  it("starts at 0", () => {
    expect(easeOutQuint(0)).toBe(0);
  });

  it("ends at 1", () => {
    expect(easeOutQuint(1)).toBe(1);
  });

  it("is an easing function (output > input at midpoint)", () => {
    // easeOutQuint is concave — at t=0.5 the value should be well past 0.5
    expect(easeOutQuint(0.5)).toBeGreaterThan(0.5);
  });

  it("monotonically increases", () => {
    const v1 = easeOutQuint(0.2);
    const v2 = easeOutQuint(0.5);
    const v3 = easeOutQuint(0.8);
    expect(v1).toBeLessThan(v2);
    expect(v2).toBeLessThan(v3);
  });
});

describe("metricsApproxEqual", () => {
  const base: IndicatorMetrics = {
    x: 10,
    y: 20,
    width: 100,
    height: 50,
    visible: true,
  };

  it("returns true for identical metrics", () => {
    expect(metricsApproxEqual(base, base)).toBe(true);
  });

  it("returns true within default epsilon", () => {
    expect(
      metricsApproxEqual(base, { ...base, x: 10.3, y: 20.2 })
    ).toBe(true);
  });

  it("returns false beyond default epsilon", () => {
    expect(
      metricsApproxEqual(base, { ...base, x: 11 })
    ).toBe(false);
  });

  it("respects custom epsilon", () => {
    expect(metricsApproxEqual(base, { ...base, x: 14 }, 5)).toBe(true);
    expect(metricsApproxEqual(base, { ...base, x: 16 }, 5)).toBe(false);
  });

  it("compares visible flag", () => {
    expect(metricsApproxEqual(base, { ...base, visible: false })).toBe(false);
  });
});
