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
import { db } from '../lib/firebase';
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
  orderBy
} from 'firebase/firestore';
import { useSecurity } from './SecurityGate';

export const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { isAdmin, logout } = useSecurity();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [keys, setKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyCoins, setNewKeyCoins] = useState(10);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'admin'));
      const adminData = settingsDoc.data();
      
      // Default initial password if not set
      const currentPassword = adminData?.adminPassword || 'maksudjr24';
      
      if (adminId === 'maksud' && password === currentPassword) {
        setIsLoggedIn(true);
        setError(null);
      } else {
        setError('Invalid Admin ID or Password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateKey = async () => {
    if (!newKeyName || newKeyCoins <= 0) return;
    setLoading(true);
    try {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      await addDoc(collection(db, 'keys'), {
        code,
        userName: newKeyName,
        coins: newKeyCoins,
        isUsed: false,
        createdAt: Timestamp.now()
      });
      setNewKeyName('');
      fetchKeys();
    } catch (err) {
      setError('Failed to generate key');
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

  const changePassword = async () => {
    if (!newPassword) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'admin'), { adminPassword: newPassword }, { merge: true });
      setIsChangingPassword(false);
      setNewPassword('');
      alert('Password changed successfully');
    } catch (err) {
      setError('Failed to change password');
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
              onClick={() => setIsChangingPassword(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
            >
              <Settings size={18} />
              Settings
            </button>
            <button 
              onClick={() => setIsLoggedIn(false)}
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
                disabled={loading || !newKeyName}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
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
                        <button 
                          onClick={() => deleteKey(k.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
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

      {/* Change Password Modal */}
      <AnimatePresence>
        {isChangingPassword && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsChangingPassword(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-6">Change Admin Password</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                    placeholder="Enter new password"
                  />
                </div>
                <button 
                  onClick={changePassword}
                  disabled={loading || !newPassword}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 transition-all"
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
