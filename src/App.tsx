import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Settings, 
  Eye, 
  Edit3, 
  Download, 
  Printer, 
  Check, 
  ChevronRight,
  Palette,
  Layout
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { CVData, DEFAULT_CV_DATA, SectionId } from './types';
import { CVForm } from './components/CVForm';
import { CVPreview } from './components/CVPreview';
import { cn } from './lib/utils';

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'careerObjective', label: 'Career Objective' },
  { id: 'personalInfo', label: 'Personal Information' },
  { id: 'education', label: 'Educational Qualification' },
  { id: 'computerSkills', label: 'Computer Skills' },
  { id: 'workExperience', label: 'Work Experience' },
  { id: 'languageProficiency', label: 'Language Proficiency' },
  { id: 'selfAssessment', label: 'Self Assessment' },
  { id: 'hobbies', label: 'Hobbies' },
  { id: 'declaration', label: 'Declaration' },
  { id: 'references', label: 'References' },
  { id: 'custom', label: 'Custom Section' },
];

const COLORS = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Black', value: '#000000' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Purple', value: '#9333ea' },
];

const FONTS = [
  { name: 'Inter', value: 'font-inter' },
  { name: 'Roboto', value: 'font-roboto' },
  { name: 'Open Sans', value: 'font-opensans' },
  { name: 'Lato', value: 'font-lato' },
  { name: 'Montserrat', value: 'font-montserrat' },
  { name: 'Playfair', value: 'font-playfair' },
  { name: 'Merriweather', value: 'font-merriweather' },
  { name: 'Oswald', value: 'font-oswald' },
  { name: 'Raleway', value: 'font-raleway' },
  { name: 'Poppins', value: 'font-poppins' },
  { name: 'Ubuntu', value: 'font-ubuntu' },
  { name: 'Lora', value: 'font-lora' },
];

export default function App() {
  const [step, setStep] = useState<'setup' | 'builder'>('setup');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [cvData, setCvData] = useState<CVData>(DEFAULT_CV_DATA);
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${cvData.personalInfo.name || 'CV'}_Curriculum_Vitae`,
  });

  const toggleSection = (id: SectionId) => {
    setCvData(prev => ({
      ...prev,
      selectedSections: prev.selectedSections.includes(id)
        ? prev.selectedSections.filter(s => s !== id)
        : [...prev.selectedSections, id]
    }));
  };

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Maksud Computer CV Builder
            </h1>
            <p className="text-lg text-gray-600">
              Configure your CV structure and theme to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Section Selection */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Layout className="text-blue-600" />
                Select Sections
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                      cvData.selectedSections.includes(section.id)
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    )}
                  >
                    <span className="font-medium">{section.label}</span>
                    {cvData.selectedSections.includes(section.id) && (
                      <Check size={18} className="text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Palette className="text-blue-600" />
                  Theme & Style
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Primary Color</label>
                    <div className="flex flex-wrap gap-3">
                      {COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setCvData(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: color.value } }))}
                          className={cn(
                            "w-10 h-10 rounded-full border-2 transition-all",
                            cvData.theme.primaryColor === color.value ? "border-gray-900 scale-110" : "border-transparent"
                          )}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            className="w-10 h-10 rounded-full border-2 border-gray-200 p-0.5 cursor-pointer overflow-hidden"
                            value={cvData.theme.primaryColor}
                            onChange={(e) => setCvData(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: e.target.value } }))}
                            title="Choose custom color"
                          />
                          <input 
                            type="text"
                            className="w-20 px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono uppercase"
                            value={cvData.theme.primaryColor}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^#[0-9A-F]{0,6}$/i.test(val)) {
                                setCvData(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: val } }));
                              }
                            }}
                            placeholder="#000000"
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium">Custom Color</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Font Style</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {FONTS.map((font) => (
                        <button
                          key={font.value}
                          onClick={() => setCvData(prev => ({ ...prev, theme: { ...prev.theme, fontStyle: font.value } }))}
                          className={cn(
                            "px-4 py-3 rounded-xl border text-left transition-all",
                            cvData.theme.fontStyle === font.value 
                              ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100" 
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          )}
                        >
                          <div className={cn("text-lg mb-1", font.value)}>Aa</div>
                          <div className="text-xs font-medium truncate">{font.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">CV Length (Pages)</label>
                    <div className="flex gap-3">
                      {[1, 2, 3].map((num) => (
                        <button
                          key={num}
                          onClick={() => setCvData(prev => ({ ...prev, theme: { ...prev.theme, pageCount: num } }))}
                          className={cn(
                            "flex-1 py-3 rounded-xl border font-bold transition-all",
                            cvData.theme.pageCount === num 
                              ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100" 
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          )}
                        >
                          {num} {num === 1 ? 'Page' : 'Pages'}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-[10px] text-gray-500 italic">
                      Note: Content will naturally flow across pages. Selecting more pages adds extra space.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('builder')}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
              >
                Continue to Builder
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">CV Builder</h1>
              <p className="text-xs text-gray-500">Live Preview Mode</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-1 rounded-xl flex">
              <button
                onClick={() => setActiveTab('edit')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === 'edit' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Edit3 size={16} />
                Edit
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === 'preview' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Eye size={16} />
                Preview
              </button>
            </div>

            <div className="h-8 w-[1px] bg-gray-200 mx-2" />

            <button
              onClick={() => setStep('setup')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
              title="Settings"
            >
              <Settings size={20} />
            </button>

            <button
              onClick={() => handlePrint()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              <Printer size={16} />
              Print / PDF
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'edit' ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="max-w-3xl mx-auto"
              >
                <CVForm data={cvData} onChange={setCvData} />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex justify-center"
              >
                <CVPreview ref={previewRef} data={cvData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
