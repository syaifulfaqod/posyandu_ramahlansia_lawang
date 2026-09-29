// @ts-nocheck
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { 
  Home, Users, ClipboardList, Activity, Settings, Menu, X, 
  Search, Filter, Plus, ChevronRight, ChevronLeft, Calendar, 
  MapPin, CheckCircle2, AlertCircle, FileText, ArrowRight,
  User, UserPlus, Activity as ActivityIcon, Brain, Eye, Ear, UserCheck,
  Stethoscope, FileDigit, Download, Upload, Sun, Moon, Wifi, WifiOff, RefreshCw,
  TrendingUp, TrendingDown, Clock, ArrowUpRight, Sparkles,
  Shield, Lock, Trash2, Edit2, LogOut, ChevronDown, Check, Smartphone, BarChart3, Database, BarChart2,
  HeartPulse
} from 'lucide-react';
import { Badge, Button, RadioGroup } from '@/components/ui/Shared';
import { authClient } from '@/lib/auth-client';
export const LoginView = ({ users, onLogin, onBackToHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const email = `${username}@posyandu.local`; // Map username to email
      
      // 1. Cek status lock sebelum mencoba login
      const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';
      const checkRes = await fetch(`${API_URL}/users/login-check?email=${encodeURIComponent(email)}`);
      if (!checkRes.ok) {
        throw new Error('Tidak dapat terhubung ke server backend (port 8080). Pastikan server backend sedang berjalan.');
      }
      const checkData = await checkRes.json();
      
      if (checkData.isLocked) {
        setError('Akun Anda telah dikunci karena gagal login 5 kali. Silakan hubungi Admin atau Ketua Kader.');
        setIsLoading(false);
        return;
      }

      // 2. Proses Login
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password
      });

      if (authError) {
        // 3. Catat kegagalan login
        let failedData: any = {};
        try {
          const failedRes = await fetch(`${API_URL}/users/login-failed`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ email })
          });
          if (failedRes.ok) {
            failedData = await failedRes.json();
          }
        } catch {
          // Abaikan kegagalan logging jika backend bermasalah
        }

        if (failedData.isLocked) {
          setError('Akun Anda telah dikunci karena gagal login 5 kali. Silakan hubungi Admin atau Ketua Kader.');
        } else {
          let msg = authError.message || 'Kredensial tidak valid. Periksa username dan password.';
          msg = msg.replace(/email/gi, 'username');
          // Tampilkan sisa percobaan
          const remaining = 5 - (failedData.attempts || 0);
          if (remaining > 0 && remaining < 5) {
            msg += ` (Sisa percobaan: ${remaining})`;
          }
          setError(msg);
        }
      } else if (data) {
        // 4. Reset counter jika sukses
        try {
          await fetch(`${API_URL}/users/login-success`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ email })
          });
        } catch {
          // Abaikan error reset counter
        }
        
        onLogin(data.user);
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      let errMsg = err.message || err.toString() || 'Terjadi kesalahan saat menghubungi server.';
      errMsg = errMsg.replace(/email/gi, 'username');
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900 font-sans p-4 sm:p-6 transition-colors relative">
      <button onClick={onBackToHome} className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer z-50"><ChevronLeft size={20} className="sm:w-6 sm:h-6" /></button>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="max-w-4xl w-full flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-3xl md:rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 mt-12 sm:mt-0">
        <div className="md:w-5/12 bg-gradient-to-br from-blue-700 to-indigo-900 p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden text-white shrink-0">
          <div className="absolute -top-24 -right-24 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 sm:w-64 sm:h-64 bg-blue-400/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col gap-4 sm:gap-6">
             <div className="flex items-center gap-2 sm:gap-3">
                 <div title="Pemerintah Kecamatan Lawang" className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                    <img src="/LOGO KECAMTAN LAWANG.png" alt="Logo Lawang" className="w-full h-full object-contain p-1 sm:p-1.5" />
                 </div>
                 <div title="Universitas Muhammadiyah Malang" className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                    <img src="/LOGO UMM.png" alt="Logo UMM" className="w-full h-full object-contain p-1 sm:p-1.5" />
                 </div>
                 <div title="KKN Ramah Lansia" className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                    <img src="/LOGO KKN RAMAH LANSIA TAHAP 1.png" alt="Logo KKN" className="w-full h-full object-contain p-1 sm:p-1.5" />
                 </div>
             </div>
             <span className="font-bold text-xl sm:text-3xl tracking-tight leading-tight">Posyandu Ramah Lansia Lawang</span>
          </div>

          <div className="relative z-10 mt-6 sm:mt-12 md:mt-0">
             <h2 className="text-xl sm:text-3xl font-extrabold mb-2 sm:mb-4">Sistem Pendataan Lansia Digital</h2>
             <p className="text-blue-50/90 leading-relaxed text-xs sm:text-sm">Transformasi pencatatan formulir kertas menjadi sistem digital terintegrasi untuk pelayanan Posyandu yang lebih efisien dan akurat.</p>
          </div>
        </div>

        <div className="md:w-7/12 p-6 sm:p-8 md:p-12 flex items-center">
           <div className="w-full max-w-md mx-auto">
             <div className="mb-6 sm:mb-8">
               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Selamat Datang 👋</h3>
               <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Silakan masuk ke akun Anda untuk melanjutkan pelayanan Posyandu.</p>
             </div>

             <AnimatePresence>
               {error && (
                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-3 mb-6 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-sm font-medium flex items-center gap-2">
                    <AlertCircle size={16} />{error}
                 </motion.div>
               )}
             </AnimatePresence>

             <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
               <div>
                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Username Akses</label>
                 <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User size={18} /></div>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Contoh: lestari.kader" required autoComplete="off" />
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                 <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={18} /></div>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="••••••••" required autoComplete="new-password" />
                 </div>
               </div>
               <div className="pt-4">
                 <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer">
                   {isLoading ? <RefreshCw size={20} className="animate-spin" /> : <>Masuk ke Sistem <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                 </button>
               </div>
             </form>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
