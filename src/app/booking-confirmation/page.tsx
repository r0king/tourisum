"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { sendEmail } from "@/app/actions/send-email";

const BookingConfirmationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [district, setDistrict] = useState("");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    setName(searchParams.get("name") || "");
    setEmail(searchParams.get("email") || "");
    setStartDate(searchParams.get("startDate") || "");
    setEndDate(searchParams.get("endDate") || "");
    setDistrict(searchParams.get("district") || "");
  }, [searchParams]);

  const handlePayment = async () => {
    setIsPaymentProcessing(true);
    setPaymentSuccess(false);

    // Simulate payment processing (replace with actual payment integration)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setPaymentSuccess(true);
    setIsPaymentProcessing(false);
    toast.success("Payment Successful!");

    // Automatically submit booking after payment
    handleSubmitBooking();
  };

  const handleSubmitBooking = async () => {
    setIsBookingSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          bookingDates: [startDate, endDate], // Send ISO date strings
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
          date: `${new Date(startDate).toDateString()} - ${new Date(
            endDate
          ).toDateString()}`,
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
      setIsBookingSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 relative">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Booking Confirmation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Booking Details</h3>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <p>
            Dates: {new Date(startDate).toLocaleDateString()} -{" "}
            {new Date(endDate).toLocaleDateString()}
          </p>
          <p>District: {district}</p>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isPaymentProcessing || paymentSuccess || isBookingSubmitting}
          className="w-full"
        >
          Make Payment
        </Button>
      </CardContent>

      {/* Payment Processing and Success Overlay */}
      {(isPaymentProcessing || paymentSuccess || isBookingSubmitting) && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-white/70">
          {isPaymentProcessing && (
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin mb-2" />
              <p>Processing Payment...</p>
            </div>
          )}
          {paymentSuccess && !isBookingSubmitting && (
            <div className="text-center">
              <p className="text-green-500 text-4xl mb-2">✓</p> {/* Tick mark */}
              <p className="text-xl font-semibold">Payment Successful!</p>
            </div>
          )}
           {isBookingSubmitting && (
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin mb-2" />
              <p>Submitting Booking...</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default BookingConfirmationPage;