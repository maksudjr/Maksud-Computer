import { useState, useRef, useMemo, useEffect, lazy, Suspense } from 'react';
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
  Sparkles,
  Globe
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateDocx } from './lib/docx-generator';
import { CVData, DEFAULT_CV_DATA, SectionId } from './types';
import { Language } from './lib/translations';
import { CVForm } from './components/CVForm';
import { CVPreview } from './components/CVPreview';
import { CVPreviewToolbar } from './components/CVPreviewToolbar';
import { TemplateSelector } from './components/TemplateSelector';
import { Dashboard } from './components/Dashboard';
import { Logo } from './components/Logo';
import { SecurityProvider, useSecurity } from './components/SecurityGate';
import { cn } from './lib/utils';

// Lazy load heavy components
const AgeCalculator = lazy(() => import('./components/AgeCalculator').then(m => ({ default: m.AgeCalculator })));
const PhotoResizer = lazy(() => import('./components/PhotoResizer').then(m => ({ default: m.PhotoResizer })));
const PdfEditor = lazy(() => import('./components/PdfEditor').then(m => ({ default: m.PdfEditor })));
const AboutUs = lazy(() => import('./components/AboutUs').then(m => ({ default: m.AboutUs })));
const DigitalConverter = lazy(() => import('./components/DigitalConverter').then(m => ({ default: m.DigitalConverter })));
const PhotoEditor = lazy(() => import('./components/PhotoEditor').then(m => ({ default: m.PhotoEditor })));
const PdfTools = lazy(() => import('./components/PdfTools').then(m => ({ default: m.PdfTools })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const IntelligentAI = lazy(() => import('./components/IntelligentAI').then(m => ({ default: m.IntelligentAI })));
const InheritanceCalculator = lazy(() => import('./components/InheritanceCalculator').then(m => ({ default: m.InheritanceCalculator })));
const Translator = lazy(() => import('./components/Translator').then(m => ({ default: m.Translator })));

const LoadingFallback = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-slate-500 font-bold animate-pulse">Loading Tool...</p>
  </div>
);

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
  { name: 'Professional Blue', value: '#2563eb' },
  { name: 'Elite Gold', value: '#d4af37' },
  { name: 'Classic Black', value: '#1a1a1a' },
  { name: 'Emerald Green', value: '#10b981' },
  { name: 'Royal Red', value: '#dc2626' },
  { name: 'Midnight Blue', value: '#1e293b' },
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

type AppStep = 'dashboard' | 'template' | 'setup' | 'builder' | 'age' | 'resizer' | 'pdf' | 'about' | 'photo-editor' | 'bg-remover' | 'pdf-to-img' | 'pdf-to-word' | 'pdf-compress' | 'pdf-merge' | 'img-to-pdf' | 'admin' | 'intelligent-ai' | 'digital-converter' | 'inheritance' | 'translator';

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
  const [uiTheme, setUiTheme] = useState<'light' | 'dark' | 'golden' | 'chameleon'>(() => {
    return (localStorage.getItem('maksud_ui_theme') as any) || 'light';
  });
  const [chameleonColor, setChameleonColor] = useState('#6366f1'); // Default indigo

  // Update chameleon color periodically or on selection
  useEffect(() => {
    if (uiTheme === 'chameleon') {
      const colors = ['#f43f5e', '#ec4899', '#d946ef', '#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#84cc16', '#eab308', '#f97316'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setChameleonColor(randomColor);
      
      const interval = setInterval(() => {
        const nextColor = colors[Math.floor(Math.random() * colors.length)];
        setChameleonColor(nextColor);
      }, 5000); // Change every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [uiTheme]);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as any) || 'en';
  });
  const previewRef = useRef<HTMLDivElement>(null);
  const { requestAccess } = useSecurity();

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('maksud_ui_theme', uiTheme);
  }, [uiTheme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

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
  }, []); // Note: This only updates on mount, which is fine for a welcome message

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${cvData.personalInfo.name || 'CV'}_Curriculum_Vitae`,
    onBeforePrint: async () => {
      if (activeTab !== 'preview') {
        setActiveTab('preview');
        // Wait for rendering
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    },
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
    return (
      <div className={cn(uiTheme, uiTheme === 'chameleon' ? 'dark' : '')}>
        <Dashboard 
          uiTheme={uiTheme}
          onThemeChange={setUiTheme}
          onAdminLogin={() => setStep('admin')}
          language={language}
          onLanguageChange={setLanguage}
          chameleonColor={chameleonColor}
          onSelectTool={(tool, cost) => {
            if (tool === 'age') {
              setStep('age');
              return;
            }
            
            requestAccess(cost, () => {
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
              else if (tool === 'intelligent-ai') setStep('intelligent-ai');
              else if (tool === 'translator') setStep('translator');
              else if (tool === 'converter') setStep('digital-converter');
              else if (tool === 'inheritance') setStep('inheritance');
            }, tool);
          }} 
        />
      </div>
    );
  }

  if (step === 'intelligent-ai') {
    return (
      <div className={uiTheme}>
        <Suspense fallback={<LoadingFallback />}>
          <IntelligentAI onBack={() => setStep('dashboard')} />
        </Suspense>
      </div>
    );
  }

  if (step === 'translator') {
    return (
      <div className={uiTheme}>
        <Suspense fallback={<LoadingFallback />}>
          <Translator onBack={() => setStep('dashboard')} uiTheme={uiTheme} language={language} />
        </Suspense>
      </div>
    );
  }

  if (step === 'admin') {
    return (
      <div className={uiTheme}>
        <Suspense fallback={<LoadingFallback />}>
          <AdminPanel onBack={() => setStep('dashboard')} />
        </Suspense>
      </div>
    );
  }

  if (step === 'age') {
    return (
      <div className={uiTheme}>
        <Suspense fallback={<LoadingFallback />}>
          <AgeCalculator onBack={() => setStep('dashboard')} />
        </Suspense>
      </div>
    );
  }

  if (step === 'resizer') {
    return (
      <div className={uiTheme}>
        <Suspense fallback={<LoadingFallback />}>
          <PhotoResizer onBack={() => setStep('dashboard')} />
        </Suspense>
      </div>
    );
  }

  if (step === 'pdf') {
    return (
      <div className={uiTheme}>
        <Suspense fallback={<LoadingFallback />}>
          <PdfEditor onBack={() => setStep('dashboard')} />
        </Suspense>
      </div>
    );
  }

  if (step === 'pdf-to-img' || step === 'pdf-to-word' || step === 'pdf-compress' || step === 'pdf-merge' || step === 'img-to-pdf') {
    return (
      <div className={uiTheme}>
        <Suspense fallback={<LoadingFallback />}>
          <PdfTools type={step as any} onBack={() => setStep('dashboard')} uiTheme={uiTheme} language={language} />
        </Suspense>
      </div>
    );
  }

  if (step === 'about') {
    return (
      <div className={uiTheme}>
        <Suspense fallback={<LoadingFallback />}>
          <AboutUs onBack={() => setStep('dashboard')} uiTheme={uiTheme} language={language} />
        </Suspense>
      </div>
    );
  }

  if (step === 'digital-converter') {
    return (
      <div className={uiTheme}>
        <Suspense fallback={<LoadingFallback />}>
          <DigitalConverter onBack={() => setStep('dashboard')} uiTheme={uiTheme} language={language} />
        </Suspense>
      </div>
    );
  }

  if (step === 'inheritance') {
    return (
      <div className={uiTheme}>
        <Suspense fallback={<LoadingFallback />}>
          <InheritanceCalculator onBack={() => setStep('dashboard')} uiTheme={uiTheme} language={language} />
        </Suspense>
      </div>
    );
  }

  if (step === 'photo-editor' || step === 'bg-remover') {
    return (
      <div className={uiTheme}>
        <Suspense fallback={<LoadingFallback />}>
          <div className={cn("min-h-screen flex flex-col", uiTheme === 'light' ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-white")}>
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
      </Suspense>
      </div>
    );
  }

  if (step === 'template') {
    return (
      <div className={uiTheme}>
        <div className={cn("min-h-screen", uiTheme === 'light' ? "bg-gray-50" : (uiTheme === 'dark' ? "bg-slate-950" : "bg-[#121212]"))}>
          <button 
            onClick={() => setStep('dashboard')}
            className={cn(
              "fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all font-medium",
              uiTheme === 'light' ? "bg-white text-gray-600 hover:text-indigo-600" : (uiTheme === 'dark' ? "bg-slate-900 text-slate-300 hover:text-white" : "bg-amber-950 text-amber-500 hover:text-amber-200")
            )}
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
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div className={uiTheme}>
        <div className={cn("min-h-screen py-12 px-4", uiTheme === 'light' ? "bg-gray-50" : (uiTheme === 'dark' ? "bg-slate-950" : "bg-[#121212]"))}>
          <button 
            onClick={() => setStep('template')}
            className={cn(
              "fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all font-medium",
              uiTheme === 'light' ? "bg-white text-gray-600 hover:text-indigo-600" : (uiTheme === 'dark' ? "bg-slate-900 text-slate-300 hover:text-white" : "bg-amber-950 text-amber-500 hover:text-amber-200")
            )}
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
              <h1 className={cn("text-4xl font-extrabold tracking-tight mb-4", uiTheme === 'light' ? "text-gray-900" : (uiTheme === 'dark' ? "text-white" : "text-amber-500"))}>
                Maksud Computer CV Builder
              </h1>
              <p className={cn("text-xl font-medium mb-2", uiTheme === 'golden' ? "text-amber-600" : "text-indigo-600")}>
                {welcomeMessage}
              </p>
              <p className={cn("text-lg", uiTheme === 'light' ? "text-gray-600" : "text-slate-400")}>
                Configure your CV structure and theme to get started.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Section Selection */}
              <div className={cn("lg:col-span-5 p-5 rounded-2xl shadow-sm border", 
                uiTheme === 'light' ? "bg-white border-gray-100" : (uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-[#1a1a1a] border-amber-900/30"))}>
                <h2 className={cn("text-base font-bold mb-3 flex items-center gap-2", uiTheme === 'light' ? "text-gray-900" : "text-white")}>
                  <Layout className={cn(uiTheme === 'golden' ? "text-amber-500" : "text-indigo-600")} size={18} />
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
                          ? (uiTheme === 'golden' ? "border-amber-600 bg-amber-950 text-amber-500" : "border-indigo-600 bg-indigo-50 text-indigo-700")
                          : (uiTheme === 'light' ? "border-gray-100 hover:border-gray-200 text-gray-600" : "border-slate-800 hover:border-slate-700 text-slate-400")
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
                <div className={cn("p-6 rounded-2xl shadow-sm border", 
                  uiTheme === 'light' ? "bg-white border-gray-100" : (uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-[#1a1a1a] border-amber-900/30"))}>
                  <h2 className={cn("text-base font-bold mb-4 flex items-center gap-2", uiTheme === 'light' ? "text-gray-900" : "text-white")}>
                    <Palette className={cn(uiTheme === 'golden' ? "text-amber-500" : "text-indigo-600")} size={18} />
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
                              cvData.theme.primaryColor === color.value ? (uiTheme === 'golden' ? "border-amber-500 scale-110" : "border-indigo-600 scale-110") : "border-transparent"
                            )}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                        <input 
                          type="color" 
                          className="w-10 h-10 rounded-full border-2 border-slate-700 p-0.5 cursor-pointer bg-slate-800"
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
                                ? (uiTheme === 'golden' ? "border-amber-500 bg-amber-950 text-amber-500 font-bold" : "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold")
                                : (uiTheme === 'light' ? "border-gray-100 hover:border-gray-200 text-gray-600" : "border-slate-800 hover:border-slate-700 text-slate-400")
                            )}
                          >
                            {font.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className={cn("text-sm font-bold", uiTheme === 'light' ? "text-gray-700" : "text-slate-300")}>Show Section Borders</label>
                      <button
                        onClick={() => setCvData(prev => ({ ...prev, theme: { ...prev.theme, showBorder: !prev.theme.showBorder } }))}
                        className={cn(
                          "w-12 h-6 rounded-full transition-colors relative",
                          cvData.theme.showBorder ? (uiTheme === 'golden' ? "bg-amber-600" : "bg-indigo-600") : "bg-gray-400"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                          cvData.theme.showBorder ? "left-7" : "left-1"
                        )} />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep('builder')}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2",
                    uiTheme === 'golden' ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-950/20" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                  )}
                >
                  Start Building CV
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={uiTheme}>
      <div className={cn("min-h-screen", uiTheme === 'light' ? "bg-gray-50" : (uiTheme === 'dark' ? "bg-slate-950" : "bg-[#121212]"))}>
        {/* Builder Header */}
        <header className={cn(
          "sticky top-0 z-50 px-4 py-3 border-b transition-all",
          uiTheme === 'light' ? "bg-white border-gray-200" : (uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-[#1a1a1a] border-amber-900/30")
        )}>
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setStep('setup')}
                className={cn("p-2 rounded-lg transition-colors", uiTheme === 'light' ? "hover:bg-gray-100 text-gray-500" : "hover:bg-slate-800 text-slate-400")}
                title="Back to Setup"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                <Logo className="w-10 h-10" />
                <div>
                  <h1 className={cn("text-lg font-bold leading-tight", uiTheme === 'light' ? "text-gray-900" : (uiTheme === 'dark' ? "text-white" : "text-amber-500"))}>
                    {cvData.personalInfo.name || 'Untitled CV'}
                  </h1>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Maksud Computer's
                  </p>
                </div>
              </div>
            </div>

            <div className={cn("flex items-center gap-2 p-1 rounded-xl", uiTheme === 'light' ? "bg-gray-100" : "bg-slate-800")}>
              <button
                onClick={() => setActiveTab('edit')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  activeTab === 'edit' 
                    ? (uiTheme === 'golden' ? "bg-amber-600 text-white shadow-sm" : "bg-white text-indigo-600 shadow-sm") 
                    : (uiTheme === 'light' ? "text-gray-500 hover:text-gray-700" : "text-slate-400 hover:text-white")
                )}
              >
                <Edit3 size={16} />
                Edit
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  activeTab === 'preview' 
                    ? (uiTheme === 'golden' ? "bg-amber-600 text-white shadow-sm" : "bg-white text-indigo-600 shadow-sm") 
                    : (uiTheme === 'light' ? "text-gray-500 hover:text-gray-700" : "text-slate-400 hover:text-white")
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
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-all",
                    uiTheme === 'light' ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50" : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                  )}
                >
                  <FileCode size={16} className="text-blue-500 text-blue-600" />
                  Word
                </button>
                <button
                  onClick={handleSaveAsPDF}
                  disabled={isGeneratingPDF}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-all",
                    uiTheme === 'light' ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50" : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                  )}
                >
                  {isGeneratingPDF ? (
                    <div className={cn("animate-spin rounded-full h-4 w-4 border-2 border-t-transparent", uiTheme === 'golden' ? "border-amber-500" : "border-indigo-600")}></div>
                  ) : (
                    <FileDown size={16} className="text-red-500 text-red-600" />
                  )}
                  PDF
                </button>
              </div>
              <button
                onClick={handlePrint}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold shadow-lg transition-all",
                  uiTheme === 'golden' ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-950/20" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                )}
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
                className="relative flex flex-col items-center xl:pr-72"
              >
                <CVPreviewToolbar data={cvData} onChange={setCvData} uiTheme={uiTheme} />
                
                <div className={cn(
                  "w-full max-w-[210mm] bg-white shadow-2xl rounded-sm overflow-hidden cv-paper",
                  uiTheme === 'light' ? "ring-1 ring-gray-100" : "ring-1 ring-slate-800"
                )}>
                  <div ref={previewRef}>
                    <CVPreview data={cvData} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
