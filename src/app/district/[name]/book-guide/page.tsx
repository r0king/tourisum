import { Suspense } from "react"
import { getUnavailableDates } from "@/lib/bookings"
import BookingCalendar from "@/components/booking/BookingCalendar"
import BookingForm from "@/components/booking/BookingForm"

export default async function BookingPage({ params }: { params: { name: string } }) {
  const unavailableDates = await getUnavailableDates(params.name)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book a Tour Guide for {params.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BookingForm className="w-full" district={params.name} unavailableDates={unavailableDates}/>
      </div>
    </div>
  )
}

