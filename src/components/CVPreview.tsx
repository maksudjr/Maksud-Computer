import React, { lazy, Suspense } from 'react';
import { CVData } from '../types';

// Lazy load templates
const ClassicTemplate = lazy(() => import('./ClassicTemplate').then(m => ({ default: m.ClassicTemplate })));
const ModernTemplate = lazy(() => import('./ModernTemplate').then(m => ({ default: m.ModernTemplate })));
const SmartClassicTemplate = lazy(() => import('./SmartTemplates').then(m => ({ default: m.SmartClassicTemplate })));
const SmartModernTemplate = lazy(() => import('./SmartTemplates').then(m => ({ default: m.SmartModernTemplate })));
const ClassicElegantTemplate = lazy(() => import('./ExtraTemplates').then(m => ({ default: m.ClassicElegantTemplate })));

interface CVPreviewProps {
  data: CVData;
}

const TemplateLoading = () => (
  <div className="w-[210mm] h-[297mm] bg-white flex items-center justify-center shadow-lg mx-auto">
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

  return (
    <Suspense fallback={<TemplateLoading />}>
      {renderTemplate()}
    </Suspense>
  );
});

CVPreview.displayName = 'CVPreview';
