import React, { useMemo } from 'react';
import { motion } from 'motion/react';
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
  Facebook
} from 'lucide-react';
import { Logo } from './Logo';
import { cn } from '../lib/utils';

interface DashboardProps {
  onSelectTool: (tool: 'cv' | 'age' | 'resizer' | 'editor' | 'pdf' | 'about' | 'bg-remover') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  const welcomeMessage = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning!";
    if (hour < 18) return "Good Afternoon!";
    return "Good Evening!";
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
      size: 'large'
    },
    {
      id: 'editor',
      name: 'Photo Editor',
      description: 'AI Background removal, upscaling & retouching.',
      icon: <ImageIcon className="text-indigo-600" />,
      color: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      borderColor: 'border-indigo-100',
      size: 'medium'
    },
    {
      id: 'bg-remover',
      name: 'BG Remover',
      description: 'Remove background from any image instantly.',
      icon: <Sparkles className="text-amber-600" />,
      color: 'bg-amber-50',
      hoverColor: 'hover:bg-amber-100',
      borderColor: 'border-amber-100',
      size: 'medium'
    },
    {
      id: 'resizer',
      name: 'Photo Resizer',
      description: 'Crop and resize by pixels or inches.',
      icon: <Layout className="text-purple-600" />,
      color: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      borderColor: 'border-purple-100',
      size: 'small'
    },
    {
      id: 'pdf',
      name: 'PDF Editor',
      description: 'Import, edit text and images in PDF files.',
      icon: <FileEdit className="text-red-600" />,
      color: 'bg-red-50',
      hoverColor: 'hover:bg-red-100',
      borderColor: 'border-red-100',
      size: 'small'
    },
    {
      id: 'age',
      name: 'Age Calculator',
      description: 'Calculate exact age and next birthday.',
      icon: <Calculator className="text-green-600" />,
      color: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      borderColor: 'border-green-100',
      size: 'small'
    },
    {
      id: 'about',
      name: 'About Us',
      description: 'Learn more about Maksud Computer.',
      icon: <Users className="text-gray-600" />,
      color: 'bg-gray-50',
      hoverColor: 'hover:bg-gray-100',
      borderColor: 'border-gray-100',
      size: 'small'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
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
              <a href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Home</a>
              <a href="#" onClick={() => onSelectTool('about')} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">About</a>
              <a href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Services</a>
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
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
              <div className="px-4 py-2 bg-indigo-50 rounded-xl">
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Active Tools</p>
                <p className="text-xl font-black text-indigo-900">07</p>
              </div>
              <div className="px-4 py-2 bg-emerald-50 rounded-xl">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Status</p>
                <p className="text-xl font-black text-emerald-900">Online</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bento Grid Tools */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectTool(tool.id as any)}
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
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  {tool.name}
                  {tool.id === 'cv' && <Sparkles size={16} className="text-amber-500 animate-pulse" />}
                </h3>
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

        {/* Quick Stats / Info */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <ShieldCheck className="text-emerald-600" />, title: "Secure Processing", desc: "All data stays in your browser. We never upload your sensitive files to any server." },
            { icon: <Zap className="text-amber-600" />, title: "Instant Results", desc: "Powered by modern web technologies for lightning-fast performance on any device." },
            { icon: <Monitor className="text-indigo-600" />, title: "Cross-Platform", desc: "Use our tools on your desktop, tablet, or smartphone with a seamless experience." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
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
