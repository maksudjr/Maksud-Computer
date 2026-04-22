import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Monitor, ShieldCheck, Zap, Heart, MapPin, Phone, Mail, Facebook } from 'lucide-react';
import { Logo } from './Logo';
import { Language, translations } from '../lib/translations';
import { cn } from '../lib/utils';

interface AboutUsProps {
  onBack: () => void;
  uiTheme: 'light' | 'dark' | 'golden';
  language: Language;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onBack, uiTheme, language }) => {
  const t = translations[language];
  
  return (
    <div className={cn("min-h-screen py-12 px-4 transition-all", 
      uiTheme === 'light' ? "bg-gray-50" : 
      uiTheme === 'dark' ? "bg-slate-950" : 
      "bg-[#121212]")}>
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={onBack}
          className={cn("flex items-center gap-2 mb-8 transition-colors font-medium", 
            uiTheme === 'light' ? "text-gray-600 hover:text-indigo-600" : 
            uiTheme === 'dark' ? "text-slate-400 hover:text-white" : 
            "text-amber-500/70 hover:text-amber-500")}
        >
          <ArrowLeft size={20} />
          {language === 'en' ? 'Back to Dashboard' : 'ড্যাশবোর্ডে ফিরে যান'}
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("rounded-3xl shadow-xl overflow-hidden border", 
            uiTheme === 'light' ? "bg-white border-gray-100" : 
            uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : 
            "bg-[#1a1a1a] border-amber-900/30")}
        >
          <div className={cn("p-12 text-white text-center", uiTheme === 'golden' ? "bg-amber-700" : "bg-indigo-600")}>
            <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden shadow-lg border-4 border-white/20">
              <Logo className="w-full h-full" />
            </div>
            <h1 className="text-4xl font-black mb-2">{t.about.title}</h1>
            <p className={cn("text-lg max-w-2xl mx-auto font-bold opacity-90", uiTheme === 'golden' ? "text-amber-100" : "text-indigo-100")}>
              Since 2020 | {t.about.welcome}
            </p>
          </div>

          <div className="p-12 space-y-16">
            {/* Mission Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-center md:text-left">
              <div>
                <h2 className={cn("text-3xl font-black mb-6", uiTheme === 'light' ? "text-gray-900" : (uiTheme === 'dark' ? "text-white" : "text-amber-500"))}>
                  {t.about.vision}
                </h2>
                <p className={cn("leading-relaxed mb-6 font-medium", uiTheme === 'light' ? "text-gray-600" : "text-slate-400")}>
                  {t.about.description}
                </p>
                <p className={cn("leading-relaxed mb-6 font-medium italic", uiTheme === 'light' ? "text-gray-500" : "text-slate-500")}>
                  "{t.about.visionText}"
                </p>
                <div className="space-y-4 flex flex-col items-center md:items-start">
                  {[
                    { icon: <ShieldCheck className="text-green-500" />, text: language === 'en' ? "Secure and private data handling" : "সুরক্ষিত এবং ব্যক্তিগত ডেটা হ্যান্ডলিং" },
                    { icon: <Zap className="text-amber-500" />, text: language === 'en' ? "Fast and efficient processing" : "দ্রুত এবং দক্ষ প্রসেসিং" },
                    { icon: <Heart className="text-red-500" />, text: language === 'en' ? "User-centric design and support" : "ব্যবহারকারী-কেন্দ্রিক ডিজাইন এবং সাপোর্ট" }
                  ].map((item, i) => (
                    <div key={i} className={cn("flex items-center gap-3 font-bold text-sm", uiTheme === 'light' ? "text-gray-700" : "text-slate-300")}>
                      {item.icon}
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className={cn("rounded-3xl p-8 flex items-center justify-center h-full", uiTheme === 'light' ? "bg-indigo-50" : "bg-slate-800/50")}>
                <Monitor size={180} className={uiTheme === 'light' ? "text-indigo-200" : "text-slate-700"} />
              </div>
            </div>

            {/* Contact Section */}
            <div className={cn("rounded-3xl p-12 text-white", uiTheme === 'golden' ? "bg-amber-900/40" : "bg-gray-900")}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black mb-4">Get In Touch</h2>
                <p className="text-gray-400 font-medium">Visit us or contact us for any professional digital services.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", uiTheme === 'golden' ? "bg-amber-600/20" : "bg-white/10")}>
                    <MapPin size={24} className={uiTheme === 'golden' ? "text-amber-500" : "text-indigo-400"} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest">{t.about.location}</h3>
                    <p className="text-gray-400 text-xs font-bold mt-1 leading-relaxed">{t.about.address}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", uiTheme === 'golden' ? "bg-amber-600/20" : "bg-white/10")}>
                    <Phone size={24} className={uiTheme === 'golden' ? "text-amber-500" : "text-indigo-400"} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest">Phone</h3>
                    <p className="text-gray-400 text-xs font-bold mt-1 leading-relaxed">01868257470</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", uiTheme === 'golden' ? "bg-amber-600/20" : "bg-white/10")}>
                    <Mail size={24} className={uiTheme === 'golden' ? "text-amber-500" : "text-indigo-400"} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest">Email</h3>
                    <p className="text-gray-400 text-xs font-bold mt-1 leading-relaxed">maksudjr2020@gmail.com</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", uiTheme === 'golden' ? "bg-amber-600/20" : "bg-white/10")}>
                    <Facebook size={24} className={uiTheme === 'golden' ? "text-amber-500" : "text-indigo-400"} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest">Social</h3>
                    <p className="text-gray-400 text-xs font-bold mt-1 leading-relaxed">fb.com/maksudcomputer</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center pt-8">
              <p className={cn("text-xs font-black uppercase tracking-[0.3em]", uiTheme === 'golden' ? "text-amber-600" : "text-indigo-600")}>
                Managed by Maksud Computer
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
