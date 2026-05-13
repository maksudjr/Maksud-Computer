import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Calculator, 
  Layout, 
  FileEdit, 
  Users, 
  ChevronRight,
  Zap,
  ShieldCheck,
  Monitor,
  Image as ImageIcon,
  Sparkles,
  Facebook,
  FileImage,
  FileType,
  FileArchive,
  Files,
  ImagePlus,
  Crown,
  Palette,
  Settings,
  Coins as CoinsIcon,
  LogOut,
  Phone,
  Mail,
  CheckCircle2,
  Gift,
  AlertCircle,
  Tag,
  CreditCard,
  Send,
  X,
  Menu,
  Bot,
  Globe,
  ArrowRightLeft,
  Languages
} from 'lucide-react';
import { Logo } from './Logo';
import { cn } from '../lib/utils';
import { useSecurity } from './SecurityGate';
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Language, translations } from '../lib/translations';

interface DashboardProps {
  onSelectTool: (tool: 'cv' | 'age' | 'resizer' | 'editor' | 'pdf' | 'about' | 'bg-remover' | 'pdf-to-img' | 'pdf-to-word' | 'pdf-compress' | 'pdf-merge' | 'img-to-pdf' | 'intelligent-ai' | 'converter' | 'inheritance' | 'translator', cost: number) => void;
  onAdminLogin: () => void;
  uiTheme: 'light' | 'dark' | 'golden' | 'chameleon';
  onThemeChange: (theme: 'light' | 'dark' | 'golden' | 'chameleon') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  chameleonColor?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onSelectTool, 
  onAdminLogin, 
  uiTheme, 
  onThemeChange,
  language,
  onLanguageChange,
  chameleonColor = '#6366f1'
}) => {
  const { coins, userName, isAuthorized, logout, freeTrialUsed, isFreeAccess, activateFreeAccess, error, activeKey } = useSecurity();
  const [showFreeSuccess, setShowFreeSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'pricing'>('tools');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPdfMenu, setShowPdfMenu] = useState(false);
  const t = translations[language];
  const [paymentData, setPaymentData] = useState({
    amount: '',
    transactionId: '',
    fullName: '',
    mobileNo: '',
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const welcomeMessage = useMemo(() => {
    const hour = new Date().getHours();
    const name = userName ? `, ${userName}` : '';
    
    let base = t.dashboard.welcomeMorning;
    if (hour >= 12 && hour < 18) base = t.dashboard.welcomeAfternoon;
    else if (hour >= 18) base = t.dashboard.welcomeEvening;
    
    return `${base}${name}!`;
  }, [userName, t]);

  const tools = [
    {
      id: 'intelligent-ai',
      name: t.dashboard.tools.ai,
      description: t.dashboard.toolDescriptions.ai,
      icon: <Bot className="text-indigo-600" />,
      color: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      borderColor: 'border-indigo-100',
      cost: 0.01
    },
    {
      id: 'translator',
      name: t.dashboard.tools.translator,
      description: t.dashboard.toolDescriptions.translator,
      icon: <Languages className="text-violet-600" />,
      color: 'bg-violet-50',
      hoverColor: 'hover:bg-violet-100',
      borderColor: 'border-violet-100',
      cost: 0.1
    },
    {
      id: 'cv',
      name: t.dashboard.tools.cv,
      description: t.dashboard.toolDescriptions.cv,
      icon: <FileText className="text-blue-600" />,
      color: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      borderColor: 'border-blue-100',
      cost: 1
    },
    {
      id: 'editor',
      name: t.dashboard.tools.photoEditor,
      description: t.dashboard.toolDescriptions.photoEditor,
      icon: <ImageIcon className="text-indigo-600" />,
      color: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      borderColor: 'border-indigo-100',
      cost: 0.5
    },
    {
      id: 'bg-remover',
      name: t.dashboard.tools.bgRemover,
      description: t.dashboard.toolDescriptions.bgRemover,
      icon: <Sparkles className="text-amber-600" />,
      color: 'bg-amber-50',
      hoverColor: 'hover:bg-amber-100',
      borderColor: 'border-amber-100',
      cost: 0.5
    },
    {
      id: 'pdfGroup',
      name: t.dashboard.tools.pdfGroup,
      description: t.dashboard.toolDescriptions.pdfGroup,
      icon: <Files className="text-red-600" />,
      color: 'bg-red-50',
      hoverColor: 'hover:bg-red-100',
      borderColor: 'border-red-100',
      cost: 0.25
    },
    {
      id: 'resizer',
      name: t.dashboard.tools.resizer,
      description: t.dashboard.toolDescriptions.resizer,
      icon: <Layout className="text-purple-600" />,
      color: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      borderColor: 'border-purple-100',
      cost: 0.5
    },
    {
      id: 'age',
      name: t.dashboard.tools.ageCalc,
      description: t.dashboard.toolDescriptions.ageCalc,
      icon: <Calculator className="text-green-600" />,
      color: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      borderColor: 'border-green-100',
      cost: 0
    },
    {
      id: 'inheritance',
      name: t.dashboard.tools.inheritance,
      description: t.dashboard.toolDescriptions.inheritance,
      icon: <Users className="text-purple-600" />,
      color: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      borderColor: 'border-purple-100',
      cost: 0
    },
    {
      id: 'converter',
      name: t.dashboard.tools.converter,
      description: t.dashboard.toolDescriptions.converter,
      icon: <ArrowRightLeft className="text-emerald-600" />,
      color: 'bg-emerald-50',
      hoverColor: 'hover:bg-emerald-100',
      borderColor: 'border-emerald-100',
      cost: 0
    }
  ];

  const pdfSubTools = [
    { id: 'pdf', name: t.dashboard.tools.pdfEditor, icon: <FileEdit size={24} />, desc: t.dashboard.toolDescriptions.pdfEditor, color: 'text-red-600' },
    { id: 'pdf-to-img', name: t.dashboard.tools.pdfToImg, icon: <FileImage size={24} />, desc: t.dashboard.toolDescriptions.pdfToImg, color: 'text-orange-600' },
    { id: 'pdf-to-word', name: t.dashboard.tools.pdfToWord, icon: <FileType size={24} />, desc: t.dashboard.toolDescriptions.pdfToWord, color: 'text-blue-600' },
    { id: 'pdf-compress', name: t.dashboard.tools.pdfCompress, icon: <FileArchive size={24} />, desc: t.dashboard.toolDescriptions.pdfCompress, color: 'text-emerald-600' },
    { id: 'pdf-merge', name: t.dashboard.tools.pdfMerge, icon: <Files size={24} />, desc: t.dashboard.toolDescriptions.pdfMerge, color: 'text-rose-600' },
    { id: 'img-to-pdf', name: t.dashboard.tools.imgToPdf, icon: <ImagePlus size={24} />, desc: t.dashboard.toolDescriptions.imgToPdf, color: 'text-cyan-600' },
  ];

  const getToolSpan = (index: number) => {
    const desktopPatterns = [
      "md:col-span-3 md:row-span-2", // Big hero tool
      "md:col-span-3 md:row-span-1", // Wide tool
      "md:col-span-2 md:row-span-2", // Large square
      "md:col-span-2 md:row-span-1", // Narrow wide
      "md:col-span-2 md:row-span-1", // Narrow wide
      "md:col-span-2 md:row-span-2", // Large square
      "md:col-span-4 md:row-span-1", // Extra wide
      "md:col-span-2 md:row-span-2", // Large square
    ];
    return desktopPatterns[index % desktopPatterns.length];
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      uiTheme === 'light' ? "bg-slate-50" : (uiTheme === 'dark' ? "bg-slate-950 text-slate-100" : "bg-[#004d35] text-white")
    )}>
      {/* Premium Banner */}
      <div className={cn(
        "py-3 px-4 transition-all",
        uiTheme === 'golden' ? "bg-[#f42a41] shadow-lg shadow-red-900/20" : "bg-[#006747] shadow-lg shadow-emerald-900/20"
      )}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Crown size={20} />
            </div>
            <p className="text-sm font-bold tracking-tight">
              {t.dashboard.premiumBanner} <span className="opacity-75 font-mono ml-2">01622638268</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={onAdminLogin}
              className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs uppercase tracking-wider backdrop-blur-sm transition-all"
            >
              <div className="flex items-center gap-2">
                <Settings size={14} />
                {t.dashboard.adminLogin}
              </div>
            </button>
            {isAuthorized && (
              <button 
                onClick={logout}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-500/25"
              >
                <div className="flex items-center gap-2">
                  <LogOut size={14} />
                  {t.dashboard.logout}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Free Access Section */}
      {!isAuthorized && (
        <div className="bg-amber-50 border-b border-amber-100 py-4 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                <Gift size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{t.dashboard.newUserGift}</p>
                <p className="text-xs font-medium text-slate-500">{t.dashboard.newUserInfo}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={async () => {
                  await activateFreeAccess();
                  if (!error) {
                    setShowFreeSuccess(true);
                    setTimeout(() => setShowFreeSuccess(false), 5000);
                  }
                }}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-sm shadow-lg shadow-amber-200 transition-all flex items-center gap-2 group"
              >
                {t.dashboard.getFreeAccess}
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <AnimatePresence>
            {error && !isAuthorized && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-7xl mx-auto mt-4"
              >
                <div className="bg-red-500 text-white p-3 rounded-xl flex items-center gap-3 font-black text-sm">
                  <AlertCircle size={18} />
                  {error}
                </div>
              </motion.div>
            )}
            {showFreeSuccess && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-7xl mx-auto mt-4"
              >
                <div className="bg-emerald-500 text-white p-3 rounded-xl flex items-center gap-3 font-black text-sm">
                  <CheckCircle2 size={18} />
                  {t.dashboard.freeAccessSuccess}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Modern Header */}
      <header className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300 backdrop-blur-md",
        uiTheme === 'light' ? "bg-white/80 border-slate-200" : 
        uiTheme === 'dark' ? "bg-slate-950/80 border-slate-800" :
        (uiTheme === 'chameleon' ? "bg-slate-950/80 border-white/10" : "bg-[#1a1a1a]/80 border-amber-900/30")
      )}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className={cn(
                "md:hidden p-2 rounded-xl transition-colors",
                uiTheme === 'light' ? "bg-slate-100 text-slate-900" : "bg-slate-800 text-slate-100"
              )}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative group">
              <Logo className="w-12 h-12 transition-transform duration-500 cursor-pointer hover:scale-110" />
              <div className="absolute -bottom-1 -right-1 bg-[#f42a41] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white">LIVE</div>
            </div>
            <div className="hidden sm:block">
              <h2 className={cn("text-xl font-bold tracking-tight leading-none", uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'dark' ? "text-white" : "text-emerald-400"))}>MAKSUD</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Computers</span>
                <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse rounded-full" />
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-6">
                  {['tools', 'pricing'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={cn(
                        "text-sm font-bold uppercase tracking-wider transition-all relative py-2",
                        activeTab === tab 
                          ? (uiTheme === 'golden' ? "text-emerald-300" : (uiTheme === 'chameleon' ? "opacity-100" : "text-indigo-600")) 
                          : (uiTheme === 'light' ? "text-slate-500 hover:text-slate-900" : (uiTheme === 'golden' ? "text-emerald-100/40 hover:text-white" : "text-slate-400 hover:text-slate-100"))
                      )}
                      style={activeTab === tab && uiTheme === 'chameleon' ? { color: chameleonColor } : {}}
                    >
                      {tab === 'tools' ? t.dashboard.home : t.dashboard.pricing}
                      {activeTab === tab && (
                        <motion.div 
                          layoutId="navUnderline"
                          className={cn(
                            "absolute -bottom-1 left-0 w-full h-0.5 rounded-full",
                            uiTheme === 'golden' ? "bg-amber-500" : (uiTheme === 'chameleon' ? "" : "bg-indigo-600")
                          )}
                          style={uiTheme === 'chameleon' ? { backgroundColor: chameleonColor } : {}}
                        />
                      )}
                    </button>
                  ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className={cn(
                "p-1 rounded-2xl flex items-center transition-colors",
                uiTheme === 'light' ? "bg-slate-100" : "bg-slate-800"
              )}>
                {['en', 'bn'].map((lang) => (
                  <button 
                    key={lang}
                    onClick={() => onLanguageChange(lang as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all",
                      language === lang 
                        ? (uiTheme === 'golden' ? "bg-amber-600 text-white" : "bg-white text-indigo-600 shadow-sm shadow-indigo-600/10") 
                        : (uiTheme === 'golden' ? "text-emerald-100/40 hover:text-white" : "text-slate-500 hover:text-slate-700")
                    )}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className={cn(
                "p-1 rounded-2xl flex items-center transition-colors",
                uiTheme === 'light' ? "bg-slate-100" : "bg-slate-800"
              )}>
                {[
                  { theme: 'light', icon: <Monitor size={14} /> },
                  { theme: 'dark', icon: <Zap size={14} /> },
                  { theme: 'golden', icon: <Crown size={14} />, label: 'Flag Style' },
                  { theme: 'chameleon', icon: <Palette size={14} /> }
                ].map((t) => (
                  <button 
                    key={`theme-btn-${t.theme}`}
                    onClick={() => onThemeChange(t.theme as any)}
                    className={cn(
                      "p-1.5 rounded-xl transition-all",
                      uiTheme === t.theme 
                        ? (uiTheme === 'golden' ? "bg-[#f42a41] text-white" : 
                           uiTheme === 'chameleon' ? "text-white" : "bg-white text-[#006747] shadow-sm shadow-emerald-600/10") 
                        : (uiTheme === 'golden' ? "text-emerald-100/40 hover:text-white" : "text-slate-500 hover:text-slate-700")
                    )}
                    style={uiTheme === 'chameleon' && uiTheme === t.theme ? { backgroundColor: chameleonColor } : {}}
                  >
                    {t.theme === 'chameleon' ? <Palette size={14} className={cn(uiTheme === 'chameleon' ? "text-white" : "text-indigo-500")} /> : t.icon}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => onSelectTool('about', 0)}
              className={cn(
                "px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95",
                uiTheme === 'golden' ? "bg-[#f42a41] text-white shadow-lg shadow-red-900/20" : (uiTheme === 'chameleon' ? "" : "bg-[#006747] text-white shadow-lg shadow-emerald-600/20")
              )}
              style={uiTheme === 'chameleon' ? { backgroundColor: chameleonColor, color: 'white' } : {}}
            >
              {t.dashboard.contactUs}
            </button>
          </div>
        </div>
      </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                "md:hidden overflow-hidden border-t",
                uiTheme === 'light' ? "bg-white border-slate-100" : 
                uiTheme === 'dark' ? "bg-slate-900 border-slate-800" :
                "bg-[#1a1a1a] border-amber-900/30"
              )}
            >
              <div className="p-4 space-y-4">
                <nav className="flex flex-col gap-4">
                  <button 
                    onClick={() => { setActiveTab('tools'); setIsMenuOpen(false); }}
                    className={cn("text-left text-sm font-bold p-2 rounded-xl transition-all", 
                      activeTab === 'tools' ? (uiTheme === 'golden' ? "bg-amber-600/10 text-emerald-400" : (uiTheme === 'chameleon' ? "" : "bg-indigo-50 text-indigo-600")) : 
                      (uiTheme === 'light' ? "text-slate-600" : (uiTheme === 'golden' ? "text-emerald-100/40" : "text-slate-400")))}
                    style={activeTab === 'tools' && uiTheme === 'chameleon' ? { color: chameleonColor, backgroundColor: `${chameleonColor}15` } : {}}
                  >
                    {t.dashboard.home}
                  </button>
                  <button 
                    onClick={() => { setActiveTab('pricing'); setIsMenuOpen(false); }}
                    className={cn("text-left text-sm font-bold p-2 rounded-xl transition-all", 
                      activeTab === 'pricing' ? (uiTheme === 'golden' ? "bg-amber-600/10 text-emerald-400" : (uiTheme === 'chameleon' ? "" : "bg-indigo-50 text-indigo-600")) : 
                      (uiTheme === 'light' ? "text-slate-600" : (uiTheme === 'golden' ? "text-emerald-100/40" : "text-slate-400")))}
                    style={activeTab === 'pricing' && uiTheme === 'chameleon' ? { color: chameleonColor, backgroundColor: `${chameleonColor}15` } : {}}
                  >
                    {t.dashboard.pricing}
                  </button>
                </nav>

                <div className="flex items-center justify-between p-2 border-t border-white/5 pt-4">
                  <span className={cn("text-xs font-bold uppercase tracking-widest", uiTheme === 'golden' ? "text-emerald-100/40" : "text-slate-500")}>{language === 'en' ? 'Language' : 'ভাষা'}</span>
                  <div className={cn("flex items-center p-1 rounded-full border", 
                    uiTheme === 'light' ? "bg-slate-100 border-slate-200" : 
                    uiTheme === 'dark' ? "bg-slate-800 border-slate-700" : 
                    "bg-emerald-950/80 border-emerald-900")}>
                    <button 
                      onClick={() => onLanguageChange('en')}
                      className={cn("px-3 py-1.5 rounded-full text-[10px] font-black transition-all", language === 'en' ? (uiTheme === 'golden' ? "bg-[#f42a41] text-white" : "bg-white text-indigo-600 shadow-sm") : (uiTheme === 'golden' ? "text-emerald-100/40" : "text-slate-500"))}
                    >
                      EN
                    </button>
                    <button 
                      onClick={() => onLanguageChange('bn')}
                      className={cn("px-3 py-1.5 rounded-full text-[10px] font-black transition-all", language === 'bn' ? (uiTheme === 'golden' ? "bg-[#f42a41] text-white" : "bg-white text-indigo-600 shadow-sm") : (uiTheme === 'golden' ? "text-emerald-100/40" : "text-slate-500"))}
                    >
                      BN
                    </button>
                  </div>
                </div>

            <div className="flex items-center justify-between p-2 mt-2">
                  <span className={cn("text-xs font-bold uppercase tracking-widest", uiTheme === 'golden' ? "text-emerald-100/40" : "text-slate-500")}>{language === 'en' ? 'Theme' : 'থিম'}</span>
                  <div className={cn("flex items-center p-1 rounded-full border", 
                    uiTheme === 'light' ? "bg-slate-100 border-slate-200" : 
                    uiTheme === 'dark' ? "bg-slate-800 border-slate-700" : 
                    "bg-emerald-950/80 border-emerald-900")}>
                    <button 
                      onClick={() => onThemeChange('light')}
                      className={cn("p-2 rounded-full transition-all", uiTheme === 'light' ? "bg-white text-[#006747] shadow-sm" : "text-slate-500")}
                    >
                      <Monitor size={16} />
                    </button>
                    <button 
                      onClick={() => onThemeChange('dark')}
                      className={cn("p-2 rounded-full transition-all", uiTheme === 'dark' ? "bg-[#006747] text-white shadow-sm" : "text-slate-500")}
                    >
                      <Zap size={16} />
                    </button>
                    <button 
                      onClick={() => onThemeChange('golden')}
                      className={cn("p-2 rounded-full transition-all", uiTheme === 'golden' ? "bg-[#f42a41] text-white shadow-sm" : "text-slate-500")}
                    >
                      <Crown size={16} />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => { onSelectTool('about', 0); setIsMenuOpen(false); }}
                  className={cn(
                    "w-full py-3 rounded-xl text-sm font-bold shadow-lg transition-all",
                    uiTheme === 'golden' ? "bg-amber-600 text-white hover:bg-amber-700" : 
                    "bg-indigo-600 text-white hover:bg-indigo-700"
                  )}
                >
                  {t.dashboard.contactUs}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-20" 
                   style={{ backgroundColor: uiTheme === 'chameleon' ? chameleonColor : (uiTheme === 'golden' ? '#f42a41' : '#6366f1') }} />
              <h1 className={cn("text-4xl md:text-6xl font-black tracking-tight mb-4", 
                uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'dark' ? "text-white" : (uiTheme === 'golden' ? "text-emerald-200" : "text-white")))}
                style={uiTheme === 'chameleon' ? { color: chameleonColor } : {}}>
                {welcomeMessage}
              </h1>
              <div className="flex items-center gap-3">
                <div className={cn("h-1 w-12 rounded-full", uiTheme === 'golden' ? "bg-bd-red" : (uiTheme === 'chameleon' ? "" : "bg-indigo-600"))} 
                     style={uiTheme === 'chameleon' ? { backgroundColor: chameleonColor } : {}} />
                <p className={cn("text-lg font-bold text-slate-500", uiTheme === 'golden' ? "text-emerald-300" : (uiTheme === 'chameleon' ? "" : ""))}
                   style={uiTheme === 'chameleon' ? { color: chameleonColor, opacity: 0.8 } : {}}>
                  {t.dashboard.workspaceTitle}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthorized && (
                <div className={cn(
                  "px-6 py-3 rounded-2xl border flex items-center gap-3 shadow-sm",
                  uiTheme === 'light' ? "bg-white border-slate-200" : (uiTheme === 'golden' ? "bg-emerald-900 border-emerald-500/30" : "bg-slate-900/50 border-slate-800")
                )}>
                  <ShieldCheck size={20} className={uiTheme === 'golden' ? "text-bd-red" : "text-indigo-500"} />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[10px] font-bold uppercase tracking-widest", uiTheme === 'golden' ? "text-emerald-100" : "text-slate-400")}>Your Key:</span>
                      <span className={cn("text-xs font-bold uppercase tracking-widest", uiTheme === 'golden' ? "text-emerald-300" : "text-slate-500")}>{activeKey}</span>
                    </div>
                    <p className={cn("text-[10px] font-black mt-0.5 uppercase tracking-tighter animate-bounce", uiTheme === 'golden' ? "text-bd-red" : "text-[#f42a41]")}>
                      keep it secret and note it for next use
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4">
                <div className={cn(
                  "p-4 rounded-2xl border flex flex-col min-w-[120px] shadow-sm transition-all hover:scale-105",
                  uiTheme === 'light' ? "bg-white border-slate-200" : (uiTheme === 'golden' ? "bg-emerald-950/40 border-emerald-500/20 shadow-[0_0_15px_rgba(0,103,71,0.2)]" : "bg-slate-900/50 border-slate-800")
                )}>
                  <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", uiTheme === 'light' ? "text-slate-500" : (uiTheme === 'golden' ? "text-emerald-300" : "text-emerald-100/40"))}>{t.dashboard.activeTools}</p>
                  <p className={cn("text-3xl font-black", uiTheme === 'golden' ? "text-emerald-100 animate-pulse" : "text-slate-900 dark:text-white")}>
                    {tools.length + pdfSubTools.length - 1}
                  </p>
                </div>
                <div className={cn(
                  "p-4 rounded-2xl border flex flex-col min-w-[120px] shadow-sm transition-all hover:scale-105",
                  uiTheme === 'light' ? "bg-white border-slate-200" : (uiTheme === 'golden' ? "bg-emerald-950/40 border-emerald-500/20 shadow-[0_0_15px_rgba(0,103,71,0.2)]" : "bg-slate-900/50 border-slate-800")
                )}>
                  <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", uiTheme === 'light' ? "text-slate-500" : (uiTheme === 'golden' ? "text-emerald-300" : "text-emerald-100/40"))}>{t.dashboard.status}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    <p className={cn("text-3xl font-black", uiTheme === 'golden' ? "text-emerald-100" : "text-slate-900 dark:text-white")}>{t.dashboard.online}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {isAuthorized && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className={cn(
                 "standard-card p-6 min-w-[300px] mt-8",
                 uiTheme === 'light' ? "bg-white" : "bg-slate-900"
               )}
             >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-xl border flex items-center justify-center",
                    uiTheme === 'golden' ? "bg-[#f42a41]/10 border-[#f42a41]/20" : "bg-emerald-50 border-emerald-100"
                  )}>
                    <CoinsIcon size={18} className={uiTheme === 'golden' ? "text-[#f42a41]" : "text-[#006747]"} />
                  </div>
                  <p className={cn("text-xs font-bold uppercase tracking-wider", uiTheme === 'light' ? "text-slate-700" : "text-slate-300")}>
                    {isFreeAccess ? t.dashboard.freeTrial : t.dashboard.coinUsage}
                  </p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider",
                  isFreeAccess 
                    ? (coins > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600") 
                    : (uiTheme === 'golden' ? "bg-[#f42a41] text-white" : "bg-slate-100 text-slate-900")
                )}>
                  {isFreeAccess ? (coins > 0 ? "ACTIVE" : "EXPIRED") : `${coins.toFixed(2)} COINS`}
                </div>
              </div>
              
              {isFreeAccess ? (
                <div className={cn(
                  "p-3 rounded-xl border border-dashed text-center",
                  uiTheme === 'golden' ? "bg-[#f42a41]/5 border-[#f42a41]/20" : "bg-emerald-50/50 border-emerald-200"
                )}>
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", uiTheme === 'golden' ? "text-white" : "text-[#006747]")}>
                    {t.dashboard.freeAccountNotice}
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${Math.min((coins / 50) * 100, 100)}%` }}
                       className={cn(
                         "h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.1)]",
                         coins < 5 ? "bg-[#f42a41]" : coins < 15 ? "bg-amber-500" : "bg-[#006747]"
                       )}
                    />
                  </div>
                  {!freeTrialUsed && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#f42a41] rounded-full animate-pulse" />
                      <p className={cn("text-[10px] font-bold uppercase tracking-widest", uiTheme === 'golden' ? "text-white" : "text-red-600")}>
                        {t.dashboard.freeUseAvailable}
                      </p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </div>

        {/* Tools Section */}
        {activeTab === 'tools' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={`tool-card-${tool.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  if (tool.id === 'pdfGroup') {
                    setShowPdfMenu(true);
                  } else {
                    onSelectTool(tool.id as any, tool.cost || 0);
                  }
                }}
                className={cn(
                  "group relative cursor-pointer p-8 standard-card flex flex-col justify-between overflow-hidden",
                  uiTheme === 'light' ? "hover:border-indigo-200" : 
                  uiTheme === 'dark' ? "bg-slate-900 hover:border-slate-700" :
                  "bg-[#005a3e] border-[#007a55] hover:border-emerald-300/30"
                )}
              >
                <div>
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                    uiTheme === 'golden' ? "bg-amber-500/10 text-emerald-400" : (uiTheme === 'chameleon' ? "bg-white/10" : "bg-indigo-50 text-indigo-600")
                  )}
                  style={uiTheme === 'chameleon' ? { color: chameleonColor } : {}}>
                    {React.cloneElement(tool.icon as React.ReactElement, { 
                      size: 28,
                      className: uiTheme === 'golden' ? "text-emerald-400" : (uiTheme === 'chameleon' ? "" : "text-indigo-600"),
                      style: uiTheme === 'chameleon' ? { color: chameleonColor } : {}
                    })}
                  </div>
                  <div className="space-y-3">
                    <h3 className={cn("text-xl font-bold tracking-tight", 
                      uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'dark' ? "text-white" : "text-emerald-50"))}>
                      {tool.name}
                      {tool.id === 'cv' && <Sparkles size={16} className="inline ml-2 text-pink-500" />}
                    </h3>
                    <p className={cn("text-sm font-medium leading-relaxed", 
                      uiTheme === 'light' ? "text-slate-500" : (uiTheme === 'golden' ? "text-emerald-50/80" : "text-slate-400"))}>
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {tool.cost > 0 ? (
                      <div className={cn("px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5", 
                        uiTheme === 'light' ? "bg-slate-100 text-slate-700" : (uiTheme === 'golden' ? "bg-emerald-950 border border-emerald-800 text-emerald-100" : "bg-slate-800 text-slate-300"))}>
                        <CoinsIcon size={14} className="text-amber-500" />
                        <span>{tool.cost}</span>
                      </div>
                    ) : (
                      <div className={cn("px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider",
                        uiTheme === 'golden' ? "bg-bd-red text-white" : "bg-emerald-50 text-emerald-600")}>
                        Free
                      </div>
                    )}
                  </div>
                  
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0",
                    uiTheme === 'golden' ? "bg-amber-600 text-white" : (uiTheme === 'chameleon' ? "" : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20")
                  )}
                  style={uiTheme === 'chameleon' ? { backgroundColor: chameleonColor, color: 'white' } : {}}>
                    <ChevronRight size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className={cn("text-3xl font-black mb-4", uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'dark' ? "text-white" : "text-emerald-100"))}>
                {t.pricing.title}
              </h2>
              <p className={cn("font-medium", uiTheme === 'light' ? "text-slate-500" : (uiTheme === 'golden' ? "text-emerald-100/70" : "text-slate-400"))}>
                {t.pricing.subtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[
                { coins: 20, price: 20, label: 'Starter', color: 'bg-indigo-50 border-indigo-100', text: 'text-indigo-600' },
                { coins: 100, price: 70, label: 'Popular', popular: true, color: 'bg-white border-slate-200', text: 'text-slate-900' },
                { coins: 200, price: 150, label: 'Pro', color: 'bg-white border-slate-200', text: 'text-slate-900' },
                { coins: 500, price: 300, label: 'Business', color: 'bg-white border-slate-200', text: 'text-slate-900' },
                { coins: 1000, price: 500, label: 'Enterprise', color: 'bg-white border-slate-200', text: 'text-slate-900' },
                { coins: 'Unlimited', price: 10000, label: 'Lifetime', lifetime: true, color: 'bg-amber-50 border-amber-100', text: 'text-amber-600' }
              ].map((plan, i) => (
                <motion.div
                  key={plan.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "relative p-8 rounded-3xl border flex flex-col transition-all hover:shadow-xl",
                    uiTheme === 'light' ? plan.color : 
                    uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : 
                    "bg-emerald-900/40 border-emerald-500/20",
                    plan.popular && "ring-2 ring-indigo-600 ring-offset-4 dark:ring-offset-slate-950"
                  )}
                >
                  {plan.popular && (
                    <div className={cn("absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg", uiTheme === 'golden' ? "bg-amber-600 text-white" : "bg-indigo-600 text-white")}>
                      {t.pricing.popular}
                    </div>
                  )}
                  <div className="mb-8">
                    <p className={cn("text-xs font-bold uppercase tracking-widest mb-2 opacity-60", uiTheme === 'golden' ? "text-emerald-300" : "text-slate-500")}>{plan.label}</p>
                    <div className="flex items-baseline gap-1">
                      <span className={cn("text-4xl font-black", uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'golden' ? "text-emerald-100" : "text-white"))}>{plan.price}</span>
                      <span className={cn("text-sm font-bold uppercase", uiTheme === 'golden' ? "text-emerald-400" : "text-slate-400")}>TK</span>
                    </div>
                  </div>
                  <div className="space-y-4 mb-8 flex-1">
                    {[
                      { icon: <CheckCircle2 size={16} />, text: `${plan.coins} ${t.pricing.features.coins}` },
                      { icon: <CheckCircle2 size={16} />, text: t.pricing.features.access },
                      { icon: <CheckCircle2 size={16} />, text: t.pricing.features.expiry }
                    ].map((feature, fIdx) => (
                      <div key={`plan-${plan.label}-feature-${fIdx}`} className="flex items-center gap-3">
                        <div className={cn("text-emerald-500", uiTheme === 'golden' && "text-bd-red")}>{feature.icon}</div>
                        <p className={cn("text-sm font-medium", uiTheme === 'light' ? "text-slate-600" : (uiTheme === 'golden' ? "text-emerald-100" : "text-slate-300"))}>{feature.text}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setShowPaymentForm(true)}
                    className={cn(
                      "w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all active:scale-95",
                      plan.popular 
                        ? (uiTheme === 'golden' ? "bg-amber-600 text-white shadow-lg shadow-amber-900/20" : (uiTheme === 'chameleon' ? "" : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20")) 
                        : (uiTheme === 'light' ? "bg-white border border-slate-200 text-slate-900 hover:bg-slate-50" : "bg-slate-800 text-white hover:bg-slate-700")
                    )}
                    style={plan.popular && uiTheme === 'chameleon' ? { backgroundColor: chameleonColor, color: 'white', boxShadow: `0 10px 15px -3px ${chameleonColor}40` } : {}}
                  >
                    {t.pricing.addCoins}
                    <CreditCard size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Payment Form Modal */}
      <AnimatePresence>
        {showPaymentForm && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "max-w-2xl w-full rounded-[2.5rem] shadow-2xl border p-8 md:p-12 relative my-8",
                uiTheme === 'light' ? "bg-white border-slate-100" : (uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-emerald-950 border-emerald-500/30")
              )}
            >
              <button 
                onClick={() => setShowPaymentForm(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white", uiTheme === 'golden' ? "bg-amber-600" : "bg-indigo-600")}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <h2 className={cn("text-2xl font-black", uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'dark' ? "text-white" : "text-emerald-400"))}>{t.pricing.payment.title}</h2>
                  <p className={cn("text-sm font-medium tracking-wide", uiTheme === 'golden' ? "text-emerald-100/60" : "text-slate-500")}>{t.pricing.payment.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div className={cn("p-6 rounded-3xl border", uiTheme === 'golden' ? "bg-emerald-900/40 border-emerald-800" : "bg-indigo-50 border-indigo-100")}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold", uiTheme === 'golden' ? "bg-amber-600" : "bg-indigo-500 shadow-lg shadow-indigo-200")}>1</div>
                      <p className={cn("text-sm font-bold uppercase tracking-widest", uiTheme === 'golden' ? "text-emerald-400" : "text-indigo-900")}>{t.pricing.payment.step1}</p>
                    </div>
                    <ul className={cn("space-y-3 text-sm font-medium", uiTheme === 'golden' ? "text-emerald-100" : "text-indigo-800")}>
                      {t.pricing.payment.steps.map((step, idx) => (
                        <li key={`payment-step-${idx}`} className="flex items-start gap-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5", uiTheme === 'golden' ? "bg-bd-red" : "bg-indigo-400")} />
                          {step === "Enter Merchant No: 01868257470" ? (
                            <>Enter Merchant No: <span className="font-bold underline decoration-indigo-400">01868257470</span></>
                          ) : (
                            language === 'bn' && step.includes("01868257470") ? (
                             <>মার্চেন্ট নম্বর দিন: <span className="font-bold underline decoration-indigo-400">01868257470</span></>
                            ) : step
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    try {
                      await addDoc(collection(db, 'paymentRequests'), {
                        ...paymentData,
                        userKey: activeKey || 'Guest',
                        userName: userName || 'Guest',
                        status: 'pending',
                        createdAt: Timestamp.now()
                      });
                      setShowPaymentForm(false);
                      setShowPaymentSuccess(true);
                      setPaymentData({ amount: '', transactionId: '', fullName: '', mobileNo: '', comments: '' });
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={cn("text-[10px] font-black uppercase tracking-widest ml-1", uiTheme === 'golden' ? "text-emerald-300" : "text-slate-400")}>Amount (TK)</label>
                      <input 
                        required
                        type="number"
                        placeholder="e.g. 70"
                        value={paymentData.amount}
                        onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                        className={cn("w-full px-4 py-3 border rounded-xl outline-none transition-all text-sm font-bold", 
                          uiTheme === 'light' ? "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500" : 
                          (uiTheme === 'golden' ? "bg-emerald-900/50 border-emerald-700 focus:ring-2 focus:ring-amber-500 text-white" : "bg-slate-800 border-slate-700 focus:ring-2 focus:ring-amber-500 text-white"))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={cn("text-[10px] font-black uppercase tracking-widest ml-1", uiTheme === 'golden' ? "text-emerald-300" : "text-slate-400")}>Mobile No</label>
                      <input 
                        required
                        type="text"
                        placeholder="017XXXXXXXX"
                        value={paymentData.mobileNo}
                        onChange={(e) => setPaymentData({...paymentData, mobileNo: e.target.value})}
                        className={cn("w-full px-4 py-3 border rounded-xl outline-none transition-all text-sm font-bold", 
                          uiTheme === 'light' ? "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500" : 
                          (uiTheme === 'golden' ? "bg-emerald-900/50 border-emerald-700 focus:ring-2 focus:ring-amber-500 text-white" : "bg-slate-800 border-slate-700 focus:ring-2 focus:ring-amber-500 text-white"))}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className={cn("text-[10px] font-black uppercase tracking-widest ml-1", uiTheme === 'golden' ? "text-emerald-300" : "text-slate-400")}>{t.pricing.payment.form.trxId}</label>
                    <input 
                      required
                      type="text"
                      placeholder="Enter bKash TrxID"
                      value={paymentData.transactionId}
                      onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                      className={cn("w-full px-4 py-3 border rounded-xl outline-none transition-all text-sm font-bold", 
                        uiTheme === 'light' ? "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500" : 
                        (uiTheme === 'golden' ? "bg-emerald-900/50 border-emerald-700 focus:ring-2 focus:ring-amber-500 text-white" : "bg-slate-800 border-slate-700 focus:ring-2 focus:ring-amber-500 text-white"))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={cn("text-[10px] font-black uppercase tracking-widest ml-1", uiTheme === 'golden' ? "text-emerald-300" : "text-slate-400")}>{t.pricing.payment.form.name}</label>
                    <input 
                      required
                      type="text"
                      placeholder="Your Name"
                      value={paymentData.fullName}
                      onChange={(e) => setPaymentData({...paymentData, fullName: e.target.value})}
                      className={cn("w-full px-4 py-3 border rounded-xl outline-none transition-all text-sm font-bold", 
                        uiTheme === 'light' ? "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500" : 
                        (uiTheme === 'golden' ? "bg-emerald-900/50 border-emerald-700 focus:ring-2 focus:ring-amber-500 text-white" : "bg-slate-800 border-slate-700 focus:ring-2 focus:ring-amber-500 text-white"))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={cn("text-[10px] font-black uppercase tracking-widest ml-1", uiTheme === 'golden' ? "text-emerald-300" : "text-slate-400")}>{t.pricing.payment.form.comments}</label>
                    <textarea 
                      placeholder="Any message..."
                      value={paymentData.comments}
                      onChange={(e) => setPaymentData({...paymentData, comments: e.target.value})}
                      className={cn("w-full px-4 py-3 border rounded-xl outline-none transition-all text-sm font-bold h-20 resize-none", 
                        uiTheme === 'light' ? "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500" : 
                        (uiTheme === 'golden' ? "bg-emerald-900/50 border-emerald-700 focus:ring-2 focus:ring-amber-500 text-white" : "bg-slate-800 border-slate-700 focus:ring-2 focus:ring-amber-500 text-white"))}
                    />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className={cn(
                      "w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2",
                      uiTheme === 'golden' ? "bg-amber-600 hover:bg-amber-700 text-white shadow-xl shadow-amber-950/20" : 
                      (uiTheme === 'chameleon' ? "text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200")
                    )}
                    style={uiTheme === 'chameleon' ? { backgroundColor: chameleonColor, boxShadow: `0 15px 25px -5px ${chameleonColor}40` } : {}}
                  >
                    {isSubmitting ? t.pricing.payment.form.submitting : t.pricing.payment.form.submit}
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {showPaymentSuccess && (
          <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "max-w-md w-full rounded-[2.5rem] p-10 text-center shadow-2xl border",
                uiTheme === 'light' ? "bg-white border-slate-100" : (uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-[#1a1a1a] border-amber-900/30")
              )}
            >
              <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6", uiTheme === 'golden' ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-100 text-emerald-600")}>
                <CheckCircle2 size={40} />
              </div>
              <h2 className={cn("text-2xl font-black mb-4", uiTheme === 'light' ? "text-slate-900" : "text-white")}>
                {language === 'en' ? 'Successfully Requested!' : 'সফলভাবে অনুরোধ করা হয়েছে!'}
              </h2>
              <p className={cn("font-medium mb-8", uiTheme === 'light' ? "text-slate-500" : "text-slate-400")}>
                {language === 'en' 
                  ? 'Please wait for confirmation message. Our team will verify your payments and will inform you by SMS.' 
                  : 'অনুগ্রহ করে কনফার্মেশন মেসেজের জন্য অপেক্ষা করুন। আমাদের টিম আপনার পেমেন্ট যাচাই করবে এবং এসএমএসের মাধ্যমে জানাবে।'}
              </p>
              <button 
                onClick={() => setShowPaymentSuccess(false)}
                className={cn(
                  "w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95",
                  uiTheme === 'golden' ? "bg-amber-600 text-white shadow-lg shadow-amber-900/20" : "bg-slate-900 text-white hover:bg-slate-800"
                )}
              >
                {language === 'en' ? 'Got it' : 'বুঝেছি'}
              </button>
            </motion.div>
          </div>
        )}

        {showPdfMenu && (
          <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "max-w-4xl w-full rounded-[3rem] shadow-2xl border p-8 md:p-12 relative overflow-hidden",
                uiTheme === 'light' ? "bg-white border-slate-100" : (uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-[#1a1a1a] border-amber-900/30")
              )}
            >
              <button 
                onClick={() => setShowPdfMenu(false)}
                className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-600 transition-colors z-10"
              >
                <X size={28} />
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", uiTheme === 'golden' ? "bg-amber-600" : (uiTheme === 'chameleon' ? "" : "bg-red-600"))}
                       style={uiTheme === 'chameleon' ? { backgroundColor: chameleonColor } : {}}>
                    <Files size={28} />
                  </div>
                  <div>
                    <h2 className={cn("text-3xl font-black", uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'dark' ? "text-white" : "text-emerald-400"))}>
                      {t.dashboard.tools.pdfGroup}
                    </h2>
                    <p className="text-sm font-medium text-slate-500 tracking-wide uppercase mt-1">Professional PDF Suite</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pdfSubTools.map((tool) => (
                    <button
                      key={`pdf-tool-choice-${tool.id}`}
                      onClick={() => {
                        onSelectTool(tool.id as any, 0.25);
                        setShowPdfMenu(false);
                      }}
                      className={cn(
                        "flex items-start gap-4 p-6 rounded-[2rem] border transition-all text-left group active:scale-95",
                        uiTheme === 'light' ? "bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100" : 
                        "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600"
                      )}
                    >
                      <div className={cn("mt-1 transition-transform group-hover:scale-110", tool.color)}>
                        {tool.icon}
                      </div>
                      <div>
                        <h4 className={cn("font-black mb-1", uiTheme === 'light' ? "text-slate-900" : "text-white")}>{tool.name}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-tight">{tool.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Background Decoration */}
              <div className={cn(
                "absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-3xl opacity-20",
                uiTheme === 'golden' ? "bg-amber-600" : (uiTheme === 'chameleon' ? "" : "bg-red-600")
              )} 
              style={uiTheme === 'chameleon' ? { backgroundColor: chameleonColor } : {}} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <footer className={cn(
        "border-t py-16 mt-24 transition-colors duration-300",
        uiTheme === 'light' ? "bg-white border-slate-200" : (uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-[#121212] border-amber-900/30")
      )}>
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <Logo className="w-10 h-10" />
                <h2 className={cn("text-xl font-bold tracking-tight", uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'dark' ? "text-white" : "text-emerald-300"))}>MAKSUD COMPUTERS</h2>
              </div>
              <p className={cn("font-medium max-w-md mb-8 mx-auto md:mx-0", uiTheme === 'light' ? "text-slate-500" : "text-slate-400")}>
                Professional digital services and tools since 2020. Providing the best-in-class solutions for your daily digital needs.
              </p>
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer", 
                uiTheme === 'light' ? "bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600" : "bg-slate-800 text-slate-500 hover:bg-amber-600 hover:text-white")}>
                <Facebook size={20} />
              </div>
            </div>
          </div>
          <div>
            <h4 className={cn("text-sm font-black uppercase tracking-widest mb-6", uiTheme === 'golden' ? "text-emerald-400" : (uiTheme === 'dark' ? "text-slate-300" : "text-slate-900"))}>
              {language === 'en' ? 'Quick Links' : 'দ্রুত লিঙ্ক'}
            </h4>
            <ul className="space-y-4">
              <li><button onClick={() => onSelectTool('cv', 0)} className={cn("text-sm font-bold transition-colors", uiTheme === 'light' ? "text-slate-500 hover:text-indigo-600" : "text-slate-400 hover:text-white")}>{t.dashboard.tools.cv}</button></li>
              <li><button onClick={() => onSelectTool('editor', 5)} className={cn("text-sm font-bold transition-colors", uiTheme === 'light' ? "text-slate-500 hover:text-indigo-600" : "text-slate-400 hover:text-white")}>{t.dashboard.tools.photoEditor}</button></li>
              <li><button onClick={() => onSelectTool('pdf', 5)} className={cn("text-sm font-bold transition-colors", uiTheme === 'light' ? "text-slate-500 hover:text-indigo-600" : "text-slate-400 hover:text-white")}>{t.dashboard.tools.pdfEditor}</button></li>
              <li><button onClick={() => onSelectTool('converter', 0)} className={cn("text-sm font-bold transition-colors", uiTheme === 'light' ? "text-slate-500 hover:text-indigo-600" : "text-slate-400 hover:text-white")}>{t.dashboard.tools.converter}</button></li>
            </ul>
          </div>
          <div>
            <button 
              onClick={() => onSelectTool('about', 0)}
              className={cn("text-sm font-black uppercase tracking-widest mb-6 block text-left w-full hover:underline transition-all", uiTheme === 'golden' ? "text-emerald-400" : (uiTheme === 'dark' ? "text-slate-300" : "text-slate-900"))}
            >
              {language === 'en' ? 'Contact' : 'যোগাযোগ'}
            </button>
            <ul className="space-y-4">
              <li className={cn("text-sm font-bold", uiTheme === 'light' ? "text-slate-500" : "text-slate-400")}>{language === 'en' ? "Jamalpur, Bangladesh" : "জামালপুর, বাংলাদেশ"}</li>
              <li className={cn("text-sm font-bold", uiTheme === 'light' ? "text-slate-500" : "text-slate-400")}>01868257470</li>
              <li className={cn("text-sm font-bold", uiTheme === 'light' ? "text-slate-500" : "text-slate-400")}>maksudjr2020@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-100/10 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © 2026 MAKSUD COMPUTERS. {language === 'en' ? 'ALL RIGHTS RESERVED.' : 'সর্বস্বত্ব সংরক্ষিত।'}
          </p>
        </div>
      </footer>
    </div>
  );
};
