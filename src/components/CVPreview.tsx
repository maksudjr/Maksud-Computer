import React from 'react';
import { CVData } from '../types';
import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';
import { SmartClassicTemplate, SmartModernTemplate } from './SmartTemplates';
import { ClassicElegantTemplate } from './ExtraTemplates';

interface CVPreviewProps {
  data: CVData;
}

const TemplateLoading = () => (
  <div className="w-[210mm] h-[297mm] bg-white flex items-center justify-center shadow-lg mx-auto cv-paper">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 font-bold animate-pulse">Rendering Template...</p>
    </div>
  </div>
);

export const CVPreview = React.forwardRef<HTMLDivElement, CVPreviewProps>(({ data }, ref) => {
  const renderTemplate = () => {
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
  };

  return renderTemplate();
});

CVPreview.displayName = 'CVPreview';
