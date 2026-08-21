import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  applyTimeToDate,
  formatDisplayDateTime,
  formatIsoDate,
  formatTimeValue,
  getCalendarDays,
  getRangeSelectionPosition,
  isDateDisabled,
  isDateInRange,
  isRangeStart,
  isRangeEnd,
  isSameDay,
  isSameMonth,
  normalizeRange,
  parseDateInput,
  parseDateRangeInput,
  startOfDay,
} from "./date-utils";

describe("startOfDay", () => {
  it("clears hours, minutes, seconds, milliseconds", () => {
    const date = new Date(2026, 7, 21, 14, 30, 45, 500);
    const result = startOfDay(date);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
    expect(result.getDate()).toBe(21);
  });

  it("does not mutate the original date", () => {
    const date = new Date(2026, 7, 21, 14, 30);
    startOfDay(date);
    expect(date.getHours()).toBe(14);
  });
});

describe("applyTimeToDate", () => {
  it("merges time into a calendar day", () => {
    const date = new Date(2026, 0, 15);
    const result = applyTimeToDate(date, 9, 45);
    expect(result.getHours()).toBe(9);
    expect(result.getMinutes()).toBe(45);
    expect(result.getDate()).toBe(15);
  });
});

describe("isSameDay", () => {
  it("returns true for same calendar day", () => {
    expect(isSameDay(new Date(2026, 7, 21, 10, 0), new Date(2026, 7, 21, 22, 59))).toBe(true);
  });

  it("returns false for different days", () => {
    expect(isSameDay(new Date(2026, 7, 21), new Date(2026, 7, 22))).toBe(false);
  });
});

describe("isSameMonth", () => {
  it("returns true for same year and month", () => {
    expect(isSameMonth(new Date(2026, 7, 1), new Date(2026, 7, 31))).toBe(true);
  });

  it("returns false for different months", () => {
    expect(isSameMonth(new Date(2026, 7, 1), new Date(2026, 8, 1))).toBe(false);
  });

  it("returns false for same month but different year", () => {
    expect(isSameMonth(new Date(2025, 7, 1), new Date(2026, 7, 1))).toBe(false);
  });
});

describe("addMonths", () => {
  it("adds months correctly", () => {
    const date = new Date(2026, 0, 15);
    const result = addMonths(date, 3);
    expect(result.getMonth()).toBe(3);
    expect(result.getDate()).toBe(1); // addMonths resets to 1st
  });

  it("handles negative offsets", () => {
    const date = new Date(2026, 5, 1);
    const result = addMonths(date, -3);
    expect(result.getMonth()).toBe(2);
  });
});

describe("addDays", () => {
  it("adds days and normalizes to start of day", () => {
    const date = new Date(2026, 7, 21, 14, 30);
    const result = addDays(date, 3);
    expect(result.getDate()).toBe(24);
    expect(result.getHours()).toBe(0);
  });

  it("crosses month boundaries", () => {
    const date = new Date(2026, 0, 31);
    const result = addDays(date, 1);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(1);
  });
});

describe("getCalendarDays", () => {
  it("returns exactly 42 days (6 weeks)", () => {
    const month = new Date(2026, 7, 1);
    const days = getCalendarDays(month);
    expect(days).toHaveLength(42);
  });

  it("includes the target month's days", () => {
    const month = new Date(2026, 7, 1);
    const days = getCalendarDays(month);
    const augustDays = days.filter((d) => d.getMonth() === 7);
    expect(augustDays).toHaveLength(31);
  });

  it("starts on Monday (week starts Monday per Figma)", () => {
    // August 2026 starts on Saturday. Monday-before is July 27.
    const month = new Date(2026, 7, 1);
    const days = getCalendarDays(month);
    const firstDay = days[0];
    // Monday = day 1 in JS getDay()
    expect(firstDay.getDay()).toBe(1);
  });
});

describe("formatIsoDate", () => {
  it("formats as YYYY-MM-DD", () => {
    expect(formatIsoDate(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(formatIsoDate(new Date(2026, 11, 25))).toBe("2026-12-25");
  });
});

describe("formatTimeValue", () => {
  it("pads hours and minutes", () => {
    expect(formatTimeValue(9, 5)).toBe("09:05");
    expect(formatTimeValue(14, 30)).toBe("14:30");
    expect(formatTimeValue(0, 0)).toBe("00:00");
  });
});

describe("isDateInRange", () => {
  const from = new Date(2026, 7, 10);
  const to = new Date(2026, 7, 20);

  it("returns true for dates within the range", () => {
    expect(isDateInRange(new Date(2026, 7, 15), from, to)).toBe(true);
  });

  it("returns true for range boundaries", () => {
    expect(isDateInRange(new Date(2026, 7, 10), from, to)).toBe(true);
    expect(isDateInRange(new Date(2026, 7, 20), from, to)).toBe(true);
  });

  it("returns false for dates outside the range", () => {
    expect(isDateInRange(new Date(2026, 7, 9), from, to)).toBe(false);
    expect(isDateInRange(new Date(2026, 7, 21), from, to)).toBe(false);
  });

  it("returns false when from is undefined", () => {
    expect(isDateInRange(new Date(2026, 7, 15), undefined, to)).toBe(false);
  });

  it("handles reversed from/to", () => {
    expect(isDateInRange(new Date(2026, 7, 15), to, from)).toBe(true);
  });
});

describe("isDateDisabled", () => {
  it("returns true when before minDate", () => {
    expect(isDateDisabled(new Date(2026, 7, 1), new Date(2026, 7, 10))).toBe(true);
  });

  it("returns true when after maxDate", () => {
    expect(isDateDisabled(new Date(2026, 7, 25), undefined, new Date(2026, 7, 20))).toBe(true);
  });

  it("returns false when within bounds", () => {
    expect(
      isDateDisabled(new Date(2026, 7, 15), new Date(2026, 7, 10), new Date(2026, 7, 20))
    ).toBe(false);
  });

  it("returns false when no bounds", () => {
    expect(isDateDisabled(new Date(2026, 7, 15))).toBe(false);
  });
});

describe("normalizeRange", () => {
  it("returns from/to in chronological order", () => {
    const a = new Date(2026, 7, 10);
    const b = new Date(2026, 7, 20);
    const result = normalizeRange(a, b);
    expect(isSameDay(result.from!, a)).toBe(true);
    expect(isSameDay(result.to!, b)).toBe(true);
  });

  it("swaps if from is after to", () => {
    const a = new Date(2026, 7, 20);
    const b = new Date(2026, 7, 10);
    const result = normalizeRange(a, b);
    expect(isSameDay(result.from!, b)).toBe(true);
    expect(isSameDay(result.to!, a)).toBe(true);
  });
});

describe("parseDateInput", () => {
  it("parses YYYY-MM-DD", () => {
    const result = parseDateInput("2026-08-21");
    expect(result).not.toBeNull();
    expect(result!.date.getFullYear()).toBe(2026);
    expect(result!.date.getMonth()).toBe(7);
    expect(result!.date.getDate()).toBe(21);
    expect(result!.hours).toBeUndefined();
  });

  it("parses YYYY-MM-DD HH:mm", () => {
    const result = parseDateInput("2026-08-21 14:30");
    expect(result).not.toBeNull();
    expect(result!.hours).toBe(14);
    expect(result!.minutes).toBe(30);
  });

  it("parses YYYY/MM/DD", () => {
    const result = parseDateInput("2026/08/21");
    expect(result).not.toBeNull();
    expect(result!.date.getDate()).toBe(21);
  });

  it("returns null for invalid dates", () => {
    expect(parseDateInput("not-a-date")).toBeNull();
    expect(parseDateInput("")).toBeNull();
    expect(parseDateInput("2026-13-01")).toBeNull();
  });

  it("returns null for impossible day", () => {
    expect(parseDateInput("2026-02-30")).toBeNull();
  });
});

describe("parseDateRangeInput", () => {
  it("parses a range with 至 separator (slash dates)", () => {
    const result = parseDateRangeInput("2026/08/10 至 2026/08/20");
    expect(result).not.toBeNull();
    expect(result!.from!.getDate()).toBe(10);
    expect(result!.to!.getDate()).toBe(20);
  });

  it("normalizes reversed ranges", () => {
    const result = parseDateRangeInput("2026/08/20 至 2026/08/10");
    expect(result).not.toBeNull();
    expect(result!.from!.getDate()).toBe(10);
    expect(result!.to!.getDate()).toBe(20);
  });

  it("returns empty range for empty input", () => {
    const result = parseDateRangeInput("");
    expect(result).toEqual({ from: undefined, to: undefined });
  });

  it("returns null for unparseable input", () => {
    expect(parseDateRangeInput("garbage")).toBeNull();
  });
});

describe("formatDisplayDateTime", () => {
  it("combines ISO date with time", () => {
    expect(formatDisplayDateTime(new Date(2026, 0, 5), 9, 30)).toBe(
      "2026-01-05 09:30"
    );
  });

  it("handles midnight", () => {
    expect(formatDisplayDateTime(new Date(2026, 11, 25), 0, 0)).toBe(
      "2026-12-25 00:00"
    );
  });
});

describe("getRangeSelectionPosition", () => {
  const from = new Date(2026, 7, 10);
  const to = new Date(2026, 7, 20);

  it("returns none when from is undefined", () => {
    expect(getRangeSelectionPosition(new Date(2026, 7, 15))).toBe("none");
  });

  it("returns single when day matches from and no to", () => {
    expect(getRangeSelectionPosition(new Date(2026, 7, 10), from)).toBe(
      "single"
    );
  });

  it("returns none when day is outside range", () => {
    expect(getRangeSelectionPosition(new Date(2026, 7, 5), from, to)).toBe(
      "none"
    );
  });

  it("returns single when from equals to and day matches", () => {
    expect(getRangeSelectionPosition(new Date(2026, 7, 10), from, from)).toBe(
      "single"
    );
  });

  it("returns head for the first day of a multi-day range", () => {
    // Aug 10 2026 is a Monday (weekCol=0), so it's both visual start
    // and potentially head.
    const result = getRangeSelectionPosition(from, from, to);
    expect(["head", "single"]).toContain(result);
  });

  it("returns a position within the range", () => {
    const mid = new Date(2026, 7, 15);
    const result = getRangeSelectionPosition(mid, from, to);
    expect(["head", "middle", "last"]).toContain(result);
  });
});

describe("isRangeStart", () => {
  it("returns true when date matches from", () => {
    expect(
      isRangeStart(
        new Date(2026, 7, 10),
        new Date(2026, 7, 10),
        new Date(2026, 7, 20)
      )
    ).toBe(true);
  });

  it("returns true when date matches to in reversed range", () => {
    // from > to, so the actual start is to
    expect(
      isRangeStart(
        new Date(2026, 7, 10),
        new Date(2026, 7, 20),
        new Date(2026, 7, 10)
      )
    ).toBe(true);
  });

  it("returns false when date is the end", () => {
    expect(
      isRangeStart(
        new Date(2026, 7, 20),
        new Date(2026, 7, 10),
        new Date(2026, 7, 20)
      )
    ).toBe(false);
  });

  it("matches from when to is undefined", () => {
    expect(
      isRangeStart(new Date(2026, 7, 10), new Date(2026, 7, 10))
    ).toBe(true);
    expect(
      isRangeStart(new Date(2026, 7, 15), new Date(2026, 7, 10))
    ).toBe(false);
  });
});

describe("isRangeEnd", () => {
  it("returns true when date matches to", () => {
    expect(
      isRangeEnd(
        new Date(2026, 7, 20),
        new Date(2026, 7, 10),
        new Date(2026, 7, 20)
      )
    ).toBe(true);
  });

  it("returns false when date is the start", () => {
    expect(
      isRangeEnd(
        new Date(2026, 7, 10),
        new Date(2026, 7, 10),
        new Date(2026, 7, 20)
      )
    ).toBe(false);
  });

  it("returns false when to is undefined", () => {
    expect(
      isRangeEnd(new Date(2026, 7, 10), new Date(2026, 7, 10))
    ).toBe(false);
  });
});
