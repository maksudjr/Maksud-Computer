import React, { lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { Check, Layout, Loader2 } from 'lucide-react';
import { TemplateId, CVData, DEFAULT_CV_DATA } from '../types';
import { cn } from '../lib/utils';
import { CVHistory } from './CVHistory';

// Lazy load templates
const ClassicTemplate = lazy(() => import('./ClassicTemplate').then(m => ({ default: m.ClassicTemplate })));
const ModernTemplate = lazy(() => import('./ModernTemplate').then(m => ({ default: m.ModernTemplate })));
const SmartClassicTemplate = lazy(() => import('./SmartTemplates').then(m => ({ default: m.SmartClassicTemplate })));
const SmartModernTemplate = lazy(() => import('./SmartTemplates').then(m => ({ default: m.SmartModernTemplate })));
const ClassicElegantTemplate = lazy(() => import('./ExtraTemplates').then(m => ({ default: m.ClassicElegantTemplate })));
const VibrantTemplate = lazy(() => import('./VibrantTemplate').then(m => ({ default: m.VibrantTemplate })));

const PreviewLoading = () => (
  <div className="w-full h-full bg-white flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-indigo-200 animate-spin" />
  </div>
);

interface TemplateSelectorProps {
  selectedId: TemplateId;
  onSelect: (id: TemplateId) => void;
  onNext: () => void;
  history: CVData[];
  onViewHistory: (cv: CVData) => void;
  onDeleteHistory: (id: string) => void;
  onPrintHistory: (cv: CVData) => void;
  onDownloadHistory: (cv: CVData) => void;
}

const SAMPLE_DATA: CVData = {
  ...DEFAULT_CV_DATA,
  personalInfo: {
    ...DEFAULT_CV_DATA.personalInfo,
    name: 'MD. MAKSUDUR RAHMAN',
    phone: '01700-000000',
    email: 'maksud@example.com',
    presentDistrict: 'Jamalpur',
    photo: 'https://picsum.photos/seed/maksud/200/200',
  },
  education: [
    {
      id: '1',
      examName: 'Secondary School Certificate (S.S.C)',
      passingYear: '2015',
      board: 'Dhaka',
      gpa: '5.00',
      gpaType: 'Out Of 5.00',
      instituteName: 'Narundi School And College',
      subject: 'Science'
    }
  ],
  skills: ['Computer Operation', 'Graphic Design', 'Web Development'],
};

const TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'A clean, traditional layout perfect for corporate and academic roles.',
  },
  {
    id: 'modern',
    name: 'Modern Sidebar',
    description: 'A stylish two-column layout with a sidebar for skills and contact info.',
  },
  {
    id: 'smart-classic',
    name: 'Smart Classic',
    description: 'An enhanced version of classic with better typography and smart spacing.',
  },
  {
    id: 'smart-modern',
    name: 'Smart Modern',
    description: 'A premium sidebar layout with timeline indicators and modern accents.',
  },
  {
    id: 'classic-elegant',
    name: 'Classic Elegant',
    description: 'A sophisticated serif-based layout for a distinguished professional look.',
  },
  {
    id: 'vibrant',
    name: 'Vibrant Professional',
    description: 'A colorful, modern layout based on traditional Bangladeshi resume styles.',
  }
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  selectedId, 
  onSelect, 
  onNext,
  history,
  onViewHistory,
  onDeleteHistory,
  onPrintHistory,
  onDownloadHistory
}) => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
          Choose Your Template
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select a layout that best represents your professional brand. All templates are fully customizable.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {TEMPLATES.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(template.id)}
            className={cn(
              "relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all group w-full",
              selectedId === template.id 
                ? "border-indigo-600 shadow-xl ring-4 ring-indigo-50" 
                : "border-gray-100 shadow-md hover:shadow-lg"
            )}
          >
            <div className="aspect-[3/4.2] bg-gray-50 relative overflow-hidden flex justify-center">
              <div 
                className="absolute top-0 origin-top transition-transform duration-500 group-hover:scale-[0.22]"
                style={{ 
                  width: '794px', 
                  height: '1123px', 
                  transform: 'scale(0.2)',
                  backgroundColor: 'white',
                  boxShadow: '0 0 30px rgba(0,0,0,0.1)',
                  pointerEvents: 'none'
                }}
              >
                <Suspense fallback={<PreviewLoading />}>
                  {template.id === 'classic' && <ClassicTemplate data={{ ...SAMPLE_DATA, theme: { ...SAMPLE_DATA.theme, templateId: 'classic' } }} />}
                  {template.id === 'modern' && <ModernTemplate data={{ ...SAMPLE_DATA, theme: { ...SAMPLE_DATA.theme, templateId: 'modern' } }} />}
                  {template.id === 'smart-classic' && <SmartClassicTemplate data={{ ...SAMPLE_DATA, theme: { ...SAMPLE_DATA.theme, templateId: 'smart-classic' } }} />}
                  {template.id === 'smart-modern' && <SmartModernTemplate data={{ ...SAMPLE_DATA, theme: { ...SAMPLE_DATA.theme, templateId: 'smart-modern' } }} />}
                  {template.id === 'classic-elegant' && <ClassicElegantTemplate data={{ ...SAMPLE_DATA, theme: { ...SAMPLE_DATA.theme, templateId: 'classic-elegant' } }} />}
                  {template.id === 'vibrant' && <VibrantTemplate data={{ ...SAMPLE_DATA, theme: { ...SAMPLE_DATA.theme, templateId: 'vibrant' } }} />}
                </Suspense>
              </div>
              
              {selectedId === template.id && (
                <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center z-10">
                  <div className="bg-indigo-600 text-white p-3 rounded-full shadow-lg scale-110">
                    <Check size={28} strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>
            <div className="p-5 bg-white relative z-20 border-t border-gray-100 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-1.5">{template.name}</h3>
              <p className="text-gray-500 text-sm leading-snug px-2">{template.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onNext}
          className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all flex items-center gap-3 group active:scale-95"
        >
          Start Building Now
          <Layout size={24} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      <CVHistory 
        history={history}
        onView={onViewHistory}
        onDelete={onDeleteHistory}
        onPrint={onPrintHistory}
        onDownload={onDownloadHistory}
      />

      {/* About Us Section */}
      <div className="mt-20 pt-10 border-t border-gray-200">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 justify-center">
            <span className="w-2 h-8 bg-indigo-600 rounded-full" />
            About Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                  MR
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Maksudur Rahman</h3>
                  <p className="text-indigo-600 font-medium text-sm">Director, Maksud Computer</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Professional developer and director at Maksud Computer, dedicated to providing high-quality digital solutions and career-building tools.
              </p>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <Layout size={16} />
                </div>
                <span>Narundi Bazar, Jamalpur Sadar, Jamalpur</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <Check size={16} />
                </div>
                <span>01622638268</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <Check size={16} />
                </div>
                <span>maksudjr2020@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
