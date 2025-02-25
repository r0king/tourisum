export type EmailTemplate = 'SUCCESS' | 'CONFIRMATION' | 'FAILED';

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