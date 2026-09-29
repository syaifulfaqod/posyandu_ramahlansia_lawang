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
import { calculateAge } from '@/utils/helpers';

export const AddLansiaModal = ({ onClose, onSave, masterRegions, initialData = null, isKader = false, currentUser = null }) => {
  const availableKel = Object.keys(masterRegions).sort();
  const defaultKel = (isKader || currentUser?.role === 'Ketua Kader') && currentUser?.kelurahan ? currentUser.kelurahan : availableKel[0] || '';
  const defaultRW = (isKader || currentUser?.role === 'Ketua Kader') && currentUser?.rw ? currentUser.rw : '';
  
  const [formData, setFormData] = useState(initialData || {
    nama: '', nik: '', jk: 'P', tglLahir: '', alamat: '', kelurahan: defaultKel, rw: defaultRW, rt: '', golDarah: '-', statusKawin: 'Kawin', pekerjaan: ''
  });
  const [validationError, setValidationError] = useState('');

  const availableRW = formData.kelurahan && masterRegions[formData.kelurahan] ? Object.keys(masterRegions[formData.kelurahan]).sort() : [];
  const availableRT = formData.kelurahan && formData.rw && masterRegions[formData.kelurahan]?.[formData.rw] ? [...masterRegions[formData.kelurahan][formData.rw]].sort() : [];

  const updateForm = (key, value) => { setFormData(prev => { const newData = { ...prev, [key]: value }; if (key === 'kelurahan') { newData.rw = ''; newData.rt = ''; } if (key === 'rw') { newData.rt = ''; } return newData; }); };

  const handleSave = () => { 
    if(!formData.nik) { setValidationError('NIK wajib diisi.'); return; }
    if(formData.nik.length !== 16) { setValidationError('NIK harus 16 digit.'); return; }
    if(!formData.nama) { setValidationError('Nama Lengkap wajib diisi.'); return; }
    if(!formData.tglLahir) { setValidationError('Tanggal Lahir wajib diisi.'); return; }
    if(!formData.kelurahan) { setValidationError('Desa / Kelurahan wajib dipilih.'); return; }
    setValidationError('');
    onSave(formData); 
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="m-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90dvh]">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2"><UserPlus className="text-blue-600"/> {initialData ? 'Edit Data Lansia' : 'Pendaftaran Lansia Baru'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors cursor-pointer"><X size={20} /></button>
        </div>
        
        {validationError && (
          <div className="mx-4 sm:mx-6 md:mx-8 mt-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-center gap-2 text-sm font-semibold shrink-0">
             <AlertCircle size={16} /> {validationError}
          </div>
        )}

        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-4 sm:space-y-6 flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div><label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">NIK <span className="text-red-500">*</span></label><input type="text" value={isKader && initialData && formData.nik.length === 16 ? formData.nik.substring(0, 6) + '******' + formData.nik.substring(12) : formData.nik} onChange={e => updateForm('nik', e.target.value)} disabled={isKader && !!initialData} className={`w-full px-3 py-2 sm:p-3 text-sm sm:text-base rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none ${isKader && !!initialData ? 'opacity-70 cursor-not-allowed' : ''}`} placeholder="16 digit NIK" /></div>
            <div><label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Nama Lengkap <span className="text-red-500">*</span></label><input type="text" value={formData.nama} onChange={e => updateForm('nama', e.target.value)} className="w-full px-3 py-2 sm:p-3 text-sm sm:text-base rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama sesuai KTP" /></div>
            <RadioGroup label="Jenis Kelamin" options={[{label: 'Laki-laki', value: 'L'}, {label: 'Perempuan', value: 'P'}]} value={formData.jk} onChange={v => updateForm('jk', v)} />
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Tanggal Lahir <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="date" value={formData.tglLahir} onChange={e => updateForm('tglLahir', e.target.value)} className="w-full px-3 py-2 sm:p-3 text-sm sm:text-base rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                {formData.tglLahir && (<div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Usia: {calculateAge(formData.tglLahir)} thn</div>)}
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Golongan Darah</label>
                <select value={formData.golDarah || '-'} onChange={e => updateForm('golDarah', e.target.value)} className="w-full px-3 py-2 sm:p-3 text-sm sm:text-base rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                  <option value="-">- Tidak Tahu -</option><option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Status Perkawinan</label>
                <select value={formData.statusKawin || 'Belum Kawin'} onChange={e => updateForm('statusKawin', e.target.value)} className="w-full px-3 py-2 sm:p-3 text-sm sm:text-base rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                  <option value="Belum Kawin">Belum Kawin</option><option value="Kawin">Kawin</option><option value="Cerai Hidup">Cerai Hidup</option><option value="Cerai Mati">Cerai Mati</option>
                </select>
              </div>
              <div className="sm:col-span-2 md:col-span-1"><label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Pekerjaan</label><input type="text" value={formData.pekerjaan} onChange={e => updateForm('pekerjaan', e.target.value)} className="w-full px-3 py-2 sm:p-3 text-sm sm:text-base rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Pensiunan, Petani, dll" /></div>
            </div>
            <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 mt-1 sm:mt-2">
              <h4 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">Informasi Wilayah / Alamat</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Desa / Kelurahan <span className="text-red-500">*</span></label>
                  <select value={formData.kelurahan || ''} onChange={e => updateForm('kelurahan', e.target.value)} className="w-full px-3 py-2 sm:p-3 text-sm sm:text-base rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer disabled:bg-gray-100 disabled:opacity-50" disabled={(isKader || currentUser?.role === 'Ketua Kader') && !!currentUser?.kelurahan}>
                    <option value="" disabled>Pilih Desa/Kel...</option>{availableKel.map(kel => <option key={kel} value={kel}>{kel}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">RW</label>
                  <select value={formData.rw || ''} onChange={e => updateForm('rw', e.target.value)} disabled={(!formData.kelurahan || availableRW.length === 0) || ((isKader || currentUser?.role === 'Ketua Kader') && !!currentUser?.rw)} className="w-full px-3 py-2 sm:p-3 text-sm sm:text-base rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:opacity-50 cursor-pointer">
                    <option value="">Pilih RW...</option>{availableRW.map(rw => <option key={rw} value={rw}>{rw}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">RT</label>
                  <select value={formData.rt || ''} onChange={e => updateForm('rt', e.target.value)} disabled={!formData.rw || availableRT.length === 0} className="w-full px-3 py-2 sm:p-3 text-sm sm:text-base rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:opacity-50 cursor-pointer">
                    <option value="">Pilih RT...</option>{availableRT.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Alamat Detail</label><input type="text" value={formData.alamat || ''} onChange={e => updateForm('alamat', e.target.value)} className="w-full px-3 py-2 sm:p-3 text-sm sm:text-base rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama jalan, nomor rumah..." /></div>
            </div>
          </div>
        </div>
        
        <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/80 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 shrink-0">
          <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto cursor-pointer py-2 sm:py-3">Batal</Button>
          <Button variant="primary" icon={CheckCircle2} onClick={handleSave} className="w-full sm:w-auto justify-center cursor-pointer bg-blue-600 hover:bg-blue-700 shadow-blue-200 py-2 sm:py-3">Simpan Pendaftaran</Button>
        </div>
      </motion.div>
      </div>
    </Portal>
  );
};
