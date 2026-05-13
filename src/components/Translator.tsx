import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Languages, 
  Copy, 
  Check, 
  Trash2, 
  Loader2, 
  ArrowRightLeft,
  Volume2,
  Sparkles
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';
import { Language, translations } from '../lib/translations';

interface TranslatorProps {
  onBack: () => void;
  uiTheme: 'light' | 'dark' | 'golden';
  language: Language;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ur', name: 'Urdu' },
  { code: 'tr', name: 'Turkish' },
];

export const Translator: React.FC<TranslatorProps> = ({ onBack, uiTheme, language }) => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('bn');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = translations[language];

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    try {
      const sourceLangName = SUPPORTED_LANGUAGES.find(l => l.code === sourceLang)?.name;
      const targetLangName = SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate the following text from ${sourceLangName} to ${targetLangName}. Only return the translated text, nothing else.\n\nText: ${inputText}`,
      });

      setTranslatedText(response.text || '');
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Error: Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  return (
    <div className={cn(
      "min-h-screen pt-24 pb-20 px-6 transition-colors duration-300",
      uiTheme === 'light' ? "bg-slate-50" : (uiTheme === 'dark' ? "bg-slate-950" : "bg-[#0c0a09]")
    )}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm",
                uiTheme === 'light' ? "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50" : 
                "bg-slate-900 text-white border border-slate-800 hover:bg-slate-800"
              )}
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className={cn(
                "text-3xl md:text-5xl font-black tracking-tight",
                uiTheme === 'golden' ? "text-amber-500" : (uiTheme === 'dark' ? "text-white" : "text-slate-900")
              )}>
                {t.dashboard.tools.translator}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className={cn("h-1 w-12 rounded-full", uiTheme === 'golden' ? "bg-amber-500" : "bg-indigo-600")} />
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">AI Powered / Context Aware</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          {/* Source Panel */}
          <div className={cn(
            "standard-card p-8 md:p-10 flex flex-col min-h-[450px] transition-all duration-300",
            uiTheme === 'light' ? "bg-white" : "bg-slate-900"
          )}>
            <div className="flex items-center justify-between mb-8">
              <div className={cn(
                "px-4 py-2 rounded-xl flex items-center gap-2",
                uiTheme === 'light' ? "bg-slate-100" : "bg-slate-800"
              )}>
                <Languages size={18} className="text-indigo-500" />
                <select 
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="bg-transparent font-bold text-sm uppercase tracking-wider outline-none cursor-pointer pr-4"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{lang.name}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => setInputText('')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                title="Clear"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              className={cn(
                "flex-1 bg-transparent resize-none text-2xl font-bold outline-none placeholder:text-slate-300",
                uiTheme === 'light' ? "text-slate-900" : "text-white"
              )}
            />

            <div className="mt-8 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {inputText.length} Characters
              </span>
              <button
                onClick={handleTranslate}
                disabled={isTranslating || !inputText.trim()}
                className={cn(
                  "px-8 py-4 rounded-2xl font-bold text-base transition-all flex items-center gap-3 active:scale-95",
                  isTranslating || !inputText.trim()
                    ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400"
                    : (uiTheme === 'golden' ? "bg-amber-600 text-white shadow-lg shadow-amber-900/20" : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20")
                )}
              >
                {isTranslating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    Translate
                    <Languages size={20} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Swap Button (Absolute center) */}
          <button 
            onClick={swapLanguages}
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex w-14 h-14 rounded-2xl items-center justify-center z-10 shadow-xl transition-all active:scale-90",
              uiTheme === 'golden' ? "bg-amber-600 text-white" : "bg-indigo-600 text-white"
            )}
          >
            <ArrowRightLeft size={24} />
          </button>

          {/* Target Panel */}
          <div className={cn(
            "standard-card p-8 md:p-10 flex flex-col min-h-[450px] transition-all duration-300",
            uiTheme === 'light' ? "bg-indigo-50/30 border-indigo-100" : "bg-slate-900/50"
          )}>
            <div className="flex items-center justify-between mb-8">
              <div className={cn(
                "px-4 py-2 rounded-xl flex items-center gap-2",
                uiTheme === 'light' ? "bg-slate-100" : "bg-slate-800"
              )}>
                <Languages size={18} className="text-emerald-500" />
                <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="bg-transparent font-bold text-sm uppercase tracking-wider outline-none cursor-pointer pr-4"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{lang.name}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={copyToClipboard}
                disabled={!translatedText}
                className={cn(
                  "p-3 rounded-xl transition-all active:scale-90",
                  copied ? "bg-emerald-500 text-white" : "bg-white border border-slate-200 text-slate-400 hover:text-slate-600"
                )}
                title="Copy"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>

            <div className={cn(
              "flex-1 text-2xl font-bold leading-relaxed",
              !translatedText ? "text-slate-300" : (uiTheme === 'light' ? "text-slate-900" : "text-white")
            )}>
              {isTranslating ? (
                <div className="space-y-4">
                  <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                  <div className="h-6 w-[80%] bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                  <div className="h-6 w-[90%] bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                </div>
              ) : (
                translatedText || "Result will appear here..."
              )}
            </div>

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isTranslating ? "bg-amber-500 animate-ping" : (translatedText ? "bg-emerald-500" : "bg-slate-300")
                )} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  {isTranslating ? 'Processing...' : (translatedText ? 'Ready' : 'Waiting')}
                </span>
              </div>
              <button className={cn(
                "px-6 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all shadow-sm active:scale-95",
                uiTheme === 'light' ? "bg-slate-900 text-slate-100 hover:bg-slate-800" : "bg-slate-800 text-slate-100 hover:bg-slate-700"
              )}>
                <Volume2 size={16} />
                Listen
              </button>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: <Languages />, title: 'Universal', desc: '100+ LANGUAGES', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { icon: <Sparkles />, title: 'AI Driven', desc: 'CONTEXT SENSITIVE', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: <Volume2 />, title: 'Accurate', desc: 'HIGH PRECISION', color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((feature, i) => (
            <div key={i} className="standard-card p-6 flex items-center gap-5 translate-y-0 hover:-translate-y-1 transition-transform">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform", feature.bg, feature.color)}>
                {React.cloneElement(feature.icon as React.ReactElement, { size: 28 })}
              </div>
              <div>
                <p className={cn("text-lg font-bold tracking-tight", uiTheme === 'light' ? "text-slate-900" : "text-white")}>{feature.title}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
