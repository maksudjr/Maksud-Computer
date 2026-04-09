import { useState, useRef, useMemo, useEffect } from 'react';
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
  Plus,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateDocx } from './lib/docx-generator';
import { CVData, DEFAULT_CV_DATA, SectionId } from './types';
import { CVForm } from './components/CVForm';
import { CVPreview } from './components/CVPreview';
import { TemplateSelector } from './components/TemplateSelector';
import { Dashboard } from './components/Dashboard';
import { AgeCalculator } from './components/AgeCalculator';
import { PhotoResizer } from './components/PhotoResizer';
import { PdfEditor } from './components/PdfEditor';
import { AboutUs } from './components/AboutUs';
import { PhotoEditor } from './components/PhotoEditor';
import { PdfTools } from './components/PdfTools';
import { Logo } from './components/Logo';
import { SecurityProvider, useSecurity } from './components/SecurityGate';
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

type AppStep = 'dashboard' | 'template' | 'setup' | 'builder' | 'age' | 'resizer' | 'pdf' | 'about' | 'photo-editor' | 'bg-remover' | 'pdf-to-img' | 'pdf-to-word' | 'pdf-compress' | 'pdf-merge' | 'img-to-pdf';

export default function App() {
  return (
    <SecurityProvider>
      <MainContent />
    </SecurityProvider>
  );
}

function MainContent() {
  const [step, setStep] = useState<AppStep>('dashboard');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [cvData, setCvData] = useState<CVData>(DEFAULT_CV_DATA);
  const [history, setHistory] = useState<CVData[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [standalonePhoto, setStandalonePhoto] = useState<string | null>(null);
  const [autoRemoveBg, setAutoRemoveBg] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { requestAccess } = useSecurity();

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('cv_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (data: CVData) => {
    const newHistory = [
      { ...data, lastUpdated: Date.now(), id: data.id === 'default' ? Math.random().toString(36).substr(2, 9) : data.id },
      ...history.filter(h => h.id !== data.id)
    ].slice(0, 5);
    
    setHistory(newHistory);
    localStorage.setItem('cv_history', JSON.stringify(newHistory));
  };

  const deleteFromHistory = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('cv_history', JSON.stringify(newHistory));
  };

  const handleViewHistory = (cv: CVData) => {
    setCvData(cv);
    setStep('builder');
    setActiveTab('preview');
  };

  const handlePrintHistory = async (cv: CVData) => {
    setCvData(cv);
    setStep('builder');
    setActiveTab('preview');
    setTimeout(() => {
      handlePrint();
    }, 500);
  };

  const handleDownloadHistory = async (cv: CVData) => {
    setCvData(cv);
    setStep('builder');
    setActiveTab('preview');
    setTimeout(() => {
      handleSaveAsPDF();
    }, 500);
  };

  const welcomeMessage = useMemo(() => {
    const hour = new Date().getHours();
    const auth = JSON.parse(localStorage.getItem('maksud_auth') || '{}');
    const name = auth.name ? `, ${auth.name}` : '';
    
    if (hour < 12) return `Good Morning${name}! Welcome to Maksud Computer.`;
    if (hour < 18) return `Good Afternoon${name}! Welcome to Maksud Computer.`;
    return `Good Evening${name}! Welcome to Maksud Computer.`;
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${cvData.personalInfo.name || 'CV'}_Curriculum_Vitae`,
    onAfterPrint: () => saveToHistory(cvData),
  });

  const handleSaveAsPDF = async () => {
    if (!previewRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      
      const x = (pdfWidth - finalWidth) / 2;
      const y = 0; // Start from top
      
      pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
      pdf.save(`${cvData.personalInfo.name || 'CV'}_Curriculum_Vitae.pdf`);
      saveToHistory(cvData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try the Print option instead.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSaveAsWord = async () => {
    try {
      await generateDocx(cvData);
    } catch (error) {
      console.error('Error generating Word document:', error);
    }
  };

  const toggleSection = (id: SectionId) => {
    setCvData(prev => ({
      ...prev,
      selectedSections: prev.selectedSections.includes(id)
        ? prev.selectedSections.filter(s => s !== id)
        : [...prev.selectedSections, id]
    }));
  };

  if (step === 'dashboard') {
    return <Dashboard onSelectTool={(tool) => {
      if (tool === 'age') {
        setStep('age');
        return;
      }
      
      requestAccess(() => {
        if (tool === 'cv') setStep('template');
        else if (tool === 'resizer') setStep('resizer');
        else if (tool === 'pdf') setStep('pdf');
        else if (tool === 'about') setStep('about');
        else if (tool === 'editor') {
          setStep('photo-editor');
          setAutoRemoveBg(false);
        }
        else if (tool === 'bg-remover') {
          setStep('bg-remover');
          setAutoRemoveBg(true);
        }
        else if (tool === 'pdf-to-img') setStep('pdf-to-img');
        else if (tool === 'pdf-to-word') setStep('pdf-to-word');
        else if (tool === 'pdf-compress') setStep('pdf-compress');
        else if (tool === 'pdf-merge') setStep('pdf-merge');
        else if (tool === 'img-to-pdf') setStep('img-to-pdf');
      });
    }} />;
  }

  if (step === 'age') {
    return <AgeCalculator onBack={() => setStep('dashboard')} />;
  }

  if (step === 'resizer') {
    return <PhotoResizer onBack={() => setStep('dashboard')} />;
  }

  if (step === 'pdf') {
    return <PdfEditor onBack={() => setStep('dashboard')} />;
  }

  if (step === 'pdf-to-img' || step === 'pdf-to-word' || step === 'pdf-compress' || step === 'pdf-merge' || step === 'img-to-pdf') {
    return <PdfTools type={step as any} onBack={() => setStep('dashboard')} />;
  }

  if (step === 'about') {
    return <AboutUs onBack={() => setStep('dashboard')} />;
  }

  if (step === 'photo-editor' || step === 'bg-remover') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {!standalonePhoto ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <button 
              onClick={() => setStep('dashboard')}
              className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <div className="max-w-md space-y-6">
              <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
                {step === 'bg-remover' ? <Sparkles size={48} className="text-white" /> : <Layout size={48} className="text-white" />}
              </div>
              <h1 className="text-3xl font-bold text-white">
                {step === 'bg-remover' ? 'AI Background Remover' : 'Advanced Photo Editor'}
              </h1>
              <p className="text-gray-400">
                {step === 'bg-remover' 
                  ? 'Upload a photo to instantly remove its background using AI.' 
                  : 'Upload a photo to start editing with AI background removal and enhancement tools.'}
              </p>
              <label className="block">
                <span className="sr-only">Choose photo</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setStandalonePhoto(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-full file:border-0
                    file:text-sm file:font-bold
                    file:bg-indigo-600 file:text-white
                    hover:file:bg-indigo-700
                    cursor-pointer"
                />
              </label>
            </div>
          </div>
        ) : (
          <PhotoEditor 
            image={standalonePhoto}
            autoRemoveBg={autoRemoveBg}
            onSave={(edited) => {
              const link = document.createElement('a');
              link.href = edited;
              link.download = step === 'bg-remover' ? 'no_bg_photo.png' : 'edited_photo.png';
              link.click();
              setStandalonePhoto(null);
            }}
            onCancel={() => setStandalonePhoto(null)}
          />
        )}
      </div>
    );
  }

  if (step === 'template') {
    return (
      <div className="min-h-screen bg-gray-50">
        <button 
          onClick={() => setStep('dashboard')}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-gray-600 hover:text-indigo-600 transition-all font-medium"
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>
        <TemplateSelector 
          selectedId={cvData.theme.templateId}
          onSelect={(id) => setCvData(prev => ({ ...prev, theme: { ...prev.theme, templateId: id } }))}
          onNext={() => {
            saveToHistory(cvData);
            setStep('setup');
          }}
          history={history}
          onViewHistory={handleViewHistory}
          onDeleteHistory={deleteFromHistory}
          onPrintHistory={handlePrintHistory}
          onDownloadHistory={handleDownloadHistory}
        />
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <button 
          onClick={() => setStep('template')}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-gray-600 hover:text-indigo-600 transition-all font-medium"
        >
          <ArrowLeft size={18} />
          Templates
        </button>
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
                        : "border-gray-100 hover:border-gray-200 text-gray-600"
                    )}
                  >
                    <span className="text-sm font-medium">{section.label}</span>
                    {cvData.selectedSections.includes(section.id) && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Customization */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                  <Palette className="text-indigo-600" size={18} />
                  Theme & Colors
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Primary Color</label>
                    <div className="flex flex-wrap gap-3">
                      {COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setCvData(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: color.value } }))}
                          className={cn(
                            "w-10 h-10 rounded-full border-2 transition-all",
                            cvData.theme.primaryColor === color.value ? "border-indigo-600 scale-110" : "border-transparent"
                          )}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                      <input 
                        type="color" 
                        className="w-10 h-10 rounded-full border-2 border-gray-100 p-0.5 cursor-pointer"
                        value={cvData.theme.primaryColor}
                        onChange={(e) => setCvData(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: e.target.value } }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Typography</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {FONTS.map((font) => (
                        <button
                          key={font.value}
                          onClick={() => setCvData(prev => ({ ...prev, theme: { ...prev.theme, font: font.value } }))}
                          className={cn(
                            "px-3 py-2 rounded-lg border text-sm transition-all",
                            cvData.theme.font === font.value
                              ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold"
                              : "border-gray-100 hover:border-gray-200 text-gray-600"
                          )}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Font Size</label>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setCvData(prev => ({ ...prev, theme: { ...prev.theme, fontSize: Math.max(10, prev.theme.fontSize - 1) } }))}
                        className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-lg font-bold w-12 text-center">{cvData.theme.fontSize}px</span>
                      <button 
                        onClick={() => setCvData(prev => ({ ...prev, theme: { ...prev.theme, fontSize: Math.min(18, prev.theme.fontSize + 1) } }))}
                        className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('builder')}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                Start Building CV
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Builder Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setStep('setup')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              title="Back to Setup"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Logo className="w-10 h-10" />
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  {cvData.personalInfo.name || 'Untitled CV'}
                </h1>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Maksud Computer's
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('edit')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                activeTab === 'edit' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Edit3 size={16} />
              Edit
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                activeTab === 'preview' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Eye size={16} />
              Preview
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <button
                onClick={handleSaveAsWord}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
              >
                <FileCode size={16} className="text-blue-600" />
                Word
              </button>
              <button
                onClick={handleSaveAsPDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
              >
                {isGeneratingPDF ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
                ) : (
                  <FileDown size={16} className="text-red-600" />
                )}
                PDF
              </button>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all"
            >
              <Printer size={16} />
              Print
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'edit' ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
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
              <div className="w-full max-w-[210mm] bg-white shadow-2xl rounded-sm overflow-hidden">
                <div ref={previewRef}>
                  <CVPreview data={cvData} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
