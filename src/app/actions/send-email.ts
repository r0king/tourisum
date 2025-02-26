'use server';

import nodemailer from 'nodemailer';
import { renderEmailTemplate, TemplateData } from '@/lib/email-templates';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail(
  templateType: keyof TemplateData,
  recipient: string,
  data: TemplateData[keyof TemplateData]
) {
  try {
    const htmlContent = renderEmailTemplate(templateType, data);
    
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: recipient,
      subject: getEmailSubject(templateType) as string, // Type assertion here
      html: htmlContent,
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

const getEmailSubject = (templateType: keyof TemplateData): string | undefined => { // Updated return type
  return {
    SUCCESS: 'Booking Confirmation',
    CONFIRMATION: 'Booking Receipt',
    FAILED: 'Booking Failed',
    GUIDE_ASSIGNED: 'Guide Assigned to Booking' // Added case for GUIDE_ASSIGNED
  }[templateType];
};