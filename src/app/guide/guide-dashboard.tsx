"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  Star,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { IGuide } from "@/models/guide";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation"

const UPCOMING_TOURS = [
  {
    id: 1,
    date: "2024-05-15",
    destination: "Silent Valley",
    tourists: 4,
    duration: "Full Day",
  },
  {
    id: 2,
    date: "2024-05-18",
    destination: "Wayanad Wildlife Sanctuary",
    tourists: 2,
    duration: "2 Days",
  },
  {
    id: 3,
    date: "2024-05-22",
    destination: "Munnar Tea Plantations",
    tourists: 6,
    duration: "Half Day",
  },
];

const TOUR_REQUESTS = [
  {
    id: 1,
    date: "2024-06-01",
    destination: "Periyar Tiger Reserve",
    tourists: 3,
    duration: "Full Day",
    status: "Pending",
  },
  {
    id: 2,
    date: "2024-06-05",
    destination: "Athirappilly Waterfalls",
    tourists: 5,
    duration: "Half Day",
    status: "Pending",
  },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ProfileCard = ({ guide }: { guide: IGuide }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src="/placeholder.svg?height=100&width=100"
            alt={guide.name}
          />
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
            {guide.averageRating} (152 tours)
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 mb-4">{guide.about}</p>
      <div className="flex flex-wrap gap-2">
        {guide.specialties.map((specialty, index) => (
          <Badge key={index} variant="secondary">
            {specialty}
          </Badge>
        ))}
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full">Edit Profile</Button>
    </CardFooter>
  </Card>
);

const TourCard = ({
  tour,
  isRequest = false,
}: {
  tour: (typeof UPCOMING_TOURS)[0] | (typeof TOUR_REQUESTS)[0];
  isRequest?: boolean;
}) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-lg">{tour.destination}</CardTitle>
      <CardDescription className="flex items-center">
        <Calendar className="w-4 h-4 mr-2" />
        {formatDate(tour.date)}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {tour.tourists} tourists
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {tour.duration}
        </div>
      </div>
      {"status" in tour && <Badge>{tour.status}</Badge>}
    </CardContent>
    <CardFooter className={isRequest ? "flex justify-between" : undefined}>
      {isRequest ? (
        <>
          <Button variant="outline" className="flex-1 mr-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            Accept
          </Button>
          <Button variant="outline" className="flex-1 ml-2">
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
);

interface GuideDashboardProps {
  initialGuideData: IGuide;
}

const GuideDashboard: React.FC<GuideDashboardProps> = ({
  initialGuideData,
}) => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const router = useRouter()

  return (
    <div className="min-h-screen bg-green-50">
      <div className="flex justify-between items-center m-8">
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
                  <TabsTrigger value="upcoming">Upcoming Tours</TabsTrigger>
                  <TabsTrigger value="requests">Tour Requests</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                  {UPCOMING_TOURS.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </TabsContent>
                <TabsContent value="requests">
                  {TOUR_REQUESTS.map((request) => (
                    <TourCard key={request.id} tour={request} isRequest />
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GuideDashboard;
