'use client';

import { useTransition } from 'react';
import { sendEmail } from '@/app/actions/send-email';
import type { TemplateData } from '@/lib/email-templates/types';

type Props = {
  templateType: keyof TemplateData;
  recipient: string;
  templateData: TemplateData[keyof TemplateData];
};

export default function SendEmailButton({ templateType, recipient, templateData }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await sendEmail(templateType, recipient, templateData);
    });
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? 'Sending...' : 'Send Email'}
    </button>
  );
}