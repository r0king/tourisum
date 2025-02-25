import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Booking from "@/models/booking";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    console.log(userId)

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Fetch user's bookings
    const bookings = await Booking.find({ email: user.email }).lean();

    return NextResponse.json({ success: true, user, bookings });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
