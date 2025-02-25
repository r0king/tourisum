export async function getUserProfile(userId: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; 
        const res = await fetch(`${apiUrl}/api/profile?userId=${userId}`, {
            cache: "no-store",
          });
      console.log(res)
  
      const data = await res.json();
      if (!data.success) {
        console.error("Error fetching profile:", data.error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Profile fetch error:", error);
      return null;
    }
  }
  