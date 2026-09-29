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
  HeartPulse, PieChart, UserMinus
} from 'lucide-react';
import { Badge, Button, RadioGroup } from '@/components/ui/Shared';
import { TiltWrapper, Portal } from '@/components/ui/Wrappers';
import { GalleryCard } from '@/components/ui/GalleryCard';
import { useGetGaleri } from '@/hooks/queries/useGaleri';


export const LandingPageView = ({ onNavigateToLogin, stats, onNavigateToJadwal, onNavigateToBerita, onNavigateToEdukasi, jadwalList = [], beritaList = [] }) => {
  const { data: serverGaleri = [] } = useGetGaleri();
  const [selectedBerita, setSelectedBerita] = useState(null);
  const { scrollYProgress } = useScroll();
  const yHeroText = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const yParallaxFast = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const yParallaxSlow = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const today = new Date().toISOString().split('T')[0];
  const upcomingSchedules = jadwalList
    .filter(j => j.tgl >= today)
    .sort((a, b) => new Date(a.tgl).getTime() - new Date(b.tgl).getTime())
    .slice(0, 3);

  // Permanent Gallery Images
  const galleryImages = [
    { img: "/galery/PEMBUKAAN KKN RAMAH LANSIA TAHAP 1.jpg", t: "Pembukaan KKN Ramah Lansia Tahap 1", d: "KKN UMM", is16x9: true },
    { img: "/galery/BERKOORDINASI DENGAN PIHAK KELURAHAN KALIREJO.jpg", t: "Berkoordinasi Dengan Pihak Kelurahan Kalirejo", d: "Kelurahan Kalirejo", is16x9: false },
    { img: "/galery/BERKOORDINASI DENGAN PIHAK KELURAHAN LAWANG.jpg", t: "Berkoordinasi Dengan Pihak Kelurahan Lawang", d: "Kelurahan Lawang", is16x9: false },
    { img: "/galery/KARNAVAL DI KELURAHAN LAWANG.jpg", t: "Karnaval Di Kelurahan Lawang", d: "Kelurahan Lawang", is16x9: false },
    { img: "/galery/PENDATAAN LANSIA DI KELURAHAN KALIREJO.jpg", t: "Pendataan Lansia Di Kelurahan Kalirejo", d: "Kelurahan Kalirejo", is16x9: false },
    { img: "/galery/PENYULUHAN DI KELURAHAN KALIREJO.jpg", t: "Penyuluhan Di Kelurahan Kalirejo", d: "Kelurahan Kalirejo", is16x9: false },
    { img: "/galery/PENYULUHAN DI KELURAHAN LAWANG.jpg", t: "Penyuluhan Di Kelurahan Lawang", d: "Kelurahan Lawang", is16x9: false },
    { img: "/galery/POSYANDU DI KELURAHAN KALIREJO.jpg", t: "Posyandu Di Kelurahan Kalirejo", d: "Kelurahan Kalirejo", is16x9: false },
    { img: "/galery/POSYANDU DI KELURAHAN LAWANG.jpg", t: "Posyandu Di Kelurahan Lawang", d: "Kelurahan Lawang", is16x9: false }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900">
      
      <nav className="absolute top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-50 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-5">
             <div className="flex space-x-1 sm:space-x-2">
                <div title="Logo Kecamatan Lawang" className="w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden z-30 shrink-0">
                   <img src="/LOGO KECAMTAN LAWANG.png" alt="Logo Lawang" className="w-full h-full object-contain p-0.5 sm:p-1" />
                </div>
                <div title="Logo Universitas Muhammadiyah Malang" className="flex w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full border border-gray-200 shadow-sm items-center justify-center overflow-hidden z-20 shrink-0">
                   <img src="/LOGO UMM.png" alt="Logo UMM" className="w-full h-full object-contain p-0.5 sm:p-1" />
                </div>
                <div title="Logo KKN" className="flex w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full border border-gray-200 shadow-sm items-center justify-center overflow-hidden z-10 shrink-0">
                   <img src="/LOGO KKN RAMAH LANSIA TAHAP 1.png" alt="Logo KKN" className="w-full h-full object-contain p-0.5 sm:p-1" />
                </div>
             </div>
             
             <div className="flex flex-col sm:border-l-2 border-gray-300 dark:border-gray-600 sm:pl-4 py-1">
                <h1 className="font-extrabold text-gray-800 dark:text-white tracking-tight text-[10px] sm:text-base leading-tight uppercase">Posyandu Ramah Lansia Lawang</h1>
                <p className="text-[8px] sm:text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider hidden sm:block mt-0.5">BERSAMA KKN RAMAH LANSIA UMM TAHAP 1</p>
             </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 font-bold text-sm text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-md">
             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onNavigateToJadwal} className="px-5 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-all cursor-pointer">Jadwal</motion.button>
             <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#info" className="px-5 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-all text-center flex items-center justify-center">Edukasi</motion.a>
             <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#kegiatan" className="px-5 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-all text-center flex items-center justify-center">Galeri</motion.a>
             <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#berita" className="px-5 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-all text-center flex items-center justify-center">Berita</motion.a>
          </div>

          <button onClick={onNavigateToLogin} className="px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer">
             <Lock size={16} /> <span className="hidden sm:inline">Portal Admin</span>
          </button>
        </div>
      </nav>

      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-32 min-h-[85vh] lg:min-h-[95vh] flex items-center">
        <motion.div style={{ y: yParallaxFast }} className="absolute top-0 right-0 w-full h-[150%] bg-[url('https://images.unsplash.com/photo-1576091160550-2173ff9e5eb3?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 dark:opacity-10 pointer-events-none -z-20"></motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-slate-50/80 to-white dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900 -z-10"></div>
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10 w-full">
          <motion.div style={{ y: yHeroText, opacity: opacityFade }} className="text-center lg:text-left pt-2 lg:pt-10">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold text-xs sm:text-sm border border-blue-100 dark:border-blue-800 mb-6 uppercase tracking-wider shadow-sm mx-auto lg:mx-0">
              <Shield size={16} /> Layanan Terpadu KKN UMM
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] text-gray-900 dark:text-white mx-auto lg:mx-0 max-w-2xl lg:max-w-none">
              Digitalisasi Pelayanan <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-emerald-500">Posyandu Lansia</span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed font-medium mx-auto lg:mx-0">
              Sistem informasi inovatif persembahan <b>Pemerintah Kecamatan Lawang</b> berkolaborasi dengan mahasiswa <b>KKN UMM</b> untuk mewujudkan pencatatan kesehatan lansia yang akurat, terpusat, dan responsif.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full px-4 sm:px-0">
              <button onClick={onNavigateToLogin} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-blue-200 dark:hover:shadow-none transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                 Masuk Sistem <ArrowRight size={20} />
              </button>
              <button onClick={onNavigateToJadwal} className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-750 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:-translate-y-1 active:scale-95">
                 Lihat Agenda
              </button>
            </div>
          </motion.div>
          
          <div className="hidden lg:block relative perspective-1000 h-[500px] w-full flex items-center justify-center">
             <TiltWrapper>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
                  className="relative flex items-center justify-center w-full h-full"
                >
                  <motion.img 
                     src="/LOGO%20KKN%20RAMAH%20LANSIA%20TAHAP%201.png" 
                     alt="KKN Ramah Lansia Logo"
                     className="w-[400px] h-[400px] object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)]"
                     style={{ transform: 'translateZ(50px)' }}
                     animate={{ y: [0, -15, 0], rotateY: [0, 5, -5, 0] }}
                     transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  />
                  
                  {/* Decorative Glow Behind */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 blur-3xl -z-10 rounded-full w-[400px] h-[400px] mx-auto top-1/2 -translate-y-1/2"></div>
                </motion.div>

                {/* Floating Badges */}
                <motion.div 
                   style={{ transform: 'translateZ(80px)' }} 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                   className="absolute -top-4 -right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 z-20"
                >
                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><ActivityIcon size={24}/></div>
                   <div>
                     <p className="text-xs text-gray-500 font-bold uppercase">Terintegrasi</p>
                     <p className="font-black text-gray-800 dark:text-white">SKILAS & PUMA</p>
                   </div>
                </motion.div>

                <motion.div 
                   style={{ transform: 'translateZ(100px)' }} 
                   animate={{ y: [0, 10, 0] }}
                   transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                   className="absolute -bottom-8 -left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 z-20"
                >
                   <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600"><CheckCircle2 size={24}/></div>
                   <div>
                     <p className="text-xs text-gray-500 font-bold uppercase">Akurasi Data</p>
                     <p className="font-black text-gray-800 dark:text-white">Real-Time Sync</p>
                   </div>
                </motion.div>
             </TiltWrapper>
          </div>
        </div>
      </section>

      <section id="berita" className="py-16 sm:py-24 bg-white dark:bg-gray-800 relative z-10 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold text-xs sm:text-sm mb-4 sm:mb-6 shadow-sm border border-violet-200 dark:border-violet-800">
              <FileText size={16} /> Berita Posyandu
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 tracking-tight text-gray-900 dark:text-white">Berita & Informasi</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              Kabar terbaru, artikel kesehatan, dan liputan kegiatan dari Posyandu Ramah Lansia Lawang.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-6 pb-0">
            {beritaList.slice(0, 4).map((berita) => (
              <div key={berita.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl sm:rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer sm:hover:-translate-y-2" onClick={() => setSelectedBerita(berita)}>
                <div className="h-24 sm:h-48 overflow-hidden relative">
                  <img src={berita.image} alt={berita.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-1 left-1 sm:top-4 sm:left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold text-violet-600 dark:text-violet-400 shadow-sm">{berita.category}</div>
                </div>
                <div className="p-3 sm:p-6 flex-1 flex flex-col">
                  <div className="text-[9px] sm:text-xs text-gray-500 mb-1 sm:mb-3 font-semibold flex items-center gap-1 sm:gap-2"><Calendar size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="truncate">{berita.date}</span></div>
                  <h3 className="text-[11px] sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-3 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-tight line-clamp-2">{berita.title}</h3>
                  <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-6 flex-1 leading-relaxed line-clamp-2 sm:line-clamp-3">{berita.excerpt}</p>
                  <div className="hidden sm:flex items-center text-sm font-bold text-violet-600 dark:text-violet-400 gap-1 group-hover:gap-3 transition-all mt-auto">Baca Selengkapnya <ArrowRight size={16}/></div>
                </div>
              </div>
            ))}
            {beritaList.length === 0 && (
               <div className="col-span-full py-12 sm:py-16 text-center text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                  <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-sm sm:text-lg">Belum ada berita yang dipublikasikan saat ini.</p>
               </div>
            )}
          </div>
          {beritaList.length > 0 && (
            <div className="flex justify-center mt-6 sm:mt-10">
              <button className="px-6 py-2.5 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 font-bold hover:bg-violet-100 transition-colors flex items-center gap-2 cursor-pointer text-xs sm:text-sm shadow-sm border border-violet-200 dark:border-violet-800" onClick={onNavigateToBerita}>
                 Lihat Semua Berita <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-8 sm:py-16 relative overflow-hidden bg-slate-900 text-white shadow-2xl z-10 border-t-4 border-blue-500">
        <motion.div style={{ y: yParallaxSlow }} className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 -z-10"></motion.div>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 relative z-10 flex flex-row justify-around sm:grid sm:grid-cols-3 gap-2 sm:gap-0 text-center sm:divide-x divide-slate-700">
           <div className="py-2 sm:py-6 px-1 sm:px-4 hover:-translate-y-1 sm:hover:-translate-y-2 transition-transform flex-1">
              <div className="text-2xl sm:text-5xl font-black mb-1 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-400">{stats.lansia}</div>
              <div className="text-slate-400 font-bold tracking-wider text-[9px] sm:text-sm leading-tight">LANSIA<br className="sm:hidden"/> TERDAFTAR</div>
           </div>
           <div className="py-2 sm:py-6 px-1 sm:px-4 hover:-translate-y-1 sm:hover:-translate-y-2 transition-transform flex-1 border-l sm:border-l-0 border-slate-700">
              <div className="text-2xl sm:text-5xl font-black mb-1 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-400">{stats.wilayah}</div>
              <div className="text-slate-400 font-bold tracking-wider text-[9px] sm:text-sm leading-tight">DESA &<br className="sm:hidden"/> KELURAHAN</div>
           </div>
           <div className="py-2 sm:py-6 px-1 sm:px-4 hover:-translate-y-1 sm:hover:-translate-y-2 transition-transform flex-1 border-l sm:border-l-0 border-slate-700">
              <div className="text-2xl sm:text-5xl font-black mb-1 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-400">{stats.kader}</div>
              <div className="text-slate-400 font-bold tracking-wider text-[9px] sm:text-sm leading-tight">KADER<br className="sm:hidden"/> AKTIF</div>
           </div>
        </div>
      </section>

      {upcomingSchedules.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-xs sm:text-sm shadow-sm border border-blue-200 dark:border-blue-800 mb-4 sm:mb-6">
                <Calendar size={16} /> Agenda Posyandu
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4 sm:mb-6">Jadwal Posyandu Mendatang</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                 Jangan lewatkan jadwal pemeriksaan kesehatan dan pembagian PMT di wilayah Anda.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-6 pb-0">
               {upcomingSchedules.slice(0, 4).map((jadwal) => {
                  const dateObj = new Date(jadwal.tgl);
                  const tglString = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                  return (
                    <div key={jadwal.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-100 dark:border-gray-700 hover:border-blue-200 hover:shadow-lg transition-all group flex flex-col">
                       <div className="flex flex-col sm:flex-row justify-between items-start mb-2 sm:mb-4 gap-2 sm:gap-0">
                          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl shadow-sm flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110"><Calendar size={14} className="sm:w-6 sm:h-6" /></div>
                          <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 w-fit">Akan Datang</span>
                       </div>
                       <h4 className="text-[11px] sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">Desa {jadwal.desa}, RW {jadwal.rw}</h4>
                       <div className="space-y-1.5 sm:space-y-2 mt-auto pt-2 border-t border-gray-200 dark:border-gray-700 text-[9px] sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                          <div className="flex items-center gap-1.5 sm:gap-3"><Clock size={12} className="sm:w-4 sm:h-4 text-gray-400 shrink-0" /> <span className="line-clamp-1">{tglString}</span></div>
                          <div className="flex items-center gap-1.5 sm:gap-3"><MapPin size={12} className="sm:w-4 sm:h-4 text-gray-400 shrink-0" /> <span className="line-clamp-1">{jadwal.tempat}</span></div>
                       </div>
                    </div>
                  )
               })}
            </div>
            {upcomingSchedules.length > 0 && (
               <div className="flex justify-center mt-6 sm:mt-10">
                  <button onClick={onNavigateToJadwal} className="px-6 py-2.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 cursor-pointer text-xs sm:text-sm shadow-sm border border-blue-200 dark:border-blue-800">
                     Lihat Semua Jadwal <ArrowRight size={16} />
                  </button>
               </div>
            )}
          </div>
        </section>
      )}

      <section id="info" className="py-24 bg-slate-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-xs font-bold tracking-[0.2em] text-emerald-600 dark:text-emerald-400 uppercase mb-2">Pojok Edukasi</h2>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Info Kesehatan Lansia</h3>
              <p className="text-gray-500 mt-4">Panduan praktis dan edukasi kesehatan untuk menjaga kebugaran di usia senja, persembahan dari tim KKN UMM.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-6 pb-0">
             <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl sm:rounded-3xl p-4 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl sm:hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col h-full">
               <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-2xl flex items-center justify-center border transition-colors duration-300 mb-3 sm:mb-6 bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/20 dark:border-blue-800/50 shrink-0 mx-auto sm:mx-0">
                 <ActivityIcon size={18} className="sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
               </div>
               <h4 className="text-[11px] sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-snug text-center sm:text-left">Menjaga Tekanan Darah</h4>
               <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[10px] sm:text-sm flex-1 text-center sm:text-left line-clamp-4">Kurangi konsumsi garam berlebih, perbanyak sayur, dan usahakan jalan pagi 30 menit sehari.</p>
             </div>
             
             <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl sm:rounded-3xl p-4 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl sm:hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col h-full">
               <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-2xl flex items-center justify-center border transition-colors duration-300 mb-3 sm:mb-6 bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/20 dark:border-emerald-800/50 shrink-0 mx-auto sm:mx-0">
                 <Brain size={18} className="sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
               </div>
               <h4 className="text-[11px] sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-snug text-center sm:text-left">Pentingnya Cek Kognitif</h4>
               <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[10px] sm:text-sm flex-1 text-center sm:text-left line-clamp-4">Penurunan daya ingat wajar terjadi, namun deteksi dini SKILAS sangat penting untuk lansia.</p>
             </div>
             
             <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl sm:rounded-3xl p-4 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl sm:hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col h-full">
               <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-2xl flex items-center justify-center border transition-colors duration-300 mb-3 sm:mb-6 bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-500 group-hover:text-white dark:bg-amber-900/20 dark:border-amber-800/50 shrink-0 mx-auto sm:mx-0">
                 <UserCheck size={18} className="sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
               </div>
               <h4 className="text-[11px] sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-snug text-center sm:text-left">Waspada Nyeri Sendi</h4>
               <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[10px] sm:text-sm flex-1 text-center sm:text-left line-clamp-4">Konsumsi makanan tinggi kalsium dan vitamin D, hindari mengangkat beban secara mendadak.</p>
             </div>

             <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl sm:rounded-3xl p-4 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl sm:hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col h-full">
               <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-2xl flex items-center justify-center border transition-colors duration-300 mb-3 sm:mb-6 bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white dark:bg-rose-900/20 dark:border-rose-800/50 shrink-0 mx-auto sm:mx-0">
                 <HeartPulse size={18} className="sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
               </div>
               <h4 className="text-[11px] sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-snug text-center sm:text-left">Gizi Seimbang Lansia</h4>
               <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[10px] sm:text-sm flex-1 text-center sm:text-left line-clamp-4">Perbanyak protein nabati dan sayur, serta kurangi asupan gula berlebih setiap harinya.</p>
             </div>
          </div>
          <div className="flex justify-center mt-6 sm:mt-10">
            <button className="px-6 py-2.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold hover:bg-emerald-100 transition-colors flex items-center gap-2 cursor-pointer text-xs sm:text-sm shadow-sm border border-emerald-200 dark:border-emerald-800" onClick={onNavigateToEdukasi}>
               Lihat Semua Edukasi <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section id="kegiatan" className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase mb-2">Dokumentasi</h2>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              Galeri Pengabdian Masyarakat <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">KKN Ramah Lansia Tahap 1 UMM</span>
            </h3>
          </div>
          
          <div className="overflow-hidden pb-8 -mx-6 md:mx-0 relative w-full flex">
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
            
            <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 40, repeat: Infinity }} className="flex gap-4 sm:gap-6 w-max items-center">
              {[...Array(2)].map((_, arrayIndex) => (
                <div key={arrayIndex} className="flex gap-4 sm:gap-6 px-2 sm:px-3">
                  {galleryImages.map((img, i) => (
                    <div key={i} className={`shrink-0 ${img.is16x9 ? "w-[512px]" : "w-[350px]"}`}>
                      <GalleryCard imgUrl={img.img} title={img.t} desc={img.d} />
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Berita dipindahkan ke atas */}

      <footer className="bg-gray-950 text-gray-400 py-16 border-t border-gray-900 text-sm relative z-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mb-10 pb-10 border-b border-gray-800">
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-xs">Tentang Portal</h4>
            <p className="leading-relaxed">Posyandu Ramah Lansia Lawang adalah inisiatif digitalisasi pendataan kesehatan lansia yang dikembangkan melalui program Pengabdian Masyarakat oleh mahasiswa KKN Universitas Muhammadiyah Malang.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-xs">Instansi Terkait</h4>
            <ul className="space-y-3 font-medium">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Pemerintah Kecamatan Lawang</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Puskesmas Lawang</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Universitas Muhammadiyah Malang</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center text-xs font-semibold tracking-wide">
          <p>© 2026 Pemerintah Kecamatan Lawang & KKN UMM. Hak Cipta Dilindungi.</p>
        </div>
      </footer>

      <AnimatePresence>
        {selectedBerita && (
          <Portal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setSelectedBerita(null)}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm cursor-pointer"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="relative h-64 sm:h-80 shrink-0">
                  <img src={selectedBerita.image} alt={selectedBerita.title} className="w-full h-full object-cover sm:object-contain bg-black/10 backdrop-blur-sm" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  <button onClick={() => setSelectedBerita(null)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors cursor-pointer z-10">
                    <X size={24} />
                  </button>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block px-3 py-1 bg-violet-600 text-white text-xs font-bold rounded-full mb-3 shadow-sm">{selectedBerita.category}</span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{selectedBerita.title}</h3>
                  </div>
                </div>
                <div className="p-6 sm:p-8 overflow-y-auto">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 font-semibold"><Calendar size={16}/> {selectedBerita.date}</div>
                    <div className="flex items-center gap-2 font-semibold"><User size={16}/> {selectedBerita.author}</div>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-a:text-violet-600">
                    {selectedBerita.content ? (
                       <div dangerouslySetInnerHTML={{ __html: selectedBerita.content }} />
                    ) : (
                       <p className="text-gray-700 dark:text-gray-300 text-lg">{selectedBerita.excerpt}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </Portal>
        )}
      </AnimatePresence>
    </div>
  );
};
