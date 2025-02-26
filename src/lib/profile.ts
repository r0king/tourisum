export async function getUserProfile(userId: string) {
  // userId parameter is still needed for profile API
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const profileRes = await fetch(`${apiUrl}/api/profile?userId=${userId}`, {
      // userId is needed for profile API
      cache: "no-store",
      credentials: "include",
    });

    if (!profileRes.ok) {
      console.error(
        "Error fetching profile:",
        profileRes.status,
        profileRes.statusText
      );
      return null;
    }

    const user = await profileRes.json();

    // Pass email as search parameters to bookings API - Removed userId params
    const bookingsRes = await fetch(
      `${apiUrl}/api/bookings/user?email=${user.user.email}`,
      {
        cache: "no-store",
        credentials: "include",
      }
    );

    if (!bookingsRes.ok) {
      console.error(
        "Error fetching bookings:",
        bookingsRes.status,
        bookingsRes.statusText
      );
      return null; // Or handle error as needed
    }

    const bookingsData = await bookingsRes.json();

    return { user: user.user, bookings: bookingsData.bookings }; // Return both user and bookings
  } catch (error) {
    console.error("Profile fetch error:", error);
    return null;
  }
}
