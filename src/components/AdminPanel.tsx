import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Key, 
  User, 
  Coins, 
  Plus, 
  Trash2, 
  Lock, 
  X, 
  ArrowLeft,
  Settings,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  LogOut,
  LogIn,
  Loader2
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  getDoc,
  setDoc,
  Timestamp,
  query,
  orderBy,
  increment
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { useSecurity } from './SecurityGate';

export const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { logout: securityLogout } = useSecurity();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keys, setKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyCoins, setNewKeyCoins] = useState(10);
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAIL = "maksudjr2020@gmail.com";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.email === ADMIN_EMAIL && user.emailVerified) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchKeys();
    }
  }, [isLoggedIn]);

  const fetchKeys = async () => {
    const keysRef = collection(db, 'keys');
    const q = query(keysRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    setKeys(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== ADMIN_EMAIL) {
        await auth.signOut();
        setError('Access Denied: You are not authorized as an admin.');
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setIsLoggedIn(false);
  };

  const generateKey = async () => {
    if (!newKeyName) {
      setError('Please enter a user name');
      return;
    }
    if (newKeyCoins <= 0) {
      setError('Coin amount must be greater than 0');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      await addDoc(collection(db, 'keys'), {
        code,
        userName: newKeyName,
        coins: newKeyCoins,
        freeTrialUsed: false,
        isUsed: false,
        createdAt: Timestamp.now()
      });
      setNewKeyName('');
      fetchKeys();
    } catch (err) {
      console.error("Error generating key", err);
      setError('Failed to generate key. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const deleteKey = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'keys', id));
      fetchKeys();
    } catch (err) {
      setError('Failed to delete key');
    }
  };

  const addCoinsToKey = async (keyId: string) => {
    const amount = prompt("Enter amount of coins to add:", "10");
    if (!amount || isNaN(Number(amount))) return;
    
    setLoading(true);
    try {
      await updateDoc(doc(db, 'keys', keyId), {
        coins: increment(Number(amount))
      });
      fetchKeys();
    } catch (err) {
      setError('Failed to add coins');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <ShieldCheck size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 text-center mb-2">Admin Login</h1>
          <p className="text-slate-500 text-center mb-8 font-medium">Sign in with your admin Google account.</p>

          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-bold">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Sign in with Google
            </button>
          </div>

          <button 
            onClick={onBack}
            className="w-full mt-6 py-4 text-slate-400 hover:text-slate-600 font-bold transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <h1 className="text-2xl font-black text-slate-900">Admin Control Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Key Generator */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="text-indigo-600" />
              Generate New Key
            </h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">User Name</label>
                <input 
                  type="text" 
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  placeholder="e.g. MD MISSION"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Coin Amount</label>
                <input 
                  type="number" 
                  value={newKeyCoins}
                  onChange={(e) => setNewKeyCoins(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  placeholder="10"
                />
              </div>
              <button 
                onClick={generateKey}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Key size={20} />
                Generate Key
              </button>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200">
            <h3 className="text-lg font-black mb-2">Quick Tip</h3>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed">
              Keys are unique 8-character codes. Once a user redeems a key, it becomes inactive and the coins are added to their account.
            </p>
          </div>
        </div>

        {/* Key List */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Active & Used Keys</h2>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">
                {keys.length} Total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Code</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Coins</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {keys.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                          {k.code}
                        </span>
                      </td>
                      <td className="px-8 py-4 font-bold text-slate-700">{k.userName}</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-1 font-black text-slate-900">
                          <Coins size={14} className="text-amber-500" />
                          {k.coins}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        {k.isUsed ? (
                          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase">Used</span>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase">Active</span>
                        )}
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => addCoinsToKey(k.id)}
                            className="p-2 text-slate-400 hover:text-amber-600 transition-all"
                            title="Add Coins"
                          >
                            <Plus size={18} />
                          </button>
                          <button 
                            onClick={() => deleteKey(k.id)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-all"
                            title="Delete Key"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {keys.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-bold">
                        No keys generated yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
