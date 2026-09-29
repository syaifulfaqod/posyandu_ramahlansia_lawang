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
import { useCreateUser, useDeleteUser, useUpdateUser, useUnlockUser } from '@/hooks/queries/useUsers';
import { useCreateRegion, useDeleteKelurahan, useDeleteRW, useDeleteRT } from '@/hooks/queries/useRegions';
import { AdminJadwalView } from './AdminJadwalView';
import { AdminBeritaView } from './AdminBeritaView';

export const AdminView = ({ masterRegions, setMasterRegions, users, currentUser }) => {
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const unlockUserMutation = useUnlockUser();
  const createRegionMutation = useCreateRegion();
  const deleteKelurahanMutation = useDeleteKelurahan();
  const deleteRWMutation = useDeleteRW();
  const deleteRTMutation = useDeleteRT();
  
  const isKetua = currentUser?.role === 'Ketua Kader';
  const [activeTab, setActiveTab] = useState(isKetua ? 'pengguna' : 'wilayah');
  
  const visibleUsers = isKetua 
    ? users.filter(u => u.role === 'Kader' && u.kelurahan === currentUser?.kelurahan && u.rw === currentUser?.rw)
    : users;

  const [selectedKel, setSelectedKel] = useState(Object.keys(masterRegions)[0] || '');
  const [selectedRW, setSelectedRW] = useState(masterRegions[selectedKel] ? Object.keys(masterRegions[selectedKel])[0] : '');
  const [newInput, setNewInput] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [userErrorMsg, setUserErrorMsg] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  
  const availableKelForUser = isKetua ? [currentUser.kelurahan] : Object.keys(masterRegions).sort();
  const [newUser, setNewUser] = useState({ nama: '', username: '', password: '', role: 'Kader', kelurahan: isKetua ? currentUser.kelurahan : (availableKelForUser[0] || ''), rw: isKetua ? currentUser.rw : '' });
  const availableRWForUser = isKetua ? [currentUser.rw] : (newUser.kelurahan && masterRegions[newUser.kelurahan] ? Object.keys(masterRegions[newUser.kelurahan]).sort() : []);

  const handleNameChange = (e) => {
    setUserErrorMsg('');
    const nama = e.target.value;
    
    if (editingUserId) {
      setNewUser({ ...newUser, nama });
      return;
    }
    
    const baseUsername = nama.toLowerCase().replace(/[^a-z0-9]/g, '');
    let username = baseUsername;
    let counter = 1;
    while (users.some(u => u.username === username)) {
      username = `${baseUsername}${counter}`;
      counter++;
    }
    
    setNewUser({ ...newUser, nama, username });
  };

  useEffect(() => {
    if (masterRegions[selectedKel]) { const rws = Object.keys(masterRegions[selectedKel]); setSelectedRW(rws.length > 0 ? rws[0] : ''); } else { setSelectedRW(''); }
  }, [selectedKel, masterRegions]);

  const handleAddWilayah = async (type) => {
    if (!newInput.trim()) return;
    
    try {
      if (type === 'Kelurahan') {
        await createRegionMutation.mutateAsync({ kelurahan: newInput });
      } else {
        const count = parseInt(newInput, 10);
        if (!isNaN(count) && count > 0 && count < 100) {
          if (type === 'RW') {
            for (let i = 1; i <= count; i++) {
              const val = String(i).padStart(2, '0');
              if (!masterRegions[selectedKel]?.[val]) {
                await createRegionMutation.mutateAsync({ kelurahan: selectedKel, rw: val });
              }
            }
          } else if (type === 'RT') {
            for (let i = 1; i <= count; i++) {
              const val = String(i).padStart(2, '0');
              if (!masterRegions[selectedKel]?.[selectedRW]?.includes(val)) {
                await createRegionMutation.mutateAsync({ kelurahan: selectedKel, rw: selectedRW, rt: val });
              }
            }
          }
        } else {
          if (type === 'RW') {
            if (!masterRegions[selectedKel]?.[newInput]) {
              await createRegionMutation.mutateAsync({ kelurahan: selectedKel, rw: newInput });
            }
          } else if (type === 'RT') {
            if (!masterRegions[selectedKel]?.[selectedRW]?.includes(newInput)) {
              await createRegionMutation.mutateAsync({ kelurahan: selectedKel, rw: selectedRW, rt: newInput });
            }
          }
        }
      }
      setNewInput('');
    } catch (error) {
      alert(`Gagal menambahkan wilayah: ${error.message || 'Terjadi kesalahan pada server.'}`);
    }
  };

  const handleDeleteWilayah = async (type, kelName, rwName, rtName, e) => {
    e.stopPropagation(); 
    
    try {
      if (type === 'Kelurahan') { 
        await deleteKelurahanMutation.mutateAsync(kelName);
        if (selectedKel === kelName) { setSelectedKel(''); setSelectedRW(''); } 
      } else if (type === 'RW') { 
        await deleteRWMutation.mutateAsync({ kelurahan: kelName, rw: rwName });
        if (selectedRW === rwName) { setSelectedRW(''); } 
      } else if (type === 'RT') { 
        await deleteRTMutation.mutateAsync({ kelurahan: kelName, rw: rwName, rt: rtName });
      }
    } catch (error) {
      alert(`Gagal menghapus wilayah: ${error.message || 'Terjadi kesalahan pada server.'}`);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.nama || !newUser.username || !newUser.password) {
      setUserErrorMsg('Mohon lengkapi seluruh kolom yang wajib diisi (*) sebelum menyimpan akun.');
      return;
    }
    
    let userToSave = { ...newUser };
    
    if (userToSave.role === 'Admin') {
       delete userToSave.kelurahan;
       delete userToSave.rw;
    } else if (userToSave.role === 'Bidan') {
       if (!userToSave.kelurahan) {
         setUserErrorMsg('Bidan wajib memiliki Kelurahan tugas.');
         return;
       }
       delete userToSave.rw;
    } else {
       if (!userToSave.kelurahan || !userToSave.rw) {
         setUserErrorMsg('Kader wajib memiliki Kelurahan dan RW tugas.');
         return;
       }
    }
    
    if (userToSave.password && userToSave.password.length < 8) {
       setUserErrorMsg("Password wajib minimal 8 karakter!");
       return;
    }
    
    setUserErrorMsg('');
    
    try {
      if (editingUserId) {
        await updateUserMutation.mutateAsync({ id: editingUserId, data: userToSave });
      } else {
        await createUserMutation.mutateAsync(userToSave);
      }
      setShowAddUser(false); 
      setEditingUserId(null);
      setNewUser({ nama: '', username: '', password: '', role: 'Kader', kelurahan: availableKelForUser[0] || '', rw: '' });
    } catch (error) {
      alert(`Gagal menyimpan pengguna: ${error.message || 'Pastikan username belum digunakan.'}`);
    }
  };

  const handleEditUser = (user) => {
    setNewUser({
      nama: user.nama,
      username: user.username,
      password: '', // Blank password means do not update
      role: user.role,
      kelurahan: user.kelurahan || (isKetua ? currentUser.kelurahan : (availableKelForUser[0] || '')),
      rw: user.rw || (isKetua ? currentUser.rw : '')
    });
    setEditingUserId(user.id);
    setShowAddUser(true);
    setUserErrorMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportUser = async () => {
    const { exportUsersExcelZip } = await import('@/utils/excelUserExport');
    const todayFormatted = new Date().toISOString().split('T')[0];
    await exportUsersExcelZip(visibleUsers, todayFormatted);
  };

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete?.isPermanent) {
      alert("Akun ini adalah akun permanen dan tidak dapat dihapus.");
      return;
    }
    if (window.confirm("Apakah Anda benar-benar yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        await deleteUserMutation.mutateAsync(userId);
      } catch (error) {
        alert("Gagal menghapus pengguna.");
      }
    }
  };

  const handleUnlockUser = async (userId) => {
    if (window.confirm("Buka kunci akun ini agar pengguna dapat login kembali?")) {
      try {
        await unlockUserMutation.mutateAsync(userId);
        alert("Akun berhasil dibuka.");
      } catch (error) {
        alert("Gagal membuka kunci akun.");
      }
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-extrabold flex items-center gap-3"><Shield className="text-emerald-400" size={32}/> {isKetua ? 'Manajemen Anggota Kader' : 'Pengaturan Sistem'}</h2>
        <p className="text-gray-300 mt-2">{isKetua ? 'Kelola akun kader di wilayah tugas Anda.' : 'Kelola master data wilayah operasional dan hak akses pengguna aplikasi Posyandu Care+.'}</p>
      </div>
      {!isKetua && (
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-px">
          <button onClick={() => setActiveTab('wilayah')} className={`pb-4 px-2 font-bold text-sm transition-colors border-b-2 cursor-pointer ${activeTab === 'wilayah' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}><div className="flex items-center gap-2"><MapPin size={18}/> Manajemen Wilayah</div></button>
          <button onClick={() => setActiveTab('pengguna')} className={`pb-4 px-2 font-bold text-sm transition-colors border-b-2 cursor-pointer ${activeTab === 'pengguna' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}><div className="flex items-center gap-2"><Users size={18}/> Manajemen Pengguna</div></button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'wilayah' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><MapPin size={18} className="text-emerald-500"/> Desa / Kelurahan</h3>
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
                {Object.keys(masterRegions).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map(kel => (
                  <div key={kel} onClick={() => setSelectedKel(kel)} className={`group p-3 rounded-xl cursor-pointer font-medium transition-all flex justify-between items-center ${selectedKel === kel ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-gray-50 text-gray-700 border border-transparent hover:bg-gray-100 dark:bg-gray-750 dark:text-gray-300'}`}>
                    <span className="truncate">{kel}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={(e) => handleDeleteWilayah('Kelurahan', kel, null, null, e)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"><Trash2 size={14}/></button>
                      {selectedKel === kel && <ChevronRight size={16} />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-auto">
                <input type="text" placeholder="Desa / Kel Baru" value={activeTab === 'wilayah' ? newInput : ''} onChange={(e) => setNewInput(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm outline-none focus:border-emerald-500" />
                <Button variant="primary" onClick={() => handleAddWilayah('Kelurahan')} className="px-3 cursor-pointer"><Plus size={18}/></Button>
              </div>
            </div>
            <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-opacity ${!selectedKel ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><Home size={18} className="text-blue-500"/> RW (Rukun Warga)</h3>
              <p className="text-xs text-gray-500 mb-3">Di Desa/Kel: <span className="font-bold text-emerald-600">{selectedKel || '-'}</span></p>
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
                {selectedKel && masterRegions[selectedKel] && Object.keys(masterRegions[selectedKel]).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map(rw => (
                  <div key={rw} onClick={() => setSelectedRW(rw)} className={`group p-3 rounded-xl cursor-pointer font-medium transition-all flex justify-between items-center ${selectedRW === rw ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' : 'bg-gray-50 text-gray-700 border border-transparent hover:bg-gray-100 dark:bg-gray-750 dark:text-gray-300'}`}>
                    <span>RW {rw}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={(e) => handleDeleteWilayah('RW', selectedKel, rw, null, e)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"><Trash2 size={14}/></button>
                      {selectedRW === rw && <ChevronRight size={16} />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-auto">
                <input type="text" placeholder="Jml/Nama RW Baru" value={newInput} onChange={(e) => setNewInput(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm outline-none focus:border-blue-500" />
                <Button variant="secondary" onClick={() => handleAddWilayah('RW')} className="px-3 border-blue-200 text-blue-600 hover:bg-blue-50 cursor-pointer"><Plus size={18}/></Button>
              </div>
            </div>
            <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-opacity ${!selectedRW ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><Users size={18} className="text-amber-500"/> RT (Rukun Tetangga)</h3>
              <p className="text-xs text-gray-500 mb-3">Di RW: <span className="font-bold text-emerald-600">{selectedRW || '-'}</span></p>
              <div className="flex flex-wrap gap-2 mb-4 max-h-60 overflow-y-auto">
                {selectedKel && selectedRW && masterRegions[selectedKel]?.[selectedRW] && [...masterRegions[selectedKel][selectedRW]].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true })).map(rt => (
                  <div key={rt} className="group px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm border border-gray-200 dark:border-gray-600 flex items-center gap-2">
                    RT {rt}
                    <button onClick={(e) => handleDeleteWilayah('RT', selectedKel, selectedRW, rt, e)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-0.5 -mr-1 rounded cursor-pointer"><Trash2 size={14}/></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-auto">
                <input type="text" placeholder="Jml/Nama RT Baru" value={newInput} onChange={(e) => setNewInput(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm outline-none focus:border-amber-500" />
                <Button variant="secondary" onClick={() => handleAddWilayah('RT')} className="px-3 border-amber-200 text-amber-600 hover:bg-amber-50 cursor-pointer"><Plus size={18}/></Button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'pengguna' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2"><Lock className="text-emerald-600 shrink-0"/> Daftar Akun Aplikasi</h3>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="secondary" icon={Download} onClick={handleExportUser} className="w-full sm:w-auto justify-center cursor-pointer bg-white dark:bg-gray-800">Ekspor Akun</Button>
                <Button variant="primary" icon={showAddUser ? X : Plus} onClick={() => {
                  setShowAddUser(!showAddUser);
                  if (showAddUser) {
                    setEditingUserId(null);
                    setNewUser({ nama: '', username: '', password: '', role: 'Kader', kelurahan: availableKelForUser[0] || '', rw: '' });
                    setUserErrorMsg('');
                  }
                }} className="w-full sm:w-auto justify-center cursor-pointer bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200">{showAddUser ? 'Batal' : 'Tambah Akun'}</Button>
              </div>
            </div>
            <AnimatePresence>
              {showAddUser && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 border-b border-emerald-100 dark:border-gray-700 flex flex-col gap-4">
                    <AnimatePresence>
                      {userErrorMsg && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-2">
                          <AlertCircle size={18} className="shrink-0" />
                          <span>{userErrorMsg}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                      <div className="sm:col-span-2"><label className="block text-xs font-semibold text-gray-500 mb-1">Nama Lengkap <span className="text-red-500">*</span></label><input type="text" value={newUser.nama} onChange={handleNameChange} className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 text-sm dark:bg-gray-800 dark:border-gray-600" placeholder="Ketik nama untuk buat akun..." /></div>
                      <div><label className="block text-xs font-semibold text-gray-500 mb-1">Username (Otomatis) <span className="text-red-500">*</span></label><input type="text" value={newUser.username} readOnly className="w-full p-2.5 rounded-xl border border-gray-200 outline-none text-sm dark:bg-gray-900 dark:border-gray-700 bg-gray-50 text-gray-500 cursor-not-allowed" /></div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Password <span className="text-red-500">*</span></label>
                        <input type="text" value={newUser.password} onChange={e => { setNewUser({...newUser, password: e.target.value}); setUserErrorMsg(''); }} className="w-full p-2.5 rounded-xl border border-gray-200 outline-none text-sm dark:bg-gray-900 dark:border-gray-700 focus:border-emerald-500" placeholder="Ketik kata sandi..." />
                      </div>
                      <div><label className="block text-xs font-semibold text-gray-500 mb-1">Hak Akses (Role) <span className="text-red-500">*</span></label><select value={newUser.role} onChange={e => { setNewUser({...newUser, role: e.target.value}); setUserErrorMsg(''); }} disabled={isKetua} className={`w-full p-2.5 rounded-xl border border-gray-200 outline-none text-sm dark:bg-gray-800 dark:border-gray-600 ${isKetua ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:border-emerald-500 cursor-pointer'}`}><option value="Kader">Kader Posyandu</option><option value="Ketua Kader">Ketua Kader</option><option value="Bidan">Bidan</option><option value="Admin">Admin Sistem</option></select></div>
                    </div>
                    {newUser.role === 'Admin' && (
                      <div className="flex gap-2 mt-2"><Button variant="primary" onClick={handleAddUser} className="w-full sm:w-auto px-8 h-[42px] cursor-pointer bg-emerald-600 hover:bg-emerald-700">{editingUserId ? 'Simpan Perubahan Admin' : 'Simpan Akun Admin'}</Button></div>
                    )}
                    {(newUser.role === 'Kader' || newUser.role === 'Bidan' || newUser.role === 'Ketua Kader') && (
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end bg-white dark:bg-gray-800 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <div className="sm:col-span-1"><label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Kelurahan Tugas <span className="text-red-500">*</span></label><select value={newUser.kelurahan || ''} onChange={e => { setNewUser({...newUser, kelurahan: e.target.value, rw: ''}); setUserErrorMsg(''); }} disabled={isKetua} className={`w-full p-2.5 rounded-xl border outline-none text-sm dark:bg-gray-800 ${isKetua ? 'border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 cursor-not-allowed' : 'border-emerald-200 focus:border-emerald-500 dark:border-emerald-800 cursor-pointer'}`}>{availableKelForUser.map(kel => <option key={kel} value={kel}>{kel}</option>)}</select></div>
                        {(newUser.role === 'Kader' || newUser.role === 'Ketua Kader') && (
                          <div className="sm:col-span-1"><label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">RW Tugas <span className="text-red-500">*</span></label><select value={newUser.rw || ''} onChange={e => { setNewUser({...newUser, rw: e.target.value}); setUserErrorMsg(''); }} disabled={isKetua || !newUser.kelurahan} className={`w-full p-2.5 rounded-xl border outline-none text-sm dark:bg-gray-800 ${isKetua ? 'border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 cursor-not-allowed' : 'border-emerald-200 focus:border-emerald-500 dark:border-emerald-800 cursor-pointer'}`}><option value="">Pilih RW...</option>{availableRWForUser.map(rw => <option key={rw} value={rw}>{rw}</option>)}</select></div>
                        )}
                        <div className={`sm:col-span-1 hidden sm:block ${newUser.role === 'Bidan' ? 'sm:col-span-2' : ''}`}></div>
                        <div className="sm:col-span-1 flex gap-2"><Button variant="primary" onClick={handleAddUser} className="w-full h-[42px] cursor-pointer bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 text-white border-0">{editingUserId ? 'Simpan Perubahan' : `Simpan ${newUser.role}`}</Button></div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Nama & Username</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Role</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Aktivitas Terakhir</th>
                    <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {visibleUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4"><div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>{user.nama.charAt(0)}</div>{user.nama}</div><div className="text-xs text-gray-500 ml-10">@{user.username}</div></td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          <Badge type={user.role === 'Admin' ? 'Rujuk' : 'Normal'}>{user.role}</Badge>
                          {(user.role === 'Kader' || user.role === 'Ketua Kader') && user.kelurahan && (
                            <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full mt-1 border border-gray-200 dark:border-gray-600 whitespace-nowrap">
                              RW {user.rw || '-'} {user.kelurahan}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.isLocked ? (
                          <div className="flex items-center gap-1.5 text-red-600 font-bold bg-red-50 dark:bg-red-900/30 px-2.5 py-1 rounded-lg w-fit">
                            <Lock size={14} /> Terkunci
                          </div>
                        ) : (
                          user.lastLogin
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {user.isLocked && (
                            <button onClick={() => handleUnlockUser(user.id)} className="p-2 text-white bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-xl transition-all cursor-pointer shadow-sm shadow-blue-200 dark:shadow-none" title="Buka Kunci Akun"><Check size={16}/></button>
                          )}
                          {(!user.isPermanent || user.id === currentUser?.id) && (
                            <button onClick={() => handleEditUser(user)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-all cursor-pointer" title="Edit Akun"><Edit2 size={16}/></button>
                          )}
                          {!user.isPermanent && (
                            <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all cursor-pointer" title="Hapus Akun"><Trash2 size={16}/></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
