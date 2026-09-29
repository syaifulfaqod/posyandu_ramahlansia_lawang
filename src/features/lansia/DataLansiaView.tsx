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
import { Portal } from '@/components/ui/Wrappers';
import { AddLansiaModal } from './AddLansiaModal';
import { RiwayatModal } from './RiwayatModal';
import { useBulkCreateLansia } from '@/hooks/queries/useLansia';


export const DataLansiaView = ({ data, onExamine, onAddPatient, onEditPatient, onDeletePatient, onUpdateStatus, masterRegions, currentUser }: any) => {
  const isKader = currentUser?.role === 'Kader';
  const isKetuaKader = currentUser?.role === 'Ketua Kader';
  const isBidan = currentUser?.role === 'Bidan';
  const bulkCreateMutation = useBulkCreateLansia();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelurahan, setFilterKelurahan] = useState((isKader || isKetuaKader || isBidan) && currentUser?.kelurahan ? currentUser.kelurahan : 'Semua');
  const [filterRW, setFilterRW] = useState((isKader || isKetuaKader) && currentUser?.rw ? currentUser.rw : 'Semua');
  const [filterRT, setFilterRT] = useState('Semua');
  const [filterKehadiran, setFilterKehadiran] = useState('Semua');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [isExporting, setIsExporting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deletingPatient, setDeletingPatient] = useState(null);
  const [statusPatient, setStatusPatient] = useState(null);
  const [keteranganMeninggal, setKeteranganMeninggal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const availableKel = Object.keys(masterRegions).sort();
  const availableRW = filterKelurahan !== 'Semua' && masterRegions[filterKelurahan] ? Object.keys(masterRegions[filterKelurahan]).sort() : [];
  const availableRT = filterKelurahan !== 'Semua' && filterRW !== 'Semua' && filterRW !== '' && masterRegions[filterKelurahan]?.[filterRW] ? masterRegions[filterKelurahan][filterRW].sort() : [];

  const filteredData = data.filter((d: any) => {
    const matchSearch = d.nama.toLowerCase().includes(searchTerm.toLowerCase()) || d.nik.includes(searchTerm);
    const matchKelurahan = filterKelurahan === 'Semua' || d.kelurahan === filterKelurahan;
    const matchRW = filterRW === 'Semua' || filterRW === '' || d.rw === filterRW;
    const matchRT = filterRT === 'Semua' || filterRT === '' || d.rt === filterRT;
    let matchKehadiran = true;
    if (filterKehadiran !== 'Semua') {
      const hadirBulanIni = d.riwayat && d.riwayat.some((r: any) => r.tglKunjungan && r.tglKunjungan.startsWith(selectedMonth));
      if (filterKehadiran === 'Sudah Hadir') matchKehadiran = hadirBulanIni;
      else if (filterKehadiran === 'Belum Hadir') matchKehadiran = !hadirBulanIni;
    }
    
    return matchSearch && matchKelurahan && matchRW && matchRT && matchKehadiran;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const handleCetakRujukan = async (patient: any, currentUser: any) => {
    try {
      const { generateSuratRujukan } = await import('@/utils/pdfSuratRujukan');
      generateSuratRujukan(patient, currentUser);
    } catch (error) {
      console.error('Gagal mencetak rujukan:', error);
      alert('Terjadi kesalahan saat memproses PDF.');
    }
  };

  const handleExport = async (type = 'kartu') => {
    try {
      setIsExporting(true);
      const ExcelJS = (await import('exceljs')).default;
      const { saveAs } = (await import('file-saver'));
      const todayFormatted = new Date().toISOString().split('T')[0];
      
      if (type === 'rekap') {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Data Lansia');
        
        const [year, month] = selectedMonth.split('-');
        const monthName = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        
        ws.columns = [
          { key: 'no', width: 5 },
          { key: 'nik', width: 20 },
          { key: 'nama', width: 25 },
          { key: 'jk', width: 15 },
          { key: 'usia', width: 10 },
          { key: 'tglLahir', width: 15 },
          { key: 'alamat', width: 30 },
          { key: 'kelurahan', width: 15 },
          { key: 'rw', width: 5 },
          { key: 'rt', width: 5 },
          { key: 'lastVisit', width: 25 },
          { key: 'bb', width: 10 },
          { key: 'tb', width: 10 },
          { key: 'tdSistole', width: 10 },
          { key: 'tdDiastole', width: 10 },
          { key: 'status', width: 15 },
          { key: 'skilas', width: 25 },
          { key: 'aks', width: 30 },
          { key: 'puma', width: 30 }
        ];

        ws.addRow([`REKAP DATA LANSIA (${filterKehadiran.toUpperCase()})`]);
        ws.addRow([`Bulan Pemeriksaan: ${monthName}`]);
        ws.addRow([]);
        
        ws.mergeCells('A1:S1');
        ws.mergeCells('A2:S2');
        ws.getRow(1).font = { bold: true, size: 14 };
        ws.getRow(2).font = { bold: true, size: 12 };

        ws.addRow([
          'No', 'NIK', 'Nama Lengkap', 'Jenis Kelamin', 'Usia', 'Tgl Lahir', 'Alamat', 
          'Kelurahan', 'RW', 'RT', 'Tanggal Kunjungan (Bulan Ini)', 'BB (kg)', 'TB (cm)', 
          'Sistole', 'Diastole', 'Status (Bulan Ini)', 'Hasil SKILAS (Terbaru)', 
          'Skor AKS (Terbaru)', 'Skor PUMA (Terbaru)'
        ]);
        
        filteredData.forEach((patient: any, idx: number) => {
          const riwayatBulanIni = patient.riwayat ? patient.riwayat.find((r: any) => r.tglKunjungan && r.tglKunjungan.startsWith(selectedMonth)) : null;
          
          let tglBulanIniFormatted = '-';
          if (riwayatBulanIni && riwayatBulanIni.tglKunjungan) {
            const d = new Date(riwayatBulanIni.tglKunjungan);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
            tglBulanIniFormatted = `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
          }
          
          let tglLahirFormatted = '-';
          if (patient.tglLahir) {
            const d = new Date(patient.tglLahir);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
            tglLahirFormatted = `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
          }
          
          const maxDate = `${selectedMonth}-31`;
          const allRiwayatBeforeOrOn = (patient.riwayat || []).filter((r: any) => r.tglKunjungan && r.tglKunjungan <= maxDate);
          
          allRiwayatBeforeOrOn.sort((a: any, b: any) => new Date(b.tglKunjungan).getTime() - new Date(a.tglKunjungan).getTime());
          
          let latestSkilas = '-';
          let latestAks = null;
          let latestPuma = null;

          for (const r of allRiwayatBeforeOrOn) {
            if (latestSkilas === '-' && r.skilas && r.skilas !== '-') latestSkilas = r.skilas;
            if (latestAks === null && r.aks !== undefined && r.aks !== null && r.aks !== '-') latestAks = r.aks;
            if (latestPuma === null && r.puma !== undefined && r.puma !== null && r.puma !== '-') latestPuma = r.puma;
            if (latestSkilas !== '-' && latestAks !== null && latestPuma !== null) break;
          }
          if (latestSkilas === '-' && patient.skilas && patient.skilas !== '-') latestSkilas = patient.skilas;
          if (latestAks === null && patient.aks !== undefined && patient.aks !== null && patient.aks !== '-') latestAks = patient.aks;
          if (latestPuma === null && patient.puma !== undefined && patient.puma !== null && patient.puma !== '-') latestPuma = patient.puma;

          let skilasDesc = latestSkilas === 'Normal' ? 'Normal (Aman)' : latestSkilas === 'Abnormal' ? 'Abnormal (Perlu Rujukan)' : '-';
          
          let aksDesc = '-';
          if (latestAks !== undefined && latestAks !== null && typeof latestAks === 'number') {
            if (latestAks === 20) aksDesc = `${latestAks} (Mandiri)`;
            else if (latestAks >= 12) aksDesc = `${latestAks} (Ketergantungan Ringan)`;
            else if (latestAks >= 9) aksDesc = `${latestAks} (Ketergantungan Sedang)`;
            else if (latestAks >= 5) aksDesc = `${latestAks} (Ketergantungan Berat)`;
            else aksDesc = `${latestAks} (Ketergantungan Total)`;
          } else if (typeof latestAks === 'string' && latestAks !== '-') {
            aksDesc = latestAks;
          }

          let pumaDesc = '-';
          if (latestPuma !== undefined && latestPuma !== null && typeof latestPuma === 'number') {
            if (latestPuma >= 6) pumaDesc = `${latestPuma} (Risiko Tinggi / Perlu Rujukan)`;
            else pumaDesc = `${latestPuma} (Risiko Rendah / Aman)`;
          } else if (typeof latestPuma === 'string' && latestPuma !== '-') {
            pumaDesc = latestPuma;
          }

          ws.addRow({
            no: idx + 1,
            nik: patient.nik,
            nama: patient.nama,
            jk: patient.jk === 'L' ? 'Laki-laki' : 'Perempuan',
            usia: patient.usia,
            tglLahir: tglLahirFormatted,
            alamat: patient.alamat,
            kelurahan: patient.kelurahan,
            rw: patient.rw,
            rt: patient.rt,
            lastVisit: tglBulanIniFormatted,
            bb: riwayatBulanIni?.bb || '-',
            tb: riwayatBulanIni?.tb || '-',
            tdSistole: riwayatBulanIni?.tdSistole || '-',
            tdDiastole: riwayatBulanIni?.tdDiastole || '-',
            status: patient.status === 'Meninggal' ? 'Meninggal' : (riwayatBulanIni?.status || patient.status || '-'),
            skilas: skilasDesc,
            aks: aksDesc,
            puma: pumaDesc
          });
        });
        
        ws.getRow(4).font = { bold: true }; 
        
        const buffer = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Rekap_Data_Lansia_Bulan_${selectedMonth}.xlsx`);
      } else {
        const { exportKartuBantuExcel } = await import('@/utils/excelKartuBantuExport');
        await exportKartuBantuExcel(filteredData, todayFormatted);
      }
    } catch (error) {
      console.error("Export error", error);
      alert("Terjadi kesalahan saat mengekspor data Excel.");
    } finally {
      setIsExporting(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const ExcelJS = (await import('exceljs')).default;
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet('Template Import');

      ws.columns = [
        { header: 'NIK (16 Digit)', key: 'nik', width: 25 },
        { header: 'NAMA', key: 'nama', width: 30 },
        { header: 'JENIS KELAMIN (L/P)', key: 'jk', width: 20 },
        { header: 'TANGGAL LAHIR (YYYY-MM-DD)', key: 'tglLahir', width: 30 },
        { header: 'KELURAHAN', key: 'kelurahan', width: 20 },
        { header: 'RW (Misal: 01)', key: 'rw', width: 15 },
        { header: 'RT (Misal: 01)', key: 'rt', width: 15 },
        { header: 'ALAMAT', key: 'alamat', width: 40 },
      ];

      ws.getRow(1).font = { bold: true };
      
      const buffer = await wb.xlsx.writeBuffer();
      const { saveAs } = await import('file-saver');
      saveAs(new Blob([buffer]), 'Template_Import_Lansia.xlsx');
    } catch (error) {
      console.error(error);
      alert('Gagal membuat template Excel.');
    }
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsExporting(true);
      const ExcelJS = (await import('exceljs')).default;
      const wb = new ExcelJS.Workbook();
      const reader = new FileReader();

      reader.onload = async (evt) => {
        try {
          const buffer = evt.target?.result;
          if (!buffer) return;
          await wb.xlsx.load(buffer as ArrayBuffer);
          const ws = wb.worksheets[0];
          const payload: any[] = [];
          
          ws.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header
            
            const rawNik = row.getCell(1).value?.toString() || '';
            const rawNama = row.getCell(2).value?.toString() || '';
            let rawJk = row.getCell(3).value?.toString().toUpperCase() || '';
            const rawTglLahir = row.getCell(4).value?.toString() || '';
            const rawKelurahan = row.getCell(5).value?.toString() || '';
            const rawRw = row.getCell(6).value?.toString() || '';
            const rawRt = row.getCell(7).value?.toString() || '';
            const rawAlamat = row.getCell(8).value?.toString() || '';

            if (rawNik && rawNama) {
              if (rawJk !== 'L' && rawJk !== 'P') rawJk = 'P'; // Default
              
              let formattedTglLahir = new Date().toISOString();
              try {
                if (rawTglLahir) {
                  const d = new Date(rawTglLahir);
                  if (!isNaN(d.getTime())) formattedTglLahir = d.toISOString();
                }
              } catch (e) {}

              let rwString = rawRw;
              if (rwString.length === 1 && !isNaN(Number(rwString))) rwString = `0${rwString}`;
              let rtString = rawRt;
              if (rtString.length === 1 && !isNaN(Number(rtString))) rtString = `0${rtString}`;

              payload.push({
                nik: rawNik.replace(/\D/g, '').substring(0, 16),
                nama: rawNama,
                jk: rawJk,
                tglLahir: formattedTglLahir,
                kelurahan: rawKelurahan,
                rw: rwString,
                rt: rtString,
                alamat: rawAlamat,
                status: 'Terdaftar',
                usia: 60, // Auto calculated on backend anyway
                isDeleted: false
              });
            }
          });

          if (payload.length > 0) {
            await bulkCreateMutation.mutateAsync(payload);
            alert(`Berhasil mengimpor ${payload.length} data lansia.`);
          } else {
            alert('Tidak ada data valid yang ditemukan dalam file.');
          }
        } catch (err) {
          console.error(err);
          alert('Gagal membaca isi file Excel.');
        } finally {
          setIsExporting(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
      alert('Gagal memproses file.');
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
      <div className="p-4 lg:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col gap-5 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white shrink-0">Direktori Lansia</h2>
          <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center w-full lg:w-auto">
            {(currentUser?.role === 'Admin' || isKetuaKader || isBidan) && (
              <>
                <Button variant="secondary" icon={Download} onClick={() => handleExport('kartu')} disabled={isExporting} className="cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 text-sm h-11 flex-1 sm:flex-none justify-center shadow-sm">{isExporting ? 'Proses...' : 'Kartu Bantu'}</Button>
                <Button variant="secondary" icon={FileText} onClick={() => handleExport('rekap')} disabled={isExporting} className="cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 text-sm h-11 flex-1 sm:flex-none justify-center shadow-sm">{isExporting ? 'Proses...' : 'Excel Rekap'}</Button>
              </>
            )}
            {currentUser?.email?.startsWith('kknramahlansia') && (
              <>
                <Button variant="secondary" icon={FileText} onClick={downloadTemplate} disabled={isExporting} className="cursor-pointer bg-green-50 text-green-700 hover:bg-green-100 border-green-200 text-sm h-11 flex-1 sm:flex-none justify-center shadow-sm border">Template Import</Button>
                <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleImportExcel} className="hidden" />
                <Button variant="success" icon={Upload} onClick={() => fileInputRef.current?.click()} disabled={isExporting} className="border-none text-sm h-11 flex-1 sm:flex-none justify-center font-bold">Import Excel</Button>
              </>
            )}
            <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm h-11 flex-1 sm:flex-none justify-center font-bold">Lansia Baru</Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Cari nama lansia atau NIK..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"/>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select value={filterKelurahan} onChange={(e) => { setFilterKelurahan(e.target.value); setFilterRW('Semua'); setFilterRT('Semua'); }} disabled={isKader || isKetuaKader || isBidan} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed appearance-none">
                <option value="Semua">Semua Desa/Kel.</option>{availableKel.map(kel => (<option key={kel} value={kel}>{kel}</option>))}
              </select>
            </div>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select value={filterRW} onChange={(e) => { setFilterRW(e.target.value); setFilterRT('Semua'); }} disabled={isKader || isKetuaKader || filterKelurahan === 'Semua' || availableRW.length === 0} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-70 disabled:cursor-not-allowed appearance-none cursor-pointer">
                <option value="Semua">Semua RW</option>
                {availableRW.map(rw => (<option key={rw} value={rw}>{rw}</option>))}
              </select>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select value={filterRT} onChange={(e) => setFilterRT(e.target.value)} disabled={filterRW === 'Semua' || filterRW === '' || availableRT.length === 0} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-70 disabled:cursor-not-allowed appearance-none cursor-pointer">
                <option value="Semua">Semua RT</option>
                {availableRT.map(rt => (<option key={rt} value={rt}>{rt}</option>))}
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer" />
            </div>
            <div className="relative">
              <ActivityIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select value={filterKehadiran} onChange={(e) => setFilterKehadiran(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer appearance-none">
                <option value="Semua">Semua Kehadiran</option>
                <option value="Sudah Hadir">Sudah Hadir</option>
                <option value="Belum Hadir">Belum Hadir</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-full">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 lg:px-6 py-4 font-semibold w-16 whitespace-nowrap">No</th>
              <th className="px-4 lg:px-6 py-4 font-semibold whitespace-nowrap">Nama & NIK</th>
              <th className="px-4 lg:px-6 py-4 font-semibold whitespace-nowrap">L/P</th>
              <th className="px-4 lg:px-6 py-4 font-semibold whitespace-nowrap">Usia</th>
              <th className="px-4 lg:px-6 py-4 font-semibold whitespace-nowrap">Alamat Wilayah</th>
              <th className="px-4 lg:px-6 py-4 font-semibold whitespace-nowrap">Kunjungan Terakhir</th>
              <th className="px-4 lg:px-6 py-4 font-semibold whitespace-nowrap">Status</th>
              <th className="px-4 lg:px-6 py-4 font-semibold text-right whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.map((patient: any, index: number) => {
              const displayNik = isKader && patient.nik.length === 16 ? patient.nik.substring(0, 6) + '******' + patient.nik.substring(12) : patient.nik;
              return (
              <tr key={patient.id} className={`transition-colors group ${patient.status === 'Meninggal' ? 'bg-gray-100 dark:bg-gray-800/80 opacity-75 grayscale' : 'hover:bg-gray-50 dark:hover:bg-gray-750/50'}`}>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-500">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                <td className="px-4 lg:px-6 py-4">
                  <div className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">{patient.nama}</div><div className="text-xs text-gray-500 whitespace-nowrap">{displayNik}</div>
                </td>
                <td className="px-4 lg:px-6 py-4">{patient.jk}</td>
                <td className="px-4 lg:px-6 py-4">{patient.usia} thn</td>
                <td className="px-4 lg:px-6 py-4">
                  <div className="text-sm whitespace-nowrap">{patient.alamat}</div><div className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">Desa/Kel. {patient.kelurahan}, RT {patient.rt}/RW {patient.rw}</div>
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {patient.lastVisit && patient.lastVisit !== 'Belum pernah' ? (
                    (() => {
                      const d = new Date(patient.lastVisit);
                      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
                      return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                    })()
                  ) : (
                    <span className="text-gray-400 italic">Belum pernah</span>
                  )}
                </td>
                <td className="px-4 lg:px-6 py-4">
                  <Badge type={patient.status}>{patient.status}</Badge>
                </td>
                <td className="px-4 lg:px-6 py-4 text-right">
                  <div className="flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[100px] sm:max-w-[210px] ml-auto">
                    <Button variant="secondary" className="text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100 dark:bg-blue-900/30 dark:border-blue-800 dark:hover:bg-blue-900/50 text-xs sm:text-sm px-2.5 py-1.5 cursor-pointer justify-start shadow-sm w-full sm:w-24" onClick={() => setSelectedHistory(patient)} title="Riwayat">
                      <Clock size={14} className="mr-1"/> <span>Riwayat</span>
                    </Button>
                    
                    {patient.status !== 'Meninggal' ? (
                      <>
                        <Button variant="secondary" className="text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100 dark:bg-amber-900/30 dark:border-amber-800 dark:hover:bg-amber-900/50 text-xs sm:text-sm px-2.5 py-1.5 cursor-pointer justify-start shadow-sm w-full sm:w-24" onClick={() => setEditingPatient(patient)} title="Edit Data">
                          <Edit2 size={14} className="mr-1"/> <span>Edit</span>
                        </Button>
                        <Button variant="secondary" className="text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 text-xs sm:text-sm px-2.5 py-1.5 cursor-pointer justify-start shadow-sm w-full sm:w-24" onClick={() => { setStatusPatient({ id: patient.id, nama: patient.nama }); setKeteranganMeninggal(''); }} title="Tandai Meninggal">
                          <UserMinus size={14} className="mr-1"/> <span>Wafat</span>
                        </Button>
                        {!isKader && (
                          <Button variant="secondary" className="text-red-600 bg-red-50 border-red-100 hover:bg-red-100 dark:bg-red-900/30 dark:border-red-800 dark:hover:bg-red-900/50 text-xs sm:text-sm px-2.5 py-1.5 cursor-pointer justify-start shadow-sm w-full sm:w-24" onClick={() => setDeletingPatient({ id: patient.id, nama: patient.nama })} title="Hapus Data">
                            <Trash2 size={14} className="mr-1"/> <span>Hapus</span>
                          </Button>
                        )}
                      </>
                    ) : (
                       !isKader && (
                         <Button variant="secondary" className="text-red-600 bg-red-50 border-red-100 hover:bg-red-100 dark:bg-red-900/30 dark:border-red-800 dark:hover:bg-red-900/50 text-xs sm:text-sm px-2.5 py-1.5 cursor-pointer justify-start shadow-sm w-full sm:w-24" onClick={() => setDeletingPatient({ id: patient.id, nama: patient.nama })} title="Hapus Data">
                           <Trash2 size={14} className="mr-1"/> <span>Hapus</span>
                         </Button>
                       )
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
            {filteredData.length === 0 && (<tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500">Data tidak ditemukan.</td></tr>)}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500 bg-white dark:bg-gray-800">
        <span>Menampilkan {paginatedData.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} data</span>
        <div className="flex gap-2 items-center">
          <span className="mr-2">Halaman {currentPage} dari {totalPages}</span>
          <Button variant="secondary" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 cursor-pointer"><ChevronLeft size={16}/></Button>
          <Button variant="secondary" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 cursor-pointer"><ChevronRight size={16}/></Button>
        </div>
      </div>
        <AnimatePresence>
          {showAddModal && (<AddLansiaModal isKader={isKader} onClose={() => setShowAddModal(false)} onSave={(newPatient) => { onAddPatient(newPatient); setShowAddModal(false); }} masterRegions={masterRegions} currentUser={currentUser} />)}
        </AnimatePresence>
        <AnimatePresence>
          {editingPatient && (<AddLansiaModal isKader={isKader} initialData={editingPatient} onClose={() => setEditingPatient(null)} onSave={(updatedPatient) => { onEditPatient(updatedPatient); setEditingPatient(null); }} masterRegions={masterRegions} currentUser={currentUser} />)}
        </AnimatePresence>
      <AnimatePresence>
        {deletingPatient && (
          <Portal>
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hapus Data Lansia</h3>
                  <p className="text-gray-500 mb-6">Apakah Anda yakin ingin menghapus data lansia <strong>{deletingPatient.nama}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
                  <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => setDeletingPatient(null)}>Batal</Button>
                    <Button variant="primary" className="bg-red-600 hover:bg-red-700 border-red-600 text-white cursor-pointer" onClick={() => { onDeletePatient(deletingPatient.id); setDeletingPatient(null); }}>Hapus Data</Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </Portal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {statusPatient && (
          <Portal>
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Konfirmasi Meninggal</h3>
                  <p className="text-gray-500 mb-4">Tandai lansia <strong>{statusPatient.nama}</strong> sebagai Meninggal? Status ini akan diperbarui dan riwayat tetap tersimpan.</p>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Keterangan / Penyebab Kematian (Opsional)</label>
                    <textarea value={keteranganMeninggal} onChange={(e) => setKeteranganMeninggal(e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-gray-800 outline-none resize-none" rows={3} placeholder="Contoh: Karena sakit tua, serangan jantung, dll."></textarea>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => setStatusPatient(null)}>Batal</Button>
                    <Button variant="primary" className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-800 text-white cursor-pointer" onClick={() => { onUpdateStatus(statusPatient.id, 'Meninggal', keteranganMeninggal); setStatusPatient(null); }}>Ya, Tandai Meninggal</Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </Portal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedHistory && (<RiwayatModal patient={selectedHistory} isKader={isKader} onClose={() => setSelectedHistory(null)} onCompletePemeriksaan={(idx) => { setSelectedHistory(null); onExamine(selectedHistory, currentUser?.role?.toLowerCase() || 'bidan', idx); }} />)}
      </AnimatePresence>
    </div>
  );
};
