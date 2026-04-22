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
  Bot,
  Globe,
  ArrowRightLeft
} from 'lucide-react';
import { Logo } from './Logo';
import { cn } from '../lib/utils';
import { useSecurity } from './SecurityGate';
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Language, translations } from '../lib/translations';

interface DashboardProps {
  onSelectTool: (tool: 'cv' | 'age' | 'resizer' | 'editor' | 'pdf' | 'about' | 'bg-remover' | 'pdf-to-img' | 'pdf-to-word' | 'pdf-compress' | 'pdf-merge' | 'img-to-pdf' | 'intelligent-ai' | 'converter' | 'inheritance', cost: number) => void;
  onAdminLogin: () => void;
  uiTheme: 'light' | 'dark' | 'golden';
  onThemeChange: (theme: 'light' | 'dark' | 'golden') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onSelectTool, 
  onAdminLogin, 
  uiTheme, 
  onThemeChange,
  language,
  onLanguageChange
}) => {
  const { coins, userName, isAuthorized, logout, freeTrialUsed, isFreeAccess, activateFreeAccess, error, activeKey } = useSecurity();
  const [showFreeSuccess, setShowFreeSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'pricing'>('tools');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
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
      size: 'medium',
      cost: 0.01
    },
    {
      id: 'cv',
      name: t.dashboard.tools.cv,
      description: t.dashboard.toolDescriptions.cv,
      icon: <FileText className="text-blue-600" />,
      color: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      borderColor: 'border-blue-100',
      size: 'large',
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
      size: 'medium',
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
      size: 'medium',
      cost: 0.5
    },
    {
      id: 'resizer',
      name: t.dashboard.tools.resizer,
      description: t.dashboard.toolDescriptions.resizer,
      icon: <Layout className="text-purple-600" />,
      color: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      borderColor: 'border-purple-100',
      size: 'small',
      cost: 0.5
    },
    {
      id: 'pdf',
      name: t.dashboard.tools.pdfEditor,
      description: t.dashboard.toolDescriptions.pdfEditor,
      icon: <FileEdit className="text-red-600" />,
      color: 'bg-red-50',
      hoverColor: 'hover:bg-red-100',
      borderColor: 'border-red-100',
      size: 'small',
      cost: 0.25
    },
    {
      id: 'pdf-to-img',
      name: t.dashboard.tools.pdfToImg,
      description: t.dashboard.toolDescriptions.pdfToImg,
      icon: <FileImage className="text-orange-600" />,
      color: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      borderColor: 'border-orange-100',
      size: 'small',
      cost: 0.25
    },
    {
      id: 'pdf-to-word',
      name: t.dashboard.tools.pdfToWord,
      description: t.dashboard.toolDescriptions.pdfToWord,
      icon: <FileType className="text-blue-600" />,
      color: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      borderColor: 'border-blue-100',
      size: 'small',
      cost: 0.25
    },
    {
      id: 'pdf-compress',
      name: t.dashboard.tools.pdfCompress,
      description: t.dashboard.toolDescriptions.pdfCompress,
      icon: <FileArchive className="text-emerald-600" />,
      color: 'bg-emerald-50',
      hoverColor: 'hover:bg-emerald-100',
      borderColor: 'border-emerald-100',
      size: 'small',
      cost: 0.25
    },
    {
      id: 'pdf-merge',
      name: t.dashboard.tools.pdfMerge,
      description: t.dashboard.toolDescriptions.pdfMerge,
      icon: <Files className="text-rose-600" />,
      color: 'bg-rose-50',
      hoverColor: 'hover:bg-rose-100',
      borderColor: 'border-rose-100',
      size: 'small',
      cost: 0.25
    },
    {
      id: 'img-to-pdf',
      name: t.dashboard.tools.imgToPdf,
      description: t.dashboard.toolDescriptions.imgToPdf,
      icon: <ImagePlus className="text-cyan-600" />,
      color: 'bg-cyan-50',
      hoverColor: 'hover:bg-cyan-100',
      borderColor: 'border-cyan-100',
      size: 'small',
      cost: 0.25
    },
    {
      id: 'age',
      name: t.dashboard.tools.ageCalc,
      description: t.dashboard.toolDescriptions.ageCalc,
      icon: <Calculator className="text-green-600" />,
      color: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      borderColor: 'border-green-100',
      size: 'small',
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
      size: 'small',
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
      size: 'small',
      cost: 0
    }
  ];

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      uiTheme === 'light' ? "bg-[#f8fafc]" : (uiTheme === 'dark' ? "bg-slate-950 text-slate-100" : "bg-[#121212] text-amber-100")
    )}>
      {/* Premium Banner */}
      <div className={cn(
        "py-3 px-4",
        uiTheme === 'golden' ? "bg-gradient-to-r from-amber-700 to-amber-900 border-b border-amber-500/30" : "bg-gradient-to-r from-indigo-600 to-fuchsia-600"
      )}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Crown size={18} className="text-amber-300" />
            </div>
            <p className="text-sm font-bold tracking-wide text-white lowercase">
              {t.dashboard.premiumBanner} <span className="text-amber-300 ml-2 uppercase">01622638268</span> | <span className="text-amber-300 uppercase">maksudjr2020@gmail.com</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onAdminLogin}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 text-white"
            >
              <Settings size={14} />
              {t.dashboard.adminLogin}
            </button>
            {isAuthorized && (
              <button 
                onClick={logout}
                className="px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 text-white"
              >
                <LogOut size={14} />
                {t.dashboard.logout}
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
        "sticky top-0 z-50 border-b transition-all duration-300",
        uiTheme === 'light' ? "bg-white/80 backdrop-blur-md border-slate-200" : 
        uiTheme === 'dark' ? "bg-slate-900/80 backdrop-blur-md border-slate-800" :
        "bg-[#1a1a1a]/80 backdrop-blur-md border-amber-900/30"
      )}>
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-12 h-12" />
            <div>
              <h2 className={cn("text-xl font-black leading-none", uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'dark' ? "text-white" : "text-amber-500"))}>MAKSUD</h2>
              <p className={cn("text-[10px] font-bold tracking-[0.2em] uppercase mt-1", uiTheme === 'golden' ? "text-amber-600" : "text-indigo-600")}>Computers</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('tools')}
                className={cn("text-sm font-bold transition-colors", 
                  activeTab === 'tools' ? (uiTheme === 'golden' ? "text-amber-500" : "text-indigo-600") : 
                  (uiTheme === 'light' ? "text-slate-600 hover:text-indigo-600" : "text-slate-400 hover:text-white"))}
              >
                {t.dashboard.home}
              </button>
              <button 
                onClick={() => setActiveTab('pricing')}
                className={cn("text-sm font-bold transition-colors", 
                  activeTab === 'pricing' ? (uiTheme === 'golden' ? "text-amber-500" : "text-indigo-600") : 
                  (uiTheme === 'light' ? "text-slate-600 hover:text-indigo-600" : "text-slate-400 hover:text-white"))}
              >
                {t.dashboard.pricing}
              </button>
            </nav>

            {/* Language Switcher */}
            <div className={cn("flex items-center p-1 rounded-full border", 
              uiTheme === 'light' ? "bg-slate-100 border-slate-200" : 
              uiTheme === 'dark' ? "bg-slate-800 border-slate-700" : 
              "bg-amber-950 border-amber-900")}>
              <button 
                onClick={() => onLanguageChange('en')}
                className={cn("px-2 py-1 rounded-full text-[10px] font-black transition-all", language === 'en' ? (uiTheme === 'golden' ? "bg-amber-600 text-white" : "bg-white text-indigo-600 shadow-sm") : "text-slate-500 hover:text-slate-700")}
              >
                EN
              </button>
              <button 
                onClick={() => onLanguageChange('bn')}
                className={cn("px-2 py-1 rounded-full text-[10px] font-black transition-all", language === 'bn' ? (uiTheme === 'golden' ? "bg-amber-600 text-white" : "bg-white text-indigo-600 shadow-sm") : "text-slate-500 hover:text-slate-700")}
              >
                BN
              </button>
            </div>

            {/* Theme Switcher */}
            <div className={cn("flex items-center p-1 rounded-full border", 
              uiTheme === 'light' ? "bg-slate-100 border-slate-200" : 
              uiTheme === 'dark' ? "bg-slate-800 border-slate-700" : 
              "bg-amber-950 border-amber-900")}>
              <button 
                onClick={() => onThemeChange('light')}
                className={cn("p-1.5 rounded-full transition-all", uiTheme === 'light' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-white")}
                title="Light Mode"
              >
                <Monitor size={14} />
              </button>
              <button 
                onClick={() => onThemeChange('dark')}
                className={cn("p-1.5 rounded-full transition-all", uiTheme === 'dark' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-white")}
                title="Dark Mode"
              >
                <Zap size={14} />
              </button>
              <button 
                onClick={() => onThemeChange('golden')}
                className={cn("p-1.5 rounded-full transition-all", uiTheme === 'golden' ? "bg-amber-600 text-white shadow-sm" : "text-slate-500 hover:text-amber-500")}
                title="Golden Mode"
              >
                <Crown size={14} />
              </button>
            </div>

            <button 
              onClick={() => onSelectTool('about', 0)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all",
                uiTheme === 'golden' ? "bg-amber-600 text-white shadow-amber-950 hover:bg-amber-700" : 
                "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700"
              )}
            >
              {t.dashboard.contactUs}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className={cn("text-4xl md:text-5xl font-black tracking-tight mb-4", 
                uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'dark' ? "text-white" : "text-amber-500"))}>
                {welcomeMessage}
              </h1>
              <p className={cn("text-lg max-w-xl font-medium", uiTheme === 'light' ? "text-slate-500" : "text-slate-400")}>
                {t.dashboard.workspaceTitle}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {isAuthorized && (
                <div className={cn("px-4 py-2 rounded-xl shadow-lg flex items-center gap-2", 
                  uiTheme === 'golden' ? "bg-amber-700 text-white" : "bg-indigo-600 text-white")}>
                  <ShieldCheck size={16} />
                  <span className="text-xs font-black uppercase tracking-widest">Your Key: {activeKey}</span>
                </div>
              )}
              <div className={cn("flex items-center gap-4 p-2 rounded-2xl shadow-sm border", 
                uiTheme === 'light' ? "bg-white border-slate-100" : (uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-[#1a1a1a] border-amber-900/30"))}>
                <div className={cn("px-4 py-2 rounded-xl", uiTheme === 'golden' ? "bg-amber-950" : "bg-indigo-50")}>
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", uiTheme === 'golden' ? "text-amber-500" : "text-indigo-600")}>{t.dashboard.activeTools}</p>
                  <p className={cn("text-xl font-black", uiTheme === 'golden' ? "text-amber-200" : "text-indigo-900")}>13</p>
                </div>
                <div className={cn("px-4 py-2 rounded-xl", uiTheme === 'golden' ? "bg-emerald-950/30" : "bg-emerald-50")}>
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", uiTheme === 'golden' ? "text-emerald-500" : "text-emerald-600")}>{t.dashboard.status}</p>
                  <p className={cn("text-xl font-black", uiTheme === 'golden' ? "text-emerald-200" : "text-emerald-900")}>{t.dashboard.online}</p>
                </div>
              </div>
              
              {isAuthorized && (
                <div className={cn("p-4 rounded-2xl shadow-sm border min-w-[240px] w-fit", 
                  uiTheme === 'light' ? "bg-white border-slate-100" : (uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-[#1a1a1a] border-amber-900/30"))}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <CoinsIcon size={16} className="text-amber-500" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {isFreeAccess ? t.dashboard.freeTrial : t.dashboard.coinUsage}
                      </p>
                    </div>
                    <p className={cn("text-[10px] font-bold", uiTheme === 'golden' ? "text-amber-500" : "text-indigo-600")}>
                      {isFreeAccess ? (coins > 0 ? "1 COIN" : "EXPIRED") : `${coins.toFixed(2)} Coins`}
                    </p>
                  </div>
                  
                  {isFreeAccess ? (
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                        {t.dashboard.freeAccountNotice}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className={cn("w-full h-2 rounded-full overflow-hidden", uiTheme === 'light' ? "bg-slate-100" : "bg-slate-800")}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((coins / 50) * 100, 100)}%` }}
                          className={cn(
                            "h-full transition-all duration-1000",
                            coins < 5 ? "bg-red-500" : coins < 15 ? "bg-amber-500" : "bg-indigo-600"
                          )}
                        />
                      </div>
                      {!freeTrialUsed && (
                        <p className="text-[9px] font-black text-emerald-600 mt-2 uppercase tracking-widest">
                          ✨ {t.dashboard.freeUseAvailable}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bento Grid Tools or Pricing */}
        {activeTab === 'tools' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectTool(tool.id as any, tool.cost || 0)}
                className={cn(
                  "group relative cursor-pointer rounded-[2rem] border p-8 transition-all active:scale-[0.98]",
                  uiTheme === 'light' ? "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-100" : 
                  uiTheme === 'dark' ? "bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-2xl hover:shadow-slate-950/50" :
                  "bg-[#1a1a1a] border-amber-900/30 hover:border-amber-600/50 hover:shadow-2xl hover:shadow-amber-950/50",
                  tool.size === 'large' ? "md:col-span-2 md:row-span-2" : 
                  tool.size === 'medium' ? "md:col-span-2" : "md:col-span-1"
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3",
                  uiTheme === 'golden' ? "bg-amber-900/20" : tool.color
                )}>
                  {React.cloneElement(tool.icon as React.ReactElement, { 
                    size: 28,
                    className: uiTheme === 'golden' ? "text-amber-500" : (tool.icon as any).props.className
                  })}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className={cn("text-xl font-black flex items-center gap-2", 
                      uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'dark' ? "text-white" : "text-amber-200"))}>
                      {tool.name}
                      {tool.id === 'cv' && <Sparkles size={16} className="text-amber-500 animate-pulse" />}
                    </h3>
                    {tool.cost > 0 ? (
                      <div className={cn("flex items-center gap-1 px-2 py-1 rounded-lg", 
                        uiTheme === 'light' ? "bg-slate-50" : "bg-slate-800")}>
                        <CoinsIcon size={12} className="text-amber-500" />
                        <span className={cn("text-[10px] font-black", uiTheme === 'light' ? "text-slate-600" : "text-slate-400")}>{tool.cost}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Free</span>
                    )}
                  </div>
                  <p className={cn("text-sm font-medium leading-relaxed", 
                    uiTheme === 'light' ? "text-slate-500" : "text-slate-400")}>
                    {tool.description}
                  </p>
                </div>
                <div className={cn("absolute bottom-8 right-8 w-10 h-10 rounded-full flex items-center justify-center transition-all", 
                  uiTheme === 'light' ? "bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white" : 
                  uiTheme === 'dark' ? "bg-slate-800 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white" :
                  "bg-amber-950 text-amber-900 group-hover:bg-amber-600 group-hover:text-white")}>
                  <ChevronRight size={20} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className={cn("text-3xl font-black mb-4", uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'dark' ? "text-white" : "text-amber-500"))}>
                {t.pricing.title}
              </h2>
              <p className={cn("font-medium", uiTheme === 'light' ? "text-slate-500" : "text-slate-400")}>
                {t.pricing.subtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { coins: 20, price: 20, label: 'Starter' },
                { coins: 100, price: 70, label: 'Popular', popular: true },
                { coins: 200, price: 150, label: 'Pro' },
                { coins: 500, price: 300, label: 'Business' },
                { coins: 1000, price: 500, label: 'Enterprise' },
                { coins: 'Unlimited', price: 10000, label: 'Lifetime', lifetime: true }
              ].map((plan, i) => (
                <motion.div
                  key={plan.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "relative rounded-[2.5rem] p-8 border-2 transition-all",
                    uiTheme === 'light' ? "bg-white border-slate-100 shadow-sm hover:shadow-xl" : 
                    uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : 
                    "bg-[#1a1a1a] border-amber-900/30",
                    plan.popular ? "border-indigo-600 shadow-xl shadow-indigo-100 scale-105 z-10" : "hover:border-indigo-200"
                  )}
                >
                  {plan.popular && (
                    <div className={cn("absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", uiTheme === 'golden' ? "bg-amber-600 text-white" : "bg-indigo-600 text-white")}>
                      {t.pricing.popular}
                    </div>
                  )}
                  <div className="mb-8">
                    <p className={cn("text-sm font-black uppercase tracking-widest mb-2", uiTheme === 'golden' ? "text-amber-500" : "text-indigo-600")}>{plan.label}</p>
                    <div className="flex items-baseline gap-1">
                      <span className={cn("text-4xl font-black", uiTheme === 'light' ? "text-slate-900" : "text-white")}>{plan.price}</span>
                      <span className="text-lg font-bold text-slate-400">TK</span>
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-emerald-100/20 rounded-full flex items-center justify-center text-emerald-500 font-bold">✓</div>
                      <p className={cn("text-sm font-bold", uiTheme === 'light' ? "text-slate-600" : "text-slate-400")}>{plan.coins} {t.pricing.features.coins}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-emerald-100/20 rounded-full flex items-center justify-center text-emerald-500 font-bold">✓</div>
                      <p className={cn("text-sm font-bold", uiTheme === 'light' ? "text-slate-600" : "text-slate-400")}>{t.pricing.features.access}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-emerald-100/20 rounded-full flex items-center justify-center text-emerald-500 font-bold">✓</div>
                      <p className={cn("text-sm font-bold", uiTheme === 'light' ? "text-slate-600" : "text-slate-400")}>{t.pricing.features.expiry}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPaymentForm(true)}
                    className={cn(
                      "w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2",
                      plan.popular ? (uiTheme === 'golden' ? "bg-amber-600" : "bg-indigo-600") + " text-white hover:opacity-90 shadow-lg" : 
                      (uiTheme === 'light' ? "bg-slate-50 text-slate-900 hover:bg-slate-100" : "bg-slate-800 text-white hover:bg-slate-700")
                    )}
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
                uiTheme === 'light' ? "bg-white border-slate-100" : (uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-[#1a1a1a] border-amber-900/30")
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
                  <h2 className={cn("text-2xl font-black", uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'dark' ? "text-white" : "text-amber-500"))}>{t.pricing.payment.title}</h2>
                  <p className="text-sm font-medium text-slate-500 tracking-wide">{t.pricing.payment.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div className={cn("p-6 rounded-3xl border", uiTheme === 'golden' ? "bg-amber-950/20 border-amber-900/30" : "bg-pink-50 border-pink-100")}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-black", uiTheme === 'golden' ? "bg-amber-600" : "bg-pink-500")}>1</div>
                      <p className={cn("text-sm font-black uppercase tracking-widest", uiTheme === 'golden' ? "text-amber-500" : "text-pink-900")}>{t.pricing.payment.step1}</p>
                    </div>
                    <ul className={cn("space-y-3 text-sm font-medium", uiTheme === 'golden' ? "text-amber-200/70" : "text-pink-800")}>
                      {t.pricing.payment.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5", uiTheme === 'golden' ? "bg-amber-500" : "bg-pink-400")} />
                          {step === "Enter Merchant No: 01868257470" ? (
                            <>Enter Merchant No: <span className="font-black">01868257470</span></>
                          ) : (
                            language === 'bn' && step.includes("01868257470") ? (
                             <>মার্চেন্ট নম্বর দিন: <span className="font-black">01868257470</span></>
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
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (TK)</label>
                      <input 
                        required
                        type="number"
                        placeholder="e.g. 70"
                        value={paymentData.amount}
                        onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                        className={cn("w-full px-4 py-3 border rounded-xl outline-none transition-all text-sm font-bold", 
                          uiTheme === 'light' ? "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500" : 
                          "bg-slate-800 border-slate-700 focus:ring-2 focus:ring-amber-500 text-white")}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile No</label>
                      <input 
                        required
                        type="text"
                        placeholder="017XXXXXXXX"
                        value={paymentData.mobileNo}
                        onChange={(e) => setPaymentData({...paymentData, mobileNo: e.target.value})}
                        className={cn("w-full px-4 py-3 border rounded-xl outline-none transition-all text-sm font-bold", 
                          uiTheme === 'light' ? "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500" : 
                          "bg-slate-800 border-slate-700 focus:ring-2 focus:ring-amber-500 text-white")}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.pricing.payment.form.trxId}</label>
                    <input 
                      required
                      type="text"
                      placeholder="Enter bKash TrxID"
                      value={paymentData.transactionId}
                      onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                      className={cn("w-full px-4 py-3 border rounded-xl outline-none transition-all text-sm font-bold", 
                        uiTheme === 'light' ? "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500" : 
                        "bg-slate-800 border-slate-700 focus:ring-2 focus:ring-amber-500 text-white")}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.pricing.payment.form.name}</label>
                    <input 
                      required
                      type="text"
                      placeholder="Your Name"
                      value={paymentData.fullName}
                      onChange={(e) => setPaymentData({...paymentData, fullName: e.target.value})}
                      className={cn("w-full px-4 py-3 border rounded-xl outline-none transition-all text-sm font-bold", 
                        uiTheme === 'light' ? "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500" : 
                        "bg-slate-800 border-slate-700 focus:ring-2 focus:ring-amber-500 text-white")}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.pricing.payment.form.comments}</label>
                    <textarea 
                      placeholder="Any message..."
                      value={paymentData.comments}
                      onChange={(e) => setPaymentData({...paymentData, comments: e.target.value})}
                      className={cn("w-full px-4 py-3 border rounded-xl outline-none transition-all text-sm font-bold h-20 resize-none", 
                        uiTheme === 'light' ? "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500" : 
                        "bg-slate-800 border-slate-700 focus:ring-2 focus:ring-amber-500 text-white")}
                    />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className={cn(
                      "w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2",
                      uiTheme === 'golden' ? "bg-amber-600 hover:bg-amber-700 text-white shadow-xl shadow-amber-950/20" : 
                      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200"
                    )}
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
              className="max-w-md w-full bg-white rounded-[2.5rem] p-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                {language === 'en' ? 'Successfully Requested!' : 'সফলভাবে অনুরোধ করা হয়েছে!'}
              </h2>
              <p className="text-slate-500 font-medium mb-8">
                {language === 'en' 
                  ? 'Please wait for confirmation message. Our team will verify your payments and will inform you by SMS.' 
                  : 'অনুগ্রহ করে কনফার্মেশন মেসেজের জন্য অপেক্ষা করুন। আমাদের টিম আপনার পেমেন্ট যাচাই করবে এবং এসএমএসের মাধ্যমে জানাবে।'}
              </p>
              <button 
                onClick={() => setShowPaymentSuccess(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all"
              >
                {language === 'en' ? 'Got it' : 'বুঝেছি'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <footer className={cn(
        "border-t py-16 mt-24 transition-colors duration-300",
        uiTheme === 'light' ? "bg-white border-slate-200" : (uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-[#121212] border-amber-900/30")
      )}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Logo className="w-10 h-10" />
              <h2 className={cn("text-xl font-black", uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'dark' ? "text-white" : "text-amber-500"))}>MAKSUD COMPUTERS</h2>
            </div>
            <p className={cn("font-medium max-w-md mb-8", uiTheme === 'light' ? "text-slate-500" : "text-slate-400")}>
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
            <h4 className={cn("text-sm font-black uppercase tracking-widest mb-6", uiTheme === 'golden' ? "text-amber-500" : (uiTheme === 'dark' ? "text-slate-300" : "text-slate-900"))}>
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
              className={cn("text-sm font-black uppercase tracking-widest mb-6 block text-left w-full hover:underline transition-all", uiTheme === 'golden' ? "text-amber-500" : (uiTheme === 'dark' ? "text-slate-300" : "text-slate-900"))}
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
