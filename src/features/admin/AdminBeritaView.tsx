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
import { useCreateBerita, useUpdateBerita, useDeleteBerita } from '@/hooks/queries/useBerita';


const AdminBeritaView = ({ beritaData, setBeritaData, currentUser }) => {
  const createBeritaMutation = useCreateBerita();
  const updateBeritaMutation = useUpdateBerita();
  const deleteBeritaMutation = useDeleteBerita();
  const [showAddForm, setShowAddForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({ title: '', date: '', category: 'Kegiatan', excerpt: '', image: '', content: '' });
  const [editingId, setEditingId] = useState(null);

  const updateForm = (k, v) => {
    setFormData(p => ({ ...p, [k]: v }));
    setErrorMsg('');
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateForm('image', reader.result);
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = async () => {
    if (!formData.title || !formData.date || !formData.category || !formData.image || !formData.excerpt || !formData.content) {
      setErrorMsg('Mohon lengkapi seluruh kolom yang wajib diisi (*) termasuk gambar sampul sebelum menerbitkan berita.');
      return;
    }
    setErrorMsg('');
    try {
      if (editingId) {
        await updateBeritaMutation.mutateAsync({ id: editingId, data: formData });
        setBeritaData(beritaData.map(b => b.id === editingId ? { ...formData, id: editingId, author: b.author } : b));
      } else {
        const { date, ...dataToSave } = formData;
        const payload = { ...dataToSave, authorId: currentUser?.id };
        const result = await createBeritaMutation.mutateAsync(payload);
        setBeritaData([{ ...result, author: currentUser?.name || 'Admin' }, ...beritaData]);
      }
      setShowAddForm(false);
      setEditingId(null);
      setErrorMsg('');
      setFormData({ title: '', date: '', category: 'Kegiatan', excerpt: '', image: '', content: '' });
    } catch (error) {
      alert('Gagal menyimpan berita ke server: ' + (error.message || ''));
    }
  };
  
  const handleEdit = (b) => {
    setFormData({ title: b.title, date: b.date, category: b.category, excerpt: b.excerpt, image: b.image, content: b.content });
    setEditingId(b.id);
    setShowAddForm(true);
  };
  
  const handleDelete = async (id) => {
    try {
      await deleteBeritaMutation.mutateAsync(id);
      setBeritaData(beritaData.filter(b => b.id !== id));
    } catch (error) {
      alert('Gagal menghapus berita dari server.');
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-800 rounded-3xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-extrabold flex items-center gap-3"><FileText className="text-violet-300" size={32}/> Manajemen Berita</h2>
        <p className="text-violet-100 mt-2">
          {currentUser?.role !== 'Kader'
            ? 'Kelola berita, informasi, atau artikel kegiatan posyandu lansia yang akan tampil di halaman utama.'
            : 'Pantau berita, informasi, atau artikel kegiatan posyandu lansia yang saat ini ditampilkan di halaman utama.'}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
          <h3 className="font-bold text-lg flex items-center gap-2"><ClipboardList className="text-violet-500"/> Daftar Berita</h3>
          {currentUser?.role !== 'Kader' && (
            <Button variant="primary" icon={showAddForm ? X : Plus} onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); setFormData({ title: '', date: '', category: 'Kegiatan', excerpt: '', image: '', content: '' }); }} className="cursor-pointer bg-violet-600 hover:bg-violet-700 shadow-violet-200">{showAddForm ? 'Batal' : 'Tulis Berita'}</Button>
          )}
        </div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-6 bg-violet-50/50 dark:bg-violet-900/10 border-b border-violet-100 dark:border-gray-700 flex flex-col gap-5">
                <AnimatePresence>
                  {errorMsg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-2">
                      <AlertCircle size={18} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-gray-500 mb-1">Judul Berita <span className="text-red-500">*</span></label><input type="text" value={formData.title} onChange={e => updateForm('title', e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-violet-500 text-sm dark:bg-gray-800 dark:border-gray-600" /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 mb-1">Tanggal <span className="text-red-500">*</span></label><input type="date" value={formData.date} onChange={e => updateForm('date', e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-violet-500 text-sm dark:bg-gray-800 dark:border-gray-600" /></div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Kategori <span className="text-red-500">*</span></label>
                    <select value={formData.category} onChange={e => updateForm('category', e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-violet-500 text-sm dark:bg-gray-800 dark:border-gray-600 cursor-pointer">
                      <option value="Kegiatan">Kegiatan</option><option value="Kesehatan">Kesehatan</option><option value="Edukasi">Edukasi</option><option value="Pengumuman">Pengumuman</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Unggah Gambar Sampul <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-3">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 rounded-xl border border-gray-200 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer dark:bg-gray-800 dark:border-gray-600 dark:file:bg-violet-900/30 dark:file:text-violet-400" />
                      {formData.image && <img src={formData.image} alt="Preview" className="h-10 w-10 object-cover rounded-md border border-gray-200 shrink-0" />}
                    </div>
                  </div>
                </div>
                <div><label className="block text-xs font-semibold text-gray-500 mb-1">Ringkasan (Tampil di Landing Page) <span className="text-red-500">*</span></label><textarea value={formData.excerpt} onChange={e => updateForm('excerpt', e.target.value)} rows={2} className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-violet-500 text-sm dark:bg-gray-800 dark:border-gray-600" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 mb-1">Isi Berita Lengkap <span className="text-red-500">*</span></label><textarea value={formData.content} onChange={e => updateForm('content', e.target.value)} rows={4} className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-violet-500 text-sm dark:bg-gray-800 dark:border-gray-600" /></div>
                <div className="flex flex-col sm:flex-row justify-end gap-2"><Button variant="primary" onClick={handleSave} className="w-full sm:w-auto justify-center bg-violet-600 hover:bg-violet-700 cursor-pointer">{editingId ? 'Simpan Perubahan' : 'Terbitkan Berita'}</Button></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 font-semibold whitespace-nowrap w-24">Tanggal</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Judul & Kategori</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Penulis</th>
                {currentUser?.role !== 'Kader' && <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {beritaData.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.date}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 dark:text-white mb-1">{b.title}</div>
                    <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold">{b.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.author}</td>
                  {currentUser?.role !== 'Kader' && (
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="ghost" className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 cursor-pointer inline-flex" onClick={() => handleEdit(b)} title="Edit"><Edit2 size={16}/></Button>
                      <Button variant="ghost" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 cursor-pointer inline-flex ml-2" onClick={() => handleDelete(b.id)} title="Hapus"><Trash2 size={16}/></Button>
                    </td>
                  )}
                </tr>
              ))}
              {beritaData.length === 0 && (<tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">Belum ada berita diterbitkan.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export { AdminBeritaView };
