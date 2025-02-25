import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { EmailTemplate, TemplateData } from '@/lib/email-templates/types';
import {
  renderSuccessTemplate,
  // renderConfirmationTemplate,
  // renderFailedTemplate,
} from '@/lib/email-templates/success';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  const body = await request.json();
  
  const { 
    templateType,
    recipient,
    templateData
  }: {
    templateType: EmailTemplate;
    recipient: string;
    templateData: TemplateData[EmailTemplate];
  } = body;

  try {
    let htmlContent = '';
    
    switch (templateType) {
      case 'SUCCESS':
        htmlContent = await renderSuccessTemplate(templateData as TemplateData['SUCCESS']);
        break;
      // case 'CONFIRMATION':
      //   htmlContent = renderConfirmationTemplate(templateData as TemplateData['CONFIRMATION']);
      //   break;
      // case 'FAILED':
      //   htmlContent = renderFailedTemplate(templateData as TemplateData['FAILED']);
      //   break;
      default:
        throw new Error('Invalid template type');
    }

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: recipient,
      subject: getSubjectByTemplate(templateType),
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

const getSubjectByTemplate = (templateType: EmailTemplate): string => {
  switch (templateType) {
    case 'SUCCESS':
      return 'Booking Successful!';
    case 'CONFIRMATION':
      return 'Booking Confirmation';
    case 'FAILED':
      return 'Booking Failed';
    default:
      return 'Booking Update';
  }
};