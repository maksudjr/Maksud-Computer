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
  Loader2,
  Minus,
  CreditCard
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
  where,
  orderBy,
  increment
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useSecurity } from './SecurityGate';

export const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { logout: securityLogout } = useSecurity();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [keys, setKeys] = useState<any[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyKeyword, setNewKeyKeyword] = useState('');
  const [newKeyCoins, setNewKeyCoins] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalNotice, setGlobalNotice] = useState('');
  const [isUpdatingNotice, setIsUpdatingNotice] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchKeys();
      fetchPaymentRequests();
      fetchGlobalNotice();
    }
  }, [isLoggedIn]);

  const fetchGlobalNotice = async () => {
    try {
      const noticeRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(noticeRef);
      if (docSnap.exists()) {
        setGlobalNotice(docSnap.data().notice || '');
      }
    } catch (err) {
      console.error("Error fetching notice:", err);
    }
  };

  const handleUpdateNotice = async () => {
    setIsUpdatingNotice(true);
    try {
      const noticeRef = doc(db, 'settings', 'global');
      await setDoc(noticeRef, { notice: globalNotice }, { merge: true });
      alert('Notice updated successfully!');
    } catch (err) {
      console.error("Error updating notice:", err);
      setError('Failed to update notice');
    } finally {
      setIsUpdatingNotice(false);
    }
  };

  const fetchPaymentRequests = async () => {
    try {
      const requestsRef = collection(db, 'paymentRequests');
      const q = query(requestsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setPaymentRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching payment requests:", err);
    }
  };

  const fetchKeys = async () => {
    const keysRef = collection(db, 'keys');
    const q = query(keysRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    setKeys(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Hardcoded credentials as requested by user
      if (adminId === 'maksud' && password === 'maksudjr24') {
        setIsLoggedIn(true);
      } else {
        setError('Invalid Admin ID or Password');
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminId('');
    setPassword('');
  };

  const generateKey = async () => {
    if (!newKeyName) {
      setError('Please enter a user name');
      return;
    }
    if (!newKeyKeyword) {
      setError('Please enter a keyword');
      return;
    }
    if (newKeyCoins <= 0) {
      setError('Coin amount must be greater than 0');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const code = newKeyKeyword.trim().toUpperCase();
      
      // Check if key already exists
      const keysRef = collection(db, 'keys');
      const q = query(keysRef, where("code", "==", code));
      const existing = await getDocs(q);
      
      if (!existing.empty) {
        setError('This keyword is already in use');
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'keys'), {
        code,
        userName: newKeyName,
        coins: newKeyCoins,
        freeTrialUsed: false,
        isUsed: false,
        createdAt: Timestamp.now()
      });
      setNewKeyName('');
      setNewKeyKeyword('');
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

  const deletePaymentRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'paymentRequests', id));
      fetchPaymentRequests();
    } catch (err) {
      setError('Failed to delete request');
    }
  };

  const adjustCoins = async (keyId: string, type: 'add' | 'subtract') => {
    const amount = prompt(`Enter amount of coins to ${type}:`, "10");
    if (!amount || isNaN(Number(amount))) return;
    
    const value = type === 'add' ? Number(amount) : -Number(amount);
    
    setLoading(true);
    try {
      await updateDoc(doc(db, 'keys', keyId), {
        coins: increment(value)
      });
      fetchKeys();
    } catch (err) {
      setError(`Failed to ${type} coins`);
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
          <p className="text-slate-500 text-center mb-8 font-medium">Access Maksud Computers control panel.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Admin ID</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  placeholder="Enter ID"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  placeholder="Enter Password"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-bold">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
              Login to Panel
            </button>
          </form>

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
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Keyword (Key Code)</label>
                <input 
                  type="text" 
                  value={newKeyKeyword}
                  onChange={(e) => setNewKeyKeyword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold uppercase"
                  placeholder="e.g. VIP2026"
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
                <Plus size={20} />
                Create Key
              </button>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200">
            <h3 className="text-lg font-black mb-2">Quick Tip</h3>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed">
              Keywords are custom codes you create. Once a user redeems a keyword, it becomes inactive and the coins are added to their account.
            </p>
          </div>

          {/* Global Notice Box */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="text-indigo-600" />
              Global Notice
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Notice Message</label>
                <textarea 
                  value={globalNotice}
                  onChange={(e) => setGlobalNotice(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold h-32 resize-none"
                  placeholder="Enter notice message for dashboard marquee..."
                />
              </div>
              <button 
                onClick={handleUpdateNotice}
                disabled={isUpdatingNotice}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUpdatingNotice ? <Loader2 className="animate-spin" /> : <Settings size={20} />}
                Update Global Notice
              </button>
            </div>
          </div>
        </div>

        {/* Key List */}
        <div className="lg:col-span-8 space-y-8">
          {/* Payment Requests */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-amber-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900">Payment Requests</h2>
              </div>
              <span className="px-3 py-1 bg-amber-100 rounded-full text-xs font-bold text-amber-600">
                {paymentRequests.length} Pending
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User / Key</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount / TrxID</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Mobile</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paymentRequests.map((r) => (
                    <tr key={`payment-${r.id}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <p className="font-bold text-slate-900">{r.fullName}</p>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{r.userKey}</p>
                      </td>
                      <td className="px-8 py-4">
                        <p className="font-black text-emerald-600">{r.amount} TK</p>
                        <p className="text-[10px] font-mono text-slate-400">{r.transactionId}</p>
                      </td>
                      <td className="px-8 py-4 font-bold text-slate-600">{r.mobileNo}</td>
                      <td className="px-8 py-4 text-[10px] font-bold text-slate-400">
                        {r.createdAt?.toDate().toLocaleString()}
                      </td>
                      <td className="px-8 py-4">
                        <button 
                          onClick={() => deletePaymentRequest(r.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-all"
                          title="Delete Request"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paymentRequests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-bold">
                        No pending payment requests.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
                    <tr key={`key-${k.id}`} className="hover:bg-slate-50/50 transition-colors">
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
                            onClick={() => adjustCoins(k.id, 'add')}
                            className="p-2 text-slate-400 hover:text-emerald-600 transition-all"
                            title="Add Coins"
                          >
                            <Plus size={18} />
                          </button>
                          <button 
                            onClick={() => adjustCoins(k.id, 'subtract')}
                            className="p-2 text-slate-400 hover:text-amber-600 transition-all"
                            title="Subtract Coins"
                          >
                            <Minus size={18} />
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
