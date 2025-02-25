"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import BookingCalendar from "@/components/booking/BookingCalendar"
import { toast } from "react-hot-toast"

interface BookingFormProps {
  district: string
  unavailableDates: Date[] // Pass unavailable dates as props
  className?: string
}

export default function BookingForm({ district, unavailableDates }: BookingFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null) // Stores date range
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRange) {
      toast.error("Please select a date range before submitting.")
      return
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name, 
          email, 
          bookingDates: selectedRange, 
          district
        }),
      })

      if (response.ok) {
        toast.success("Booking confirmed! You will be informed later.", { duration: 3000 })
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push(`/district/${district}`)
        }, 2000)
      } else {
        console.error("Booking failed")
      }
    } catch (error) {
      console.error("Error submitting booking:", error)
    }
  }

  return (
    <Card className="p-6 rounded-lg">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="font-semibold text-gray-700">Name</Label>
            <Input id="name" className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="email" className="font-semibold text-gray-700">Email</Label>
            <Input id="email" type="email" className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {/* Booking Calendar Component */}
          <div>
            <Label className="font-semibold text-gray-700">Select Your Booking Dates</Label>
            <BookingCalendar unavailableDates={unavailableDates} onDateChange={setSelectedRange} />
          </div>
          {/* Display Selected Dates */}
          {selectedRange && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {selectedRange[0].toDateString()} - {selectedRange[1].toDateString()}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit">Book Now</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
