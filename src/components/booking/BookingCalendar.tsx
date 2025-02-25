"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { CalendarValue, CalendarProps } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"

interface BookingCalendarProps {
  unavailableDates: Date[]
  onDateChange: (dates: [Date, Date] | null) => void
}

export default function BookingCalendar({ unavailableDates, onDateChange }: BookingCalendarProps) {
  const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null)

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Remove time portion to ensure accuracy

  const isDateUnavailable = (date: Date) => {
    return (
      unavailableDates.some(
        (unavailableDate) => unavailableDate.toDateString() === date.toDateString()
      ) || date < today // Disable past dates
    )
  }

  const handleDateChange = (range: Date | [Date, Date] | null) => {
    if (Array.isArray(range) && range[0] && range[1]) {
      // Ensure no unavailable dates are selected in the range
      const [start, end] = range;
      const tempDate = new Date(start);

      while (tempDate <= end) {
        if (isDateUnavailable(tempDate)) {
          alert("Selected range includes unavailable or past dates. Please choose a valid range.");
          return;
        }
        tempDate.setDate(tempDate.getDate() + 1);
      }

      setSelectedRange(range as [Date, Date])
      onDateChange(range as [Date, Date])
    }
  }

  return (
    <Card>
      
        <Calendar
          selected={selectedRange}
          onChange={(dateRange) => {
            setSelectedRange(dateRange as [Date, Date] | null);
            onDateChange(dateRange as [Date, Date] | null); // Call prop to update parent state
          }}
          selectRange
          disabled={isDateUnavailable} // Disable unavailable dates
        />
        {selectedRange && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {selectedRange[0].toDateString()} - {selectedRange[1].toDateString()}
          </p>
        )}
      
    </Card>
  )
}
