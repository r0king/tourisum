'use server';

import nodemailer from 'nodemailer';
import { renderEmailTemplate } from '@/lib/email-templates';
import { TemplateData } from '@/lib/email-templates';

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
      subject: getEmailSubject(templateType),
      html: htmlContent,
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

const getEmailSubject = (templateType: keyof TemplateData): string => {
  return {
    SUCCESS: 'Booking Confirmation',
    CONFIRMATION: 'Booking Receipt',
    FAILED: 'Booking Failed'
  }[templateType];
};