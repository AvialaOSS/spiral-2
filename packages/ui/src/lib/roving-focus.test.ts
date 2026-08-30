import { describe, expect, it } from "vitest";
import { resolveRovingIndex, resolveRovingMove } from "./roving-focus";

describe("resolveRovingMove", () => {
  it("maps arrows to the horizontal axis", () => {
    expect(resolveRovingMove("ArrowRight", "horizontal")).toBe("next");
    expect(resolveRovingMove("ArrowLeft", "horizontal")).toBe("prev");
    expect(resolveRovingMove("ArrowDown", "horizontal")).toBeNull();
  });

  it("maps arrows to the vertical axis", () => {
    expect(resolveRovingMove("ArrowDown", "vertical")).toBe("next");
    expect(resolveRovingMove("ArrowUp", "vertical")).toBe("prev");
    expect(resolveRovingMove("ArrowRight", "vertical")).toBeNull();
  });

  it("flips the horizontal axis in RTL", () => {
    expect(resolveRovingMove("ArrowRight", "horizontal", true)).toBe("prev");
    expect(resolveRovingMove("ArrowLeft", "horizontal", true)).toBe("next");
  });

  it("keeps Home/End on both axes", () => {
    expect(resolveRovingMove("Home", "vertical")).toBe("first");
    expect(resolveRovingMove("End", "horizontal")).toBe("last");
  });

  it("ignores unrelated keys", () => {
    expect(resolveRovingMove("a", "both")).toBeNull();
    expect(resolveRovingMove("Enter", "both")).toBeNull();
  });
});

describe("resolveRovingIndex", () => {
  it("steps within bounds", () => {
    expect(resolveRovingIndex(0, 3, "next")).toBe(1);
    expect(resolveRovingIndex(2, 3, "prev")).toBe(1);
  });

  it("wraps at the ends when looping", () => {
    expect(resolveRovingIndex(2, 3, "next")).toBe(0);
    expect(resolveRovingIndex(0, 3, "prev")).toBe(2);
  });

  it("clamps at the ends when not looping", () => {
    expect(resolveRovingIndex(2, 3, "next", false)).toBe(2);
    expect(resolveRovingIndex(0, 3, "prev", false)).toBe(0);
  });

  it("enters from either end when nothing is focused", () => {
    expect(resolveRovingIndex(-1, 3, "next")).toBe(0);
    expect(resolveRovingIndex(-1, 3, "prev")).toBe(2);
  });

  it("jumps to the first and last item", () => {
    expect(resolveRovingIndex(1, 4, "first")).toBe(0);
    expect(resolveRovingIndex(1, 4, "last")).toBe(3);
  });

  it("returns -1 for an empty set", () => {
    expect(resolveRovingIndex(0, 0, "next")).toBe(-1);
  });
});
