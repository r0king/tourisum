"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Star, CheckCircle, XCircle, MapPin, Languages } from "lucide-react"
import type { IGuide } from "@/models/guide"
import type { IBooking } from "@/models/booking"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  getGuideBookings,
  getGuidePendingRequests,
  acceptBookingRequest,
  declineBookingRequest,
} from "@/actions/booking-actions"

const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const ProfileCard = ({ guide }: { guide: IGuide }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src="/placeholder.svg?height=100&width=100" alt={guide.name} />
          <AvatarFallback>
            {guide.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{guide.name}</CardTitle>
          <CardDescription className="flex items-center mt-1">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            {guide.averageRating.toFixed(1)} ({guide.reviewCount} tours)
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 mb-4">{guide.about}</p>

      <div className="grid grid-cols-1 gap-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          {guide.location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Languages className="w-4 h-4 mr-2" />
          {guide.languages.join(", ")}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {guide.specialties.map((specialty, index) => (
          <Badge key={index} variant="secondary">
            {specialty}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
)

const TourCard = ({
  booking,
  isRequest = false,
  onAccept,
  onDecline,
}: {
  booking: IBooking
  isRequest?: boolean
  onAccept?: (id: string) => void
  onDecline?: (id: string) => void
}) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-lg">{booking.district}</CardTitle>
      <CardDescription className="flex items-center">
        <Calendar className="w-4 h-4 mr-2" />
        {booking.bookingDates.length > 1
          ? `${formatDate(booking.bookingDates[0])} - ${formatDate(booking.bookingDates[booking.bookingDates.length - 1])}`
          : formatDate(booking.bookingDates[0])}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col space-y-2">
        <div className="text-sm">
          <span className="font-medium">Tourist:</span> {booking.name}
        </div>
        <div className="text-sm">
          <span className="font-medium">Email:</span> {booking.email}
        </div>
        {booking.specialRequests && (
          <div className="text-sm">
            <span className="font-medium">Special Requests:</span> {booking.specialRequests}
          </div>
        )}
        <div className="mt-2">
          <Badge>{booking.status}</Badge>
        </div>
      </div>
    </CardContent>
    <CardFooter className={isRequest ? "flex justify-between" : undefined}>
      {isRequest ? (
        <>
          <Button
            variant="outline"
            className="flex-1 mr-2"
            onClick={() => onAccept && onAccept(booking._id?.toString() || "")}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Accept
          </Button>
          <Button
            variant="outline"
            className="flex-1 ml-2"
            onClick={() => onDecline && onDecline(booking._id?.toString() || "")}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Decline
          </Button>
        </>
      ) : (
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      )}
    </CardFooter>
  </Card>
)

interface GuideDashboardProps {
  initialGuideData: IGuide
}

const GuideDashboard: React.FC<GuideDashboardProps> = ({ initialGuideData }) => {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [upcomingTours, setUpcomingTours] = useState<IBooking[]>([])
  const [tourRequests, setTourRequests] = useState<IBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const guideId = initialGuideData._id.toString()

        // Fetch confirmed bookings for this guide
        const confirmedBookings = await getGuideBookings(guideId)
        setUpcomingTours(confirmedBookings)

        // Fetch pending requests for this guide's district
        const pendingRequests = await getGuidePendingRequests(initialGuideData.location)
        setTourRequests(pendingRequests)
      } catch (error) {
        console.error("Error fetching guide data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [initialGuideData])

  const handleAcceptRequest = async (bookingId: string) => {
    try {
      await acceptBookingRequest(bookingId, initialGuideData._id.toString())

      // Update local state
      const updatedRequest = tourRequests.find((req) => req._id?.toString() === bookingId)
      if (updatedRequest) {
        const updatedBooking = { ...updatedRequest, status: "confirmed" as "confirmed", guideId: initialGuideData._id.toString() }
        setUpcomingTours([...upcomingTours, updatedBooking])
        setTourRequests(tourRequests.filter((req) => req._id?.toString() !== bookingId))
      }
    } catch (error) {
      console.error("Error accepting booking request:", error)
    }
  }

  const handleDeclineRequest = async (bookingId: string) => {
    try {
      await declineBookingRequest(bookingId)

      // Update local state
      setTourRequests(tourRequests.filter((req) => req._id?.toString() !== bookingId))
    } catch (error) {
      console.error("Error declining booking request:", error)
    }
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="flex justify-between items-center p-8">
        <h2 className="text-3xl font-bold">Welcome, {initialGuideData.name}</h2>
        <Button
          variant="outline"
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              router.push("/")
            })
          }}
        >
          Sign Out
        </Button>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ProfileCard guide={initialGuideData} />
          </div>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Tour Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">
                    Upcoming Tours {upcomingTours.length > 0 && `(${upcomingTours.length})`}
                  </TabsTrigger>
                  <TabsTrigger value="requests">
                    Tour Requests {tourRequests.length > 0 && `(${tourRequests.length})`}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                  {isLoading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : upcomingTours.length > 0 ? (
                    upcomingTours.map((tour) => <TourCard key={tour._id?.toString()} booking={tour} />)
                  ) : (
                    <div className="text-center py-8 text-gray-500">No upcoming tours scheduled</div>
                  )}
                </TabsContent>
                <TabsContent value="requests">
                  {isLoading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : tourRequests.length > 0 ? (
                    tourRequests.map((request) => (
                      <TourCard
                        key={request._id?.toString()}
                        booking={request}
                        isRequest
                        onAccept={handleAcceptRequest}
                        onDecline={handleDeclineRequest}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">No pending tour requests</div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default GuideDashboard

