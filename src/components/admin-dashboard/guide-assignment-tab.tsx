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
import { getPendingBookings } from '@/actions/booking-actions';
import { useEffect, useState } from 'react';
import { IBooking } from '@/models/booking';

const GuideAssignmentTab = () => {
    const [pendingBookings, setPendingBookings] = useState<IBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


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
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Assign Guide
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default GuideAssignmentTab;