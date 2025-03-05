"use server"

import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/mongodb"
import Booking from "@/models/booking"

export async function getPendingBookings() {
    await connectDB()
    const bookings = await Booking.find({ status: "pending" }).sort({ createdAt: -1 })
    return JSON.parse(JSON.stringify(bookings))
}

export async function getAllBookings() {
    await connectDB()
    const bookings = await Booking.find().sort({ createdAt: -1 })
    return JSON.parse(JSON.stringify(bookings))
}

export async function getBookingById(id: string) {
    await connectDB()
    const booking = await Booking.findById(id)
    return JSON.parse(JSON.stringify(booking))
}

export async function updateBookingStatus(bookingId: string, status: "confirmed" | "cancelled") {
    await connectDB()
    await Booking.findByIdAndUpdate(bookingId, { status })
    revalidatePath("/admin")
}

export async function deleteBooking(bookingId: string) {
    await connectDB()
    await Booking.findByIdAndDelete(bookingId)
    revalidatePath("/admin")
}

export async function assignGuideToBooking(bookingId: string, guideId: string) {
    await connectDB()
    await Booking.findByIdAndUpdate(bookingId, { guideId: guideId, status: "confirmed" })
    revalidatePath("/admin")
}

// New functions for guide dashboard

export async function getGuideBookings(guideId: string) {
    await connectDB()
    const bookings = await Booking.find({
        guideId: guideId,
        status: "confirmed",
        // Only show future bookings
        bookingDates: { $gte: new Date() },
    }).sort({ bookingDates: 1 })
    return JSON.parse(JSON.stringify(bookings))
}

export async function getGuidePendingRequests(district: string) {
    await connectDB()
    const bookings = await Booking.find({
        district: district,
        status: "pending",
        // Only show future bookings
        bookingDates: { $gte: new Date() },
    }).sort({ bookingDates: 1 })
    return JSON.parse(JSON.stringify(bookings))
}

export async function acceptBookingRequest(bookingId: string, guideId: string) {
    await connectDB()
    await Booking.findByIdAndUpdate(bookingId, {
        guideId: guideId,
        status: "confirmed",
    })
    revalidatePath("/guide/dashboard")
}

export async function declineBookingRequest(bookingId: string) {
    await connectDB()
    await Booking.findByIdAndUpdate(bookingId, {
        status: "cancelled",
    })
    revalidatePath("/guide/dashboard")
}

