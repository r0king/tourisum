'use server';

import { renderToString } from 'react-dom/server';
import SuccessfullyBooked from '@/components/email-templates/successfully-booked';
import BookingConfirmation from '@/components/email-templates/successfully-booked';
// import FailedMail from '@/components/email-templates/failed-mail';
import { TemplateData } from '@/lib/email-templates/types';

export async function sendEmail(
  templateType: keyof TemplateData,
  recipient: string,
  data: TemplateData[keyof TemplateData]
) {
  let htmlContent = '';

  switch (templateType) {
    case 'SUCCESS':
      htmlContent = renderToString(<SuccessfullyBooked {...(data as TemplateData['SUCCESS'])} />);
      break;
    // case 'CONFIRMATION':
    //   htmlContent = renderToString(<BookingConfirmation {...(data as TemplateData['CONFIRMATION'])} />);
    //   break;
    // case 'FAILED':
    //   htmlContent = renderToString(<FailedMail {...(data as TemplateData['FAILED'])} />);
    //   break;
    default:
      throw new Error('Invalid template type');
  }

  // Add your nodemailer logic here
  return { success: true };
}