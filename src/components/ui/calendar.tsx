"use client";

import * as React from "react";
import { Calendar as HeadlessCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";

type CalendarValue = Date | [Date, Date] | null;

interface CalendarProps {
  selected?: CalendarValue;
  onChange?: React.Dispatch<React.SetStateAction<CalendarValue>>;
  selectRange?: boolean; // Enable range selection when true
  disabled?: (date: Date) => boolean;
}

export type { CalendarValue, CalendarProps };
export function Calendar({ selected, onChange, selectRange = false, disabled }: CalendarProps) {
  return (
    <HeadlessCalendar
      selectRange={selectRange} // Enables range selection when true
      onChange={(date) => onChange && onChange(date as CalendarValue)}
      value={selected || (selectRange ? [null, null] : new Date())}
      tileDisabled={({ date }) => (disabled ? disabled(date) : false)}
    />
  );
}
