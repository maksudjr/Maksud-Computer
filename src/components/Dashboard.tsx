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
  X
} from 'lucide-react';
import { Logo } from './Logo';
import { cn } from '../lib/utils';
import { useSecurity } from './SecurityGate';
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface DashboardProps {
  onSelectTool: (tool: 'cv' | 'age' | 'resizer' | 'editor' | 'pdf' | 'about' | 'bg-remover' | 'pdf-to-img' | 'pdf-to-word' | 'pdf-compress' | 'pdf-merge' | 'img-to-pdf', cost: number) => void;
  onAdminLogin: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectTool, onAdminLogin }) => {
  const { coins, userName, isAuthorized, logout, freeTrialUsed, isFreeAccess, activateFreeAccess, error, activeKey } = useSecurity();
  const [showFreeSuccess, setShowFreeSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'pricing'>('tools');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
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
    
    if (hour < 12) return `Good Morning${name}!`;
    if (hour < 18) return `Good Afternoon${name}!`;
    return `Good Evening${name}!`;
  }, []);

  const tools = [
    {
      id: 'cv',
      name: 'CV Builder',
      description: 'Create professional CVs with multiple templates.',
      icon: <FileText className="text-blue-600" />,
      color: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      borderColor: 'border-blue-100',
      size: 'large',
      cost: 1
    },
    {
      id: 'editor',
      name: 'Photo Editor',
      description: 'AI Background removal, upscaling & retouching.',
      icon: <ImageIcon className="text-indigo-600" />,
      color: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      borderColor: 'border-indigo-100',
      size: 'medium',
      cost: 0.5
    },
    {
      id: 'bg-remover',
      name: 'BG Remover',
      description: 'Remove background from any image instantly.',
      icon: <Sparkles className="text-amber-600" />,
      color: 'bg-amber-50',
      hoverColor: 'hover:bg-amber-100',
      borderColor: 'border-amber-100',
      size: 'medium',
      cost: 0.5
    },
    {
      id: 'resizer',
      name: 'Photo Resizer',
      description: 'Crop and resize by pixels or inches.',
      icon: <Layout className="text-purple-600" />,
      color: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      borderColor: 'border-purple-100',
      size: 'small',
      cost: 0.5
    },
    {
      id: 'pdf',
      name: 'PDF Editor',
      description: 'Import, edit text and images in PDF files.',
      icon: <FileEdit className="text-red-600" />,
      color: 'bg-red-50',
      hoverColor: 'hover:bg-red-100',
      borderColor: 'border-red-100',
      size: 'small',
      cost: 0.25
    },
    {
      id: 'pdf-to-img',
      name: 'PDF to Image',
      description: 'Convert PDF pages to high-quality images.',
      icon: <FileImage className="text-orange-600" />,
      color: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      borderColor: 'border-orange-100',
      size: 'small',
      cost: 0.25
    },
    {
      id: 'pdf-to-word',
      name: 'PDF to Word',
      description: 'Extract text from PDF to Word document.',
      icon: <FileType className="text-blue-600" />,
      color: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      borderColor: 'border-blue-100',
      size: 'small',
      cost: 0.25
    },
    {
      id: 'pdf-compress',
      name: 'PDF Compress',
      description: 'Reduce PDF file size without losing quality.',
      icon: <FileArchive className="text-emerald-600" />,
      color: 'bg-emerald-50',
      hoverColor: 'hover:bg-emerald-100',
      borderColor: 'border-emerald-100',
      size: 'small',
      cost: 0.25
    },
    {
      id: 'pdf-merge',
      name: 'PDF Merge',
      description: 'Combine multiple PDF files into one.',
      icon: <Files className="text-rose-600" />,
      color: 'bg-rose-50',
      hoverColor: 'hover:bg-rose-100',
      borderColor: 'border-rose-100',
      size: 'small',
      cost: 0.25
    },
    {
      id: 'img-to-pdf',
      name: 'Image to PDF',
      description: 'Convert images into a professional PDF.',
      icon: <ImagePlus className="text-cyan-600" />,
      color: 'bg-cyan-50',
      hoverColor: 'hover:bg-cyan-100',
      borderColor: 'border-cyan-100',
      size: 'small',
      cost: 0.25
    },
    {
      id: 'age',
      name: 'Age Calculator',
      description: 'Calculate exact age and next birthday.',
      icon: <Calculator className="text-green-600" />,
      color: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      borderColor: 'border-green-100',
      size: 'small',
      cost: 0
    },
    {
      id: 'about',
      name: 'About Us',
      description: 'Learn more about Maksud Computer.',
      icon: <Users className="text-gray-600" />,
      color: 'bg-gray-50',
      hoverColor: 'hover:bg-gray-100',
      borderColor: 'border-gray-100',
      size: 'small',
      cost: 0
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Premium Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Crown size={18} className="text-amber-300" />
            </div>
            <p className="text-sm font-bold tracking-wide">
              GET PREMIUM ACCESS: <span className="text-amber-300 ml-2">01622638268</span> | <span className="text-amber-300">maksudjr2020@gmail.com</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onAdminLogin}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Settings size={14} />
              Admin Login
            </button>
            {isAuthorized && (
              <button 
                onClick={logout}
                className="px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <LogOut size={14} />
                Logout
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
                <p className="text-sm font-black text-slate-900">New User? Get Free Access!</p>
                <p className="text-xs font-medium text-slate-500">Includes 1 CV and 2 uses of all other tools.</p>
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
                Get Free Access
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
                  Congratulations! You have got free access.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-12 h-12" />
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-none">MAKSUD</h2>
              <p className="text-[10px] font-bold text-indigo-600 tracking-[0.2em] uppercase mt-1">Computers</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('tools')}
                className={cn("text-sm font-bold transition-colors", activeTab === 'tools' ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600")}
              >
                Home
              </button>
              <button 
                onClick={() => setActiveTab('pricing')}
                className={cn("text-sm font-bold transition-colors", activeTab === 'pricing' ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600")}
              >
                Pricing
              </button>
              <a href="#" onClick={() => onSelectTool('about')} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">About</a>
            </nav>
            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
              Contact Us
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
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                {welcomeMessage}
              </h1>
              <p className="text-lg text-slate-500 max-w-xl font-medium">
                Your professional digital workspace. Everything you need to create, edit, and manage your digital assets in one place.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {isAuthorized && (
                <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-black uppercase tracking-widest">Your Key: {activeKey}</span>
                </div>
              )}
              <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                <div className="px-4 py-2 bg-indigo-50 rounded-xl">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Active Tools</p>
                  <p className="text-xl font-black text-indigo-900">12</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 rounded-xl">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Status</p>
                  <p className="text-xl font-black text-emerald-900">Online</p>
                </div>
              </div>
              
              {isAuthorized && (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 min-w-[240px] w-fit">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <CoinsIcon size={16} className="text-amber-500" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {isFreeAccess ? "Free Access Usage" : "Coin Usages"}
                      </p>
                    </div>
                    <p className="text-[10px] font-bold text-indigo-600">
                      {isFreeAccess ? (coins > 0 ? "1 COIN" : "EXPIRED") : `${coins.toFixed(2)} Coins`}
                    </p>
                  </div>
                  
                  {isFreeAccess ? (
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                        You have 1 free coin. Use it for 1 CV or 2 other tools.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
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
                          ✨ 1 Free Use Available
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
                  "group relative cursor-pointer bg-white rounded-[2rem] border border-slate-200 p-8 transition-all hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-100 active:scale-[0.98]",
                  tool.size === 'large' ? "md:col-span-2 md:row-span-2" : 
                  tool.size === 'medium' ? "md:col-span-2" : "md:col-span-1"
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3",
                  tool.color
                )}>
                  {React.cloneElement(tool.icon as React.ReactElement, { size: 28 })}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      {tool.name}
                      {tool.id === 'cv' && <Sparkles size={16} className="text-amber-500 animate-pulse" />}
                    </h3>
                    {tool.cost > 0 ? (
                      <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                        <CoinsIcon size={12} className="text-amber-500" />
                        <span className="text-[10px] font-black text-slate-600">{tool.cost}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Free</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <div className="absolute bottom-8 right-8 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ChevronRight size={20} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-black text-slate-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-slate-500 font-medium">Choose the coin pack that fits your needs. Coins never expire and can be used for any tool.</p>
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
                    "relative bg-white rounded-[2.5rem] p-8 border-2 transition-all hover:shadow-2xl",
                    plan.popular ? "border-indigo-600 shadow-xl shadow-indigo-100 scale-105 z-10" : "border-slate-100 hover:border-indigo-200"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-8">
                    <p className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-2">{plan.label}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                      <span className="text-lg font-bold text-slate-400">TK</span>
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={14} />
                      </div>
                      <p className="text-sm font-bold text-slate-600">{plan.coins} Coins</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={14} />
                      </div>
                      <p className="text-sm font-bold text-slate-600">All Tools Access</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={14} />
                      </div>
                      <p className="text-sm font-bold text-slate-600">No Expiry</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPaymentForm(true)}
                    className={cn(
                      "w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2",
                      plan.popular ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200" : "bg-slate-50 text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    Add Coins
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
              className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 relative my-8"
            >
              <button 
                onClick={() => setShowPaymentForm(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Payment Instructions</h2>
                  <p className="text-sm font-medium text-slate-500 tracking-wide">Follow the steps below to add coins</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div className="p-6 bg-pink-50 rounded-3xl border border-pink-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white font-black">1</div>
                      <p className="text-sm font-black text-pink-900 uppercase tracking-widest">bKash Payment</p>
                    </div>
                    <ul className="space-y-3 text-sm font-medium text-pink-800">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-1.5" />
                        Go to bKash App
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-1.5" />
                        Select "Payment" option
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-1.5" />
                        Enter Merchant No: <span className="font-black">01868257470</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-1.5" />
                        Complete the payment
                      </li>
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
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold"
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
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transaction ID</label>
                    <input 
                      required
                      type="text"
                      placeholder="Enter bKash TrxID"
                      value={paymentData.transactionId}
                      onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      required
                      type="text"
                      placeholder="Your Name"
                      value={paymentData.fullName}
                      onChange={(e) => setPaymentData({...paymentData, fullName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Comments (Optional)</label>
                    <textarea 
                      placeholder="Any message..."
                      value={paymentData.comments}
                      onChange={(e) => setPaymentData({...paymentData, comments: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold h-20 resize-none"
                    />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
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
              <h2 className="text-2xl font-black text-slate-900 mb-4">Successfully Requested!</h2>
              <p className="text-slate-500 font-medium mb-8">
                Please wait for confirmation message. Our team will verify your payments and will inform you by SMS.
              </p>
              <button 
                onClick={() => setShowPaymentSuccess(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <footer className="bg-white border-t border-slate-200 py-16 mt-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Logo className="w-10 h-10" />
              <h2 className="text-xl font-black text-slate-900">MAKSUD COMPUTERS</h2>
            </div>
            <p className="text-slate-500 font-medium max-w-md mb-8">
              Professional digital services and tools since 2020. Providing the best-in-class solutions for your daily digital needs.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all cursor-pointer">
                <Facebook size={20} />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">CV Builder</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Photo Editor</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">PDF Tools</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="text-sm font-bold text-slate-500">Jamalpur, Bangladesh</li>
              <li className="text-sm font-bold text-slate-500">01622638268</li>
              <li className="text-sm font-bold text-slate-500">maksudjr2020@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-xs font-bold">© 2026 MAKSUD COMPUTERS. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};
