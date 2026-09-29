// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, ChevronRight, MapPin, Home, Users, 
  UserCheck, Activity as ActivityIcon, AlertCircle, 
  Brain, Stethoscope, CheckCircle2, Sparkles 
} from 'lucide-react';
import { StatCard, BentoChartCard } from '@/components/ui/Cards';

export const DashboardView = ({ data, onExamine, masterRegions, currentUser, onNavigate }: any) => {
  const isKader = currentUser?.role === 'Kader';
  const isKetuaKader = currentUser?.role === 'Ketua Kader';
  const isBidan = currentUser?.role === 'Bidan';
  const [filterKel, setFilterKel] = useState((isKader || isKetuaKader || isBidan) && currentUser?.kelurahan ? currentUser.kelurahan : 'Semua');
  const [filterRW, setFilterRW] = useState((isKader || isKetuaKader) && currentUser?.rw ? currentUser.rw : 'Semua');
  const [filterRT, setFilterRT] = useState('Semua');

  const handleKelChange = (e: any) => { setFilterKel(e.target.value); setFilterRW('Semua'); setFilterRT('Semua'); };
  const handleRWChange = (e: any) => { setFilterRW(e.target.value); setFilterRT('Semua'); };

  const availableKel = Object.keys(masterRegions).sort();
  let availableRW = filterKel !== 'Semua' && masterRegions[filterKel] ? Object.keys(masterRegions[filterKel]).sort() : [];
  let availableRT = filterKel !== 'Semua' && filterRW !== 'Semua' && masterRegions[filterKel]?.[filterRW] ? [...masterRegions[filterKel][filterRW]].sort() : [];

  const filteredData = data.filter((d: any) => {
    if (filterKel !== 'Semua' && d.kelurahan !== filterKel) return false;
    if (filterRW !== 'Semua' && d.rw !== filterRW) return false;
    if (filterRT !== 'Semua' && d.rt !== filterRT) return false;
    return true;
  });

  const activeData = useMemo(() => filteredData.filter((d: any) => d.status !== 'Meninggal'), [filteredData]);

  const stats = useMemo(() => {
    const total = activeData.length;
    const todayStr = new Date().toISOString().split('T')[0];
    const hadirToday = activeData.filter((d: any) => d.lastVisit === todayStr).length; 
    const perluRujuk = activeData.filter((d: any) => d.status === 'Rujuk').length;
    const dipantau = activeData.filter((d: any) => d.status === 'Pantau').length;
    return { total, hadirToday, perluRujuk, dipantau };
  }, [activeData]);

  const chartStats = useMemo(() => {
    const total = activeData.length || 1;
    const skilasNormal = activeData.filter((d: any) => d.skilas === 'Normal').length;
    const aksMandiri = activeData.filter((d: any) => d.aks >= 20).length;
    const pumaAman = activeData.filter((d: any) => d.puma <= 6).length;
    return { skilas: Math.round((skilasNormal / total) * 100), aks: Math.round((aksMandiri / total) * 100), puma: Math.round((pumaAman / total) * 100) };
  }, [activeData]);

  const needsAttention = activeData.filter((d: any) => d.status !== 'Normal' && d.status !== 'Terdaftar').slice(0, 5);

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } }};
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }};

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-10">
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-8 sm:p-10 text-white shadow-lg shadow-emerald-900/20">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-400/20 rounded-full blur-2xl mix-blend-overlay"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-medium mb-4"><Sparkles size={16} className="text-yellow-300" /><span>Semangat melayani hari ini!</span></div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Halo, {currentUser?.name?.split(' ')[0] || 'Kader'} 👋</h1>
            <p className="text-emerald-50 text-lg md:text-xl max-w-xl opacity-90 leading-relaxed">
              Menampilkan data <span className="font-semibold text-white">{filterKel !== 'Semua' ? `Desa/Kelurahan ${filterKel}` : 'semua wilayah'}</span>
              {filterRW !== 'Semua' && <span className="font-semibold text-white">, RW {filterRW}</span>}
              {filterRT !== 'Semua' && <span className="font-semibold text-white">, RT {filterRT}</span>}. 
              Terdapat total <span className="font-semibold text-white bg-white/20 px-2.5 py-0.5 rounded-lg inline-block whitespace-nowrap">{stats.total} lansia</span> di area ini.
            </p>
          </div>
          <div className="flex shrink-0">
            <button onClick={() => onExamine(null, currentUser?.role?.toLowerCase() || 'kader')} className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-teal-900 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" /><span className="text-lg">Pemeriksaan Baru</span>
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-3xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col xl:flex-row xl:items-center gap-4 z-20 relative">
        <div className="flex items-center gap-2 px-3 text-gray-700 dark:text-gray-300 font-extrabold whitespace-nowrap"><MapPin size={22} className="text-emerald-500" /><span>Pilih Wilayah:</span></div>
        <div className="flex flex-1 w-full flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"><MapPin size={18} /></div>
            <select value={filterKel} onChange={handleKelChange} disabled={isKader || isKetuaKader || isBidan} className="w-full pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-800 dark:text-gray-200 appearance-none outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed">
              <option value="Semua">Semua Desa/Kel.</option>{availableKel.map(opt => (<option key={opt} value={opt}>Desa/Kel. {opt}</option>))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><ChevronRight size={18} className="rotate-90" /></div>
          </div>
          <div className={`relative flex-1 transition-all duration-300 ${filterKel === 'Semua' ? 'opacity-50 grayscale' : 'opacity-100'}`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"><Home size={18} /></div>
            <select value={filterRW} onChange={handleRWChange} disabled={filterKel === 'Semua' || isKader || isKetuaKader} className="w-full pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-800 dark:text-gray-200 appearance-none outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed">
              <option value="Semua">Semua RW</option>{availableRW.map(opt => (<option key={opt} value={opt}>RW {opt}</option>))}
            </select>
             <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><ChevronRight size={18} className="rotate-90" /></div>
          </div>
          <div className={`relative flex-1 transition-all duration-300 ${filterRW === 'Semua' ? 'opacity-50 grayscale' : 'opacity-100'}`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"><Users size={18} /></div>
            <select value={filterRT} onChange={(e) => setFilterRT(e.target.value)} disabled={filterRW === 'Semua'} className="w-full pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-800 dark:text-gray-200 appearance-none outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 disabled:cursor-not-allowed">
              <option value="Semua">Semua RT</option>{availableRT.map(opt => (<option key={opt} value={opt}>RT {opt}</option>))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><ChevronRight size={18} className="rotate-90" /></div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 z-10 relative">
        <StatCard title="Total Lansia" subtitle="Berdasarkan filter wilayah" value={stats.total} icon={Users} trend="" color="blue" onClick={() => onNavigate('statistik')}/>
        <StatCard title="Hadir Hari Ini" value={stats.hadirToday} icon={UserCheck} trend="12%" trendUp={true} color="emerald" subtitle="Estimasi kunjungan" onClick={() => onNavigate('statistik')}/>
        <StatCard title="Perlu Pantauan" value={stats.dipantau} icon={ActivityIcon} trend="-1" trendUp={false} color="amber" subtitle="Risiko sedang" onClick={() => onNavigate('statistik')}/>
        <StatCard title="Perlu Rujukan" value={stats.perluRujuk} icon={AlertCircle} trend="+2" trendUp={true} color="red" subtitle="Tindak lanjut medis" onClick={() => onNavigate('statistik')}/>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <div className="flex justify-between items-center mb-8">
             <div><h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Indikator Kesehatan (Data Tersaring)</h3><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Distribusi hasil skrining pada area yang Anda pilih</p></div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-6 flex-1">
            <BentoChartCard title="SKILAS" subtitle="Kognitif & Sensorik" percentage={chartStats.skilas} color="emerald" icon={Brain} status={chartStats.skilas > 70 ? "Baik" : "Perhatian"}/>
            <BentoChartCard title="AKS" subtitle="Kemandirian" percentage={chartStats.aks} color="blue" icon={UserCheck} status={chartStats.aks > 50 ? "Mandiri" : "Bantuan"}/>
            <BentoChartCard title="PUMA" subtitle="Risiko PPOK" percentage={chartStats.puma} color="amber" icon={Stethoscope} status={chartStats.puma > 70 ? "Rendah" : "Tinggi"}/>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
          <div className="flex justify-between items-end mb-6">
            <div><h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>Prioritas Penanganan</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pada area terpilih</p></div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {needsAttention.length > 0 ? needsAttention.map((patient: any) => (
              <div key={patient.id} className="group relative p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 dark:hover:shadow-emerald-900/20 transition-all cursor-pointer overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${patient.status === 'Rujuk' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                <div className="pl-2 flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">{patient.nama} <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-[10px] font-semibold text-gray-500">{patient.usia}th</span></h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{patient.alamat}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {patient.skilas === 'Abnormal' && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-red-50 text-red-600 dark:bg-red-900/30"><Brain size={10}/> SKILAS</span>}
                      {patient.puma > 6 && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-red-50 text-red-600 dark:bg-red-900/30"><Stethoscope size={10}/> PUMA</span>}
                      {patient.status === 'Pantau' && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-amber-50 text-amber-600 dark:bg-amber-900/30"><ActivityIcon size={10}/> PANTAU</span>}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
               <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                 <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2 opacity-50"/><p className="text-sm text-gray-500">Tidak ada lansia prioritas di wilayah ini.</p>
               </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
