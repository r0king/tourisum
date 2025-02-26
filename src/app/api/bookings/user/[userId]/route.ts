import { authOptions, ExtendedUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/booking";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ message: "UserId is required" }, { status: 400 });
    }

    const userEmail = req.nextUrl.searchParams.get("email"); // Get email from search params
    if (!userEmail) {
      return NextResponse.json({ message: "User Email is required" }, { status: 400 });
    }

    // Fetch bookings by user email from search params
    const bookings = await Booking.find({ email: userEmail }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bookings }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json({ message: "Failed to fetch user bookings", error: error.message }, { status: 500 });
  }
}