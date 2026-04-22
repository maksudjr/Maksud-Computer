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
  Palette
} from 'lucide-react';
import { TemplateId, CVData } from '../types';
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
  { id: 'classic-elegant', name: 'Elegant' },
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

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block">
      <motion.div 
        layout
        className={cn(
          "rounded-3xl shadow-2xl border overflow-hidden w-64 transition-all duration-300",
          uiTheme === 'light' ? "bg-white border-gray-100" : 
          uiTheme === 'dark' ? "bg-slate-900 border-slate-800" :
          "bg-[#1a1a1a] border-amber-900/30 shadow-amber-950/20"
        )}
      >
        <div className={cn(
          "p-4 text-white flex items-center justify-between",
          uiTheme === 'golden' ? "bg-amber-600" : "bg-indigo-600"
        )}>
          <h3 className="font-bold text-sm uppercase tracking-wider">Quick Adjust</h3>
          <button onClick={() => setIsOpen(!isOpen)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
            <ChevronDown className={cn("transition-transform", !isOpen && "rotate-180")} size={18} />
          </button>
        </div>

        {isOpen && (
          <div className="p-5 space-y-6">
            {/* Themes Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Palette size={14} />
                Theme Presets
              </label>
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
                  Spacing
                </label>
                <div className={cn("flex items-center justify-between rounded-xl p-1", uiTheme === 'light' ? "bg-gray-50" : "bg-slate-800")}>
                  <button 
                    onClick={() => updateTheme({ lineSpacing: Math.max(1, data.theme.lineSpacing - 0.1) })}
                    className={cn("p-2 rounded-lg transition-colors shadow-sm", uiTheme === 'light' ? "hover:bg-white" : "hover:bg-slate-700")}
                  >
                    <Minus size={14} />
                  </button>
                  <span className={cn("font-bold text-sm", uiTheme === 'light' ? "text-slate-900" : "text-slate-200")}>{data.theme.lineSpacing.toFixed(1)}</span>
                  <button 
                    onClick={() => updateTheme({ lineSpacing: Math.min(3, data.theme.lineSpacing + 0.1) })}
                    className={cn("p-2 rounded-lg transition-colors shadow-sm", uiTheme === 'light' ? "hover:bg-white" : "hover:bg-slate-700")}
                  >
                    <Plus size={14} />
                  </button>
                </div>
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
          </div>
        )}
      </motion.div>
    </div>
  );
};
