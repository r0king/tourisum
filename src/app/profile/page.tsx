'use client'
import { useSession } from "next-auth/react";
import { getUserProfile } from "@/lib/profile";
import { IBooking } from "@/models/booking";
import { useState, useEffect } from "react";
import { ExtendedUser } from "@/lib/auth";

interface ProfileDataType {
    user: any; // Define user type more specifically if possible
    bookings: IBooking[];
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [profileData, setProfileData] = useState<ProfileDataType | null>(null); // Update profileData state type
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [bookings, setBookings] = useState<IBooking[]>([]); // Initialize bookings state

    console.log("Session in /profile (client component):", session); // Log session in client component

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            const userId = (session.user as ExtendedUser).id;
            getUserProfile(userId).then(data => {
                if (data) {
                    setProfileData(data);
                    setName(data.user.name);
                    setEmail(data.user.email);
                    setPhone(data.user.phone || "");
                    setBookings(data.bookings || []); // Set bookings data, default to empty array if null
                }
            });
        }
    }, [status, session]);

  if (status === "loading") {
    return <p className="text-center text-gray-500">Loading profile...</p>;
  }

  if (status === "unauthenticated") {
    return <p className="text-center text-red-500">You must be logged in to view this page.</p>;
  }

  if (!profileData) {
    return <p className="text-center text-red-500">Error loading profile.</p>;
  }

  const handleSaveProfile = async () => {
    const updatedUser = {
      id: (session?.user as ExtendedUser).id,
      name,
      email,
      phone,
    };
    // Directly call the API route
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });

    if (response.ok) {
      alert("Profile updated successfully!");
    } else {
      const errorData = await response.json();
      alert(`Failed to update profile: ${errorData.message || 'Unknown error'}`);
    }
  };


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* User Profile */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly // Consider making email editable after verification
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={handleSaveProfile}>
            Save Profile
          </button>
        </div>
      </div>

      {/* Recently Visited Places */}
      <h3 className="text-xl font-semibold mb-4">Recently Visited Places</h3>
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
