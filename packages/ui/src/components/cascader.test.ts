import { describe, expect, it } from "vitest";
import {
  findOptionPath,
  getLabelsForPath,
  getOptionsAtPath,
  isPathOnSelectedPath,
  type CascaderOption,
} from "./cascader";

const options: CascaderOption[] = [
  {
    value: "a",
    label: "A",
    children: [
      {
        value: "a1",
        label: "A-1",
        children: [
          { value: "a1x", label: "A-1-X" },
          { value: "a1y", label: "A-1-Y" },
        ],
      },
      { value: "a2", label: "A-2" },
    ],
  },
  { value: "b", label: "B" },
  { value: "c", label: "C", disabled: true },
];

describe("findOptionPath", () => {
  it("finds root-level option", () => {
    const result = findOptionPath(options, ["a"]);
    expect(result).toEqual(options[0]);
  });

  it("finds nested option", () => {
    const result = findOptionPath(options, ["a", "a1", "a1x"]);
    expect(result?.value).toBe("a1x");
    expect(result?.label).toBe("A-1-X");
  });

  it("returns undefined for non-existent path", () => {
    expect(findOptionPath(options, ["z"])).toBeUndefined();
    expect(findOptionPath(options, ["a", "z"])).toBeUndefined();
  });

  it("returns undefined for empty path", () => {
    expect(findOptionPath(options, [])).toBeUndefined();
  });

  it("finds disabled options", () => {
    const result = findOptionPath(options, ["c"]);
    expect(result?.disabled).toBe(true);
  });
});

describe("getOptionsAtPath", () => {
  it("returns root options for empty path", () => {
    expect(getOptionsAtPath(options, [])).toEqual(options);
  });

  it("returns children at valid path", () => {
    const children = getOptionsAtPath(options, ["a"]);
    expect(children).toHaveLength(2);
    expect(children[0].value).toBe("a1");
    expect(children[1].value).toBe("a2");
  });

  it("returns empty array for leaf node", () => {
    expect(getOptionsAtPath(options, ["b"])).toEqual([]);
  });

  it("returns empty array for non-existent path", () => {
    expect(getOptionsAtPath(options, ["z"])).toEqual([]);
  });

  it("returns deep children", () => {
    const children = getOptionsAtPath(options, ["a", "a1"]);
    expect(children).toHaveLength(2);
    expect(children[0].value).toBe("a1x");
  });
});

describe("getLabelsForPath", () => {
  it("returns labels for a valid path", () => {
    expect(getLabelsForPath(options, ["a", "a1", "a1x"])).toEqual([
      "A",
      "A-1",
      "A-1-X",
    ]);
  });

  it("returns partial labels when path is invalid mid-way", () => {
    expect(getLabelsForPath(options, ["a", "z"])).toEqual(["A"]);
  });

  it("returns empty array for invalid root", () => {
    expect(getLabelsForPath(options, ["z"])).toEqual([]);
  });

  it("returns empty array for empty path", () => {
    expect(getLabelsForPath(options, [])).toEqual([]);
  });
});

describe("isPathOnSelectedPath", () => {
  it("returns true when path is a prefix of selectedPath", () => {
    expect(isPathOnSelectedPath(["a"], ["a", "a1", "a1x"])).toBe(true);
    expect(isPathOnSelectedPath(["a", "a1"], ["a", "a1", "a1x"])).toBe(true);
    expect(isPathOnSelectedPath(["a", "a1", "a1x"], ["a", "a1", "a1x"])).toBe(true);
  });

  it("returns false when path diverges", () => {
    expect(isPathOnSelectedPath(["b"], ["a", "a1"])).toBe(false);
    expect(isPathOnSelectedPath(["a", "a2"], ["a", "a1"])).toBe(false);
  });

  it("returns false when path is longer than selectedPath", () => {
    expect(isPathOnSelectedPath(["a", "a1", "a1x"], ["a"])).toBe(false);
  });

  it("returns false for empty path", () => {
    expect(isPathOnSelectedPath([], ["a", "a1"])).toBe(false);
  });

  it("returns false for empty selectedPath", () => {
    expect(isPathOnSelectedPath(["a"], [])).toBe(false);
  });
});
