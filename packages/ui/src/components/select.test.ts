import { describe, expect, it } from "vitest";
import { getComponentDisplayName } from "./select";

describe("getComponentDisplayName", () => {
  it("returns displayName from a function component", () => {
    function MyComponent() {
      return null;
    }
    MyComponent.displayName = "MyComponent";
    expect(getComponentDisplayName(MyComponent)).toBe("MyComponent");
  });

  it("returns displayName from an object with displayName", () => {
    const component = { displayName: "ForwardRef(Select)" };
    expect(getComponentDisplayName(component)).toBe("ForwardRef(Select)");
  });

  it("returns undefined when no displayName is set", () => {
    function Plain() {
      return null;
    }
    expect(getComponentDisplayName(Plain)).toBeUndefined();
  });

  it("returns undefined for string types", () => {
    expect(getComponentDisplayName("div")).toBeUndefined();
  });

  it("returns undefined for null or undefined", () => {
    expect(getComponentDisplayName(null)).toBeUndefined();
    expect(getComponentDisplayName(undefined)).toBeUndefined();
  });

  it("returns undefined for primitive types", () => {
    expect(getComponentDisplayName(42)).toBeUndefined();
    expect(getComponentDisplayName(true)).toBeUndefined();
  });
});
