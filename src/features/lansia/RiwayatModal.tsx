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
import { Portal } from '@/components/ui/Wrappers';


export const RiwayatModal = ({ patient, onClose, onCompletePemeriksaan, isKader }) => {
  const riwayatList = patient.riwayat || (patient.lastVisit !== 'Belum pernah' ? [{
    tglKunjungan: patient.lastVisit, bb: patient.bb || '-', tb: patient.tb || '-',
    tdSistole: patient.tdSistole || '-', tdDiastole: patient.tdDiastole || '-',
    gulaDarah: patient.gulaDarah || '-', kolesterol: patient.kolesterol || '-', asamUrat: patient.asamUrat || '-',
    skilas: patient.skilas, aks: patient.aks, puma: patient.puma, status: patient.status
  }] : []);

  const displayNik = isKader && patient.nik.length === 16 ? patient.nik.substring(0, 6) + '******' + patient.nik.substring(12) : patient.nik;

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="m-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[95dvh]">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 flex items-center justify-center font-bold text-lg">{patient.nama.charAt(0)}</div>
             <div>
               <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">Riwayat Pemeriksaan: {patient.nama}</h2>
               <p className="text-sm text-gray-500">NIK: {displayNik} &bull; {patient.usia} Tahun &bull; {patient.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
               {patient.status === 'Meninggal' && patient.keteranganMeninggal && (
                 <p className="text-sm text-red-600 font-medium mt-1">Keterangan Meninggal: {patient.keteranganMeninggal}</p>
               )}
             </div>
          </div>
          <div className="flex items-center gap-3">
             {patient.status !== 'Meninggal' && (
               <Button variant="primary" icon={Plus} onClick={() => onCompletePemeriksaan(null)} className="bg-blue-600 hover:bg-blue-700 shadow-sm text-xs py-1.5 px-3 cursor-pointer">Riwayat Baru</Button>
             )}
             <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors cursor-pointer"><X size={20} /></button>
          </div>
        </div>
        
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6 bg-gray-50/30 dark:bg-gray-900 custom-scrollbar">
           {riwayatList.length > 0 ? (
             <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-x-auto bg-white dark:bg-gray-800 shadow-sm">
               <table className="w-full text-left border-collapse text-sm min-w-[1000px]">
                 <thead>
                   <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                     <th className="px-4 py-3 font-bold whitespace-nowrap">Tgl Kunjungan</th>
                     <th className="px-4 py-3 font-bold whitespace-nowrap">BB/TB/IMT</th>
                     <th className="px-4 py-3 font-bold text-center whitespace-nowrap">Tensi (mmHg)</th>
                     <th className="px-4 py-3 font-bold text-center whitespace-nowrap">Lab & EKG</th>
                     <th className="px-4 py-3 font-bold text-center whitespace-nowrap">Indera</th>
                     <th className="px-4 py-3 font-bold text-center whitespace-nowrap">SKILAS</th>
                     <th className="px-4 py-3 font-bold text-center whitespace-nowrap">AKS</th>
                     <th className="px-4 py-3 font-bold text-center whitespace-nowrap">PUMA</th>
                     <th className="px-4 py-3 font-bold whitespace-nowrap">Status</th>
                     <th className="px-4 py-3 font-bold text-center whitespace-nowrap">Aksi</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {riwayatList.map((riwayat, idx) => (
                     <React.Fragment key={idx}>
                        <tr onClick={() => patient.status !== 'Meninggal' && onCompletePemeriksaan(idx)} className={`transition-colors group ${patient.status !== 'Meninggal' ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer' : 'opacity-70'}`}>
                          <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                            {riwayat.tglKunjungan && riwayat.tglKunjungan !== 'Belum pernah' ? (() => {
                              const d = new Date(riwayat.tglKunjungan);
                              const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
                              return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                            })() : '-'}
                          </td>
                         <td className="px-4 py-3"><div className="font-medium">{riwayat.bb}kg / {riwayat.tb}cm</div></td>
                         <td className="px-4 py-3 text-center font-medium">{riwayat.tdSistole}/{riwayat.tdDiastole}</td>
                         <td className="px-4 py-3 text-center">
                           <div className="text-[10px] text-gray-500 whitespace-nowrap">Gula: <span className="font-bold text-gray-800 dark:text-gray-300">{riwayat.gulaDarah || '-'}</span> | Kol: <span className="font-bold text-gray-800 dark:text-gray-300">{riwayat.kolesterol || '-'}</span></div>
                           <div className="text-[10px] text-gray-500 whitespace-nowrap">AU: <span className="font-bold text-gray-800 dark:text-gray-300">{riwayat.asamUrat || '-'}</span></div>
                         </td>
                         <td className="px-4 py-3 text-center">
                           <div className="text-[10px] text-gray-500 whitespace-nowrap">Mata: <span className="font-bold text-gray-800 dark:text-gray-300">{riwayat.mataKanan?.charAt(0) || '-'}/{riwayat.mataKiri?.charAt(0) || '-'}</span></div>
                           <div className="text-[10px] text-gray-500 whitespace-nowrap">Telinga: <span className="font-bold text-gray-800 dark:text-gray-300">{riwayat.telingaKanan?.charAt(0) || '-'}/{riwayat.telingaKiri?.charAt(0) || '-'}</span></div>
                         </td>
                         <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-md text-[10px] font-bold ${riwayat.skilas === 'Normal' ? 'bg-emerald-50 text-emerald-600' : riwayat.skilas === 'Abnormal' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{riwayat.skilas || '-'}</span></td>
                         <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-md text-[10px] font-bold ${riwayat.aks >= 20 ? 'bg-emerald-50 text-emerald-600' : riwayat.aks > 0 ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>{riwayat.aks || '-'}</span></td>
                         <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-md text-[10px] font-bold ${riwayat.puma <= 6 && riwayat.puma > 0 ? 'bg-emerald-50 text-emerald-600' : riwayat.puma > 6 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{riwayat.puma || '-'}</span></td>
                         <td className="px-4 py-3"><Badge type={riwayat.status || 'Default'}>{riwayat.status || '-'}</Badge></td>
                         <td className="px-4 py-3 text-center">
                           {patient.status !== 'Meninggal' ? (
                             <Button variant="ghost" className="text-blue-600 px-2 py-1 text-xs cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 font-bold flex items-center gap-1" onClick={(e) => { e.stopPropagation(); onCompletePemeriksaan(idx); }} title="Edit Detail Pemeriksaan">
                               <Edit2 size={14}/> Edit
                             </Button>
                           ) : (
                             <span className="text-gray-400 text-xs italic">Terkunci</span>
                           )}
                         </td>
                       </tr>
                       {riwayat.catatan && (
                         <tr key={`note-${idx}`} className="bg-amber-50/50 dark:bg-amber-900/10">
                           <td colSpan={10} className="px-6 py-2 text-xs text-gray-700 dark:text-gray-300 border-l-4 border-amber-400">
                             <b>Catatan:</b> {riwayat.catatan}
                           </td>
                         </tr>
                       )}
                     </React.Fragment>
                   ))}
                 </tbody>
               </table>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FileText size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <p>Belum ada riwayat pemeriksaan untuk pasien ini.</p>
             </div>
           )}
        </div>
      </motion.div>
      </div>
    </Portal>
  );
};
