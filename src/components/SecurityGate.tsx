import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ShieldAlert, Key, X } from 'lucide-react';
import { Logo } from './Logo';

const SECURITY_CODES: Record<string, string> = {
  'MISSON12': 'MD MISSION',
  'HIMEL12': 'MD HIMEL',
  'MAKSUD12': 'MD MAKSUDUR RAHMAN'
};

const MAX_USAGE = 50;

interface SecurityContextType {
  isAuthorized: boolean;
  userName: string | null;
  usageCount: number;
  maxUsage: number;
  requestAccess: (onSuccess?: () => void) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) throw new Error('useSecurity must be used within a SecurityProvider');
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [showGate, setShowGate] = useState(false);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('maksud_auth');
    if (savedAuth) {
      const { name, code: savedCode } = JSON.parse(savedAuth);
      const usage = JSON.parse(localStorage.getItem('maksud_usage') || '{}');
      const currentUsage = usage[savedCode] || 0;

      if (currentUsage < MAX_USAGE) {
        setIsAuthorized(true);
        setUserName(name);
        setUsageCount(currentUsage);
      } else {
        localStorage.removeItem('maksud_auth');
      }
    }
  }, []);

  const requestAccess = (onSuccess?: () => void) => {
    if (isAuthorized) {
      onSuccess?.();
    } else {
      setOnSuccessCallback(() => onSuccess || null);
      setShowGate(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const upperCode = code.toUpperCase();
    const name = SECURITY_CODES[upperCode];

    if (name) {
      const usage = JSON.parse(localStorage.getItem('maksud_usage') || '{}');
      const currentUsage = usage[upperCode] || 0;

      if (currentUsage >= MAX_USAGE) {
        setError('CONTACT WITH ADMIN TO GET NEW KEY 01622638268');
        return;
      }

      const newUsageCount = currentUsage + 1;
      const newUsage = { ...usage, [upperCode]: newUsageCount };
      localStorage.setItem('maksud_usage', JSON.stringify(newUsage));
      localStorage.setItem('maksud_auth', JSON.stringify({ name, code: upperCode }));
      
      setUserName(name);
      setUsageCount(newUsageCount);
      setIsAuthorized(true);
      setError(null);
      setShowGate(false);
      setCode('');
      onSuccessCallback?.();
    } else {
      setError('Invalid security code. Please try again.');
    }
  };

  return (
    <SecurityContext.Provider value={{ isAuthorized, userName, usageCount, maxUsage: MAX_USAGE, requestAccess }}>
      {children}
      <AnimatePresence>
        {showGate && (
          <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 text-center relative"
            >
              <button 
                onClick={() => setShowGate(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex justify-center mb-8">
                <Logo className="w-20 h-20" />
              </div>
              
              <h1 className="text-3xl font-black text-slate-900 mb-2">Security Access</h1>
              <p className="text-slate-500 font-medium mb-8">Please enter your security code to access Maksud Computers tools.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key size={20} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter Security Code"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 uppercase tracking-widest"
                    required
                    autoFocus
                  />
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-left"
                  >
                    <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-sm font-bold text-red-700 leading-relaxed">{error}</p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 group"
                >
                  Access App
                  <Lock size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  © 2026 MAKSUD COMPUTERS
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SecurityContext.Provider>
  );
};
