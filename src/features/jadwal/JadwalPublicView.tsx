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


export const JadwalPublicView = ({ onBack, masterRegions, jadwalList }) => {
  const [filterKel, setFilterKel] = useState('Semua');
  const availableKel = Object.keys(masterRegions).sort();
  const today = new Date().toISOString().split('T')[0];
  
  const filteredAndSortedJadwal = jadwalList
    .filter(j => filterKel === 'Semua' || j.desa === filterKel)
    .sort((a, b) => {
      const aIsPast = a.tgl < today;
      const bIsPast = b.tgl < today;
      if (aIsPast && !bIsPast) return 1;
      if (!aIsPast && bIsPast) return -1;
      return new Date(a.tgl).getTime() - new Date(b.tgl).getTime();
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans p-4 transition-colors relative">
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 mb-6 sm:mb-8 gap-2">
         <button onClick={onBack} className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-gray-700 font-bold cursor-pointer text-[10px] sm:text-base whitespace-nowrap shrink-0"><ChevronLeft size={14} className="sm:w-5 sm:h-5 shrink-0" /> <span className="hidden sm:inline">Kembali ke Beranda</span><span className="sm:hidden">Kembali</span></button>
         <div className="flex items-center justify-end gap-1.5 sm:gap-2 text-blue-600 dark:text-blue-400 font-black text-xs sm:text-xl whitespace-nowrap overflow-hidden text-right"><Calendar size={14} className="sm:w-6 sm:h-6 shrink-0" /> <span className="truncate">Agenda Posyandu</span></div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pb-20">
         <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Jadwal Posyandu Lansia</h2>
              <p className="text-gray-500 mt-4 text-sm sm:text-base">Pantau jadwal pelaksanaan kegiatan Posyandu Lansia di berbagai balai RW dan balai desa sekitar Anda.</p>
            </div>
            
            <div className="w-full md:w-auto flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
               <div className="px-3 text-gray-400"><MapPin size={18}/></div>
               <select value={filterKel} onChange={(e) => setFilterKel(e.target.value)} className="py-2.5 pr-8 bg-transparent text-sm font-bold text-gray-800 dark:text-gray-200 outline-none cursor-pointer">
                 <option value="Semua">Semua Wilayah</option>
                 {availableKel.map(opt => (<option key={opt} value={opt}>Desa/Kel. {opt}</option>))}
               </select>
            </div>
         </div>

         {filteredAndSortedJadwal.length > 0 ? (
           <div className="grid grid-cols-2 gap-2 sm:gap-6">
             {filteredAndSortedJadwal.map((jadwal) => {
                const dateObj = new Date(jadwal.tgl);
                const tglString = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                const isPast = jadwal.tgl < today;
                
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={jadwal.id} className={`bg-white dark:bg-gray-800 rounded-xl sm:rounded-3xl p-3 sm:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group flex flex-col ${isPast ? 'opacity-60 grayscale' : ''}`}>
                     <div className="flex flex-col sm:flex-row justify-between items-start mb-2 sm:mb-6 gap-2 sm:gap-0">
                        <div className="w-8 h-8 sm:w-14 sm:h-14 bg-blue-50 dark:bg-blue-900/30 rounded-lg sm:rounded-2xl flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110"><Calendar size={14} className="sm:w-7 sm:h-7" /></div>
                        <span className={`px-2 py-1 sm:px-3 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider w-fit ${isPast ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-700'}`}>{isPast ? 'Selesai' : 'Akan Datang'}</span>
                     </div>
                     <h4 className="text-xs sm:text-xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">Desa {jadwal.desa}</h4>
                     <p className="text-[10px] sm:text-sm font-bold text-gray-500 mb-2 sm:mb-6">Kader RW {jadwal.rw}</p>
                     
                     <div className="space-y-1.5 sm:space-y-3 text-[9px] sm:text-sm text-gray-600 dark:text-gray-300 font-medium bg-gray-50 dark:bg-gray-750/50 p-2 sm:p-4 rounded-lg sm:rounded-2xl border border-gray-100 dark:border-gray-700 mt-auto">
                        <div className="flex items-center gap-1.5 sm:gap-3"><Clock size={10} className="sm:w-4 sm:h-4 text-gray-400 shrink-0" /> <span className="line-clamp-1">{tglString} <span className="text-gray-300 mx-1 hidden sm:inline">•</span> <span className="hidden sm:inline">{jadwal.waktu}</span></span></div>
                        <div className="flex items-center gap-1.5 sm:gap-3"><MapPin size={10} className="sm:w-4 sm:h-4 text-gray-400 shrink-0" /> <span className="line-clamp-1">{jadwal.tempat}</span></div>
                     </div>
                  </motion.div>
                )
             })}
           </div>
         ) : (
           <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
              <Calendar size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Jadwal Kosong</h3>
              <p className="text-gray-500">Belum ada jadwal posyandu untuk wilayah yang dipilih.</p>
           </div>
         )}
      </div>
    </div>
  )
};

import { authClient } from '@/lib/auth-client';
