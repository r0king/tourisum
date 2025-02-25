import React from 'react';

type Props = {
  userName: string;
  bookingId: string;
  date: string;
};

const SuccessfullyBooked = ({ userName, bookingId, date }: Props) => (
  <div className="max-w-2xl mx-auto p-6 bg-white">
    <h1 className="text-2xl font-bold mb-4">Booking Successful! 🎉</h1>
    <p className="mb-2">Dear {userName},</p>
    <p className="mb-4">
      Your booking (ID: {bookingId}) for {date} has been successfully confirmed.
    </p>
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="font-bold mb-2">Next Steps:</h2>
      <ul className="list-disc pl-5">
        <li>Check your booking details</li>
        <li>Save this confirmation email</li>
        <li>Contact support if needed</li>
      </ul>
    </div>
  </div>
);

export default SuccessfullyBooked;