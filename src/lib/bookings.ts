import Booking from "@/models/booking";
import { connectDB } from "./mongodb";

export async function getUnavailableDates(district: string): Promise<Date[]> {
  try {
    await connectDB();

    const bookings = await Booking.find({ district }).lean();

    if (!bookings || bookings.length === 0) {
      return [];
    }

    const unavailableDates = bookings.flatMap((booking) => {
      if (!booking.bookingDates || booking.bookingDates.length < 2) {
        return [];
      }

      const startDate = new Date(booking.bookingDates[0]);
      const endDate = new Date(booking.bookingDates[1]);

      const dateRange: Date[] = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        dateRange.push(new Date(currentDate)); // Push copy to avoid reference issues
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }

      return dateRange;
    });

    return unavailableDates;
  } catch (error) {
    console.error("Error fetching unavailable dates:", error);
    return [];
  }
}
