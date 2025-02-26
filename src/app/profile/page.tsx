"use client"

import { useSession } from "next-auth/react"
import { getUserProfile } from "@/lib/profile"
import type { IBooking } from "@/models/booking"
import { useState, useEffect } from "react"
import type { ExtendedUser } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import toast from "react-hot-toast"
import { CalendarDays, MapPin, Phone, Mail, Save, Loader2 } from "lucide-react"

interface ProfileDataType {
  user: any
  bookings: IBooking[]
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [profileData, setProfileData] = useState<ProfileDataType | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [bookings, setBookings] = useState<IBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setIsLoading(true)
      const userId = (session.user as ExtendedUser).id
      getUserProfile(userId)
        .then((data) => {
          if (data) {
            setProfileData(data)
            setName(data.user.name || "")
            setEmail(data.user.email || "")
            setPhone(data.user.phone || "")
            setBookings(data.bookings || [])
          }
        })
        .catch((error) => {
          console.error("Error fetching profile:", error)
          toast.error("Failed to load profile data")
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [status, session])

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty")
      return
    }

    setIsSaving(true)
    try {
      const updatedUser = {
        id: (session?.user as ExtendedUser).id,
        name,
        email,
        phone,
      }

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })

      if (response.ok) {
        toast.success("Profile updated successfully")
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to update profile")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  if (status === "unauthenticated") {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>You must be logged in to view this page.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return <ProfileSkeleton />
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <Avatar className="w-24 h-24">
          <AvatarImage src={session?.user?.image || ""} alt={name} />
          <AvatarFallback className="text-2xl">{getInitials(name)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Mail className="h-4 w-4" />
            <span>{email}</span>
          </div>
          {phone && (
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isSaving} className="ml-auto">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
              <CardDescription>View your recent bookings and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You don't have any bookings yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {bookings.map((booking) => (
                    <Card key={booking._id?.toString()} className="overflow-hidden">
                      <div className={`h-2 ${getStatusColor(booking.status)}`} />
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{booking.district}</CardTitle>
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : booking.status === "pending"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 pt-0">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {booking.bookingDates.length > 0 ? (
                              <>
                                {formatDate(booking.bookingDates[0])}
                                {booking.bookingDates.length > 1 &&
                                  ` - ${formatDate(booking.bookingDates[booking.bookingDates.length - 1])}`}
                              </>
                            ) : (
                              "No dates specified"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.district}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  )
}
