'use server'

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/booking';
import { IBooking } from '@/models/booking';

export async function getPendingBookings(): Promise<IBooking[]> {
    try {
        await connectDB();
        const pendingBookings = await Booking.find({ status: 'pending' })
            .populate('district')
            .sort({ createdAt: -1 });
        console.log("Pending bookings fetched:", pendingBookings);    
        return JSON.parse(JSON.stringify(pendingBookings)); // Serialize dates
    } catch (error) {
        console.error("Error fetching pending bookings:", error);
        throw new Error(JSON.stringify(error));
    }
}