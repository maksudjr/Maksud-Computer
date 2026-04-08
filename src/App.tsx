import { useState, useRef, useMemo } from 'react';
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
  Layout,
  FileDown,
  FileCode,
  Type,
  Minus,
  Plus
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateDocx } from './lib/docx-generator';
import { CVData, DEFAULT_CV_DATA, SectionId } from './types';
import { CVForm } from './components/CVForm';
import { CVPreview } from './components/CVPreview';
import { TemplateSelector } from './components/TemplateSelector';
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
  const [step, setStep] = useState<'template' | 'setup' | 'builder'>('template');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [cvData, setCvData] = useState<CVData>(DEFAULT_CV_DATA);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const welcomeMessage = useMemo(() => {
    const messages = [
      "Welcome! Let's build your professional CV today.",
      "Ready to land your dream job? Start with a great CV!",
      "Welcome to Maksud Computer CV Builder - Your career starts here.",
      "Create a standout CV in minutes. Let's get started!",
      "Hello! Ready to showcase your professional journey?",
      "Welcome! A professional CV is just a few clicks away."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${cvData.personalInfo.name || 'CV'}_Curriculum_Vitae`,
  });

  const handleSaveAsPDF = async () => {
    if (!previewRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 210 * 3.78, // 210mm in pixels
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cvData.personalInfo.name || 'CV'}_Curriculum_Vitae.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSaveAsWord = async () => {
    await generateDocx(cvData);
  };

  const toggleSection = (id: SectionId) => {
    setCvData(prev => ({
      ...prev,
      selectedSections: prev.selectedSections.includes(id)
        ? prev.selectedSections.filter(s => s !== id)
        : [...prev.selectedSections, id]
    }));
  };

  if (step === 'template') {
    return (
      <div className="min-h-screen bg-gray-50">
        <TemplateSelector 
          selectedId={cvData.theme.templateId}
          onSelect={(id) => setCvData(prev => ({ ...prev, theme: { ...prev.theme, templateId: id } }))}
          onNext={() => setStep('setup')}
        />
      </div>
    );
  }

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
            <p className="text-xl font-medium text-indigo-600 mb-2">
              {welcomeMessage}
            </p>
            <p className="text-lg text-gray-600">
              Configure your CV structure and theme to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Section Selection */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-base font-bold mb-3 flex items-center gap-2">
                <Layout className="text-indigo-600" size={18} />
                Select Sections
              </h2>
              <div className="grid grid-cols-1 gap-1.5">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-xl border transition-all text-left",
                      cvData.selectedSections.includes(section.id)
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    )}
                  >
                    <span className="text-xs font-medium">{section.label}</span>
                    {cvData.selectedSections.includes(section.id) && (
                      <Check size={14} className="text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-base font-bold mb-3 flex items-center gap-2">
                  <Palette className="text-indigo-600" size={18} />
                  Theme & Style
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Template</label>
                      <button
                        onClick={() => setStep('template')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Layout size={14} />
                          <span className="text-xs font-bold">{cvData.theme.templateId === 'classic' ? 'Classic' : 'Modern'}</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">Change</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Primary Color</label>
                      <div className="flex flex-wrap gap-1.5">
                        {COLORS.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setCvData(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: color.value } }))}
                            className={cn(
                              "w-7 h-7 rounded-full border-2 transition-all",
                              cvData.theme.primaryColor === color.value ? "border-gray-900 scale-110" : "border-transparent"
                            )}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                        <input 
                          type="color" 
                          className="w-7 h-7 rounded-full border-2 border-gray-200 p-0.5 cursor-pointer overflow-hidden"
                          value={cvData.theme.primaryColor}
                          onChange={(e) => setCvData(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: e.target.value } }))}
                          title="Custom"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Font Size ({cvData.theme.fontSize}pt)</label>
                      <div className="flex items-center gap-2.5 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                        <button 
                          onClick={() => setCvData(prev => ({ ...prev, theme: { ...prev.theme, fontSize: Math.max(8, prev.theme.fontSize - 1) } }))}
                          className="p-1 hover:bg-white rounded-lg transition-all text-gray-600 shadow-sm"
                        >
                          <Minus size={12} />
                        </button>
                        <input 
                          type="range"
                          min="8"
                          max="16"
                          step="0.5"
                          value={cvData.theme.fontSize}
                          onChange={(e) => setCvData(prev => ({ ...prev, theme: { ...prev.theme, fontSize: parseFloat(e.target.value) } }))}
                          className="flex-1 accent-indigo-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <button 
                          onClick={() => setCvData(prev => ({ ...prev, theme: { ...prev.theme, fontSize: Math.min(16, prev.theme.fontSize + 1) } }))}
                          className="p-1 hover:bg-white rounded-lg transition-all text-gray-600 shadow-sm"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Font Style</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {FONTS.slice(0, 6).map((font) => (
                          <button
                            key={font.value}
                            onClick={() => setCvData(prev => ({ ...prev, theme: { ...prev.theme, fontStyle: font.value } }))}
                            className={cn(
                              "px-2.5 py-1.5 rounded-xl border text-left transition-all",
                              cvData.theme.fontStyle === font.value 
                                ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                            )}
                          >
                            <div className={cn("text-xs font-medium truncate", font.value)}>{font.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('builder')}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
              >
                Continue to Builder
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
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
                  activeTab === 'edit' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Edit3 size={16} />
                Edit
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === 'preview' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Eye size={16} />
                Preview
              </button>
            </div>

            <div className="h-8 w-[1px] bg-gray-200 mx-2" />

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveAsPDF}
                disabled={isGeneratingPDF}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                  isGeneratingPDF && "animate-pulse"
                )}
                title="Save as PDF"
              >
                <FileDown size={16} />
                {isGeneratingPDF ? 'Wait...' : 'PDF'}
              </button>
              
              <button
                onClick={handleSaveAsWord}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all"
                title="Save as Word (.docx)"
              >
                <FileCode size={16} />
                Word
              </button>

              <button
                onClick={() => handlePrint()}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <Printer size={16} />
                Print
              </button>
            </div>

            <button
              onClick={() => setStep('setup')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
              title="Settings"
            >
              <Settings size={20} />
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
