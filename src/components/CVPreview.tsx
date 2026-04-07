import React from 'react';
import { CVData } from '../types';
import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';

interface CVPreviewProps {
  data: CVData;
}

export const CVPreview = React.forwardRef<HTMLDivElement, CVPreviewProps>(({ data }, ref) => {
  if (data.theme.templateId === 'modern') {
    return <ModernTemplate ref={ref} data={data} />;
  }
  
  return <ClassicTemplate ref={ref} data={data} />;
});

CVPreview.displayName = 'CVPreview';
