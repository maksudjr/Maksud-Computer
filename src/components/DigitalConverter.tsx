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
    <div className={cn("min-h-screen py-12 px-4 transition-all", 
      uiTheme === 'light' ? "bg-slate-50" : uiTheme === 'dark' ? "bg-slate-950" : "bg-[#121212]")}>
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack}
          className={cn("flex items-center gap-2 mb-8 transition-colors font-medium", 
            uiTheme === 'light' ? "text-slate-600 hover:text-indigo-600" : 
            uiTheme === 'dark' ? "text-slate-400 hover:text-white" : 
            "text-amber-500/70 hover:text-amber-500")}
        >
          <ArrowLeft size={20} />
          {t.labels.back}
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("rounded-[2.5rem] shadow-xl overflow-hidden border", 
            uiTheme === 'light' ? "bg-white border-slate-100" : 
            uiTheme === 'dark' ? "bg-slate-900 border-slate-800 text-white" : 
            "bg-[#1a1a1a] border-amber-950 text-amber-100")}
        >
          <div className={cn("p-10 text-white text-center", uiTheme === 'golden' ? "bg-amber-700" : "bg-indigo-600")}>
            <div className="w-20 h-20 bg-white/20 rounded-3xl mx-auto mb-6 flex items-center justify-center backdrop-blur-md">
              <Calculator size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-black mb-2">{t.title}</h1>
            <p className="text-white/80 font-medium max-w-md mx-auto small text-sm">{t.subtitle}</p>
          </div>

          <div className="p-8">
            {/* Tabs */}
            <div className={cn("flex flex-wrap gap-2 mb-8 p-1 rounded-2xl", 
              uiTheme === 'light' ? "bg-slate-100" : "bg-white/5")}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveType(tab.id as ConverterType)}
                  className={cn("flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black transition-all",
                    activeType === tab.id 
                      ? (uiTheme === 'golden' ? "bg-amber-600 text-white" : "bg-white text-indigo-600 shadow-sm")
                      : (uiTheme === 'light' ? "text-slate-500 hover:text-slate-900" : "text-slate-500 hover:text-slate-300")
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.labels.amount}</label>
                <input 
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={cn("w-full px-6 py-4 rounded-2xl text-xl font-black outline-none transition-all border",
                    uiTheme === 'light' ? "bg-slate-50 border-slate-200 focus:ring-4 focus:ring-indigo-100" : 
                    uiTheme === 'dark' ? "bg-slate-800 border-slate-700 focus:ring-4 focus:ring-indigo-900/30" :
                    "bg-black border-amber-900/30 focus:ring-4 focus:ring-amber-900/20")}
                  placeholder="0.00"
                />
              </div>

              <div className="hidden md:flex justify-center pb-5 text-slate-400">
                <ArrowRightLeft size={24} />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.labels.result}</label>
                <div className={cn("w-full px-6 py-4 rounded-2xl text-xl font-black border flex items-center",
                  uiTheme === 'light' ? "bg-slate-50 border-slate-100" : 
                  uiTheme === 'dark' ? "bg-slate-800/50 border-slate-700" :
                  "bg-black/50 border-amber-900/20")}>
                  {conversionResult}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.labels.from}</label>
                <select 
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className={cn("w-full px-6 py-4 rounded-2xl font-bold outline-none transition-all border appearance-none cursor-pointer",
                    uiTheme === 'light' ? "bg-white border-slate-200 focus:ring-4 focus:ring-indigo-100" : 
                    uiTheme === 'dark' ? "bg-slate-800 border-slate-700 text-white" :
                    "bg-[#1a1a1a] border-amber-900/30 text-amber-100")}
                >
                  {Object.entries(t.units[activeType]).map(([val, label]) => (
                    <option key={val} value={val}>{label as string}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.labels.to}</label>
                <select 
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className={cn("w-full px-6 py-4 rounded-2xl font-bold outline-none transition-all border appearance-none cursor-pointer",
                    uiTheme === 'light' ? "bg-white border-slate-200 focus:ring-4 focus:ring-indigo-100" : 
                    uiTheme === 'dark' ? "bg-slate-800 border-slate-700 text-white" :
                    "bg-[#1a1a1a] border-amber-900/30 text-amber-100")}
                >
                  {Object.entries(t.units[activeType]).map(([val, label]) => (
                    <option key={val} value={val}>{label as string}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100/30 text-center">
              <p className={cn("text-xs font-bold", uiTheme === 'light' ? "text-indigo-600" : "text-indigo-400")}>
                Note: Currency rates are estimated. For critical conversions, please verify with your local bank.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
