import { createContext, useContext, type ReactNode } from "react";

/** Figma Components → Information Collect → TimePicker */
export type TimePickerSize = "regular" | "big";

export type TimePickerValue = {
  hours: number;
  minutes: number;
};

export type TimePickerContextValue = {
  open: boolean;
  disabled?: boolean;
  size: TimePickerSize;
  value: TimePickerValue;
  setValue: (value: TimePickerValue) => void;
};

const TimePickerContext = createContext<TimePickerContextValue | null>(null);

export function TimePickerProvider({
  value,
  children,
}: {
  value: TimePickerContextValue;
  children: ReactNode;
}) {
  return (
    <TimePickerContext.Provider value={value}>
      {children}
    </TimePickerContext.Provider>
  );
}

export function useTimePickerContext() {
  const context = useContext(TimePickerContext);
  if (!context) {
    throw new Error(
      "TimePicker compound components must be used within TimePicker."
    );
  }
  return context;
}
