"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarRange, Loader2, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BookingCalendar from "@/components/booking/BookingCalendar";
import { toast } from "react-hot-toast";
import { sendEmail } from "@/app/actions/send-email";

interface BookingFormProps {
  district: string;
  unavailableDates: Date[]; // Pass unavailable dates as props
  className?: string;
}

export default function BookingForm({
  district,
  unavailableDates,
  className,
}: BookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null); // Stores date range
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRange) {
      toast.error("Please select a date range before submitting.");
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          bookingDates: selectedRange,
          district,
        }),
      });

      if (response.ok) {
        const booking = await response.json();

        toast.success("Booking confirmed! You will be informed later.", {
          duration: 3000,
        });

        // Send booking confirmation email
        await sendEmail("SUCCESS", email, {
          userName: name,
          bookingId: booking.bookingId,
          date: selectedRange
            ? `${selectedRange[0].toDateString()} - ${selectedRange[1].toDateString()}`
            : "N/A",
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push(`/district/${district}`);
        }, 2000);
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsPending(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className={`shadow-lg border-t-4 border-t-primary ${className}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Book Your Tour</CardTitle>
        <CardDescription>
          Complete the form below to book your guided tour in {district}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User size={18} className="text-primary" />
              Personal Information
            </h3>
            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <CalendarRange size={18} className="text-primary" />
              Select Your Dates
            </h3>
            <Separator />

            <BookingCalendar
              unavailableDates={unavailableDates}
              onDateChange={setSelectedRange}
            />

            {/* Selected Date Range Summary */}
            {selectedRange && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-medium mb-2">Your Selected Dates</h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">From:</span>
                    <span className="bg-background px-2 py-1 rounded">
                      {formatDate(selectedRange[0])}
                    </span>
                  </div>
                  <div className="hidden sm:block text-muted-foreground">→</div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">To:</span>
                    <span className="bg-background px-2 py-1 rounded">
                      {formatDate(selectedRange[1])}
                    </span>
                  </div>
                  <div className="ml-auto text-muted-foreground text-xs">
                    {Math.ceil(
                      (selectedRange[1].getTime() -
                        selectedRange[0].getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button
            type="submit"
            className="w-full sm:w-auto"
            size="lg"
            disabled={isPending || !selectedRange}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
