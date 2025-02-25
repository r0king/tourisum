import { connectDB } from "@/lib/mongodb"
import Booking from "@/models/booking"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, bookingDates, district, status } = await request.json()

    if (!bookingDates || bookingDates.length !== 2) {
      return NextResponse.json({ success: false, error: "Invalid date range" }, { status: 400 })
    }

    await connectDB()

    const result = await Booking.create({
      name: name,
      email: email,
      bookingDates: bookingDates, // Save as an array of two dates
      district: district,
      createdAt: new Date(),
      status: 'pending'
    })

    return NextResponse.json({ success: true, bookingId: result._id })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 })
  } 
}
