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
import { useCreateJadwal, useUpdateJadwal, useDeleteJadwal } from '@/hooks/queries/useJadwal';


export const AdminJadwalView = ({ masterRegions, jadwalData, setJadwalData, currentUser }) => {
  const createJadwalMutation = useCreateJadwal();
  const updateJadwalMutation = useUpdateJadwal();
  const deleteJadwalMutation = useDeleteJadwal();
  const [showAddForm, setShowAddForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const availableKel = Object.keys(masterRegions).sort();
  const [formData, setFormData] = useState({ desa: availableKel[0] || '', rw: '', tgl: '', waktu: '08:00', tempat: '' });
  const availableRW = formData.desa && masterRegions[formData.desa] ? Object.keys(masterRegions[formData.desa]).sort() : [];
  
  const filteredJadwal = currentUser?.role === 'Kader' 
    ? jadwalData.filter(j => j.desa === currentUser.kelurahan && j.rw === currentUser.rw)
    : currentUser?.role === 'Bidan'
      ? jadwalData.filter(j => j.desa === currentUser.kelurahan)
      : jadwalData;

  const updateForm = (key, value) => { setFormData(prev => { const newData = { ...prev, [key]: value }; if (key === 'desa') { newData.rw = ''; } return newData; }); };

  const [editingId, setEditingId] = useState(null);

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setErrorMsg('');
    setFormData({ desa: availableKel[0] || '', rw: '', tgl: '', waktu: '08:00', tempat: '' });
  };

  const handleEdit = (jadwal) => {
    setFormData({ desa: jadwal.desa, rw: jadwal.rw, tgl: jadwal.tgl, waktu: jadwal.waktu, tempat: jadwal.tempat });
    setEditingId(jadwal.id);
    setShowAddForm(true);
  };

  const handleSaveJadwal = async () => {
    if(!formData.desa || !formData.rw || !formData.tgl || !formData.waktu || !formData.tempat) {
      setErrorMsg('Mohon lengkapi seluruh kolom yang wajib diisi (*) sebelum menyimpan jadwal.');
      return;
    }
    setErrorMsg('');
    try {
      if (editingId) {
        await updateJadwalMutation.mutateAsync({ id: editingId, data: formData });
        setJadwalData(jadwalData.map(j => j.id === editingId ? { ...formData, id: editingId } : j));
      } else {
        const result = await createJadwalMutation.mutateAsync(formData);
        setJadwalData([...jadwalData, result]);
      }
      handleCancel();
    } catch (error) {
      alert('Gagal menyimpan jadwal ke server: ' + (error.message || ''));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJadwalMutation.mutateAsync(id);
      setJadwalData(jadwalData.filter(j => j.id !== id));
    } catch (error) {
      alert('Gagal menghapus jadwal dari server.');
    }
  };
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-900 rounded-3xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-extrabold flex items-center gap-3"><Calendar className="text-blue-300" size={32}/> Manajemen Jadwal Posyandu</h2>
        <p className="text-blue-100 mt-2">
          {currentUser?.role !== 'Kader' 
            ? 'Kelola agenda kegiatan posyandu. Jadwal yang Anda tambahkan di sini akan langsung tampil pada halaman publik aplikasi.' 
            : 'Pantau agenda kegiatan posyandu. Jadwal ini adalah jadwal resmi yang juga ditampilkan pada halaman publik aplikasi.'}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
          <h3 className="font-bold text-base sm:text-lg flex items-center gap-2"><MapPin className="text-blue-600 shrink-0"/> Daftar Agenda Tersimpan</h3>
          {currentUser?.role !== 'Kader' && (
            <Button variant="primary" icon={showAddForm ? X : Plus} onClick={() => showAddForm ? handleCancel() : setShowAddForm(true)} className="w-full sm:w-auto justify-center cursor-pointer bg-blue-600 hover:bg-blue-700 shadow-blue-200">{showAddForm ? 'Batal' : 'Jadwal Baru'}</Button>
          )}
        </div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-gray-700">
                <AnimatePresence>
                  {errorMsg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-4 text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-2">
                      <AlertCircle size={18} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                  <div className="lg:col-span-1"><label className="block text-xs font-semibold text-gray-500 mb-1">Desa/Kelurahan <span className="text-red-500">*</span></label><select value={formData.desa} onChange={e => { updateForm('desa', e.target.value); setErrorMsg(''); }} className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm dark:bg-gray-800 dark:border-gray-600 cursor-pointer">{availableKel.map(kel => <option key={kel} value={kel}>{kel}</option>)}</select></div>
                  <div className="lg:col-span-1"><label className="block text-xs font-semibold text-gray-500 mb-1">RW <span className="text-red-500">*</span></label><select value={formData.rw} onChange={e => { updateForm('rw', e.target.value); setErrorMsg(''); }} disabled={!formData.desa || availableRW.length === 0} className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm dark:bg-gray-800 dark:border-gray-600 cursor-pointer"><option value="">Pilih RW...</option>{availableRW.map(rw => <option key={rw} value={rw}>{rw}</option>)}</select></div>
                  <div className="lg:col-span-1"><label className="block text-xs font-semibold text-gray-500 mb-1">Tanggal <span className="text-red-500">*</span></label><input type="date" value={formData.tgl} onChange={e => { updateForm('tgl', e.target.value); setErrorMsg(''); }} className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm dark:bg-gray-800 dark:border-gray-600 cursor-pointer" /></div>
                  <div className="lg:col-span-1"><label className="block text-xs font-semibold text-gray-500 mb-1">Waktu <span className="text-red-500">*</span></label><input type="time" value={formData.waktu} onChange={e => { updateForm('waktu', e.target.value); setErrorMsg(''); }} className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm dark:bg-gray-800 dark:border-gray-600 cursor-pointer" /></div>
                  <div className="lg:col-span-1"><label className="block text-xs font-semibold text-gray-500 mb-1">Tempat/Lokasi <span className="text-red-500">*</span></label><input type="text" placeholder="Misal: Balai RW 01" value={formData.tempat} onChange={e => { updateForm('tempat', e.target.value); setErrorMsg(''); }} className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm dark:bg-gray-800 dark:border-gray-600" /></div>
                  <div className="lg:col-span-1"><Button variant="primary" onClick={handleSaveJadwal} className="w-full h-[42px] bg-blue-600 hover:bg-blue-700 cursor-pointer">{editingId ? 'Perbarui Jadwal' : 'Simpan Jadwal'}</Button></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Tanggal & Waktu</th><th className="px-6 py-4 font-semibold whitespace-nowrap">Wilayah (Desa - RW)</th><th className="px-6 py-4 font-semibold whitespace-nowrap">Lokasi Kegiatan</th><th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>{currentUser?.role !== 'Kader' && <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredJadwal.sort((a,b) => new Date(a.tgl).getTime() - new Date(b.tgl).getTime()).map((jadwal) => {
                 const isPast = jadwal.tgl < today;
                 return (
                  <tr key={jadwal.id} className={`hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors ${isPast ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Clock size={16} className="text-gray-400"/> {jadwal.tgl}</div><div className="text-xs text-gray-500 ml-6">Pukul {jadwal.waktu} WIB</div></td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap">Desa {jadwal.desa} <span className="text-gray-400 mx-1">-</span> RW {jadwal.rw}</td>
                    <td className="px-6 py-4 min-w-[200px]">{jadwal.tempat}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${isPast ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-700'}`}>{isPast ? 'Selesai' : 'Akan Datang'}</span></td>
                    {currentUser?.role !== 'Kader' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 cursor-pointer shrink-0" onClick={() => handleEdit(jadwal)} title="Edit Jadwal"><Edit2 size={16}/></Button>
                          <Button variant="ghost" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 cursor-pointer shrink-0" onClick={() => handleDelete(jadwal.id)} title="Hapus Jadwal"><Trash2 size={16}/></Button>
                        </div>
                      </td>
                    )}
                  </tr>
                 )
              })}
              {filteredJadwal.length === 0 && (<tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Belum ada data jadwal.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
};
