import { describe, expect, it } from "vitest";
import {
  formatVideoTime,
  parseVideoTime,
  videoObjectFitToCss,
} from "./use-video-state";

describe("videoObjectFitToCss", () => {
  it("maps original to contain", () => {
    expect(videoObjectFitToCss("original")).toBe("contain");
  });

  it("maps stretch to fill", () => {
    expect(videoObjectFitToCss("stretch")).toBe("fill");
  });

  it("maps fill to cover", () => {
    expect(videoObjectFitToCss("fill")).toBe("cover");
  });
});

describe("formatVideoTime", () => {
  it("formats zero seconds", () => {
    expect(formatVideoTime(0)).toBe("00:00");
  });

  it("formats minutes and seconds", () => {
    expect(formatVideoTime(125)).toBe("02:05");
    expect(formatVideoTime(59)).toBe("00:59");
  });

  it("formats hours when >= 3600", () => {
    expect(formatVideoTime(3661)).toBe("01:01:01");
    expect(formatVideoTime(7200)).toBe("02:00:00");
  });

  it("handles negative and non-finite values", () => {
    expect(formatVideoTime(-1)).toBe("00:00");
    expect(formatVideoTime(Infinity)).toBe("00:00");
    expect(formatVideoTime(NaN)).toBe("00:00");
  });
});

describe("parseVideoTime", () => {
  it("parses mm:ss", () => {
    expect(parseVideoTime("02:05")).toBe(125);
    expect(parseVideoTime("00:59")).toBe(59);
  });

  it("parses h:mm:ss", () => {
    expect(parseVideoTime("1:01:01")).toBe(3661);
    expect(parseVideoTime("02:00:00")).toBe(7200);
  });

  it("handles current / duration format", () => {
    expect(parseVideoTime("02:05 / 05:00")).toBe(125);
  });

  it("returns null for invalid input", () => {
    expect(parseVideoTime("")).toBeNull();
    expect(parseVideoTime("abc")).toBeNull();
    expect(parseVideoTime("00:60")).toBeNull(); // seconds >= 60
    expect(parseVideoTime("0:60:00")).toBeNull(); // minutes >= 60 in h:mm:ss
  });
});
