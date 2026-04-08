import React from 'react';
import { CVData } from '../types';
import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';
import { SmartClassicTemplate, SmartModernTemplate } from './SmartTemplates';
import { 
  ClassicElegantTemplate
} from './ExtraTemplates';

interface CVPreviewProps {
  data: CVData;
}

export const CVPreview = React.forwardRef<HTMLDivElement, CVPreviewProps>(({ data }, ref) => {
  switch (data.theme.templateId) {
    case 'modern':
      return <ModernTemplate ref={ref} data={data} />;
    case 'smart-classic':
      return <SmartClassicTemplate ref={ref} data={data} />;
    case 'smart-modern':
      return <SmartModernTemplate ref={ref} data={data} />;
    case 'classic-elegant':
      return <ClassicElegantTemplate ref={ref} data={data} />;
    default:
      return <ClassicTemplate ref={ref} data={data} />;
  }
});

CVPreview.displayName = 'CVPreview';
