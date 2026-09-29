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
import { StatCard, BentoChartCard } from '@/components/ui/Cards';

export const RekapStatistikView = ({ data, masterRegions, currentUser }) => {
  const isKader = currentUser?.role === 'Kader';
  const isKetuaKader = currentUser?.role === 'Ketua Kader';
  const isBidan = currentUser?.role === 'Bidan';
  
  const [filterKel, setFilterKel] = useState((isKader || isKetuaKader || isBidan) && currentUser?.kelurahan ? currentUser.kelurahan : 'Semua');
  const [filterRW, setFilterRW] = useState((isKader || isKetuaKader) && currentUser?.rw ? currentUser.rw : 'Semua');
  const [activeFilter, setActiveFilter] = useState({ type: 'Status', value: 'Aktif' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, filterKel, filterRW]);

  const handleKelChange = (e) => { setFilterKel(e.target.value); setFilterRW('Semua'); };
  const handleRWChange = (e) => { setFilterRW(e.target.value); };

  const availableKel = Object.keys(masterRegions).sort();
  let availableRW = filterKel !== 'Semua' && masterRegions[filterKel] ? Object.keys(masterRegions[filterKel]).sort() : [];

  const filteredData = data.filter(d => {
    if ((isKader || isKetuaKader || isBidan) && currentUser?.kelurahan && d.kelurahan !== currentUser.kelurahan) return false;
    if ((isKader || isKetuaKader) && currentUser?.rw && d.rw !== currentUser.rw) return false;
    
    if (filterKel !== 'Semua' && d.kelurahan !== filterKel) return false;
    if (filterRW !== 'Semua' && d.rw !== filterRW) return false;
    
    return true;
  });

  const activeData = filteredData.filter(l => l.status !== 'Meninggal');
  const meninggalData = filteredData.filter(l => l.status === 'Meninggal');
  const totalLansia = activeData.length;
  const lakiLaki = activeData.filter(l => l.jk === 'L').length;
  const perempuan = activeData.filter(l => l.jk === 'P').length;
  
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const hadirBulanIni = activeData.filter(l => l.lastVisit && l.lastVisit.startsWith(currentMonthStr)).length;
  const belumHadirBulanIni = activeData.length - hadirBulanIni;

  const totalMeninggal = meninggalData.length;
  const penyebabKematianMap = meninggalData.reduce((acc, curr) => {
    if (curr.keteranganMeninggal && curr.keteranganMeninggal.trim() !== '') {
       const key = curr.keteranganMeninggal.trim();
       acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {});
  let mostCommonPenyebab = '-';
  if (Object.keys(penyebabKematianMap).length > 0) {
    mostCommonPenyebab = Object.keys(penyebabKematianMap).reduce((a, b) => penyebabKematianMap[a] > penyebabKematianMap[b] ? a : b);
  }

  const getAgeGroup = (usia) => {
    if (usia < 60) return '< 60';
    if (usia <= 69) return '60-69';
    if (usia <= 79) return '70-79';
    return '80+';
  };

  const ageGroups = activeData.reduce((acc, l) => {
    const group = getAgeGroup(l.usia);
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, { '< 60': 0, '60-69': 0, '70-79': 0, '80+': 0 });

  const statusCount = activeData.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, { 'Normal': 0, 'Pantau': 0, 'Rujuk': 0, 'Terdaftar': 0 });

  const tableData = useMemo(() => {
    let tableData = filteredData;
    if (activeFilter.type === 'Gender' || activeFilter.type === 'JK') tableData = activeData.filter(l => l.jk === activeFilter.value);
    else if (activeFilter.type === 'Status') {
      if (activeFilter.value === 'Meninggal') tableData = meninggalData;
      else if (activeFilter.value === 'Aktif') tableData = activeData;
      else tableData = activeData.filter(l => l.status === activeFilter.value);
    } else if (activeFilter.type === 'Kehadiran') {
      if (activeFilter.value === 'Hadir' || activeFilter.value === 'Hadir Bulan Ini') tableData = activeData.filter(l => l.lastVisit && l.lastVisit.startsWith(currentMonthStr));
      else tableData = activeData.filter(l => !l.lastVisit || !l.lastVisit.startsWith(currentMonthStr));
    } else if (activeFilter.type === 'Usia') {
      tableData = activeData.filter(l => getAgeGroup(l.usia) === activeFilter.value);
    }
    return tableData;
  }, [filteredData, activeData, meninggalData, activeFilter, currentMonthStr]);

  const totalPages = Math.ceil(tableData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    return tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [tableData, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold flex items-center gap-3"><PieChart size={32}/> Laporan Statistik Lansia</h2>
          <p className="text-emerald-50 mt-2 max-w-2xl text-lg">Rekapitulasi lengkap data kesehatan dan demografi lansia di wilayah Anda.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center gap-4 z-20 relative">
        <div className="flex items-center gap-2 px-3 text-gray-700 dark:text-gray-300 font-extrabold whitespace-nowrap"><MapPin size={22} className="text-emerald-500" /><span>Filter Wilayah:</span></div>
        <div className="flex flex-1 w-full flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"><MapPin size={18} /></div>
            <select value={filterKel} onChange={handleKelChange} disabled={isKader || isKetuaKader || isBidan} className="w-full pl-12 pr-10 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-800 dark:text-gray-200 appearance-none outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed">
              <option value="Semua">Semua Desa/Kel.</option>{availableKel.map(opt => (<option key={opt} value={opt}>Desa/Kel. {opt}</option>))}
            </select>
          </div>
          <div className={`relative flex-1 transition-all duration-300 ${filterKel === 'Semua' ? 'opacity-50 grayscale' : 'opacity-100'}`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"><Home size={18} /></div>
            <select value={filterRW} onChange={handleRWChange} disabled={filterKel === 'Semua' || isKader || isKetuaKader} className="w-full pl-12 pr-10 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-800 dark:text-gray-200 appearance-none outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed">
              <option value="Semua">Semua RW</option>{availableRW.map(opt => (<option key={opt} value={opt}>RW {opt}</option>))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        <button onClick={() => setActiveFilter({type: 'Status', value: 'Aktif'})} className={`w-full cursor-pointer bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95 active:translate-y-0 ${activeFilter.value === 'Aktif' ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-blue-100' : 'border-gray-100 dark:border-gray-700 hover:border-blue-300'} flex flex-col justify-center items-center text-center`}>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 text-blue-600 rounded-2xl flex justify-center items-center mb-2 sm:mb-4"><Users className="w-6 h-6 sm:w-8 sm:h-8"/></div>
          <h3 className="text-gray-500 font-semibold mb-1 text-[10px] sm:text-sm whitespace-nowrap">Total Lansia Aktif</h3>
          <p className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{totalLansia}</p>
        </button>
        <button onClick={() => setActiveFilter({type: 'Gender', value: 'L'})} className={`w-full cursor-pointer bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95 active:translate-y-0 ${activeFilter.value === 'L' ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-indigo-100' : 'border-gray-100 dark:border-gray-700 hover:border-indigo-300'} flex flex-col justify-center items-center text-center`}>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex justify-center items-center mb-2 sm:mb-4"><UserCheck className="w-6 h-6 sm:w-8 sm:h-8"/></div>
          <h3 className="text-gray-500 font-semibold mb-1 text-[10px] sm:text-sm whitespace-nowrap">Laki-laki Aktif</h3>
          <p className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{lakiLaki}</p>
        </button>
        <button onClick={() => setActiveFilter({type: 'Gender', value: 'P'})} className={`w-full cursor-pointer bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95 active:translate-y-0 ${activeFilter.value === 'P' ? 'border-pink-500 ring-4 ring-pink-500/20 shadow-pink-100' : 'border-gray-100 dark:border-gray-700 hover:border-pink-300'} flex flex-col justify-center items-center text-center`}>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 text-pink-600 rounded-2xl flex justify-center items-center mb-2 sm:mb-4"><UserCheck className="w-6 h-6 sm:w-8 sm:h-8"/></div>
          <h3 className="text-gray-500 font-semibold mb-1 text-[10px] sm:text-sm whitespace-nowrap">Perempuan Aktif</h3>
          <p className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{perempuan}</p>
        </button>
        <button onClick={() => setActiveFilter({type: 'Kehadiran', value: 'Hadir Bulan Ini'})} className={`w-full cursor-pointer bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95 active:translate-y-0 ${activeFilter.value === 'Hadir Bulan Ini' ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-emerald-100' : 'border-gray-100 dark:border-gray-700 hover:border-emerald-300'} flex flex-col justify-center items-center text-center`}>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex justify-center items-center mb-2 sm:mb-4"><ActivityIcon className="w-6 h-6 sm:w-8 sm:h-8"/></div>
          <h3 className="text-gray-500 font-semibold mb-1 text-[10px] sm:text-sm whitespace-nowrap">Hadir Bulan Ini</h3>
          <p className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{hadirBulanIni}</p>
        </button>
        <button onClick={() => setActiveFilter({type: 'Kehadiran', value: 'Belum Hadir Bulan Ini'})} className={`w-full cursor-pointer bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95 active:translate-y-0 ${activeFilter.value === 'Belum Hadir Bulan Ini' ? 'border-orange-500 ring-4 ring-orange-500/20 shadow-orange-100' : 'border-gray-100 dark:border-gray-700 hover:border-orange-300'} flex flex-col justify-center items-center text-center`}>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 text-orange-600 rounded-2xl flex justify-center items-center mb-2 sm:mb-4"><Clock className="w-6 h-6 sm:w-8 sm:h-8"/></div>
          <h3 className="text-gray-500 font-semibold mb-1 text-[10px] sm:text-sm whitespace-nowrap">Belum Hadir Bln Ini</h3>
          <p className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{belumHadirBulanIni}</p>
        </button>
        <button onClick={() => setActiveFilter({type: 'Status', value: 'Meninggal'})} className={`w-full cursor-pointer bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95 active:translate-y-0 ${activeFilter.value === 'Meninggal' ? 'border-red-500 ring-4 ring-red-500/20 shadow-red-100' : 'border-gray-100 dark:border-gray-700 hover:border-red-300'} flex flex-col justify-center items-center text-center`} title={mostCommonPenyebab !== '-' ? `Penyebab terbanyak: ${mostCommonPenyebab}` : 'Meninggal'}>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 text-red-600 rounded-2xl flex justify-center items-center mb-2 sm:mb-4"><UserMinus className="w-6 h-6 sm:w-8 sm:h-8"/></div>
          <h3 className="text-gray-500 font-semibold mb-1 text-[10px] sm:text-sm whitespace-nowrap">Meninggal</h3>
          <p className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{totalMeninggal}</p>
          {mostCommonPenyebab !== '-' && <p className="text-[9px] sm:text-[10px] text-red-500 mt-2 line-clamp-1 max-w-[120px]">Mayoritas: {mostCommonPenyebab}</p>}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2"><ClipboardList className="text-pink-500"/> Rincian Data Lansia</h3>
            <p className="text-sm text-gray-500 mt-1">
              Menampilkan {activeFilter.type === 'Semua' ? 'semua data lansia' : `data yang difilter: ${activeFilter.type} (${activeFilter.value === 'L' ? 'Laki-laki' : activeFilter.value === 'P' ? 'Perempuan' : activeFilter.value})`} ({tableData.length} orang).
            </p>
          </div>
          {activeFilter.type !== 'Status' || activeFilter.value !== 'Aktif' ? (
            <Button size="sm" variant="outline" onClick={() => setActiveFilter({type: 'Status', value: 'Aktif'})} className="text-xs">
              Kembali ke Lansia Aktif
            </Button>
          ) : null}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 font-semibold whitespace-nowrap">NIK</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Nama Lengkap</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">L/P</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Usia</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Kel/Desa</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">RW/RT</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedData.map((l, idx) => {
                const displayNik = isKader && l.nik.length === 16 ? l.nik.substring(0, 6) + '******' + l.nik.substring(12) : l.nik;
                return (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-400">{displayNik}</td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">{l.nama}</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">{l.jk}</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">{l.usia} thn</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{l.kelurahan}</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">{l.rw}/{l.rt}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold ${
                      l.status === 'Normal' ? 'bg-emerald-100 text-emerald-700' :
                      l.status === 'Pantau' ? 'bg-amber-100 text-amber-700' :
                      l.status === 'Rujuk' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
                );
              })}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Tidak ada data yang sesuai filter.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 bg-gray-50/50 dark:bg-gray-900/30 gap-4">
            <span>Menampilkan {paginatedData.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, tableData.length)} dari {tableData.length} data</span>
            <div className="flex gap-2 items-center">
              <span className="mr-2">Halaman {currentPage} dari {totalPages}</span>
              <Button size="sm" variant="secondary" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 cursor-pointer"><ChevronLeft size={16}/></Button>
              <Button size="sm" variant="secondary" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 cursor-pointer"><ChevronRight size={16}/></Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><ActivityIcon className="text-emerald-500"/> Distribusi Status Kesehatan</h3>
          <div className="space-y-4">
            {Object.entries(statusCount).map(([status, count]) => {
              const perc = totalLansia > 0 ? Math.round((count / totalLansia) * 100) : 0;
              let color = 'bg-gray-500';
              if (status === 'Normal') color = 'bg-emerald-500';
              if (status === 'Pantau') color = 'bg-amber-500';
              if (status === 'Rujuk') color = 'bg-red-500';
              if (status === 'Terdaftar') color = 'bg-blue-500';
              
              return (
                <div key={status} onClick={() => setActiveFilter({type: 'Status', value: status})} className={`cursor-pointer p-3 -mx-3 rounded-xl transition-colors ${activeFilter.value === status ? 'bg-gray-50 dark:bg-gray-700/50 ring-1 ring-gray-200 dark:ring-gray-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
                  <div className="flex justify-between items-end mb-1 text-sm font-semibold">
                    <span className="text-gray-700 dark:text-gray-300">{status}</span>
                    <span className="text-gray-500">{count} orang ({perc}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${perc}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><BarChart2 className="text-blue-500"/> Distribusi Usia</h3>
          <div className="space-y-4">
            {Object.entries(ageGroups).map(([group, count]) => {
              const perc = totalLansia > 0 ? Math.round((count / totalLansia) * 100) : 0;
              return (
                <div key={group} onClick={() => setActiveFilter({type: 'Usia', value: group})} className={`cursor-pointer p-3 -mx-3 rounded-xl transition-colors ${activeFilter.value === group ? 'bg-gray-50 dark:bg-gray-700/50 ring-1 ring-gray-200 dark:ring-gray-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
                  <div className="flex justify-between items-end mb-1 text-sm font-semibold">
                    <span className="text-gray-700 dark:text-gray-300">{group} Tahun</span>
                    <span className="text-gray-500">{count} orang ({perc}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${perc}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><UserMinus className="text-red-500"/> Penyebab Kematian</h3>
          <div className="space-y-4">
            {Object.keys(penyebabKematianMap).length > 0 ? Object.entries(penyebabKematianMap)
              .sort((a, b) => b[1] - a[1])
              .map(([penyebab, count]) => {
              const perc = totalMeninggal > 0 ? Math.round((count / totalMeninggal) * 100) : 0;
              return (
                <div key={penyebab} className="p-3 -mx-3 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <div className="flex justify-between items-end mb-1 text-sm font-semibold">
                    <span className="text-gray-700 dark:text-gray-300 capitalize line-clamp-1 mr-2">{penyebab}</span>
                    <span className="text-gray-500 shrink-0">{count} orang ({perc}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${perc}%` }}></div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center text-gray-500 py-10">Belum ada data penyebab kematian.</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <h3 className="font-bold text-lg flex items-center gap-2"><MapPin className="text-indigo-500"/> Sebaran per Wilayah (Desa/Kelurahan)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Desa / Kelurahan</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Total Lansia</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Laki-Laki</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Perempuan</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Perlu Rujukan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {Object.keys(masterRegions)
                .filter(kel => {
                  if (filterKel !== 'Semua' && kel !== filterKel) return false;
                  if ((isKader || isBidan) && currentUser?.kelurahan && kel !== currentUser.kelurahan) return false;
                  return true;
                })
                .map(kelurahan => {
                const kelData = activeData.filter(l => l.kelurahan === kelurahan);
                const lCount = kelData.filter(l => l.jk === 'L').length;
                const pCount = kelData.filter(l => l.jk === 'P').length;
                const rujukCount = kelData.filter(l => l.status === 'Rujuk').length;
                
                return (
                  <tr key={kelurahan} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">{kelurahan}</td>
                    <td className="px-6 py-4 text-center font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10">{kelData.length}</td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">{lCount}</td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">{pCount}</td>
                    <td className="px-6 py-4 text-center">
                       {rujukCount > 0 ? <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">{rujukCount} Lansia</span> : <span className="text-gray-400">-</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};



