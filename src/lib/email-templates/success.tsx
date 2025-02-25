import { renderToString } from 'react-dom/server';
import SuccessfullyBooked from '@/components/email-templates/successfully-booked';
import { TemplateData } from './types';

export const renderSuccessTemplate = (data: TemplateData['SUCCESS']) => {
  return renderToString(<SuccessfullyBooked {...data} />);
};