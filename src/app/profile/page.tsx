import { authOptions, ExtendedUser } from "@/lib/auth";
import { getUserProfile } from "@/lib/profile";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { IBooking } from "@/models/booking";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-center text-red-500">You must be logged in to view this page.</p>;
  }
  
  const profileData = await getUserProfile((session.user as ExtendedUser)?.id);

  if (!profileData) {
    return <p className="text-center text-red-500">Error loading profile.</p>;
  }

  const { user, bookings } = profileData;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* User Profile */}
      <div className="flex items-center gap-4 mb-6">
        <Image src={user.image} alt={user.name} width={80} height={80} className="rounded-full" />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.phone}</p>
          <p className="text-gray-500 text-sm">Role: {user.role}</p>
        </div>
      </div>

      {/* Booking History */}
      <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: IBooking) => (
            <div key={booking._id?.toString()} className="p-4 border rounded-lg">
              <p className="font-semibold">District: {booking.district}</p>
              <p>Dates: {booking.bookingDates.map((date: Date) => new Date(date).toDateString()).join(" - ")}</p>
              <p>Status: 
                <span className={`px-2 py-1 rounded text-white ${booking.status === "confirmed" ? "bg-green-500" : booking.status === "pending" ? "bg-yellow-500" : "bg-red-500"}`}>
                  {booking.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
