import { cn } from "../../lib/utils";
import { DatePickerTimeWheelColumn } from "../date-picker/date-picker-time-wheel";

export const TIME_PICKER_HOUR_VALUES = Array.from({ length: 24 }, (_, index) => index);
export const TIME_PICKER_MINUTE_VALUES = Array.from({ length: 12 }, (_, index) => index * 5);

export type TimePickerWheelsValue = {
  hours: number;
  minutes: number;
};

type TimePickerWheelsProps = {
  value: TimePickerWheelsValue;
  onChange: (value: TimePickerWheelsValue) => void;
  className?: string;
};

export function TimePickerWheels({ value, onChange, className }: TimePickerWheelsProps) {
  return (
    <div className={cn("aviala-datepicker-time", className)} role="group" aria-label="选择时间">
      <div className="aviala-datepicker-time__columns">
        <DatePickerTimeWheelColumn
          aria-label="小时"
          values={TIME_PICKER_HOUR_VALUES}
          value={value.hours}
          onChange={(hours) => onChange({ ...value, hours })}
        />
        <DatePickerTimeWheelColumn
          aria-label="分钟"
          values={TIME_PICKER_MINUTE_VALUES}
          value={value.minutes}
          onChange={(minutes) => onChange({ ...value, minutes })}
        />
      </div>
    </div>
  );
}
