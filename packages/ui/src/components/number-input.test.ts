import { describe, expect, it } from "vitest";
import {
  clamp,
  decimalPlaces,
  parseNumeric,
  resolveInputState,
  stepValue,
} from "./number-input";

describe("parseNumeric", () => {
  it("returns null for empty or whitespace-only strings", () => {
    expect(parseNumeric("")).toBeNull();
    expect(parseNumeric("  ")).toBeNull();
    expect(parseNumeric("\t")).toBeNull();
  });

  it("parses integer strings", () => {
    expect(parseNumeric("42")).toBe(42);
    expect(parseNumeric("-7")).toBe(-7);
    expect(parseNumeric("0")).toBe(0);
  });

  it("parses decimal strings", () => {
    expect(parseNumeric("3.14")).toBe(3.14);
    expect(parseNumeric("-0.5")).toBe(-0.5);
  });

  it("returns null for non-numeric strings", () => {
    expect(parseNumeric("abc")).toBeNull();
    expect(parseNumeric("12abc")).toBeNull();
  });

  it("returns null for Infinity", () => {
    expect(parseNumeric("Infinity")).toBeNull();
    expect(parseNumeric("-Infinity")).toBeNull();
  });
});

describe("clamp", () => {
  it("returns value when within bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to min when value is below", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it("clamps to max when value is above", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("works without min", () => {
    expect(clamp(-100, undefined, 10)).toBe(-100);
    expect(clamp(100, undefined, 10)).toBe(10);
  });

  it("works without max", () => {
    expect(clamp(-100, 0, undefined)).toBe(0);
    expect(clamp(100, 0, undefined)).toBe(100);
  });

  it("works without any bounds", () => {
    expect(clamp(42)).toBe(42);
  });

  it("ignores non-finite bounds", () => {
    expect(clamp(5, Number.NaN, 10)).toBe(5);
    expect(clamp(5, 0, Number.NaN)).toBe(5);
  });
});

describe("decimalPlaces", () => {
  it("returns 0 for integers", () => {
    expect(decimalPlaces(0)).toBe(0);
    expect(decimalPlaces(42)).toBe(0);
    expect(decimalPlaces(-7)).toBe(0);
  });

  it("counts decimal digits correctly", () => {
    expect(decimalPlaces(3.14)).toBe(2);
    expect(decimalPlaces(0.1)).toBe(1);
    expect(decimalPlaces(1.234)).toBe(3);
  });

  it("returns 0 for non-finite numbers", () => {
    expect(decimalPlaces(Number.NaN)).toBe(0);
    expect(decimalPlaces(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("stepValue", () => {
  it("steps up from current value", () => {
    expect(stepValue(5, 1, 1)).toBe(6);
  });

  it("steps down from current value", () => {
    expect(stepValue(5, -1, 1)).toBe(4);
  });

  it("steps up from null using min or 0", () => {
    expect(stepValue(null, 1, 1, 0, 10)).toBe(1);
    expect(stepValue(null, 1, 1, 5, 10)).toBe(6);
    expect(stepValue(null, 1, 1)).toBe(1);
  });

  it("steps down from null using max or 0", () => {
    expect(stepValue(null, -1, 1, 0, 10)).toBe(9);
    expect(stepValue(null, -1, 1)).toBe(-1);
  });

  it("clamps to max when stepping above", () => {
    expect(stepValue(9.5, 1, 1, 0, 10)).toBe(10);
  });

  it("clamps to min when stepping below", () => {
    expect(stepValue(0.5, -1, 1, 0, 10)).toBe(0);
  });

  it("handles decimal steps without float noise", () => {
    expect(stepValue(0.1, 1, 0.1, 0, 1)).toBe(0.2);
    expect(stepValue(0.9, 1, 0.1, 0, 1)).toBe(1);
  });

  it("handles custom step values", () => {
    expect(stepValue(10, 1, 5)).toBe(15);
    expect(stepValue(10, -1, 5)).toBe(5);
  });
});

describe("resolveInputState", () => {
  it("returns empty when value and default are empty", () => {
    expect(resolveInputState("", undefined, false)).toBe("empty");
    expect(resolveInputState(undefined, undefined, false)).toBe("empty");
    expect(resolveInputState(undefined, "", false)).toBe("empty");
  });

  it("returns typing when focused with value", () => {
    expect(resolveInputState("42", undefined, true)).toBe("typing");
  });

  it("returns fill when not focused with value", () => {
    expect(resolveInputState("42", undefined, false)).toBe("fill");
  });

  it("prefers value over defaultValue", () => {
    expect(resolveInputState("5", "10", false)).toBe("fill");
    expect(resolveInputState("", "10", false)).toBe("empty");
  });
});
