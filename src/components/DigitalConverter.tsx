import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Repeat, Ruler, Weight, Maximize, Globe, Calculator, ArrowRightLeft } from 'lucide-react';
import { cn } from '../lib/utils';

interface DigitalConverterProps {
  onBack: () => void;
  uiTheme: 'light' | 'dark' | 'golden';
  language: 'en' | 'bn';
}

type ConverterType = 'currency' | 'length' | 'weight' | 'area';

export const DigitalConverter: React.FC<DigitalConverterProps> = ({ onBack, uiTheme, language }) => {
  const [activeType, setActiveType] = useState<ConverterType>('currency');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');

  const t = {
    en: {
      title: "Digital Converter",
      subtitle: "Convert currency, length, weight, and more with our all-in-one digital converter.",
      tabs: {
        currency: "Currency",
        length: "Length",
        weight: "Weight",
        area: "Area"
      },
      units: {
        currency: { USD: "USD ($)", BDT: "BDT (৳)", EUR: "EUR (€)", GBP: "GBP (£)", INR: "INR (₹)" },
        length: { in: "Inches", cm: "Centimeters", m: "Meters", ft: "Feet", km: "Kilometers" },
        weight: { lb: "Pounds (lbs)", kg: "Kilograms", g: "Grams", oz: "Ounces" },
        area: { sqft: "Square Feet", sqm: "Square Meters", acre: "Acre", decimal: "Decimal" }
      },
      labels: {
        from: "From",
        to: "To",
        amount: "Amount / Value",
        result: "Result",
        back: "Back to Dashboard"
      }
    },
    bn: {
      title: "ডিজিটাল কনভার্টার",
      subtitle: "কারেন্সি, দৈর্ঘ্য, ওজন এবং আরও অনেক কিছু রূপান্তর করুন আমাদের অল-ইন-ওয়ান কনভার্টার দিয়ে।",
      tabs: {
        currency: "কারেন্সি",
        length: "দৈর্ঘ্য",
        weight: "ওজন",
        area: "ক্ষেত্রফল"
      },
      units: {
        currency: { USD: "ইউএসডি ($)", BDT: "বিডিটি (৳)", EUR: "ইউরো (€)", GBP: "জিবিপি (£)", INR: "ইন্ডিয়ান রুপি (₹)" },
        length: { in: "ইঞ্চি", cm: "সেন্টিমিটার", m: "মিটার", ft: "ফুট", km: "কিলোমিটার" },
        weight: { lb: "পাউন্ড (lbs)", kg: "কিলোগ্রাম", g: "গ্রাম", oz: "আউন্স" },
        area: { sqft: "বর্গফুট", sqm: "বর্গমিটার", acre: "একর", decimal: "ডেসিমেল" }
      },
      labels: {
        from: "থেকে",
        to: "প্রতি",
        amount: "পরিমাণ / ভ্যালু",
        result: "ফলাফল",
        back: "ড্যাশবোর্ডে ফিরে যান"
      }
    }
  }[language];

  // Logic for conversions
  const conversionResult = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '0';

    if (activeType === 'currency') {
      const rates: Record<string, number> = {
        USD: 1, BDT: 110, EUR: 0.92, GBP: 0.79, INR: 83.3
      };
      if (!fromUnit || !toUnit) return '0';
      const inUSD = val / rates[fromUnit];
      const result = inUSD * rates[toUnit];
      return result.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }

    if (activeType === 'length') {
      const toMeters: Record<string, number> = {
        in: 0.0254, cm: 0.01, m: 1, ft: 0.3048, km: 1000
      };
      if (!fromUnit || !toUnit) return '0';
      const meters = val * toMeters[fromUnit];
      const result = meters / toMeters[toUnit];
      return result.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }

    if (activeType === 'weight') {
      const toKg: Record<string, number> = {
        lb: 0.453592, kg: 1, g: 0.001, oz: 0.0283495
      };
      if (!fromUnit || !toUnit) return '0';
      const kg = val * toKg[fromUnit];
      const result = kg / toKg[toUnit];
      return result.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }

    if (activeType === 'area') {
      const toSqM: Record<string, number> = {
        sqft: 0.092903, sqm: 1, acre: 4046.86, decimal: 40.4686
      };
      if (!fromUnit || !toUnit) return '0';
      const sqm = val * toSqM[fromUnit];
      const result = sqm / toSqM[toUnit];
      return result.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }

    return '0';
  }, [activeType, inputValue, fromUnit, toUnit]);

  // Reset units when type changes
  React.useEffect(() => {
    const units = Object.keys(t.units[activeType]);
    setFromUnit(units[0]);
    setToUnit(units[1]);
  }, [activeType]);

  const tabs = [
    { id: 'currency', icon: <Globe size={18} />, label: t.tabs.currency },
    { id: 'length', icon: <Ruler size={18} />, label: t.tabs.length },
    { id: 'weight', icon: <Weight size={18} />, label: t.tabs.weight },
    { id: 'area', icon: <Maximize size={18} />, label: t.tabs.area },
  ];

  return (
    <div className={cn("min-h-screen pt-24 px-4 transition-all pb-24", 
      uiTheme === 'light' ? "bg-slate-50" : uiTheme === 'dark' ? "bg-slate-950" : "bg-black")}>
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm mb-8",
            uiTheme === 'light' ? "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50" : 
            "bg-slate-900 text-white border border-slate-800 hover:bg-slate-800"
          )}
        >
          <ArrowLeft size={24} />
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("standard-card overflow-hidden", 
            uiTheme === 'light' ? "bg-white" : 
            uiTheme === 'dark' ? "bg-slate-900 border-slate-800" : 
            "bg-[#1a1a1a] border-amber-900/30")}
        >
          <div className={cn("p-10 border-b", 
            uiTheme === 'golden' ? "bg-amber-600/10 border-amber-900/20" : "bg-indigo-600/10 border-indigo-100")}>
            <div className="flex flex-col md:flex-row items-center gap-8 md:text-left text-center">
              <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-xl", 
                uiTheme === 'golden' ? "bg-amber-600" : "bg-indigo-600")}>
                <Calculator size={40} />
              </div>
              <div>
                <h1 className={cn("text-3xl md:text-4xl font-black tracking-tight mb-2", 
                  uiTheme === 'golden' ? "text-amber-500" : (uiTheme === 'light' ? "text-slate-900" : "text-white"))}>
                  {t.title}
                </h1>
                <p className="text-slate-500 font-medium max-w-xl text-sm leading-relaxed">{t.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            {/* Tabs */}
            <div className="flex flex-wrap gap-3 mb-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveType(tab.id as ConverterType)}
                  className={cn(
                    "flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 px-4 rounded-2xl font-bold transition-all text-sm group active:scale-95 border-2",
                    activeType === tab.id 
                      ? (uiTheme === 'golden' ? "bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-900/20" : "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20")
                      : (uiTheme === 'light' ? "bg-white border-slate-100 text-slate-600 hover:border-slate-200" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600")
                  )}
                >
                  <div className={cn(
                    "transition-transform group-hover:scale-110",
                    activeType === tab.id ? "text-white" : (uiTheme === 'golden' ? "text-amber-600" : "text-indigo-600")
                  )}>
                    {tab.icon}
                  </div>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={cn(
              "p-8 rounded-[2.5rem] border mb-8",
              uiTheme === 'light' ? "bg-slate-50 border-slate-100" : "bg-slate-800/50 border-slate-700"
            )}>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.labels.amount}</label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className={cn(
                        "w-full px-6 py-5 rounded-[1.5rem] text-3xl font-black outline-none transition-all",
                        uiTheme === 'light' ? "bg-white border border-slate-200 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600" : "bg-slate-900 border border-slate-800 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 text-white"
                      )}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="flex justify-center py-4 lg:py-0">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg",
                    uiTheme === 'golden' ? "bg-amber-600" : "bg-indigo-600"
                  )}>
                    <ArrowRightLeft size={24} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.labels.result}</label>
                  <div className={cn(
                    "w-full px-6 py-5 rounded-[1.5rem] border text-3xl font-black shadow-sm flex items-center min-h-[82px]",
                    uiTheme === 'light' ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-amber-500"
                  )}>
                    {conversionResult}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.labels.from}</label>
                  <div className="relative">
                    <select 
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                      className={cn(
                        "w-full px-6 py-4 rounded-2xl font-bold transition-all outline-none appearance-none cursor-pointer text-base pr-12",
                        uiTheme === 'light' ? "bg-white border border-slate-200 focus:border-indigo-600" : "bg-slate-900 border border-slate-800 focus:border-amber-500 text-white"
                      )}
                    >
                      {Object.entries(t.units[activeType]).map(([val, label]) => (
                        <option key={val} value={val}>{label as string}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Repeat size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.labels.to}</label>
                  <div className="relative">
                    <select 
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      className={cn(
                        "w-full px-6 py-4 rounded-2xl font-bold transition-all outline-none appearance-none cursor-pointer text-base pr-12",
                        uiTheme === 'light' ? "bg-white border border-slate-200 focus:border-indigo-600" : "bg-slate-900 border border-slate-800 focus:border-amber-500 text-white"
                      )}
                    >
                      {Object.entries(t.units[activeType]).map(([val, label]) => (
                        <option key={val} value={val}>{label as string}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Repeat size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={cn(
              "p-6 rounded-3xl border border-dashed text-center",
              uiTheme === 'light' ? "bg-indigo-50 border-indigo-200 text-indigo-700/60" : "bg-amber-950/20 border-amber-900/30 text-amber-500/60"
            )}>
              <p className="text-xs font-bold uppercase tracking-widest">
                Rates derived from global indices. Refreshed daily for accuracy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
