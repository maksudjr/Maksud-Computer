import React from 'react';
import { motion } from 'motion/react';
import { Check, Layout } from 'lucide-react';
import { TemplateId, CVData, DEFAULT_CV_DATA } from '../types';
import { cn } from '../lib/utils';
import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';

interface TemplateSelectorProps {
  selectedId: TemplateId;
  onSelect: (id: TemplateId) => void;
  onNext: () => void;
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
  }
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedId, onSelect, onNext }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Choose Your Template
        </h1>
        <p className="text-base text-gray-600 max-w-xl mx-auto">
          Select a layout that best represents your professional brand.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
        {TEMPLATES.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(template.id)}
            className={cn(
              "relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all group max-w-[340px] mx-auto w-full",
              selectedId === template.id 
                ? "border-indigo-600 shadow-xl ring-4 ring-indigo-50" 
                : "border-gray-100 shadow-md hover:shadow-lg"
            )}
          >
            <div className="aspect-[3/4.2] bg-gray-50 relative overflow-hidden flex justify-center">
              <div 
                className="absolute top-0 origin-top transition-transform duration-500 group-hover:scale-[0.38]"
                style={{ 
                  width: '794px', 
                  height: '1123px', 
                  transform: 'scale(0.35)',
                  backgroundColor: 'white',
                  boxShadow: '0 0 30px rgba(0,0,0,0.1)',
                  pointerEvents: 'none'
                }}
              >
                {template.id === 'classic' ? (
                  <ClassicTemplate data={{ ...SAMPLE_DATA, theme: { ...SAMPLE_DATA.theme, templateId: 'classic' } }} />
                ) : (
                  <ModernTemplate data={{ ...SAMPLE_DATA, theme: { ...SAMPLE_DATA.theme, templateId: 'modern' } }} />
                )}
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
    </div>
  );
};
