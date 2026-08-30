/** Calendar helpers — no external date library. */

export type DateRange = {
  from?: Date;
  to?: Date;
};

/** @deprecated Prefer `useLocaleMessages("DatePicker").weekdays`. Kept for callers. */
export const WEEKDAY_LABELS = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "日",
] as const;

export type RangeSelectionPosition =
  "none" | "single" | "head" | "middle" | "last";

export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Merge calendar day with hours/minutes into a single Date. */
export function applyTimeToDate(
  date: Date,
  hours: number,
  minutes: number
): Date {
  const next = startOfDay(date);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function addMonths(date: Date, count: number): Date {
  const next = new Date(date);
  next.setDate(1);
  next.setMonth(next.getMonth() + count);
  return next;
}

export function addDays(date: Date, count: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return startOfDay(next);
}

export function getCalendarDays(month: Date): Date[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  /** Figma DateButtonGrid — week starts on Monday */
  const startOffset = (firstDay.getDay() + 6) % 7;
  const days: Date[] = [];

  for (let index = startOffset - 1; index >= 0; index -= 1) {
    days.push(new Date(year, monthIndex, -index));
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, monthIndex, day));
  }

  while (days.length < 42) {
    const nextDay = days.length - startOffset - lastDay.getDate() + 1;
    days.push(new Date(year, monthIndex + 1, nextDay));
  }

  return days;
}

export function formatDisplayDate(date: Date, locale = "zh-CN"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Figma DatePicker footer / trigger — `YYYY-MM-DD` */
export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDisplayDateTime(
  date: Date,
  hours: number,
  minutes: number
): string {
  return `${formatIsoDate(date)} ${formatTimeValue(hours, minutes)}`;
}

export function formatMonthYear(date: Date, locale = "zh-CN"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(date);
}

export function formatTimeValue(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function getRangeSelectionPosition(
  day: Date,
  from?: Date,
  to?: Date
): RangeSelectionPosition {
  if (!from) return "none";

  const dayNorm = startOfDay(day);

  if (!to) {
    return isSameDay(dayNorm, from) ? "single" : "none";
  }

  if (!isDateInRange(dayNorm, from, to)) return "none";

  const normalized = normalizeRange(from, to);
  const rangeStart = startOfDay(normalized.from!);
  const rangeEnd = startOfDay(normalized.to!);

  if (isSameDay(rangeStart, rangeEnd)) return "single";

  /** Figma DateButton — per-row Head/Middle/Last with row-break rounding */
  const weekCol = (dayNorm.getDay() + 6) % 7;
  const prevInRange = isDateInRange(addDays(dayNorm, -1), rangeStart, rangeEnd);
  const nextInRange = isDateInRange(addDays(dayNorm, 1), rangeStart, rangeEnd);
  const isVisualStart = !prevInRange || weekCol === 0;
  const isVisualEnd = !nextInRange || weekCol === 6;

  if (isVisualStart && isVisualEnd) return "single";
  if (isVisualStart) return "head";
  if (isVisualEnd) return "last";
  return "middle";
}

export function isDateInRange(date: Date, from?: Date, to?: Date): boolean {
  if (!from) return false;
  const time = startOfDay(date).getTime();
  const fromTime = startOfDay(from).getTime();
  if (!to) return time === fromTime;
  const toTime = startOfDay(to).getTime();
  const min = Math.min(fromTime, toTime);
  const max = Math.max(fromTime, toTime);
  return time >= min && time <= max;
}

export function isRangeStart(date: Date, from?: Date, to?: Date): boolean {
  if (!from) return false;
  if (!to) return isSameDay(date, from);
  const start =
    startOfDay(from).getTime() <= startOfDay(to).getTime() ? from : to;
  return isSameDay(date, start);
}

export function isRangeEnd(date: Date, from?: Date, to?: Date): boolean {
  if (!from || !to) return false;
  const end =
    startOfDay(from).getTime() <= startOfDay(to).getTime() ? to : from;
  return isSameDay(date, end);
}

export function isDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date
): boolean {
  const time = startOfDay(date).getTime();
  if (minDate && time < startOfDay(minDate).getTime()) return true;
  if (maxDate && time > startOfDay(maxDate).getTime()) return true;
  return false;
}

export function normalizeRange(from: Date, to: Date): DateRange {
  if (startOfDay(from).getTime() <= startOfDay(to).getTime()) {
    return { from, to };
  }
  return { from: to, to: from };
}

export type ParsedDateInput = {
  date: Date;
  hours?: number;
  minutes?: number;
};

function isValidYmd(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function parseTimeFragment(
  hoursText?: string,
  minutesText?: string
): { hours: number; minutes: number } | undefined {
  if (hoursText == null || minutesText == null) return undefined;
  const hours = Number(hoursText);
  const minutes = Number(minutesText);
  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return undefined;
  }
  return { hours, minutes };
}

/** Parse typed date strings: `YYYY-MM-DD`, `YYYY/MM/DD`, `YYYY.MM.DD`, optional `HH:mm`. */
export function parseDateInput(text: string): ParsedDateInput | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const ymd = trimmed.match(
    /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?$/
  );
  if (ymd) {
    const year = Number(ymd[1]);
    const month = Number(ymd[2]);
    const day = Number(ymd[3]);
    if (!isValidYmd(year, month, day)) return null;
    const time = parseTimeFragment(ymd[4], ymd[5]);
    if (ymd[4] != null && !time) return null;
    return {
      date: startOfDay(new Date(year, month - 1, day)),
      hours: time?.hours,
      minutes: time?.minutes,
    };
  }

  const mdy = trimmed.match(
    /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})(?:[ T](\d{1,2}):(\d{2}))?$/
  );
  if (mdy) {
    const month = Number(mdy[1]);
    const day = Number(mdy[2]);
    const year = Number(mdy[3]);
    if (!isValidYmd(year, month, day)) return null;
    const time = parseTimeFragment(mdy[4], mdy[5]);
    if (mdy[4] != null && !time) return null;
    return {
      date: startOfDay(new Date(year, month - 1, day)),
      hours: time?.hours,
      minutes: time?.minutes,
    };
  }

  return null;
}

const RANGE_SEPARATOR = /\s*(?:-|~|—|–|至)\s*/;

/** Parse range text like `2026-07-01 - 2026-07-15` or `2026/07/01 至 2026/07/15`. */
export function parseDateRangeInput(text: string): DateRange | null {
  const trimmed = text.trim();
  if (!trimmed) return { from: undefined, to: undefined };

  const parts = trimmed.split(RANGE_SEPARATOR).filter(Boolean);
  if (parts.length === 1) {
    const parsed = parseDateInput(parts[0]);
    if (!parsed) return null;
    return { from: parsed.date, to: undefined };
  }
  if (parts.length !== 2) return null;

  const fromParsed = parseDateInput(parts[0]);
  const toParsed = parseDateInput(parts[1]);
  if (!fromParsed || !toParsed) return null;
  return normalizeRange(fromParsed.date, toParsed.date);
}
