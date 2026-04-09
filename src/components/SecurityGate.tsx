import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ShieldAlert, Key, X, LogIn, User, Coins, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { auth, db, signInWithGoogle } from '../lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  getDocs,
  Timestamp,
  increment,
  runTransaction
} from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const MAX_USAGE = 50;

interface SecurityContextType {
  isAuthorized: boolean;
  userName: string | null;
  coins: number;
  freeTrialUsed: boolean;
  isAdmin: boolean;
  requestAccess: (cost: number, onSuccess: () => void) => void;
  redeemKey: (code: string) => Promise<void>;
  logout: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) throw new Error('useSecurity must be used within a SecurityProvider');
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ cost: number, onSuccess: () => void } | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Check for admin status
        setIsAdmin(firebaseUser.email === "maksudjr2020@gmail.com");
        
        // Listen to user data
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // Initialize user
            const initialData = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              coins: 0,
              freeTrialUsed: false,
              createdAt: Timestamp.now()
            };
            setDoc(userDocRef, initialData);
            setUserData(initialData);
          }
        });
        setLoading(false);
        return () => unsubDoc();
      } else {
        setUserData(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const requestAccess = async (cost: number, onSuccess: () => void) => {
    if (!user) {
      setShowGate(true);
      setPendingAction({ cost, onSuccess });
      return;
    }

    if (cost === 0) {
      onSuccess();
      return;
    }

    // Check free trial
    if (!userData?.freeTrialUsed) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { freeTrialUsed: true });
        onSuccess();
        return;
      } catch (e) {
        console.error("Error using free trial", e);
      }
    }

    // Check coins
    if ((userData?.coins || 0) >= cost) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { coins: increment(-cost) });
        onSuccess();
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

  const redeemKey = async (inputCode: string) => {
    if (!user) {
      setError("Please login first to redeem a key.");
      return;
    }

    try {
      const keysRef = collection(db, 'keys');
      const q = query(keysRef, where("code", "==", inputCode.toUpperCase()), where("isUsed", "==", false));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid or already used key.");
        return;
      }

      const keyDoc = querySnapshot.docs[0];
      const keyData = keyDoc.data();

      await runTransaction(db, async (transaction) => {
        transaction.update(keyDoc.ref, { 
          isUsed: true, 
          usedBy: user.uid, 
          usedAt: Timestamp.now() 
        });
        transaction.update(doc(db, 'users', user.uid), { 
          coins: increment(keyData.coins) 
        });
      });

      setError(null);
      setCode('');
      if (pendingAction) {
        const action = pendingAction;
        setPendingAction(null);
        setShowGate(false);
        requestAccess(action.cost, action.onSuccess);
      }
    } catch (e) {
      console.error("Error redeeming key", e);
      setError("Failed to redeem key. Please try again.");
    }
  };

  const logout = () => auth.signOut();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <SecurityContext.Provider value={{ 
      isAuthorized: !!user, 
      userName: userData?.name || user?.displayName || null, 
      coins: userData?.coins || 0,
      freeTrialUsed: userData?.freeTrialUsed || false,
      isAdmin,
      requestAccess,
      redeemKey,
      logout
    }}>
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
              
              {!user ? (
                <>
                  <h1 className="text-3xl font-black text-slate-900 mb-2">Login Required</h1>
                  <p className="text-slate-500 font-medium mb-8">Please login with Google to access Maksud Computers tools.</p>
                  <button
                    onClick={() => signInWithGoogle()}
                    className="w-full py-4 bg-white border-2 border-slate-200 hover:border-indigo-600 text-slate-900 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 group"
                  >
                    <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Google" />
                    Login with Google
                  </button>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-black text-slate-900 mb-2">Add Coins</h1>
                  <p className="text-slate-500 font-medium mb-8">
                    {error ? <span className="text-red-500 font-bold">{error}</span> : "Enter a security key to add coins to your account."}
                  </p>

                  <form onSubmit={(e) => { e.preventDefault(); redeemKey(code); }} className="space-y-6">
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
                      Redeem Key
                      <Coins size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </form>

                  <div className="mt-8 p-4 bg-indigo-50 rounded-2xl text-left">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Need more coins?</p>
                    <p className="text-sm font-medium text-slate-600">
                      Contact admin: <span className="font-bold text-slate-900">01622638268</span> or <span className="font-bold text-slate-900">maksudjr2020@gmail.com</span>
                    </p>
                  </div>
                </>
              )}

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
