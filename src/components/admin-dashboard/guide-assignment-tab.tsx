"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPendingBookings } from "@/actions/booking-actions";
import { useEffect, useState } from "react";
import { IBooking } from "@/models/booking";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAvailableGuides } from "@/actions/guide-actions";
import { IGuide } from "@/models/guide";

const GuideAssignmentTab = () => {
  const [pendingBookings, setPendingBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [availableGuides, setAvailableGuides] = useState<IGuide[]>([]);
  const [guidesLoading, setGuidesLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookings = await getPendingBookings();
        console.log("Pending bookings fetched:", bookings);
        setPendingBookings(bookings);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleAssignGuideClick = async (booking: IBooking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
    setAvailableGuides([]); // Clear previous guides
    setGuidesLoading(true); // Set loading to true before fetching guides
    setError(null); // Clear any previous errors
    try {
      const guides = await getAvailableGuides(booking.district);
      setAvailableGuides(guides);
      setGuidesLoading(false); // Set loading to false after fetching guides
    } catch (err: any) {
      setError(err.message || "Failed to fetch available guides");
      setGuidesLoading(false); // Set loading to false even if fetching fails
    }
  };

  if (loading) {
    return <p>Loading booking requests...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guide Assignment</CardTitle>
        <CardDescription>Assign guides to new booking requests</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Requested Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingBookings.map((booking) => (
              <TableRow key={booking._id?.toString()}>
                <TableCell>{booking._id?.toString()}</TableCell>
                <TableCell>{booking.district}</TableCell>
                <TableCell>
                  {booking.bookingDates && booking.bookingDates[0]
                    ? new Date(booking.bookingDates[0]).toLocaleDateString()
                    : "No date requested"}
                </TableCell>
                <TableCell>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleAssignGuideClick(booking)}
                  >
                    Assign Guide
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Available Guides in {selectedBooking?.district}
            </DialogTitle>
          </DialogHeader>
          {error && <p className="text-red-500">{error}</p>}
          {selectedBooking && !error && (
            <div>
              {guidesLoading ? (
                <p>Loading guides...</p>
              ) : availableGuides.length > 0 ? (
                <ul>
                  {availableGuides.map((guide) => (
                    <li key={guide._id?.toString()}>
                      {guide.name} - {guide.email}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No guides available in this district.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default GuideAssignmentTab;
