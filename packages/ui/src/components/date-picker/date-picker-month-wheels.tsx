import { useMemo } from "react";
import { cn } from "../../lib/utils";
import { useDatePickerContext } from "./date-picker-context";
import { DatePickerTimeWheelColumn } from "./date-picker-time-wheel";

const MONTH_VALUES = Array.from({ length: 12 }, (_, index) => index + 1);

function formatYearValue(value: number): string {
  return String(value);
}

function formatMonthValue(value: number): string {
  return String(value);
}

type DatePickerMonthYearWheelsProps = {
  className?: string;
  /** Bump after view enter animation so wheels re-sync to the current month. */
  layoutKey?: number;
};

export function DatePickerMonthYearWheels({
  className,
  layoutKey = 0,
}: DatePickerMonthYearWheelsProps) {
  const { viewMonth, setViewMonth, minDate, maxDate } = useDatePickerContext();
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth() + 1;

  const yearValues = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const start = minDate?.getFullYear() ?? currentYear - 100;
    const end = maxDate?.getFullYear() ?? currentYear + 100;
    const length = Math.max(end - start + 1, 1);
    return Array.from({ length }, (_, index) => start + index);
  }, [maxDate, minDate]);

  const setYearMonth = (nextYear: number, nextMonth: number) => {
    setViewMonth(new Date(nextYear, nextMonth - 1, 1));
  };

  return (
    <div
      className={cn("aviala-datepicker-month", className)}
      role="group"
      aria-label="选择年月"
    >
      <div className="aviala-datepicker-month__columns">
        <DatePickerTimeWheelColumn
          aria-label="年"
          values={yearValues}
          value={year}
          loop={false}
          layoutKey={layoutKey}
          formatValue={formatYearValue}
          onChange={(nextYear) => setYearMonth(nextYear, month)}
        />
        <DatePickerTimeWheelColumn
          aria-label="月"
          values={MONTH_VALUES}
          value={month}
          loop={false}
          layoutKey={layoutKey}
          formatValue={formatMonthValue}
          onChange={(nextMonth) => setYearMonth(year, nextMonth)}
        />
      </div>
    </div>
  );
}
