export type TemplateData = {
  SUCCESS: {
    userName: string;
    bookingId: string;
    date: string;
  };
  CONFIRMATION: {
    userName: string;
    bookingDetails: string;
    paymentId: string;
  };
  FAILED: {
    userName: string;
    errorMessage: string;
    retryLink: string;
  };
};

export const renderEmailTemplate = <T extends keyof TemplateData>(
  templateType: T,
  data: TemplateData[T]
): string => {
  const templates = {
    SUCCESS: ({ userName, bookingId, date }: TemplateData["SUCCESS"]) => `
        <!DOCTYPE html>
        <html>
          <body>
            <h1>Booking Confirmed! 🎉</h1>
            <p>Dear ${userName},</p>
            <p>Your booking (ID: ${bookingId}) for ${date} is confirmed.</p>
            <p>Thank you for choosing our service!</p>
          </body>
        </html>
      `,

    CONFIRMATION: ({
      userName,
      bookingDetails,
      paymentId,
    }: TemplateData["CONFIRMATION"]) => `
        <!DOCTYPE html>
        <html>
          <body>
            <h1>Booking Receipt</h1>
            <p>${userName}, here's your booking confirmation:</p>
            <p>${bookingDetails}</p>
            <p>Payment ID: ${paymentId}</p>
          </body>
        </html>
      `,

    FAILED: ({ userName, errorMessage, retryLink }: TemplateData["FAILED"]) => `
        <!DOCTYPE html>
        <html>
          <body>
            <h1>Booking Failed 😢</h1>
            <p>Dear ${userName},</p>
            <p>Error: ${errorMessage}</p>
            <a href="${retryLink}">Click here to retry</a>
          </body>
        </html>
      `,
  };

  return templates[templateType](data as any);
};
