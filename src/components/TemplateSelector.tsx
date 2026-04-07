import React from 'react';
import { motion } from 'motion/react';
import { Check, Layout } from 'lucide-react';
import { TemplateId } from '../types';
import { cn } from '../lib/utils';

interface TemplateSelectorProps {
  selectedId: TemplateId;
  onSelect: (id: TemplateId) => void;
  onNext: () => void;
}

const TEMPLATES: { id: TemplateId; name: string; description: string; image: string }[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'A clean, traditional layout perfect for corporate and academic roles.',
    image: 'https://picsum.photos/seed/cv-classic/400/500'
  },
  {
    id: 'modern',
    name: 'Modern Sidebar',
    description: 'A stylish two-column layout with a sidebar for skills and contact info.',
    image: 'https://picsum.photos/seed/cv-modern/400/500'
  }
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedId, onSelect, onNext }) => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Choose Your Template
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select a layout that best represents your professional brand. You can always change this later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {TEMPLATES.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(template.id)}
            className={cn(
              "relative cursor-pointer rounded-2xl overflow-hidden border-4 transition-all",
              selectedId === template.id 
                ? "border-indigo-600 shadow-xl ring-4 ring-indigo-100" 
                : "border-white shadow-md hover:shadow-lg"
            )}
          >
            <div className="aspect-[4/5] bg-gray-100 relative">
              <img 
                src={template.image} 
                alt={template.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {selectedId === template.id && (
                <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                  <div className="bg-indigo-600 text-white p-3 rounded-full shadow-lg">
                    <Check size={32} strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{template.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onNext}
          className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-3 group"
        >
          Start Building
          <Layout className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  );
};
