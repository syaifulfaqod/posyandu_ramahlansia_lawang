// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { 
  Home, Users, ClipboardList, Activity, Settings, Menu, X, 
  Search, Filter, Plus, ChevronRight, ChevronLeft, Calendar, 
  MapPin, CheckCircle2, AlertCircle, FileText, ArrowRight,
  User, UserPlus, Activity as ActivityIcon, Brain, Eye, Ear, UserCheck,
  Stethoscope, FileDigit, Download, Upload, Sun, Moon, Wifi, WifiOff, RefreshCw,
  TrendingUp, TrendingDown, Clock, ArrowUpRight, Sparkles,
  Shield, Lock, Trash2, Edit2, LogOut, ChevronDown, Check, Smartphone, BarChart3, Database, PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/Shared';

import { useGetRegions } from '@/hooks/queries/useRegions';
import { useGetStats } from '@/hooks/queries/useStats';
import { initialLansiaData, initialMasterRegions, initialUsers, initialJadwalData, initialBeritaData, POSYANDU_NAME, TODAY } from '@/constants/mockData'; // we need to make sure initialBeritaData is there, if not it'll fail, but we'll see
import { calculateAge } from '@/utils/helpers';

import { DashboardView } from '@/features/dashboard/DashboardView';
import { LandingPageView } from '@/features/dashboard/LandingPageView';
import { RekapStatistikView } from '@/features/dashboard/RekapStatistikView';
import { DataLansiaView } from '@/features/lansia/DataLansiaView';
import { JadwalPublicView } from '@/features/jadwal/JadwalPublicView';
import { BeritaPublicView } from '@/features/berita/BeritaPublicView';
import { EdukasiPublicView } from '@/features/edukasi/EdukasiPublicView';
import { LoginView } from '@/features/auth/LoginView';
import { AdminBeritaView } from '@/features/admin/AdminBeritaView'; 
import { AdminJadwalView } from '@/features/admin/AdminJadwalView';
import { AdminView } from '@/features/admin/AdminView';
import { PemeriksaanWizard } from '@/features/pemeriksaan/PemeriksaanWizard';

import { useGetLansia, useCreateLansia, useUpdateLansia, useDeleteLansia } from '@/hooks/queries/useLansia';
import { useGetUsers } from '@/hooks/queries/useUsers';
import { useGetJadwal } from '@/hooks/queries/useJadwal';
import { useGetBerita } from '@/hooks/queries/useBerita';
import { useCreatePemeriksaan, useUpdatePemeriksaan } from '@/hooks/queries/usePemeriksaan';
import { authClient } from '@/lib/auth-client';

export default function App() {
  const [isMounted, setIsMounted] = useState(false);
  const [appState, setAppState] = useState('landing');
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Authentication via Better Auth
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user || null;

  useEffect(() => {
    const savedState = localStorage.getItem('posyandu_appState');
    const savedView = localStorage.getItem('posyandu_currentView');
    
    if (savedState) setAppState(savedState);
    if (savedView) setCurrentView(savedView);
    
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('posyandu_appState', appState);
      localStorage.setItem('posyandu_currentView', currentView);
    }
  }, [appState, currentView, isMounted]);

  // Sync appState with session automatically
  useEffect(() => {
    if (!isPending && isMounted) {
      if (currentUser && appState === 'login') {
        setAppState('dashboard');
      } else if (!currentUser && appState !== 'landing' && appState !== 'login' && appState !== 'jadwal' && appState !== 'berita' && appState !== 'edukasi') {
        setAppState('landing');
      }
    }
  }, [currentUser, isPending, isMounted, appState]);
  
  // Fetch Lansia Data from Server
  const { data: serverLansiaData = [], isSuccess: isLansiaSuccess, isLoading: isLansiaLoading } = useGetLansia(
     currentUser?.role === 'Kader' ? currentUser.kelurahan : undefined,
     currentUser?.role === 'Kader' ? currentUser.rw : undefined
  );

  const [localLansiaData, setLocalLansiaData] = useState(initialLansiaData);

  useEffect(() => {
    if (isLansiaSuccess) {
      setLocalLansiaData(serverLansiaData);
    }
  }, [serverLansiaData, isLansiaSuccess]);

  const lansiaData = localLansiaData;
  const setLansiaData = setLocalLansiaData;

  const { data: serverRegions = {}, isSuccess: isRegionsSuccess } = useGetRegions();
  const { data: serverStats } = useGetStats();
  const [masterRegions, setMasterRegions] = useState(initialMasterRegions);
  useEffect(() => {
    if (isRegionsSuccess) setMasterRegions(serverRegions);
  }, [serverRegions, isRegionsSuccess]);
  const { data: users = [] } = useGetUsers();
  const { data: serverJadwalData = [], isSuccess: isJadwalSuccess } = useGetJadwal();
  const { data: serverBeritaData = [], isSuccess: isBeritaSuccess } = useGetBerita();

  const [jadwalData, setJadwalData] = useState(initialJadwalData);
  const [beritaData, setBeritaData] = useState(initialBeritaData);

  useEffect(() => {
    if (isJadwalSuccess) setJadwalData(serverJadwalData);
  }, [serverJadwalData, isJadwalSuccess]);

  useEffect(() => {
    if (isBeritaSuccess) setBeritaData(serverBeritaData);
  }, [serverBeritaData, isBeritaSuccess]);
  const [wizardConfig, setWizardConfig] = useState({ isOpen: false, patient: null, mode: 'kader', riwayatIndex: null });

  const landingStats = { lansia: lansiaData.length, wilayah: Object.keys(masterRegions).length, kader: users.filter(u => u.role === 'Kader').length };

  const createPemeriksaanMutation = useCreatePemeriksaan();
  const updatePemeriksaanMutation = useUpdatePemeriksaan();

  const createLansiaMutation = useCreateLansia();
  const updateLansiaMutation = useUpdateLansia();
  const deleteLansiaMutation = useDeleteLansia();

  const handleAddPatient = async (newPatient) => {
    try {
      const usia = calculateAge(newPatient.tglLahir);
      const result = await createLansiaMutation.mutateAsync({
        nik: newPatient.nik,
        nama: newPatient.nama,
        jk: newPatient.jk,
        tglLahir: new Date(newPatient.tglLahir).toISOString(),
        alamat: newPatient.alamat,
        kelurahan: newPatient.kelurahan,
        rw: newPatient.rw,
        rt: newPatient.rt,
        usia,
        golDarah: newPatient.golDarah,
        statusKawin: newPatient.statusKawin,
        pekerjaan: newPatient.pekerjaan,
        status: 'Terdaftar',
      });
      const patientData = { ...result, lastVisit: 'Belum pernah', skilas: '-', aks: 0, puma: 0, riwayat: [] };
      setLansiaData([patientData, ...lansiaData]);
    } catch (error) {
      if (error.response) {
        // Server responded with an error (e.g. duplicate NIK)
        const errMsg = error.response.data?.details || error.response.data?.error || "Terjadi kesalahan.";
        if (errMsg.toLowerCase().includes('unique') || errMsg.toLowerCase().includes('ganda')) {
          alert(`Gagal: NIK ${newPatient.nik} sudah terdaftar di sistem!`);
        } else {
          alert(`Gagal menambahkan pasien: ${errMsg}`);
        }
      } else {
        // Network error
        alert("Gagal terhubung ke server. Membuka mode offline sementara.");
        const newId = `L0${lansiaData.length + 1}`;
        const patientData = { ...newPatient, id: newId, usia: calculateAge(newPatient.tglLahir), lastVisit: 'Belum pernah', status: 'Terdaftar', skilas: '-', aks: 0, puma: 0, riwayat: [] };
        setLansiaData([patientData, ...lansiaData]);
      }
    }
  };

  const handleEditPatient = async (updatedPatient) => {
    try {
      const usia = calculateAge(updatedPatient.tglLahir);
      await updateLansiaMutation.mutateAsync({ 
        id: updatedPatient.id, 
        data: { 
          nama: updatedPatient.nama,
          nik: updatedPatient.nik,
          jk: updatedPatient.jk,
          tglLahir: new Date(updatedPatient.tglLahir).toISOString(),
          alamat: updatedPatient.alamat,
          kelurahan: updatedPatient.kelurahan,
          rw: updatedPatient.rw,
          rt: updatedPatient.rt,
          usia,
          golDarah: updatedPatient.golDarah,
          statusKawin: updatedPatient.statusKawin,
          pekerjaan: updatedPatient.pekerjaan
        } 
      });
      setLansiaData(prev => prev.map(p => p.id === updatedPatient.id ? { ...p, ...updatedPatient, usia } : p));
    } catch (error) {
      alert("Gagal mengubah data pasien di server.");
      setLansiaData(prev => prev.map(p => p.id === updatedPatient.id ? { ...p, ...updatedPatient, usia: calculateAge(updatedPatient.tglLahir) } : p));
    }
  };

  const handleDeletePatient = async (id) => {
    try {
      await deleteLansiaMutation.mutateAsync(id);
      setLansiaData(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      alert("Gagal menghapus data pasien di server.");
      setLansiaData(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleUpdateStatus = async (id, newStatus, keterangan = '') => {
    try {
      await updateLansiaMutation.mutateAsync({ 
        id, 
        data: { 
          status: newStatus,
          keteranganMeninggal: keterangan
        } 
      });
      setLansiaData(prev => prev.map(p => p.id === id ? { ...p, status: newStatus, keteranganMeninggal: keterangan } : p));
    } catch (error) {
      alert("Gagal mengupdate status pasien di server.");
      setLansiaData(prev => prev.map(p => p.id === id ? { ...p, status: newStatus, keteranganMeninggal: keterangan } : p));
    }
  };

  const startPemeriksaan = (patient = null, reqMode = 'kader', riwayatIndex = null) => {
    setWizardConfig({ isOpen: true, patient, mode: reqMode, riwayatIndex, returnView: currentView });
    setCurrentView('form-pemeriksaan');
    setSidebarOpen(false);
  };

  const handleSavePemeriksaan = async (hasilPemeriksaan) => {
    const todayFormatted = new Date().toISOString().split('T')[0]; 
    const { patient, mode, riwayatIndex } = wizardConfig;
    
    if (!patient) {
      const existingPatient = lansiaData.find(p => p.nik === hasilPemeriksaan.nik);
      if (existingPatient) {
        if (existingPatient.status === 'Meninggal') {
          alert(`Pemeriksaan dibatalkan: Lansia dengan NIK ${hasilPemeriksaan.nik} terdaftar dengan status Meninggal.`);
        } else {
          alert(`Gagal menyimpan: Pasien dengan NIK ${hasilPemeriksaan.nik} sudah terdaftar. Silakan buka dari daftar Lansia untuk menambah riwayat baru.`);
        }
        return;
      }
    }

    try {
      if (patient && patient.id) {
        if (riwayatIndex !== null) {
           const existingRiwayatId = patient.riwayat[riwayatIndex].id;
           if (existingRiwayatId) {
             await updatePemeriksaanMutation.mutateAsync({ id: existingRiwayatId, data: hasilPemeriksaan });
           }
        } else {
           await createPemeriksaanMutation.mutateAsync({ ...hasilPemeriksaan, lansiaId: patient.id, tglKunjungan: todayFormatted });
        }
      } else {
        // Add new patient then their pemeriksaan
        if (!hasilPemeriksaan.nik || !hasilPemeriksaan.nama || !hasilPemeriksaan.tglLahir) {
          alert("Gagal menyimpan: Data diri (NIK, Nama, dan Tanggal Lahir) wajib diisi untuk pasien baru.");
          return;
        }

        const usia = calculateAge(hasilPemeriksaan.tglLahir);
        const resultLansia = await createLansiaMutation.mutateAsync({
          nik: hasilPemeriksaan.nik,
          nama: hasilPemeriksaan.nama,
          jk: hasilPemeriksaan.jk,
          tglLahir: new Date(hasilPemeriksaan.tglLahir).toISOString(),
          alamat: hasilPemeriksaan.alamat,
          kelurahan: hasilPemeriksaan.kelurahan,
          rw: hasilPemeriksaan.rw,
          rt: hasilPemeriksaan.rt,
          usia,
          status: 'Terdaftar',
        });
        await createPemeriksaanMutation.mutateAsync({ ...hasilPemeriksaan, lansiaId: resultLansia.id, tglKunjungan: todayFormatted });
      }

      // We still update local state for immediate UI feedback just like before!
      let newLansiaData = [...lansiaData];
      if (patient && patient.id) {
        newLansiaData = newLansiaData.map(p => {
          if (p.id === patient.id) {
            let currentRiwayat = [...(p.riwayat || [])];
            if (riwayatIndex !== null) {
               currentRiwayat[riwayatIndex] = { ...currentRiwayat[riwayatIndex], ...hasilPemeriksaan };
               return { ...p, ...hasilPemeriksaan, riwayat: currentRiwayat };
            } else {
               const newRecord = { ...hasilPemeriksaan, tglKunjungan: todayFormatted };
               currentRiwayat = [newRecord, ...currentRiwayat];
               return { ...p, ...hasilPemeriksaan, lastVisit: todayFormatted, riwayat: currentRiwayat };
            }
          }
          return p;
        });
      } else {
        const newId = `L0${lansiaData.length + 1}`;
        const newPatient = { ...hasilPemeriksaan, id: newId, lastVisit: todayFormatted, status: 'Terdaftar', riwayat: [{ ...hasilPemeriksaan, tglKunjungan: todayFormatted, status: 'Terdaftar' }] };
        newLansiaData = [newPatient, ...newLansiaData];
      }
      setLansiaData(newLansiaData);

    } catch (error) {
       console.error("FULL SAVE ERROR:", error);
       alert("Terjadi kesalahan saat menyimpan pemeriksaan ke server. Detail: " + (error.message || error.toString()));
    }

    const targetView = wizardConfig.returnView || 'dashboard';
    setWizardConfig({ isOpen: false, patient: null, mode: 'kader', riwayatIndex: null });
    setCurrentView(targetView);
  };

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth < 1024) setSidebarOpen(false); else setSidebarOpen(true); };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (id) => {
    setCurrentView(id);
    setSidebarOpen(false);
    setWizardConfig({ isOpen: false, patient: null, mode: 'kader', riwayatIndex: null });
  };

  const handleLogout = async () => { 
    await authClient.signOut();
    setAppState('landing'); 
    setCurrentView('dashboard');
    localStorage.removeItem('posyandu_appState');
    localStorage.removeItem('posyandu_currentView');
  };

  if (!isMounted) return null;

  if (appState === 'landing') return <LandingPageView onNavigateToLogin={() => { if (currentUser) { setAppState('dashboard'); } else { setAppState('login'); } }} stats={landingStats} onNavigateToJadwal={() => setAppState('jadwal')} onNavigateToBerita={() => setAppState('berita')} onNavigateToEdukasi={() => setAppState('edukasi')} jadwalList={jadwalData} beritaList={beritaData} />;
  if (appState === 'jadwal') return <JadwalPublicView onBack={() => setAppState('landing')} masterRegions={masterRegions} jadwalList={jadwalData} />;
  if (appState === 'berita') return <BeritaPublicView onBack={() => setAppState('landing')} beritaList={beritaData} />;
  if (appState === 'edukasi') return <EdukasiPublicView onBack={() => setAppState('landing')} />;
  if (appState === 'login') return <LoginView users={users} onBackToHome={() => setAppState('landing')} onLogin={() => {}} />;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'statistik', label: 'Rekap Statistik', icon: PieChart },
    { id: 'data', label: 'Data Lansia', icon: Users },
    { id: 'pemeriksaan', label: 'Pemeriksaan Baru', icon: ClipboardList },
    { id: 'jadwal_admin', label: 'Jadwal Posyandu', icon: Calendar },
    { id: 'berita_admin', label: 'Berita & Artikel', icon: FileText },
    { id: 'admin', label: 'Pengaturan Admin', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans transition-colors duration-200">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="fixed lg:relative z-40 w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-2xl lg:shadow-none">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                <div title="Logo Kecamatan Lawang" className="w-10 h-10 bg-white rounded-full border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                  <img src="/LOGO KECAMTAN LAWANG.png" alt="Logo Lawang" className="w-full h-full object-contain p-1" />
                </div>
                <span className="font-bold text-base tracking-tight leading-tight">Posyandu Lansia<br/>Lawang</span>
              </div>
              <button className="lg:hidden text-gray-500 cursor-pointer" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Menu Utama</div>
              {navItems.filter(item => item.id === 'admin' ? (currentUser?.role === 'Admin' || currentUser?.role === 'Ketua Kader' || currentUser?.role === 'Bidan') : true).map((item) => {
                const isActive = currentView === item.id || (currentView.startsWith('form-') && item.id === 'pemeriksaan');
                return (
                  <button key={item.id} onClick={() => { if (item.id === 'pemeriksaan') startPemeriksaan(); else handleNavigation(item.id); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-semibold' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}>
                    <item.icon size={20} className={`${isActive ? 'stroke-[2.5]' : 'stroke-2 group-hover:scale-110 transition-transform'}`} /><span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${currentUser?.role === 'Admin' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50'}`}>{currentUser?.name?.charAt(0) || 'U'}</div>
                  <div className="truncate"><p className="text-sm font-semibold truncate">{currentUser?.name || 'Pengguna'}</p><p className="text-xs text-gray-500 truncate">{currentUser?.role || 'Kader Posyandu'}</p></div>
                </div>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer" title="Keluar / Logout"><LogOut size={18} /></button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/20 dark:bg-black/40 z-30 lg:hidden backdrop-blur-sm cursor-pointer" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 z-20">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer shrink-0"><Menu size={24} /></button>
            <div className="flex-1"><h2 className="font-bold text-xs sm:text-lg leading-tight">{POSYANDU_NAME}</h2><p className="hidden sm:flex text-xs text-gray-500 items-center gap-1 mt-0.5"><Calendar size={12}/> {TODAY}</p></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
             <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-red-50 text-red-700 border-red-200'}`}>{isOnline ? <Wifi size={14}/> : <WifiOff size={14}/>}{isOnline ? 'Online tersinkron' : 'Mode Offline'}</div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            <div className="hidden sm:block"><Button variant="primary" icon={Plus} onClick={() => startPemeriksaan()} className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200">Pemeriksaan Baru</Button></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth relative custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div key={currentView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="max-w-7xl mx-auto min-h-full">
              {currentView === 'dashboard' && <DashboardView data={lansiaData} onExamine={startPemeriksaan} masterRegions={masterRegions} currentUser={currentUser} onNavigate={handleNavigation} />}
              {currentView === 'data' && <DataLansiaView data={lansiaData} onExamine={startPemeriksaan} onAddPatient={handleAddPatient} onEditPatient={handleEditPatient} onDeletePatient={handleDeletePatient} onUpdateStatus={handleUpdateStatus} masterRegions={masterRegions} currentUser={currentUser} />}
              {currentView === 'jadwal_admin' && <AdminJadwalView masterRegions={masterRegions} jadwalData={jadwalData} setJadwalData={setJadwalData} currentUser={currentUser} />}
              {currentView === 'berita_admin' && <AdminBeritaView beritaData={beritaData} setBeritaData={setBeritaData} currentUser={currentUser} />}
              {currentView === 'admin' && (currentUser?.role === 'Admin' || currentUser?.role === 'Ketua Kader' || currentUser?.role === 'Bidan') && <AdminView masterRegions={masterRegions} setMasterRegions={setMasterRegions} users={users} currentUser={currentUser} />}
              {currentView === 'form-pemeriksaan' && <PemeriksaanWizard config={wizardConfig} onComplete={handleSavePemeriksaan} onCancel={() => { const targetView = wizardConfig.returnView || 'dashboard'; setWizardConfig({ isOpen: false, patient: null, mode: 'kader', riwayatIndex: null }); setCurrentView(targetView); }} masterRegions={masterRegions} currentUser={currentUser} />}
              {currentView === 'statistik' && <RekapStatistikView data={lansiaData} masterRegions={masterRegions} currentUser={currentUser} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
