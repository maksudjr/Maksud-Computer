import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ShieldAlert, Key, X, User, Coins, LogOut, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { auth, db } from '../lib/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  getDocs,
  Timestamp,
  increment,
  runTransaction,
  addDoc
} from 'firebase/firestore';

interface SecurityContextType {
  isAuthorized: boolean;
  userName: string | null;
  coins: number;
  freeTrialUsed: boolean;
  isFreeAccess: boolean;
  isAdmin: boolean;
  activeKey: string | null;
  requestAccess: (cost: number, onSuccess: () => void, toolType?: string) => void;
  loginWithKey: (code: string) => Promise<void>;
  activateFreeAccess: () => Promise<void>;
  logout: () => void;
  error: string | null;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) throw new Error('useSecurity must be used within a SecurityProvider');
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [coins, setCoins] = useState(0);
  const [freeTrialUsed, setFreeTrialUsed] = useState(false);
  const [isFreeAccess, setIsFreeAccess] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ cost: number, onSuccess: () => void } | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedKey = localStorage.getItem('maksud_active_key');
    if (savedKey) {
      validateAndListenToKey(savedKey);
    } else {
      setLoading(false);
    }
  }, []);

  const validateAndListenToKey = async (keyCode: string) => {
    try {
      const keysRef = collection(db, 'keys');
      const q = query(keysRef, where("code", "==", keyCode.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        localStorage.removeItem('maksud_active_key');
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      const keyDoc = querySnapshot.docs[0];
      const data = keyDoc.data();
      
      setUserName(data.userName);
      setCoins(data.coins || 0);
      setFreeTrialUsed(data.freeTrialUsed || false);
      setIsFreeAccess(data.isFreeAccess || false);
      setActiveKey(keyCode.toUpperCase());
      setIsAuthorized(true);

      // Listen for real-time updates to this key
      const unsub = onSnapshot(keyDoc.ref, (docSnap) => {
        if (docSnap.exists()) {
          const updatedData = docSnap.data();
          setCoins(updatedData.coins || 0);
          setFreeTrialUsed(updatedData.freeTrialUsed || false);
          setIsFreeAccess(updatedData.isFreeAccess || false);
        } else {
          logout();
        }
      });

      setLoading(false);
      return unsub;
    } catch (e) {
      console.error("Error validating key", e);
      setLoading(false);
    }
  };

  const loginWithKey = async (inputCode: string) => {
    setError(null);
    try {
      const keysRef = collection(db, 'keys');
      const q = query(keysRef, where("code", "==", inputCode.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid security key.");
        return;
      }

      const keyDoc = querySnapshot.docs[0];
      const data = keyDoc.data();

      localStorage.setItem('maksud_active_key', inputCode.toUpperCase());
      setUserName(data.userName);
      setCoins(data.coins || 0);
      setFreeTrialUsed(data.freeTrialUsed || false);
      setActiveKey(inputCode.toUpperCase());
      setIsAuthorized(true);
      setShowGate(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setCode('');

      if (pendingAction) {
        const action = pendingAction;
        setPendingAction(null);
        requestAccess(action.cost, action.onSuccess, undefined, true, true, data.coins || 0, data.freeTrialUsed || false);
      }

      // Start listening
      validateAndListenToKey(inputCode.toUpperCase());
    } catch (e) {
      setError("Failed to connect. Please try again.");
    }
  };

  const requestAccess = async (cost: number, onSuccess: () => void, toolType?: string, bypassAuthCheck: boolean = false, currentAuth?: boolean, currentCoins?: number, currentFreeTrial?: boolean) => {
    const effectiveAuth = currentAuth !== undefined ? currentAuth : isAuthorized;
    const effectiveCoins = currentCoins !== undefined ? currentCoins : coins;
    const effectiveFreeTrial = currentFreeTrial !== undefined ? currentFreeTrial : freeTrialUsed;

    if (cost === 0) {
      onSuccess();
      return;
    }

    if (!effectiveAuth && !bypassAuthCheck) {
      setShowGate(true);
      setPendingAction({ cost, onSuccess });
      return;
    }

    // Check free trial (for paid keys)
    if (!effectiveFreeTrial && !isFreeAccess) {
      try {
        const keysRef = collection(db, 'keys');
        const q = query(keysRef, where("code", "==", activeKey));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          await updateDoc(querySnapshot.docs[0].ref, { freeTrialUsed: true });
          onSuccess();
          return;
        }
      } catch (e) {
        console.error("Error using free trial", e);
      }
    }

    // Check coins (handles both paid and free access keys)
    if (effectiveCoins >= cost) {
      try {
        const keysRef = collection(db, 'keys');
        const q = query(keysRef, where("code", "==", activeKey));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          await updateDoc(querySnapshot.docs[0].ref, { coins: increment(-cost) });
          onSuccess();
        }
      } catch (e) {
        console.error("Error deducting coins", e);
        setError("Transaction failed. Please try again.");
      }
    } else {
      setError(`Insufficient coins. This tool requires ${cost} coins.`);
      setShowGate(true);
      setPendingAction({ cost, onSuccess });
    }
  };

  const activateFreeAccess = async () => {
    const lastClaim = localStorage.getItem('maksud_free_claimed_date');
    const today = new Date().toDateString();
    
    if (lastClaim === today) {
      setError("You have already claimed your free access today. Please try again tomorrow.");
      setShowGate(true);
      return;
    }

    setLoading(true);
    try {
      const code = "FREE-" + Math.random().toString(36).substring(2, 7).toUpperCase();
      const keysRef = collection(db, 'keys');
      const newKey = {
        code,
        userName: "Free Guest",
        coins: 1,
        freeTrialUsed: true,
        isFreeAccess: true,
        createdAt: Timestamp.now()
      };
      
      await addDoc(keysRef, newKey);
      localStorage.setItem('maksud_active_key', code);
      localStorage.setItem('maksud_free_claimed_date', today);
      
      setUserName(newKey.userName);
      setCoins(1);
      setFreeTrialUsed(true);
      setIsFreeAccess(true);
      setActiveKey(code);
      setIsAuthorized(true);
      
      // Start listening
      validateAndListenToKey(code);
    } catch (e) {
      console.error("Error activating free access", e);
      setError("Failed to activate free access. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('maksud_active_key');
    setIsAuthorized(false);
    setActiveKey(null);
    setUserName(null);
    setCoins(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <SecurityContext.Provider value={{ 
      isAuthorized, 
      userName, 
      coins,
      freeTrialUsed,
      isFreeAccess,
      isAdmin: false, // Admin is handled separately in AdminPanel
      activeKey,
      requestAccess,
      loginWithKey,
      activateFreeAccess,
      logout,
      error
    }}>
      {children}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[1000] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl font-black flex items-center gap-3"
          >
            <ShieldCheck size={24} />
            Login Successful! Welcome back.
          </motion.div>
        )}
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
              
              <h1 className="text-3xl font-black text-slate-900 mb-2">Access Required</h1>
              <p className="text-slate-500 font-medium mb-8">
                {error ? <span className="text-red-500 font-bold">{error}</span> : "Please enter your security key to continue."}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); loginWithKey(code); }} className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key size={20} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter Security Key"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 uppercase tracking-widest"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 group"
                >
                  Access Tool
                  <Lock size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </form>

              <div className="mt-8 p-4 bg-indigo-50 rounded-2xl text-left">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Need a key?</p>
                <p className="text-sm font-medium text-slate-600">
                  Contact admin: <span className="font-bold text-slate-900">01622638268</span> or <span className="font-bold text-slate-900">maksudjr2020@gmail.com</span>
                </p>
              </div>

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
