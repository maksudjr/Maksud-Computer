import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Users, Calculator, Wallet, Landmark, Gem, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

interface InheritanceCalculatorProps {
  onBack: () => void;
  uiTheme: 'light' | 'dark' | 'golden';
  language: 'en' | 'bn';
}

type Gender = 'male' | 'female';

interface Assets {
  cash: number;
  gold: number;
  land: number;
}

interface Heirs {
  husband: boolean;
  wife: boolean;
  father: boolean;
  mother: boolean;
  sons: number;
  daughters: number;
  grandsons: number;
  granddaughters: number;
  fullBrothers: number;
  fullSisters: number;
}

export const InheritanceCalculator: React.FC<InheritanceCalculatorProps> = ({ onBack, uiTheme, language }) => {
  const [deceasedGender, setDeceasedGender] = useState<Gender>('male');
  const [assets, setAssets] = useState<Assets>({ cash: 0, gold: 0, land: 0 });
  const [heirs, setHeirs] = useState<Heirs>({
    husband: false,
    wife: false,
    father: false,
    mother: false,
    sons: 0,
    daughters: 0,
    grandsons: 0,
    granddaughters: 0,
    fullBrothers: 0,
    fullSisters: 0
  });

  const t = {
    title: language === 'en' ? 'Inheritance Calculator' : 'উত্তরাধিকার ক্যালকুলেটর',
    deceasedInfo: language === 'en' ? "Deceased Info" : "মৃত ব্যক্তির তথ্য",
    gender: language === 'en' ? "Gender" : "লিঙ্গ",
    male: language === 'en' ? "Male" : "পুরুষ",
    female: language === 'en' ? "Female" : "মহিলা",
    assets: language === 'en' ? "Assets" : "সম্পদসমূহ",
    cash: language === 'en' ? "Cash (BDT)" : "নগদ টাকা (টাকা)",
    gold: language === 'en' ? "Gold (Bhori)" : "স্বর্ণ (ভরি)",
    land: language === 'en' ? "Land (Decimal)" : "জমি (শতাংশ)",
    heirs: language === 'en' ? "Heirs List" : "উত্তরাধিকারীর তালিকা",
    husband: language === 'en' ? "Husband" : "স্বামী",
    wife: language === 'en' ? "Wife" : "স্ত্রী",
    father: language === 'en' ? "Father" : "পিতা",
    mother: language === 'en' ? "Mother" : "মাতা",
    sons: language === 'en' ? "Sons" : "পুত্র",
    daughters: language === 'en' ? "Daughters" : "কন্যা",
    grandsons: language === 'en' ? "Grandsons (Son's son)" : "পুত্রপৌত্র (ছেলের ছেলে)",
    granddaughters: language === 'en' ? "Granddaughters (Son's daughter)" : "পৌত্রী (ছেলের মেয়ে)",
    fullBrothers: language === 'en' ? "Full Brothers" : "সহোদর ভাই",
    fullSisters: language === 'en' ? "Full Sisters" : "সহোদর বোন",
    calculate: language === 'en' ? "Calculate Shares" : "হিসাব করুন",
    results: language === 'en' ? "Distribution Results" : "বন্টন ফলাফল",
    relation: language === 'en' ? "Relation" : "সম্পর্ক",
    percentage: language === 'en' ? "Share (%)" : "অংশ (%)",
    amount: language === 'en' ? "Amount" : "পরিমাণ",
    total: language === 'en' ? "Total" : "মোট",
    back: language === 'en' ? "Back" : "ফিরে যান"
  };

  const calculateResults = useMemo(() => {
    const results: { relation: string, percentage: number, assets: Assets }[] = [];
    
    // Total portions (Zavil Furud)
    let totalAssigned = 0;
    
    // 1. Spouses
    if (deceasedGender === 'female' && heirs.husband) {
      const share = (heirs.sons > 0 || heirs.daughters > 0 || heirs.grandsons > 0 || heirs.granddaughters > 0) ? 1/4 : 1/2;
      results.push({ relation: t.husband, percentage: share * 100, assets: { cash: assets.cash * share, gold: assets.gold * share, land: assets.land * share } });
      totalAssigned += share;
    }
    
    if (deceasedGender === 'male' && heirs.wife) {
      const share = (heirs.sons > 0 || heirs.daughters > 0 || heirs.grandsons > 0 || heirs.granddaughters > 0) ? 1/8 : 1/4;
      results.push({ relation: t.wife, percentage: share * 100, assets: { cash: assets.cash * share, gold: assets.gold * share, land: assets.land * share } });
      totalAssigned += share;
    }

    // 2. Parents
    if (heirs.mother) {
      let share = 1/6;
      const hasChildren = heirs.sons > 0 || heirs.daughters > 0 || heirs.grandsons > 0 || heirs.granddaughters > 0;
      const multipleSiblings = (heirs.fullBrothers + heirs.fullSisters) >= 2;
      
      if (!hasChildren && !multipleSiblings) {
        share = 1/3;
        // Special case: Umariyatain (Gharrawain)
        if (deceasedGender === 'male' && heirs.wife && heirs.father && !hasChildren) share = (1 - 1/4) / 3;
        if (deceasedGender === 'female' && heirs.husband && heirs.father && !hasChildren) share = (1 - 1/2) / 3;
      }
      
      results.push({ relation: t.mother, percentage: share * 100, assets: { cash: assets.cash * share, gold: assets.gold * share, land: assets.land * share } });
      totalAssigned += share;
    }

    if (heirs.father) {
      const hasMaleChildren = heirs.sons > 0 || heirs.grandsons > 0;
      const hasOnlyFemaleChildren = (heirs.daughters > 0 || heirs.granddaughters > 0) && !hasMaleChildren;
      
      if (hasMaleChildren) {
        const share = 1/6;
        results.push({ relation: t.father, percentage: share * 100, assets: { cash: assets.cash * share, gold: assets.gold * share, land: assets.land * share } });
        totalAssigned += share;
      } else if (hasOnlyFemaleChildren) {
        // Shared between Zavil Furud and Asabah, handled later
      } else {
        // Solely Asabah, handled later
      }
    }

    // 3. Daughters (if no sons)
    if (heirs.daughters > 0 && heirs.sons === 0) {
      const share = heirs.daughters === 1 ? 1/2 : 2/3;
      const sharePerDaughter = share / heirs.daughters;
      results.push({ relation: `${t.daughters} (${heirs.daughters})`, percentage: share * 100, assets: { cash: assets.cash * share, gold: assets.gold * share, land: assets.land * share } });
      totalAssigned += share;
    }

    // Handling residuaries (Asabah)
    const residue = Math.max(0, 1 - totalAssigned);
    
    if (residue > 0) {
      if (heirs.sons > 0 || heirs.daughters > 0) {
        // Son = 2 * Daughter
        const totalShares = (heirs.sons * 2) + heirs.daughters;
        if (heirs.sons > 0) {
          const sonShare = (2 / totalShares) * residue;
          results.push({ relation: `${t.sons} (${heirs.sons})`, percentage: (sonShare * heirs.sons) * 100, assets: { cash: assets.cash * sonShare * heirs.sons, gold: assets.gold * sonShare * heirs.sons, land: assets.land * sonShare * heirs.sons } });
        }
        if (heirs.daughters > 0 && heirs.sons > 0) {
          const daughterShare = (1 / totalShares) * residue;
          results.push({ relation: `${t.daughters} (${heirs.daughters})`, percentage: (daughterShare * heirs.daughters) * 100, assets: { cash: assets.cash * daughterShare * heirs.daughters, gold: assets.gold * daughterShare * heirs.daughters, land: assets.land * daughterShare * heirs.daughters } });
        }
      } else if (heirs.father) {
        results.push({ relation: t.father, percentage: residue * 100, assets: { cash: assets.cash * residue, gold: assets.gold * residue, land: assets.land * residue } });
      } else if (heirs.grandsons > 0 || heirs.granddaughters > 0) {
        const totalShares = (heirs.grandsons * 2) + heirs.granddaughters;
        if (heirs.grandsons > 0) {
          const gSonShare = (2 / totalShares) * residue;
          results.push({ relation: `${t.grandsons} (${heirs.grandsons})`, percentage: (gSonShare * heirs.grandsons) * 100, assets: { cash: assets.cash * gSonShare * heirs.grandsons, gold: assets.gold * gSonShare * heirs.grandsons, land: assets.land * gSonShare * heirs.grandsons } });
        }
        if (heirs.granddaughters > 0) {
          const gDaughterShare = (1 / totalShares) * residue;
          results.push({ relation: `${t.granddaughters} (${heirs.granddaughters})`, percentage: (gDaughterShare * heirs.granddaughters) * 100, assets: { cash: assets.cash * gDaughterShare * heirs.granddaughters, gold: assets.gold * gDaughterShare * heirs.granddaughters, land: assets.land * gDaughterShare * heirs.granddaughters } });
        }
      }
    }

    return results;
  }, [assets, heirs, deceasedGender, t]);

  return (
    <div className={cn(
      "min-h-screen pt-20 pb-12 px-4 transition-colors duration-300",
      uiTheme === 'dark' ? "bg-slate-950" : (uiTheme === 'golden' ? "bg-[#0c0a09]" : "bg-slate-50")
    )}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              uiTheme === 'light' ? "bg-white text-slate-600 hover:bg-slate-100 shadow-sm" : "bg-slate-900 text-slate-400 hover:bg-slate-800"
            )}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className={cn(
              "text-2xl font-black uppercase tracking-tight",
              uiTheme === 'golden' ? "text-amber-500" : (uiTheme === 'dark' ? "text-white" : "text-slate-900")
            )}>
              {t.title}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <div className="space-y-6">
            {/* Deceased Gender */}
            <div className={cn(
              "p-6 rounded-3xl border transition-all",
              uiTheme === 'light' ? "bg-white border-slate-100 shadow-sm" : "bg-slate-900/50 border-slate-800 shadow-xl shadow-black/20"
            )}>
              <h3 className={cn("text-lg font-bold mb-4 flex items-center gap-2", uiTheme === 'golden' ? "text-amber-500" : (uiTheme === 'dark' ? "text-white" : "text-slate-900"))}>
                <Users size={20} className="text-indigo-500" />
                {t.deceasedInfo}
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeceasedGender('male')}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl font-bold transition-all border-2",
                    deceasedGender === 'male' 
                      ? (uiTheme === 'golden' ? "border-amber-600 bg-amber-600/10 text-amber-500" : "border-indigo-600 bg-indigo-600/10 text-indigo-600")
                      : (uiTheme === 'light' ? "border-slate-100 bg-slate-50 text-slate-500" : "border-slate-800 bg-slate-800/50 text-slate-400")
                  )}
                >
                  {t.male}
                </button>
                <button
                  onClick={() => setDeceasedGender('female')}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl font-bold transition-all border-2",
                    deceasedGender === 'female' 
                      ? (uiTheme === 'golden' ? "border-amber-600 bg-amber-600/10 text-amber-500" : "border-indigo-600 bg-indigo-600/10 text-indigo-600")
                      : (uiTheme === 'light' ? "border-slate-100 bg-slate-50 text-slate-500" : "border-slate-800 bg-slate-800/50 text-slate-400")
                  )}
                >
                  {t.female}
                </button>
              </div>
            </div>

            {/* Assets */}
            <div className={cn(
              "p-6 rounded-3xl border transition-all",
              uiTheme === 'light' ? "bg-white border-slate-100 shadow-sm" : "bg-slate-900/50 border-slate-800 shadow-xl shadow-black/20"
            )}>
              <h3 className={cn("text-lg font-bold mb-4 flex items-center gap-2", uiTheme === 'golden' ? "text-amber-500" : (uiTheme === 'dark' ? "text-white" : "text-slate-900"))}>
                <Wallet size={20} className="text-emerald-500" />
                {t.assets}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t.cash}</label>
                  <input
                    type="number"
                    value={assets.cash || ''}
                    onChange={(e) => setAssets({ ...assets, cash: Number(e.target.value) })}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl font-bold bg-transparent border-2 outline-none transition-all",
                      uiTheme === 'light' ? "border-slate-100 focus:border-indigo-600 text-slate-900" : "border-slate-800 focus:border-amber-600 text-white"
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t.gold}</label>
                    <input
                      type="number"
                      value={assets.gold || ''}
                      onChange={(e) => setAssets({ ...assets, gold: Number(e.target.value) })}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl font-bold bg-transparent border-2 outline-none transition-all",
                        uiTheme === 'light' ? "border-slate-100 focus:border-indigo-600 text-slate-900" : "border-slate-800 focus:border-amber-600 text-white"
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t.land}</label>
                    <input
                      type="number"
                      value={assets.land || ''}
                      onChange={(e) => setAssets({ ...assets, land: Number(e.target.value) })}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl font-bold bg-transparent border-2 outline-none transition-all",
                        uiTheme === 'light' ? "border-slate-100 focus:border-indigo-600 text-slate-900" : "border-slate-800 focus:border-amber-600 text-white"
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Heirs */}
            <div className={cn(
              "p-6 rounded-3xl border transition-all",
              uiTheme === 'light' ? "bg-white border-slate-100 shadow-sm" : "bg-slate-900/50 border-slate-800 shadow-xl shadow-black/20"
            )}>
              <h3 className={cn("text-lg font-bold mb-4 flex items-center gap-2", uiTheme === 'golden' ? "text-amber-500" : (uiTheme === 'dark' ? "text-white" : "text-slate-900"))}>
                <Layers size={20} className="text-purple-500" />
                {t.heirs}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {deceasedGender === 'female' && (
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-500">{t.husband}</label>
                    <input
                      type="checkbox"
                      checked={heirs.husband}
                      onChange={(e) => setHeirs({ ...heirs, husband: e.target.checked })}
                      className="w-5 h-5 accent-indigo-600"
                    />
                  </div>
                )}
                {deceasedGender === 'male' && (
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-500">{t.wife}</label>
                    <input
                      type="checkbox"
                      checked={heirs.wife}
                      onChange={(e) => setHeirs({ ...heirs, wife: e.target.checked })}
                      className="w-5 h-5 accent-indigo-600"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-500">{t.father}</label>
                  <input
                    type="checkbox"
                    checked={heirs.father}
                    onChange={(e) => setHeirs({ ...heirs, father: e.target.checked })}
                    className="w-5 h-5 accent-indigo-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-500">{t.mother}</label>
                  <input
                    type="checkbox"
                    checked={heirs.mother}
                    onChange={(e) => setHeirs({ ...heirs, mother: e.target.checked })}
                    className="w-5 h-5 accent-indigo-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-500">{t.sons}</label>
                  <input
                    type="number"
                    min="0"
                    value={heirs.sons || 0}
                    onChange={(e) => setHeirs({ ...heirs, sons: Number(e.target.value) })}
                    className={cn(
                      "w-16 px-2 py-1 rounded-lg text-center font-bold bg-transparent border-2 outline-none",
                      uiTheme === 'light' ? "border-slate-100" : "border-slate-800"
                    )}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-500">{t.daughters}</label>
                  <input
                    type="number"
                    min="0"
                    value={heirs.daughters || 0}
                    onChange={(e) => setHeirs({ ...heirs, daughters: Number(e.target.value) })}
                    className={cn(
                      "w-16 px-2 py-1 rounded-lg text-center font-bold bg-transparent border-2 outline-none",
                      uiTheme === 'light' ? "border-slate-100" : "border-slate-800"
                    )}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-500">{t.fullBrothers}</label>
                  <input
                    type="number"
                    min="0"
                    value={heirs.fullBrothers || 0}
                    onChange={(e) => setHeirs({ ...heirs, fullBrothers: Number(e.target.value) })}
                    className={cn(
                      "w-16 px-2 py-1 rounded-lg text-center font-bold bg-transparent border-2 outline-none",
                      uiTheme === 'light' ? "border-slate-100" : "border-slate-800"
                    )}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-500">{t.fullSisters}</label>
                  <input
                    type="number"
                    min="0"
                    value={heirs.fullSisters || 0}
                    onChange={(e) => setHeirs({ ...heirs, fullSisters: Number(e.target.value) })}
                    className={cn(
                      "w-16 px-2 py-1 rounded-lg text-center font-bold bg-transparent border-2 outline-none",
                      uiTheme === 'light' ? "border-slate-100" : "border-slate-800"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className={cn(
              "p-6 rounded-3xl border transition-all sticky top-24",
              uiTheme === 'light' ? "bg-white border-slate-100 shadow-sm" : "bg-slate-900/50 border-slate-800 shadow-xl shadow-black/20"
            )}>
              <h3 className={cn("text-lg font-bold mb-6 flex items-center gap-2", uiTheme === 'golden' ? "text-amber-500" : (uiTheme === 'dark' ? "text-white" : "text-slate-900"))}>
                <Calculator size={20} className="text-indigo-500" />
                {t.results}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 text-xs font-black uppercase tracking-widest text-slate-400 mb-2 pb-2 border-b border-slate-100/10">
                  <div>{t.relation}</div>
                  <div className="text-center">{t.percentage}</div>
                  <div className="text-right">{t.amount}</div>
                </div>

                {calculateResults.map((res, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={idx} 
                    className="grid grid-cols-3 items-center"
                  >
                    <div className={cn("text-sm font-bold", uiTheme === 'light' ? "text-slate-700" : "text-slate-300")}>{res.relation}</div>
                    <div className="text-center">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full font-black",
                        uiTheme === 'golden' ? "bg-amber-600/20 text-amber-500" : "bg-indigo-600/10 text-indigo-600"
                      )}>
                        {res.percentage.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-right space-y-1">
                      <div className={cn("text-sm font-black", uiTheme === 'light' ? "text-slate-900" : "text-white")}>
                        {res.assets.cash.toLocaleString()} ৳
                      </div>
                      <div className="text-[10px] font-bold text-slate-500">
                        {res.assets.gold.toFixed(2)} ভরি / {res.assets.land.toFixed(2)} শ শতাংশ
                      </div>
                    </div>
                  </motion.div>
                ))}

                {calculateResults.length === 0 && (
                  <div className="text-center py-12 text-slate-500 font-bold italic">
                    {language === 'en' ? 'No heirs selected' : 'কোন অংশীদার নির্বাচন করা হয়নি'}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black uppercase tracking-widest text-slate-500">{t.total}</span>
                  <div className="text-right">
                    <div className={cn("text-lg font-black", uiTheme === 'golden' ? "text-amber-500" : "text-indigo-600")}>
                      {assets.cash.toLocaleString()} ৳
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
