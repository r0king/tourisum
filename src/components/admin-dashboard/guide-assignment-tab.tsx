'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getPendingBookings, assignGuideToBooking } from '@/actions/booking-actions';
import { useEffect, useState } from 'react';
import { IBooking } from '@/models/booking';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { getAvailableGuides, getGuideById } from '@/actions/guide-actions';
import { IGuide } from '@/models/guide';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { sendEmail } from '@/app/actions/send-email'; // Import sendEmail action

const GuideAssignmentTab = () => {
    const [pendingBookings, setPendingBookings] = useState<IBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
    const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null); // State to store selected booking
    const [availableGuides, setAvailableGuides] = useState<IGuide[]>([]); // State to store available guides
    const [guidesLoading, setGuidesLoading] = useState(false); // State for loading guides in dialog
    const [selectedGuideId, setSelectedGuideId] = useState<string | undefined>(undefined); // State to store selected guide ID
    const [assignmentLoading, setAssignmentLoading] = useState(false); // State for assignment loading


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
        setSelectedGuideId(undefined); // Reset selected guide
        try {
            const guides = await getAvailableGuides(booking.district);
            setAvailableGuides(guides);
            setGuidesLoading(false); // Set loading to false after fetching guides
        } catch (err: any) {
            setError(err.message || "Failed to fetch available guides");
            setGuidesLoading(false); // Set loading to false even if fetching fails
        }
    };

    const handleGuideSelection = (guideId: string) => {
        setSelectedGuideId(guideId);
    };

    const handleAssignConfirmation = async () => {
        if (selectedBooking && selectedGuideId) {
            setAssignmentLoading(true); // Start assignment loading
            try {
                await assignGuideToBooking(selectedBooking._id!.toString(), selectedGuideId);

                // Fetch guide details for email
                const guideDetails = await getGuideById(selectedGuideId);
                if (guideDetails) {
                    // Send confirmation email
                    await sendEmail(
                        'GUIDE_ASSIGNED',
                        selectedBooking.email,
                        {
                            userName: selectedBooking.name,
                            bookingId: selectedBooking._id!.toString(),
                            guideName: guideDetails.name,
                            guideEmail: guideDetails.email,
                            guidePhone: guideDetails.phone,
                            guideAbout: guideDetails.about,
                            guideLanguages: guideDetails.languages,
                            guideSpecialties: guideDetails.specialties,
                        }
                    );
                }


                setOpenDialog(false);
                setAssignmentLoading(false); // End assignment loading
                // Update pending bookings list after successful assignment
                const updatedBookings = pendingBookings.filter(booking => booking._id !== selectedBooking._id);
                setPendingBookings(updatedBookings);
            } catch (assignError: any) {
                setError(assignError.message || "Failed to assign guide to booking");
                setAssignmentLoading(false); // End assignment loading even on error
            }
        } else {
            alert("Please select a guide before confirming.");
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
                                <TableCell>{booking.bookingDates && booking.bookingDates[0] ? new Date(booking.bookingDates[0]).toLocaleDateString() : 'No date requested'}</TableCell>
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
                        <DialogTitle>Assign Guide for {selectedBooking?.district}</DialogTitle>
                    </DialogHeader>
                    {error && <p className="text-red-500">{error}</p>}
                    {selectedBooking && !error && (
                        <div>
                            {guidesLoading ? (
                                <p>Loading guides...</p>
                            ) : availableGuides.length > 0 ? (
                                <Select onValueChange={handleGuideSelection}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a guide" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableGuides.map(guide => (
                                            <SelectItem key={guide._id?.toString()} value={guide._id?.toString()}>
                                                {guide.name} - {guide.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p>No guides available in this district.</p>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button type="submit" onClick={handleAssignConfirmation} disabled={!selectedGuideId || assignmentLoading}>
                            {assignmentLoading ? "Assigning..." : "Assign Guide"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default GuideAssignmentTab;
