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
  GUIDE_ASSIGNED: {
    userName: string;
    bookingId: string;
    guideName: string;
    guideEmail: string;
    guidePhone: string;
    guideAbout: string;
    guideLanguages: string[];
    guideSpecialties: string[];
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
    GUIDE_ASSIGNED: ({ userName, bookingId, guideName, guideEmail, guidePhone, guideAbout, guideLanguages, guideSpecialties }: TemplateData["GUIDE_ASSIGNED"]) => `
        <!DOCTYPE html>
        <html>
          <body>
            <h1>Guide Assigned to Your Booking! </h1>
            <p>Dear ${userName},</p>
            <p>A guide has been assigned to your booking (ID: ${bookingId}).</p>
            <p>Your assigned guide is: ${guideName}.</p>
            <p>Contact your guide:</p>
            <ul>
                <li>Email: <a href="mailto:${guideEmail}">${guideEmail}</a></li>
                <li>Phone: ${guidePhone}</li>
            </ul>
            <p>About your guide: ${guideAbout}</p>
            <p>Languages: ${guideLanguages.join(', ')}</p>
            <p>Specialties: ${guideSpecialties.join(', ')}</p>
            <p>We are excited for you to explore!</p>
          </body>
        </html>
      `,
  };

  return templates[templateType](data as any);
};
