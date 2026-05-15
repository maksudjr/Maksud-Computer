import React from 'react';
import { motion } from 'motion/react';
import { 
  Layout, 
  Type, 
  Minus, 
  Plus, 
  Square, 
  Check,
  ChevronDown,
  Palette,
  Maximize,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Edit3,
  GripVertical
} from 'lucide-react';
import { TemplateId, CVData, SectionId } from '../types';
import { cn } from '../lib/utils';

interface CVPreviewToolbarProps {
  data: CVData;
  onChange: (data: CVData) => void;
  uiTheme?: 'light' | 'dark' | 'golden';
}

const TEMPLATES: { id: TemplateId; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
  { id: 'smart-classic', name: 'Smart Classic' },
  { id: 'smart-modern', name: 'Elite Modern' },
  { id: 'modern-minimalist', name: 'Modern Minimalist' },
  { id: 'executive-elite', name: 'Executive Elite' },
];

const THEME_PRESETS = [
  { name: 'Professional', color: '#2563eb', settings: { primaryColor: '#2563eb', headerStyle: 'default' } },
  { name: 'Gold Black', color: '#d4af37', settings: { primaryColor: '#d4af37', headerStyle: 'black' } },
  { name: 'Pure Black', color: '#000000', settings: { primaryColor: '#000000', headerStyle: 'default' } },
  { name: 'Elite Emerald', color: '#059669', settings: { primaryColor: '#059669', headerStyle: 'primary' } },
  { name: 'Ruby Dark', color: '#dc2626', settings: { primaryColor: '#dc2626', headerStyle: 'black' } },
  { name: 'Midnight', color: '#1e293b', settings: { primaryColor: '#1e293b', headerStyle: 'default' } },
];

export const CVPreviewToolbar: React.FC<CVPreviewToolbarProps> = ({ data, onChange, uiTheme = 'light' }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const updateTheme = (updates: Partial<CVData['theme']>) => {
    onChange({
      ...data,
      theme: { ...data.theme, ...updates }
    });
  };

  const randomizeColors = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    updateTheme({ primaryColor: color });
  };

  return (
    <div className={cn("fixed right-4 top-4 z-[9999] print:hidden", isOpen ? "w-72" : "w-12 h-12 md:w-72 md:h-auto")}>
      {/* Mobile Toggle for Quick Adjust */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "xl:hidden absolute right-0 top-0 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all z-[10000]",
          uiTheme === 'golden' ? "bg-amber-600 text-white" : "bg-indigo-600 text-white",
          isOpen && "rotate-45"
        )}
      >
        <Plus size={24} />
      </button>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: (isOpen || window.innerWidth >= 1280) ? 1 : 0,
          scale: (isOpen || window.innerWidth >= 1280) ? 1 : 0.95,
          pointerEvents: (isOpen || window.innerWidth >= 1280) ? 'auto' : 'none'
        }}
        layout
        className={cn(
          "rounded-3xl shadow-2xl border overflow-hidden w-72 transition-all duration-300 flex flex-col max-h-[90vh]",
          uiTheme === 'light' ? "bg-white/95 backdrop-blur-sm border-gray-200" : 
          uiTheme === 'dark' ? "bg-slate-900/95 backdrop-blur-sm border-slate-800" :
          "bg-[#1a1a1a]/95 backdrop-blur-sm border-amber-900/30 shadow-amber-950/20",
          !isOpen && "hidden xl:flex"
        )}
      >
        <div className={cn(
          "p-4 text-white flex items-center justify-between shrink-0",
          uiTheme === 'golden' ? "bg-amber-600" : "bg-indigo-600"
        )}>
          <div className="flex items-center gap-2">
            <Layout size={18} />
            <h3 className="font-bold text-xs uppercase tracking-wider">Design Studio</h3>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded-lg transition-colors hover:bg-white/20">
            <ChevronDown className={cn("transition-transform", !isOpen && "rotate-180")} size={18} />
          </button>
        </div>

        {isOpen && (
          <div className="p-5 space-y-6 overflow-y-auto thin-scrollbar">
            {/* Edit Mode Toggle */}
            <div className={cn("flex items-center justify-between p-3 rounded-2xl border", uiTheme === 'light' ? "bg-indigo-50 border-indigo-100" : "bg-indigo-900/20 border-indigo-800")}>
              <div className="flex items-center gap-2">
                <Edit3 size={16} className="text-indigo-600" />
                <span className={cn("text-xs font-bold", uiTheme === 'light' ? "text-indigo-900" : "text-indigo-300")}>Edit on Preview</span>
              </div>
              <button
                onClick={() => updateTheme({ editableMode: !data.theme.editableMode })}
                className={cn(
                  "w-10 h-5 rounded-full transition-colors relative",
                  data.theme.editableMode ? "bg-indigo-600" : "bg-gray-400"
                )}
              >
                <div className={cn(
                  "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all",
                  data.theme.editableMode ? "left-5.5" : "left-0.5"
                )} />
              </button>
            </div>

            {/* Section Visibility toggles */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Square size={14} className="text-gray-400" />
                Section Visibility
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'careerObjective', label: 'Objective' },
                  { id: 'education', label: 'Education' },
                  { id: 'trainings', label: 'Trainings' },
                  { id: 'workExperience', label: 'Experience' },
                  { id: 'computerSkills', label: 'IT Skills' },
                  { id: 'languageProficiency', label: 'Languages' },
                  { id: 'selfAssessment', label: 'Assessment' },
                  { id: 'hobbies', label: 'Hobbies' },
                  { id: 'references', label: 'References' },
                  { id: 'declaration', label: 'Sign' }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      const isSelected = data.selectedSections.includes(section.id as SectionId);
                      if (isSelected) {
                        onChange({ ...data, selectedSections: data.selectedSections.filter(s => s !== section.id) });
                      } else {
                        // Maintain logical order
                        const order = ['careerObjective', 'personalInfo', 'education', 'trainings', 'computerSkills', 'workExperience', 'languageProficiency', 'selfAssessment', 'hobbies', 'references', 'custom', 'declaration'];
                        const newSections = [...data.selectedSections, section.id as SectionId];
                        newSections.sort((a, b) => order.indexOf(a) - order.indexOf(b));
                        onChange({ ...data, selectedSections: newSections });
                      }
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[9px] font-bold transition-all border",
                      data.selectedSections.includes(section.id as SectionId)
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : uiTheme === 'light' ? "bg-gray-50 text-gray-400 border-gray-100" : "bg-slate-800 text-slate-500 border-slate-700"
                    )}
                  >
                    {data.selectedSections.includes(section.id as SectionId) ? <Check size={10} strokeWidth={4} /> : <Minus size={10} />}
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Reordering */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <GripVertical size={14} />
                Section Order
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 thin-scrollbar">
                {data.selectedSections.map((sectionId, index) => (
                  <div 
                    key={sectionId} 
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg border text-[10px] font-bold group",
                      uiTheme === 'light' ? "bg-white border-gray-100 hover:border-indigo-200" : "bg-slate-800 border-slate-700 hover:border-indigo-800"
                    )}
                  >
                    <span className="capitalize">{sectionId.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        disabled={index === 0}
                        onClick={() => {
                          const newSections = [...data.selectedSections];
                          [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
                          onChange({ ...data, selectedSections: newSections });
                        }}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button 
                        disabled={index === data.selectedSections.length - 1}
                        onClick={() => {
                          const newSections = [...data.selectedSections];
                          [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
                          onChange({ ...data, selectedSections: newSections });
                        }}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Page Margin in MM */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Maximize size={14} />
                Page Margin (mm)
              </label>
              <div className={cn("flex items-center justify-between rounded-xl p-1", uiTheme === 'light' ? "bg-gray-50" : "bg-slate-800")}>
                <button 
                  onClick={() => updateTheme({ pageMargin: Math.max(0, data.theme.pageMargin - 1) })}
                  className={cn("p-2 rounded-lg transition-colors shadow-sm", uiTheme === 'light' ? "hover:bg-white" : "hover:bg-slate-700")}
                >
                  <Minus size={14} />
                </button>
                <span className={cn("font-bold text-sm text-center min-w-[60px]", uiTheme === 'light' ? "text-slate-900" : "text-slate-200")}>
                  {data.theme.pageMargin}mm
                </span>
                <button 
                  onClick={() => updateTheme({ pageMargin: Math.min(50, data.theme.pageMargin + 1) })}
                  className={cn("p-2 rounded-lg transition-colors shadow-sm", uiTheme === 'light' ? "hover:bg-white" : "hover:bg-slate-700")}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Border Toggle */}
            <div className={cn("flex items-center justify-between pt-2 border-t", uiTheme === 'light' ? "border-gray-100" : "border-slate-800")}>
              <label className="text-xs font-bold text-gray-500 uppercase">Section Divider</label>
              <button
                onClick={() => updateTheme({ showBorder: !data.theme.showBorder })}
                className={cn(
                  "w-10 h-5 rounded-full transition-colors relative",
                  data.theme.showBorder ? (uiTheme === 'golden' ? "bg-amber-600" : "bg-indigo-600") : "bg-gray-400"
                )}
              >
                <div className={cn(
                  "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all",
                  data.theme.showBorder ? "left-5.5" : "left-0.5"
                )} />
              </button>
            </div>

            {/* Themes Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <Palette size={14} />
                  Theme Presets
                </label>
                <button 
                  onClick={randomizeColors}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-indigo-600 transition-colors"
                  title="Randomize Color"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {THEME_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => updateTheme(p.settings as any)}
                    className={cn(
                      "w-full aspect-square rounded-xl border p-1 transition-all flex flex-col items-center justify-center gap-1",
                      data.theme.primaryColor === p.color && data.theme.headerStyle === p.settings.headerStyle
                        ? (uiTheme === 'golden' ? "border-amber-500 bg-amber-950" : "border-indigo-600 bg-indigo-50") 
                        : (uiTheme === 'light' ? "border-gray-100 hover:border-gray-200 bg-white" : "border-slate-800 hover:border-slate-700 bg-slate-800/50")
                    )}
                    title={p.name}
                  >
                    <div className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: p.color }} />
                    <span className={cn(
                      "text-[8px] font-bold uppercase text-center leading-tight truncate w-full",
                      uiTheme === 'light' ? "text-gray-500" : "text-slate-400"
                    )}>{p.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Layout size={14} />
                Template
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateTheme({ templateId: t.id })}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl border text-sm transition-all",
                      data.theme.templateId === t.id 
                        ? (uiTheme === 'golden' ? "border-amber-500 bg-amber-950 text-amber-500 font-bold" : "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold") 
                        : (uiTheme === 'light' ? "border-gray-100 hover:border-gray-200 text-gray-600" : "border-slate-800 hover:border-slate-700 text-slate-400")
                    )}
                  >
                    {t.name}
                    {data.theme.templateId === t.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Header Style */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Square size={14} />
                Header Style
              </label>
              <div className={cn("flex p-1 rounded-xl", uiTheme === 'light' ? "bg-gray-100" : "bg-slate-800")}>
                {[
                  { id: 'default', label: 'Default' },
                  { id: 'black', label: 'Black' },
                  { id: 'primary', label: 'Accent' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => updateTheme({ headerStyle: s.id as any })}
                    className={cn(
                      "flex-1 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                      data.theme.headerStyle === s.id 
                        ? (uiTheme === 'golden' ? "bg-amber-600 text-white shadow-sm" : "bg-white text-indigo-600 shadow-sm") 
                        : (uiTheme === 'light' ? "text-gray-500 hover:text-gray-700" : "text-slate-400 hover:text-white")
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size & Spacing Controls */}
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <Type size={14} />
                  Font Size
                </label>
                <div className={cn("flex items-center justify-between rounded-xl p-1", uiTheme === 'light' ? "bg-gray-50" : "bg-slate-800")}>
                  <button 
                    onClick={() => updateTheme({ fontSize: Math.max(8, data.theme.fontSize - 1) })}
                    className={cn("p-2 rounded-lg transition-colors shadow-sm", uiTheme === 'light' ? "hover:bg-white" : "hover:bg-slate-700")}
                  >
                    <Minus size={14} />
                  </button>
                  <span className={cn("font-bold text-sm", uiTheme === 'light' ? "text-slate-900" : "text-slate-200")}>{data.theme.fontSize}px</span>
                  <button 
                    onClick={() => updateTheme({ fontSize: Math.min(24, data.theme.fontSize + 1) })}
                    className={cn("p-2 rounded-lg transition-colors shadow-sm", uiTheme === 'light' ? "hover:bg-white" : "hover:bg-slate-700")}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <Plus size={14} className="rotate-45" />
                  Line Spacing
                </label>
                <div className={cn("flex items-center justify-between rounded-xl p-1", uiTheme === 'light' ? "bg-gray-50" : "bg-slate-800")}>
                  <button 
                    onClick={() => updateTheme({ lineSpacing: parseFloat((data.theme.lineSpacing - 0.1).toFixed(2)) })}
                    className={cn("p-2 rounded-lg transition-colors shadow-sm", uiTheme === 'light' ? "hover:bg-white" : "hover:bg-slate-700")}
                  >
                    <Minus size={14} />
                  </button>
                  <span className={cn("font-bold text-sm", uiTheme === 'light' ? "text-slate-900" : "text-slate-200")}>{data.theme.lineSpacing.toFixed(2)}</span>
                  <button 
                    onClick={() => updateTheme({ lineSpacing: parseFloat((data.theme.lineSpacing + 0.1).toFixed(2)) })}
                    className={cn("p-2 rounded-lg transition-colors shadow-sm", uiTheme === 'light' ? "hover:bg-white" : "hover:bg-slate-700")}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex gap-1 overflow-x-auto pb-1 invisible-scrollbar">
                  {[-0.5, 0, 0.5, 1, 1.2, 1.5, 2].map(val => (
                    <button
                      key={val}
                      onClick={() => updateTheme({ lineSpacing: val })}
                      className={cn(
                        "px-2 py-1 rounded text-[8px] font-bold border shrink-0",
                        data.theme.lineSpacing === val ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-500 border-gray-100"
                      )}
                    >
                      {val}
                    </button>
                  ))}
                  <button
                    onClick={() => updateTheme({ lineSpacing: -50 })}
                    className={cn(
                      "px-2 py-1 rounded text-[8px] font-bold border bg-red-50 text-red-600 border-red-100 shrink-0",
                      data.theme.lineSpacing === -50 && "bg-red-600 text-white border-red-600"
                    )}
                  >
                    -50
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
