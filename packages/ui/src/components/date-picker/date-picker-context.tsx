import { createContext, useContext, type ReactNode } from "react";

import type { DateRange } from "./date-utils";

/** Figma Components → Information Collect → DatePicker Input */
export type DatePickerSize = "regular" | "big";
export type DatePickerMode = "single" | "range";
export type DatePickerPanel = "date" | "time" | "month";
export type DatePickerTimeValue = { hours: number; minutes: number };

export type DatePickerContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
  size: DatePickerSize;
  mode: DatePickerMode;
  viewMonth: Date;
  setViewMonth: (month: Date) => void;
  singleValue?: Date;
  rangeValue: DateRange;
  selectDate: (date: Date, options?: { close?: boolean; switchToTime?: boolean }) => void;
  commitTypedValue: (text: string) => boolean;
  minDate?: Date;
  maxDate?: Date;
  focusedDay: Date | null;
  setFocusedDay: (date: Date | null) => void;
  enableTime: boolean;
  activePanel: DatePickerPanel;
  setActivePanel: (panel: DatePickerPanel) => void;
  timeValue: DatePickerTimeValue;
  setTimeValue: (value: DatePickerTimeValue) => void;
};

const DatePickerContext = createContext<DatePickerContextValue | null>(null);

export function DatePickerProvider({
  value,
  children,
}: {
  value: DatePickerContextValue;
  children: ReactNode;
}) {
  return <DatePickerContext.Provider value={value}>{children}</DatePickerContext.Provider>;
}

export function useDatePickerContext() {
  const context = useContext(DatePickerContext);
  if (!context) {
    throw new Error("DatePicker compound components must be used within DatePicker.");
  }
  return context;
}
