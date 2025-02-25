import mongoose, { Schema, Types } from 'mongoose';

export interface IBooking {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    bookingDates: Date[];
    district: string;
    guideId?: string;
    createdAt: Date;
    status: 'pending' | 'confirmed' | 'cancelled';
    specialRequests?: string;
}

const BookingSchema = new Schema<IBooking>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    bookingDates: { type: [Date], required: true },
    district: { type: String, required: true },
    guideId: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    specialRequests: { type: String, required: false }
});

const Booking = mongoose.models?.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
