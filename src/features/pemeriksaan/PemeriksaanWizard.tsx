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


const BidanSteps = [
  { id: 'identitas', label: 'Data Diri', icon: User },
  { id: 'dasar', label: 'Fisik & Lab', icon: ActivityIcon },
  { id: 'skilas', label: 'SKILAS', icon: Brain },
  { id: 'aks', label: 'AKS', icon: UserCheck },
  { id: 'puma', label: 'PUMA & TBC', icon: Stethoscope },
  { id: 'hasil', label: 'Kesimpulan', icon: FileText }
];

const KaderSteps = [
  { id: 'identitas', label: 'Data Diri', icon: User },
  { id: 'dasar', label: 'Fisik Dasar', icon: ActivityIcon },
  { id: 'hasil', label: 'Selesai', icon: CheckCircle2 }
];

const getPastRecordByMonths = (riwayat, targetMonths) => {
  if (!riwayat || !riwayat.length) return null;
  const now = new Date();
  const currentMonthTotal = now.getFullYear() * 12 + now.getMonth();
  
  const validRecords = riwayat.filter(record => {
    if (!record.tglKunjungan) return false;
    const recordDate = new Date(record.tglKunjungan);
    const recordMonthTotal = recordDate.getFullYear() * 12 + recordDate.getMonth();
    return (currentMonthTotal - recordMonthTotal) === targetMonths;
  });

  if (validRecords.length > 0) {
    return validRecords.sort((a, b) => new Date(b.tglKunjungan) - new Date(a.tglKunjungan))[0];
  }
  return null;
};

export const PemeriksaanWizard = ({ config, onComplete, onCancel, masterRegions, currentUser = null }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [validationError, setValidationError] = useState('');
  const stepContainerRef = React.useRef(null);

  useEffect(() => {
    if (stepContainerRef.current) {
      const activeElement = stepContainerRef.current.querySelector(`[data-step="${currentStep}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentStep]);

  const { patient, mode: rawMode, riwayatIndex } = config;
  const mode = (rawMode === 'admin' || rawMode === 'ketua kader') ? 'bidan' : rawMode;
  const availableKel = Object.keys(masterRegions).sort();
  const defaultKel = ((currentUser?.role === 'Kader' || currentUser?.role === 'Ketua Kader') && currentUser?.kelurahan) ? currentUser.kelurahan : availableKel[0] || '';
  const defaultRW = ((currentUser?.role === 'Kader' || currentUser?.role === 'Ketua Kader') && currentUser?.rw) ? currentUser.rw : '';
  
  const existingRiwayat = riwayatIndex !== null && patient?.riwayat ? patient.riwayat[riwayatIndex] : null;
  const initData = existingRiwayat || {};
  const pastRecord3Months = getPastRecordByMonths(patient?.riwayat, 3);
  
  const parseBool = (val) => {
    if (val === 1 || val === '1' || val === true || val === 'true') return true;
    if (val === 0 || val === '0' || val === false || val === 'false') return false;
    return null;
  };

  const [formData, setFormData] = useState({
    nama: patient?.nama || '', nik: patient?.nik || '', jk: patient?.jk || 'P',
    tglLahir: patient?.tglLahir || '', alamat: patient?.alamat || '',
    kelurahan: patient?.kelurahan || defaultKel, rw: patient?.rw || defaultRW, rt: patient?.rt || '',
    golDarah: patient?.golDarah || '-', statusKawin: patient?.statusKawin || 'Kawin', pekerjaan: patient?.pekerjaan || '',
    
    bb: initData.bb || '', tb: initData.tb || '', lingkarPerut: initData.lingkarPerut || '', lingkarLengan: initData.lingkarLengan || '',
    tdSistole: initData.tdSistole || '', tdDiastole: initData.tdDiastole || '',
    gulaDarah: initData.gulaDarah || '', kolesterol: initData.kolesterol || '', trigliserida: initData.trigliserida || '', hdl: initData.hdl || '', asamUrat: initData.asamUrat || '',
    ekg: initData.ekg || '', mataKanan: initData.mataKanan || '', mataKiri: initData.mataKiri || '', telingaKanan: initData.telingaKanan || '', telingaKiri: initData.telingaKiri || '',
    catatan: initData.catatan || '',
    
    skilasKognitifOrientasi: parseBool(initData.skilasKognitifOrientasi), skilasKognitifMengulang: parseBool(initData.skilasKognitifMengulang),
    skilasMobilisasiBerdiri: parseBool(initData.skilasMobilisasiBerdiri), 
    skilasNutrisiBbturun: parseBool(initData.skilasNutrisiBbturun) ?? (
      (pastRecord3Months?.bb && initData.bb) ? (parseFloat(pastRecord3Months.bb) - parseFloat(initData.bb)) > 3 : null
    ),
    skilasNutrisiNafsumakan: parseBool(initData.skilasNutrisiNafsumakan), 
    skilasNutrisiLila: parseBool(initData.skilasNutrisiLila) ?? (initData.lingkarLengan && !isNaN(parseFloat(initData.lingkarLengan)) ? parseFloat(initData.lingkarLengan) < 21 : null),
    skilasMataMasalah: parseBool(initData.skilasMataMasalah), 
    skilasMataTes: parseBool(initData.skilasMataTes) ?? ((initData.mataKanan && initData.mataKiri) ? (initData.mataKanan === 'Gangguan' || initData.mataKiri === 'Gangguan') : null),
    skilasTelingaBisik: parseBool(initData.skilasTelingaBisik) ?? ((initData.telingaKanan && initData.telingaKiri) ? (initData.telingaKanan === 'Gangguan' || initData.telingaKiri === 'Gangguan') : null),
    skilasTelingaTes: parseBool(initData.skilasTelingaTes) ?? ((initData.telingaKanan && initData.telingaKiri) ? (initData.telingaKanan === 'Tidak dapat dites' || initData.telingaKiri === 'Tidak dapat dites') : null),
    skilasDepresiSedih: parseBool(initData.skilasDepresiSedih), skilasDepresiMinat: parseBool(initData.skilasDepresiMinat),
    skilasCovid: parseBool(initData.skilasCovid),

    aksBAB: initData.aksBAB ?? null, aksBAK: initData.aksBAK ?? null, aksGrooming: initData.aksGrooming ?? null, 
    aksToilet: initData.aksToilet ?? null, aksMakan: initData.aksMakan ?? null, aksTransfer: initData.aksTransfer ?? null, 
    aksMobilitas: initData.aksMobilitas ?? null, aksBerpakaian: initData.aksBerpakaian ?? null, aksTangga: initData.aksTangga ?? null, aksMandi: initData.aksMandi ?? null, 
    
    pumaMerokok: initData.pumaMerokok ?? null, pumaNapasPendek: initData.pumaNapasPendek ?? null, pumaDahak: initData.pumaDahak ?? null, pumaBatuk: initData.pumaBatuk ?? null, pumaSpirometri: initData.pumaSpirometri ?? null,

    tbcBatuk: parseBool(initData.tbcBatuk), tbcDemam: parseBool(initData.tbcDemam), 
    tbcBbTurun: parseBool(initData.tbcBbTurun) ?? (
      (riwayatIndex !== null ? patient?.riwayat?.[riwayatIndex + 1]?.bb : patient?.riwayat?.[0]?.bb) && initData.bb ? parseFloat(initData.bb) <= parseFloat(riwayatIndex !== null ? patient.riwayat[riwayatIndex + 1].bb : patient.riwayat[0].bb) : null
    ),
    tbcKontak: parseBool(initData.tbcKontak),
    kontrasepsi: parseBool(initData.kontrasepsi), kontrasepsiJenis: initData.kontrasepsiJenis ?? '',
  });

  const availableRW = formData.kelurahan && masterRegions[formData.kelurahan] ? Object.keys(masterRegions[formData.kelurahan]).sort() : [];
  const availableRT = formData.kelurahan && formData.rw && masterRegions[formData.kelurahan]?.[formData.rw] ? [...masterRegions[formData.kelurahan][formData.rw]].sort() : [];

  const updateForm = (key, value) => {
    setFormData(prev => {
      const newData = { ...prev, [key]: value };
      if (key === 'kelurahan') { newData.rw = ''; newData.rt = ''; }
      if (key === 'rw') { newData.rt = ''; }
      return newData;
    });
  };

  useEffect(() => {
    setFormData(prev => {
      let changed = false;
      const next = { ...prev };
      
      const pastRecord3 = getPastRecordByMonths(patient?.riwayat, 3);
      const previousRecord = riwayatIndex !== null ? patient?.riwayat?.[riwayatIndex + 1] : patient?.riwayat?.[0];
      
      // Nutrisi BB Turun
      let skilasBbTurun = null;
      let isSkilasBbTurunCalculable = false;
      if (pastRecord3 && pastRecord3.bb && next.bb && !isNaN(parseFloat(next.bb))) {
        const lastBb = parseFloat(pastRecord3.bb);
        const currentBb = parseFloat(next.bb);
        skilasBbTurun = (lastBb - currentBb) > 3;
        isSkilasBbTurunCalculable = true;
      }
      if (isSkilasBbTurunCalculable && next.skilasNutrisiBbturun !== skilasBbTurun) {
        next.skilasNutrisiBbturun = skilasBbTurun; changed = true;
      }

      // TBC BB Turun
      let tbcBbTurun = null;
      let isTbcBbTurunCalculable = false;
      if (previousRecord && previousRecord.bb && next.bb && !isNaN(parseFloat(next.bb))) {
        const lastVisitBb = parseFloat(previousRecord.bb);
        const currentBb = parseFloat(next.bb);
        tbcBbTurun = currentBb <= lastVisitBb;
        isTbcBbTurunCalculable = true;
      }
      if (isTbcBbTurunCalculable && next.tbcBbTurun !== tbcBbTurun) {
        next.tbcBbTurun = tbcBbTurun; changed = true;
      }

      // Nutrisi LiLA
      let lilaStatus = null;
      if (next.lingkarLengan && !isNaN(parseFloat(next.lingkarLengan))) {
        lilaStatus = parseFloat(next.lingkarLengan) < 21;
      }
      if (next.skilasNutrisiLila !== lilaStatus) { next.skilasNutrisiLila = lilaStatus; changed = true; }

      // Tes Mata
      let mataTes = null;
      if (next.mataKanan || next.mataKiri) {
        mataTes = (next.mataKanan === 'Gangguan' || next.mataKiri === 'Gangguan');
      }
      if (next.skilasMataTes !== mataTes) { next.skilasMataTes = mataTes; changed = true; }

      // Tes Telinga
      let telingaBisik = null;
      let telingaTes = null;
      if (next.telingaKanan || next.telingaKiri) {
        telingaBisik = (next.telingaKanan === 'Gangguan' || next.telingaKiri === 'Gangguan');
        telingaTes = (next.telingaKanan === 'Tidak dapat dites' || next.telingaKiri === 'Tidak dapat dites');
      }
      if (next.skilasTelingaBisik !== telingaBisik) { next.skilasTelingaBisik = telingaBisik; changed = true; }
      if (next.skilasTelingaTes !== telingaTes) { next.skilasTelingaTes = telingaTes; changed = true; }

      return changed ? next : prev;
    });
  }, [formData.bb, formData.lingkarLengan, formData.mataKanan, formData.mataKiri, formData.telingaKanan, formData.telingaKiri, patient]);

  const calculateIMT = () => {
    if (!formData.bb || !formData.tb) return 0;
    const heightInMeter = parseFloat(formData.tb) / 100;
    return (parseFloat(formData.bb) / (heightInMeter * heightInMeter)).toFixed(1);
  };

  const getIMTStatus = (imt) => {
    if (imt < 18.5) return "Sangat Kurus/Kurus";
    if (imt >= 18.5 && imt <= 24.9) return "Normal";
    if (imt >= 25.0 && imt <= 29.9) return "Gemuk";
    return "Obesitas";
  };

  const calculateSKILAS = () => {
    const isAbnormal = 
      formData.skilasKognitifOrientasi === false || formData.skilasKognitifMengulang === false || formData.skilasMobilisasiBerdiri === false ||
      formData.skilasNutrisiBbturun === true || formData.skilasNutrisiNafsumakan === true || formData.skilasNutrisiLila === true ||
      formData.skilasMataMasalah === true || formData.skilasMataTes === true || formData.skilasTelingaBisik === true || formData.skilasTelingaTes === true ||
      formData.skilasDepresiSedih === true || formData.skilasDepresiMinat === true;
    return isAbnormal ? "Ditemukan Indikasi (Perlu Rujukan)" : "Tidak Ditemukan Indikasi (Normal)";
  };

  const calculateAKS = () => { return (formData.aksBAB||0) + (formData.aksBAK||0) + (formData.aksGrooming||0) + (formData.aksToilet||0) + (formData.aksMakan||0) + (formData.aksTransfer||0) + (formData.aksMobilitas||0) + (formData.aksBerpakaian||0) + (formData.aksTangga||0) + (formData.aksMandi||0); };

  const isAksComplete = () => {
    return ['aksBAB', 'aksBAK', 'aksGrooming', 'aksToilet', 'aksMakan', 'aksTransfer', 'aksMobilitas', 'aksBerpakaian', 'aksTangga', 'aksMandi']
      .every(key => formData[key] !== undefined && formData[key] !== null);
  };

  const getFirstMissingAksField = () => {
    return ['aksBAB', 'aksBAK', 'aksGrooming', 'aksToilet', 'aksMakan', 'aksTransfer', 'aksMobilitas', 'aksBerpakaian', 'aksTangga', 'aksMandi']
      .find(key => formData[key] === undefined || formData[key] === null);
  };

  const skilasRequiredFields = [
    'skilasKognitifOrientasi', 'skilasKognitifMengulang', 'skilasMobilisasiBerdiri', 
    'skilasNutrisiBbturun', 'skilasNutrisiNafsumakan', 'skilasNutrisiLila', 
    'skilasMataMasalah', 'skilasMataTes', 'skilasTelingaBisik', 'skilasTelingaTes', 
    'skilasDepresiSedih', 'skilasDepresiMinat', 'skilasCovid'
  ];

  const isSkilasComplete = () => {
    return skilasRequiredFields.every(key => formData[key] !== undefined && formData[key] !== null);
  };

  const getFirstMissingSkilasField = () => {
    return skilasRequiredFields.find(key => formData[key] === undefined || formData[key] === null);
  };

  const isPumaComplete = () => {
    if (calculateAge(formData.tglLahir) < 40) return true;
    return ['pumaMerokok', 'pumaNapasPendek', 'pumaDahak', 'pumaBatuk', 'pumaSpirometri']
      .every(key => formData[key] !== undefined && formData[key] !== null);
  };

  const getFirstMissingPumaField = () => {
    if (calculateAge(formData.tglLahir) < 40) return undefined;
    return ['pumaMerokok', 'pumaNapasPendek', 'pumaDahak', 'pumaBatuk', 'pumaSpirometri']
      .find(key => formData[key] === undefined || formData[key] === null);
  };
  
  const getAksCategory = (score) => {
    if (score === 20) return "Mandiri (M)";
    if (score >= 12) return "Ketergantungan Ringan (R)";
    if (score >= 9) return "Ketergantungan Sedang (S)";
    if (score >= 5) return "Ketergantungan Berat (B)";
    return "Ketergantungan Total (T)";
  };

  const calculatePUMA = () => {
    const usia = calculateAge(formData.tglLahir);
    if (usia < 40) return 0; 
    let score = formData.jk === 'L' ? 1 : 0; 
    if (usia >= 50 && usia <= 59) score += 1;
    else if (usia >= 60) score += 2;
    let smokingScore = 0;
    if (formData.pumaMerokok === 2) smokingScore = 1; 
    if (formData.pumaMerokok === 3) smokingScore = 2; 
    score += smokingScore + (formData.pumaNapasPendek||0) + (formData.pumaDahak||0) + (formData.pumaBatuk||0) + (formData.pumaSpirometri||0);
    return score;
  };

  const getStatusRNT = (value, type) => {
    if (!value) return null;
    const v = Number(value);
    let status = 'N';
    if (type === 'sistole') { status = v < 100 ? 'R' : v <= 139 ? 'N' : 'T'; }
    else if (type === 'diastole') { status = v < 60 ? 'R' : v <= 89 ? 'N' : 'T'; }
    else if (type === 'gula') { status = v < 70 ? 'R' : v <= 200 ? 'N' : 'T'; }
    else if (type === 'kolesterol') { status = v < 150 ? 'R' : v <= 199 ? 'N' : 'T'; }
    else if (type === 'trigliserida') { status = v < 50 ? 'R' : v <= 149 ? 'N' : 'T'; }
    else if (type === 'hdl') { status = v < 40 ? 'R' : v <= 60 ? 'N' : 'T'; }
    
    const colors = { 'R': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400', 'N': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400', 'T': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400' };
    const labels = { 'R': 'Rendah (R)', 'N': 'Normal (N)', 'T': 'Tinggi (T)' };
    return <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold border ${colors[status]}`}>{labels[status]}</span>;
  };

  const isTbcSuspect = formData.tbcBatuk || formData.tbcDemam || formData.tbcBbTurun || formData.tbcKontak;

  const handleFinalSave = () => {
    const skilasText = calculateSKILAS();
    const aksTotal = calculateAKS();
    const pumaTotal = calculatePUMA();
    
    let finalStatus = 'Normal';
    if (mode === 'bidan') {
      if (skilasText.includes("Perlu Rujukan") || pumaTotal >= 6 || isTbcSuspect) finalStatus = 'Rujuk';
      else if (aksTotal < 20) finalStatus = 'Pantau';
    } else {
      finalStatus = 'Terdaftar';
    }

    const finalData = {
      ...formData,
      usia: calculateAge(formData.tglLahir),
      skilas: mode === 'bidan' ? (skilasText.includes("Normal") ? "Normal" : "Abnormal") : '-',
      aks: mode === 'bidan' ? aksTotal : 0,
      puma: mode === 'bidan' ? pumaTotal : 0,
      status: finalStatus
    };
    onComplete(finalData);
  };

  const activeSteps = mode === 'kader' ? KaderSteps : BidanSteps;

  const currentStepData = activeSteps[currentStep];
  const handleNext = () => {
    setValidationError('');
    if (currentStep === 0 && !patient) {
      if (!formData.nik || !formData.nama || !formData.jk || !formData.tglLahir) {
        setValidationError("Mohon isi data wajib: NIK, Nama Lengkap, Jenis Kelamin, dan Tanggal Lahir sebelum melanjutkan.");
        return;
      }
      if (formData.nik.length !== 16) {
        setValidationError("NIK harus 16 digit.");
        return;
      }
    }
    if (currentStep < activeSteps.length - 1) setCurrentStep(prev => prev + 1);
  };
  const handlePrev = () => { setValidationError(''); if (currentStep > 0) setCurrentStep(prev => prev - 1); };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start sm:items-center bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex flex-col gap-1.5 sm:gap-1 pr-2">
           <div className="text-lg sm:text-xl font-bold flex flex-col sm:flex-row sm:items-center gap-2">
             <span>Pemeriksaan Lansia</span>
             <span className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded w-fit ${mode === 'kader' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>Mode: {mode === 'kader' ? 'Kader (Pengukuran Dasar)' : rawMode === 'admin' ? 'Admin (Lengkapi Skrining)' : rawMode === 'ketua kader' ? 'Ketua Kader (Lengkapi Skrining)' : 'Bidan (Lengkapi Skrining)'}</span>
           </div>
           <p className="text-xs sm:text-sm text-gray-500">Berdasarkan format KARTU BANTU LANSIA.</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors cursor-pointer shrink-0 mt-0.5 sm:mt-0"><X size={20} /></button>
      </div>

      <div ref={stepContainerRef} className="px-4 py-4 md:px-8 border-b border-gray-100 dark:border-gray-800 overflow-x-auto hide-scrollbar bg-white dark:bg-gray-900 scroll-smooth">
        <div className="flex items-center min-w-max gap-2 md:gap-0">
          {activeSteps.map((step, idx) => {
            const isActive = currentStep === idx;
            const isCompleted = currentStep > idx;
            const StepIcon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <div data-step={idx} className="flex flex-col items-center relative z-10 w-24 shrink-0 transition-transform duration-300">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${isActive ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : isCompleted ? 'bg-emerald-100 border-emerald-500 text-emerald-600' : 'bg-white border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-600'}`}>
                    {isCompleted ? <CheckCircle2 size={20} /> : <StepIcon size={18} />}
                  </div>
                  <span className={`mt-2 text-xs font-semibold text-center ${isActive ? 'text-emerald-700' : 'text-gray-500'}`}>{step.label}</span>
                </div>
                {idx < activeSteps.length - 1 && (
                  <div className="flex-1 h-1 w-8 md:w-full mx-2 rounded bg-gray-200 dark:bg-gray-700 relative">
                     <motion.div className="absolute top-0 left-0 h-full bg-emerald-500 rounded" initial={{ width: 0 }} animate={{ width: isCompleted ? '100%' : '0%' }} transition={{ duration: 0.4 }}/>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-gray-900 relative custom-scrollbar">
        <AnimatePresence mode="wait" custom={currentStep}>
          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto h-full">
            
            {currentStep === 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><User className="text-emerald-600"/> Data Diri Sesuai Kartu Bantu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-semibold mb-2">NIK <span className="text-red-500">*</span></label><input type="text" value={mode === 'kader' && patient && formData.nik.length === 16 ? formData.nik.substring(0, 6) + '******' + formData.nik.substring(12) : formData.nik} onChange={e => updateForm('nik', e.target.value)} className={`w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none ${(mode === 'bidan' || (mode === 'kader' && !!patient)) ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={mode === 'bidan' || (mode === 'kader' && !!patient)} /></div>
                  <div><label className="block text-sm font-semibold mb-2">Nama Lengkap <span className="text-red-500">*</span></label><input type="text" value={formData.nama} onChange={e => updateForm('nama', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none" disabled={mode === 'bidan'} /></div>
                  <RadioGroup label="Jenis Kelamin" options={[{label: 'Laki-laki', value: 'L'}, {label: 'Perempuan', value: 'P'}]} value={formData.jk} onChange={v => {if(mode==='kader')updateForm('jk', v)}}/>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tanggal Lahir <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="date" value={formData.tglLahir} onChange={e => updateForm('tglLahir', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none" disabled={mode === 'bidan'} />
                      {formData.tglLahir && (<div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">Usia: {calculateAge(formData.tglLahir)} thn</div>)}
                    </div>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Golongan Darah</label>
                      <select value={formData.golDarah} onChange={e => updateForm('golDarah', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer" disabled={mode === 'bidan'}>
                        <option value="-">- Tidak Tahu -</option><option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Status Perkawinan</label>
                      <select value={formData.statusKawin} onChange={e => updateForm('statusKawin', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer" disabled={mode === 'bidan'}>
                        <option value="Belum Kawin">Belum Kawin</option><option value="Kawin">Kawin</option><option value="Cerai Hidup">Cerai Hidup</option><option value="Cerai Mati">Cerai Mati</option>
                      </select>
                    </div>
                  </div>
                  <div><label className="block text-sm font-semibold mb-2">Pekerjaan</label><input type="text" value={formData.pekerjaan} onChange={e => updateForm('pekerjaan', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none" disabled={mode === 'bidan'} /></div>
                  <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-6 mt-2">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Informasi Wilayah / Alamat</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Desa / Kelurahan</label>
                        <select value={formData.kelurahan} onChange={e => updateForm('kelurahan', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer disabled:bg-gray-100 disabled:opacity-50" disabled={mode === 'bidan' || ((currentUser?.role === 'Kader' || currentUser?.role === 'Ketua Kader') && !!currentUser?.kelurahan)}>
                          <option value="" disabled>Pilih Desa/Kel...</option>{availableKel.map(kel => (<option key={kel} value={kel}>{kel}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">RW</label>
                        <select value={formData.rw} onChange={e => updateForm('rw', e.target.value)} disabled={!formData.kelurahan || availableRW.length === 0 || mode === 'bidan' || ((currentUser?.role === 'Kader' || currentUser?.role === 'Ketua Kader') && !!currentUser?.rw)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-gray-100 disabled:opacity-50 cursor-pointer">
                          <option value="">Pilih RW...</option>{availableRW.map(rw => (<option key={rw} value={rw}>{rw}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">RT</label>
                        <select value={formData.rt} onChange={e => updateForm('rt', e.target.value)} disabled={!formData.rw || availableRT.length === 0 || mode === 'bidan'} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-gray-100 cursor-pointer">
                          <option value="">Pilih RT...</option>{availableRT.map(rt => (<option key={rt} value={rt}>{rt}</option>))}
                        </select>
                      </div>
                    </div>
                    <div><label className="block text-sm font-semibold mb-2">Alamat Detail (Jalan/Gang)</label><input type="text" value={formData.alamat} onChange={e => updateForm('alamat', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none" disabled={mode === 'bidan'} /></div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-8">
                 <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><ActivityIcon className="text-emerald-600"/> {mode === 'kader' ? 'Fisik Dasar' : 'Fisik & Laboratorium'}</h3>
                 
                 <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative">
                   {mode === 'bidan' && <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">Telah diisi oleh Kader</div>}
                   <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2"><ActivityIcon size={18}/> Pengukuran Tubuh</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div><label className="block text-sm font-semibold mb-2">Berat Badan (kg)</label><input type="number" value={formData.bb} onChange={e => updateForm('bb', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 focus:bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                      <div><label className="block text-sm font-semibold mb-2">Tinggi Badan (cm)</label><input type="number" value={formData.tb} onChange={e => updateForm('tb', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 focus:bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 flex flex-col justify-center">
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Indeks Massa Tubuh (IMT)</span>
                        {formData.bb && formData.tb ? (
                          <div className="flex items-baseline gap-2"><span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{calculateIMT()}</span><span className="text-sm font-medium text-emerald-600">({getIMTStatus(calculateIMT())})</span></div>
                        ) : (<span className="text-sm text-emerald-600/70">Isi BB & TB...</span>)}
                      </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                     <div><label className="block text-sm font-semibold mb-2">Lingkar Perut / LP (cm)</label><input type="number" value={formData.lingkarPerut} onChange={e => updateForm('lingkarPerut', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 focus:bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                     <div><label className="block text-sm font-semibold mb-2">Lingkar Lengan Atas / LiLA (cm)</label><input type="number" value={formData.lingkarLengan} onChange={e => updateForm('lingkarLengan', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 focus:bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                   </div>
                 </div>

                 <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative">
                   {mode === 'bidan' && <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">Telah diisi oleh Kader</div>}
                   <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2"><ActivityIcon size={18}/> Tekanan Darah</h4>
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div><label className="block text-sm font-semibold mb-2">Sistole {getStatusRNT(formData.tdSistole, 'sistole')}</label><input type="number" value={formData.tdSistole} onChange={e => updateForm('tdSistole', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="mmHg" /></div>
                      <div><label className="block text-sm font-semibold mb-2">Diastole {getStatusRNT(formData.tdDiastole, 'diastole')}</label><input type="number" value={formData.tdDiastole} onChange={e => updateForm('tdDiastole', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="mmHg" /></div>
                   </div>
                 </div>
                 
                 {mode === 'bidan' && (
                     <div className="p-6 bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm">
                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2"><ActivityIcon size={18}/> Gula Darah</h4>
                       <div className="mb-6">
                          <div><label className="block text-sm font-semibold mb-2">Kadar Gula Darah Sewaktu (GDS) {getStatusRNT(formData.gulaDarah, 'gula')}</label><input type="number" value={formData.gulaDarah} onChange={e => updateForm('gulaDarah', e.target.value)} className="w-full sm:w-1/2 p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="mg/dL" /></div>
                       </div>

                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 mt-8 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 pt-6"><ActivityIcon size={18}/> Profil Lipid</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div><label className="block text-sm font-semibold mb-2">Cholesterol Total {getStatusRNT(formData.kolesterol, 'kolesterol')}</label><input type="number" value={formData.kolesterol} onChange={e => updateForm('kolesterol', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="mg/dL" /></div>
                          <div><label className="block text-sm font-semibold mb-2">Trigliserida {getStatusRNT(formData.trigliserida, 'trigliserida')}</label><input type="number" value={formData.trigliserida} onChange={e => updateForm('trigliserida', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="mg/dL" /></div>
                          <div><label className="block text-sm font-semibold mb-2">HDL {getStatusRNT(formData.hdl, 'hdl')}</label><input type="number" value={formData.hdl} onChange={e => updateForm('hdl', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="mg/dL" /></div>
                       </div>
                       
                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 mt-8 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 pt-6"><ActivityIcon size={18}/> Asam Urat</h4>
                       <div className="mb-6">
                          <div><label className="block text-sm font-semibold mb-2">Asam Urat</label><input type="number" value={formData.asamUrat} onChange={e => updateForm('asamUrat', e.target.value)} className="w-full sm:w-1/2 p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="mg/dL" /></div>
                       </div>

                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 mt-8 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 pt-6"><ActivityIcon size={18}/> EKG</h4>
                       <div className="mb-6">
                          <div><label className="block text-sm font-semibold mb-2">Elektrokardiogram (EKG)</label><input type="text" value={formData.ekg} onChange={e => updateForm('ekg', e.target.value)} className="w-full sm:w-1/2 p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: Normal, Sinus Rhythm, dll" /></div>
                       </div>

                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 mt-8 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 pt-6"><Eye size={18}/> Tes Hitung Jari Tangan</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-sm font-semibold mb-2">Mata Kanan</label>
                            <select value={formData.mataKanan} onChange={e => updateForm('mataKanan', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                              <option value="">-- Pilih Hasil --</option><option value="Normal">Normal</option><option value="Gangguan">Gangguan</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2">Mata Kiri</label>
                            <select value={formData.mataKiri} onChange={e => updateForm('mataKiri', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                              <option value="">-- Pilih Hasil --</option><option value="Normal">Normal</option><option value="Gangguan">Gangguan</option>
                            </select>
                          </div>
                       </div>

                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 mt-8 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 pt-6"><Ear size={18}/> Tes Berbisik</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-sm font-semibold mb-2">Telinga Kanan</label>
                            <select value={formData.telingaKanan} onChange={e => updateForm('telingaKanan', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                              <option value="">-- Pilih Hasil --</option><option value="Normal">Normal</option><option value="Gangguan">Gangguan</option><option value="Tidak dapat dites">Tidak dapat dites</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2">Telinga Kiri</label>
                            <select value={formData.telingaKiri} onChange={e => updateForm('telingaKiri', e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                              <option value="">-- Pilih Hasil --</option><option value="Normal">Normal</option><option value="Gangguan">Gangguan</option><option value="Tidak dapat dites">Tidak dapat dites</option>
                            </select>
                          </div>
                       </div>
                     </div>
                 )}
              </div>
            )}

            {currentStep === 2 && mode === 'bidan' && (
              <div className="space-y-8">
                 <div>
                   <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><Brain className="text-blue-600"/> SKILAS</h3>
                   <p className="text-gray-500 text-sm">Beberapa penilaian otomatis mengambil data dari hasil Fisik & Lab di tahap sebelumnya.</p>
                 </div>
                 <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl text-sm mb-6 flex gap-3 items-start border border-blue-200 dark:border-blue-800">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <p><b>Rujuk lansia ke Pustu/Puskesmas jika ditemukan minimal satu jawaban yang mengindikasikan masalah kesehatan (indikator warna merah) sesuai ketentuan skrining.</b></p>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">1. Penurunan Kognitif</h4>
                       <div className="space-y-4">
                          <YesNoQuestion id="skilasKognitifOrientasi" dangerIfYes={false} label="Apakah lansia dapat mengetahui waktu dan tempat saat ini?" value={formData.skilasKognitifOrientasi} onChange={v => updateForm('skilasKognitifOrientasi', v)} icon={Brain}/>
                          <YesNoQuestion id="skilasKognitifMengulang" dangerIfYes={false} label="Apakah lansia dapat mengulang tiga kata yang disebutkan oleh petugas?" value={formData.skilasKognitifMengulang} onChange={v => updateForm('skilasKognitifMengulang', v)} icon={Brain}/>
                       </div>
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">2. Keterbatasan Mobilisasi</h4>
                       <div className="space-y-4">
                          <YesNoQuestion id="skilasMobilisasiBerdiri" dangerIfYes={false} label="Apakah lansia dapat berdiri dari kursi tanpa bantuan?" value={formData.skilasMobilisasiBerdiri} onChange={v => updateForm('skilasMobilisasiBerdiri', v)} icon={ActivityIcon}/>
                       </div>
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">3. Malnutrisi</h4>
                       <div className="space-y-4">
                          {(formData.bb && pastRecord3Months?.bb && !isNaN(parseFloat(formData.bb))) ? (
                            <AutoResultQuestion isDanger={formData.skilasNutrisiBbturun} label="Apakah berat badan lansia berkurang lebih dari 3 kg dalam 3 bulan terakhir atau pakaian menjadi lebih longgar?" reasoning={formData.skilasNutrisiBbturun ? `Turun ${Math.abs(parseFloat(pastRecord3Months.bb) - parseFloat(formData.bb)).toFixed(1)} kg` : 'Tidak ada penurunan > 3kg'} icon={ActivityIcon}/>
                          ) : (
                            <YesNoQuestion 
                               id="skilasNutrisiBbturun" 
                               dangerIfYes={true} 
                               label="Apakah berat badan lansia berkurang lebih dari 3 kg dalam 3 bulan terakhir atau pakaian menjadi lebih longgar?" 
                               value={formData.skilasNutrisiBbturun} 
                               onChange={v => updateForm('skilasNutrisiBbturun', v)} 
                               icon={ActivityIcon}
                               badgeText="Manual (Data BB Kurang)"
                            />
                          )}
                          <YesNoQuestion id="skilasNutrisiNafsumakan" dangerIfYes={true} label="Apakah lansia mengalami hilangnya nafsu makan atau kesulitan makan?" value={formData.skilasNutrisiNafsumakan} onChange={v => updateForm('skilasNutrisiNafsumakan', v)} icon={ActivityIcon}/>
                          <AutoResultQuestion isDanger={formData.skilasNutrisiLila} label="Apakah lingkar lengan atas (LiLA) lansia kurang dari 21 cm?" reasoning={formData.lingkarLengan ? `LiLA: ${formData.lingkarLengan} cm` : 'Data LiLA kosong'} icon={ActivityIcon}/>
                       </div>
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">4. Gangguan Penglihatan</h4>
                       <div className="space-y-4">
                          <YesNoQuestion id="skilasMataMasalah" dangerIfYes={true} label="Apakah lansia mengalami masalah pada mata, seperti sulit melihat jauh, penyakit mata, atau sedang pengobatan hipertensi/diabetes?" value={formData.skilasMataMasalah} onChange={v => updateForm('skilasMataMasalah', v)} icon={Eye}/>
                          <AutoResultQuestion isDanger={formData.skilasMataTes} label="Apakah hasil tes melihat menunjukkan adanya gangguan penglihatan?" reasoning={`Kanan: ${formData.mataKanan}, Kiri: ${formData.mataKiri}`} icon={Eye}/>
                       </div>
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">5. Gangguan Pendengaran</h4>
                       <div className="space-y-4">
                          <AutoResultQuestion isDanger={formData.skilasTelingaBisik} label="Apakah lansia mengalami gangguan pendengaran berdasarkan tes bisik?" reasoning={`Kanan: ${formData.telingaKanan}, Kiri: ${formData.telingaKiri}`} icon={Ear}/>
                          <AutoResultQuestion isDanger={formData.skilasTelingaTes} label="Apakah tes bisik tidak dapat dilakukan pada lansia?" reasoning={formData.skilasTelingaTes ? 'Tes tidak dapat dilakukan' : 'Tes dapat dilakukan'} icon={Ear}/>
                       </div>
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">6. Gejala Depresi (Dalam 2 Minggu Terakhir)</h4>
                       <div className="space-y-4">
                          <YesNoQuestion id="skilasDepresiSedih" dangerIfYes={true} label="Apakah lansia merasa sedih, tertekan, atau putus asa?" value={formData.skilasDepresiSedih} onChange={v => updateForm('skilasDepresiSedih', v)} icon={User}/>
                          <YesNoQuestion id="skilasDepresiMinat" dangerIfYes={true} label="Apakah lansia merasa sedikit atau tidak berminat atau tidak menikmati kegiatan yang biasanya dilakukan?" value={formData.skilasDepresiMinat} onChange={v => updateForm('skilasDepresiMinat', v)} icon={User}/>
                       </div>
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">7. Imunisasi COVID-19</h4>
                       <div className="space-y-4">
                          <YesNoQuestion id="skilasCovid" dangerIfYes={false} label="Apakah lansia sudah mendapatkan imunisasi COVID-19?" value={formData.skilasCovid} onChange={v => updateForm('skilasCovid', v)} icon={Shield}/>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {currentStep === 3 && mode === 'bidan' && (
              <div className="space-y-6 pb-10">
                 <div>
                   <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><UserCheck className="text-amber-600"/> Indeks AKS (Barthel)</h3>
                   <p className="text-gray-500 text-sm mb-6">Aktivitas Kehidupan Sehari-hari. Skor maksimal 20 (Mandiri Penuh).</p>
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
                   <AksScoreQuestion id="aksBAB" label="1. Mengendalikan Rangsang Buang Air Besar (BAB)" value={formData.aksBAB} onChange={v => updateForm('aksBAB', v)} options={[{val: 0, text: 'Tidak terkendali: BAB tidak dapat dikendalikan / pakai kateter'}, {val: 1, text: 'Kadang tidak terkendali: BAB kadang tidak terkendali (1x seminggu)'}, {val: 2, text: 'Terkendali: BAB dapat dikendalikan secara teratur'}]}/>
                   <AksScoreQuestion id="aksBAK" label="2. Mengendalikan Rangsang Buang Air Kecil (BAK)" value={formData.aksBAK} onChange={v => updateForm('aksBAK', v)} options={[{val: 0, text: 'Tidak terkendali: BAK tidak dapat dikendalikan / pakai kateter'}, {val: 1, text: 'Kadang tidak terkendali: BAK kadang tidak terkendali (dalam 24 jam)'}, {val: 2, text: 'Terkendali: BAK dapat dikendalikan secara teratur'}]}/>
                   <AksScoreQuestion id="aksGrooming" label="3. Membersihkan Diri" value={formData.aksGrooming} onChange={v => updateForm('aksGrooming', v)} options={[{val: 0, text: 'Membutuhkan bantuan: Butuh bantuan orang lain untuk membersihkan diri'}, {val: 1, text: 'Mandiri: Dapat membersihkan diri sendiri tanpa bantuan'}]}/>
                   <AksScoreQuestion id="aksToilet" label="4. Penggunaan WC / Toilet" value={formData.aksToilet} onChange={v => updateForm('aksToilet', v)} options={[{val: 0, text: 'Tergantung: Tidak dapat menggunakan WC dan bergantung penuh'}, {val: 1, text: 'Sebagian dibantu: Butuh bantuan di beberapa kegiatan'}, {val: 2, text: 'Mandiri: Dapat menggunakan WC sendiri tanpa bantuan'}]}/>
                   <AksScoreQuestion id="aksMakan" label="5. Makan dan Minum" value={formData.aksMakan} onChange={v => updateForm('aksMakan', v)} options={[{val: 0, text: 'Tidak mampu: Tidak mampu makan atau minum sendiri'}, {val: 1, text: 'Membutuhkan bantuan: Dapat makan sendiri tapi butuh bantuan (misal potong)'}, {val: 2, text: 'Mandiri: Dapat makan dan minum sendiri'}]}/>
                   <AksScoreQuestion id="aksTransfer" label="6. Berpindah Tempat / Transfer" value={formData.aksTransfer} onChange={v => updateForm('aksTransfer', v)} options={[{val: 0, text: 'Tidak mampu: Tidak mampu berpindah'}, {val: 1, text: 'Membutuhkan banyak bantuan (bantuan 2 orang)'}, {val: 2, text: 'Bantuan minimal (1 orang)'}, {val: 3, text: 'Mandiri: Dapat berpindah sendiri'}]}/>
                   <AksScoreQuestion id="aksMobilitas" label="7. Berjalan / Mobilitas" value={formData.aksMobilitas} onChange={v => updateForm('aksMobilitas', v)} options={[{val: 0, text: 'Tidak mampu: Tidak mampu berjalan/berpindah'}, {val: 1, text: 'Menggunakan kursi roda: Dapat berpindah menggunakan kursi roda'}, {val: 2, text: 'Dengan bantuan: Dapat berjalan dengan bantuan 1 orang'}, {val: 3, text: 'Mandiri: Dapat berjalan sendiri'}]}/>
                   <AksScoreQuestion id="aksBerpakaian" label="8. Berpakaian" value={formData.aksBerpakaian} onChange={v => updateForm('aksBerpakaian', v)} options={[{val: 0, text: 'Tergantung: Membutuhkan bantuan orang lain'}, {val: 1, text: 'Sebagian dibantu: Sebagian butuh bantuan (misal sepatu)'}, {val: 2, text: 'Mandiri: Dapat berpakaian sendiri'}]}/>
                   <AksScoreQuestion id="aksTangga" label="9. Naik Turun Tangga" value={formData.aksTangga} onChange={v => updateForm('aksTangga', v)} options={[{val: 0, text: 'Tidak mampu: Tidak mampu naik turun tangga'}, {val: 1, text: 'Membutuhkan bantuan: Membutuhkan bantuan orang lain'}, {val: 2, text: 'Mandiri: Dapat naik turun tangga sendiri'}]}/>
                   <AksScoreQuestion id="aksMandi" label="10. Mandi" value={formData.aksMandi} onChange={v => updateForm('aksMandi', v)} options={[{val: 0, text: 'Tergantung: Membutuhkan bantuan orang lain untuk mandi'}, {val: 1, text: 'Mandiri: Dapat mandi sendiri tanpa bantuan'}]}/>
                 </div>

                 <div className="p-5 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-2xl mt-8 flex flex-col sm:flex-row justify-between items-center border border-amber-200 dark:border-amber-800 shadow-sm">
                   <div className="mb-4 sm:mb-0 text-center sm:text-left">
                     <span className="block text-xs font-bold uppercase opacity-70 mb-1">Total Skor Saat Ini</span>
                     <span className="text-3xl font-black">{calculateAKS()} <span className="text-sm font-semibold opacity-70">/ 20</span></span>
                   </div>
                   <div className="text-center sm:text-right">
                     <span className="block text-xs font-bold uppercase opacity-70 mb-1">Tingkat Ketergantungan</span>
                     <span className="inline-block text-lg sm:text-xl font-extrabold px-4 py-2 bg-white/60 dark:bg-gray-900/60 rounded-xl shadow-sm border border-amber-200/50 dark:border-amber-700/50">
                       {getAksCategory(calculateAKS())}
                     </span>
                   </div>
                 </div>
              </div>
            )}

            {currentStep === 4 && mode === 'bidan' && (
              <div className="space-y-10">
                 <div>
                   <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><Stethoscope className="text-purple-600"/> Kuesioner PUMA (PPOK)</h3>
                   <p className="text-gray-500 text-sm mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Skor otomatis ditambah berdasarkan Usia dan Jenis Kelamin. Ditujukan untuk sasaran usia ≥40 tahun.</p>
                   
                   {(calculateAge(formData.tglLahir) < 40) ? (
                      <div className="p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
                        <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4" />
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Skrining PUMA Dilewati</h4>
                        <p className="text-gray-500">Sasaran berusia {calculateAge(formData.tglLahir)} tahun. Kuesioner PUMA hanya untuk usia ≥40 tahun.</p>
                      </div>
                   ) : (
                     <div className="space-y-6">
                       <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm mb-6">
                         <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">A. Data Dasar</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold mb-1 text-gray-500">1. Jenis Kelamin (Otomatis)</label>
                              <div className="font-bold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                                {formData.jk === 'L' ? 'Laki-laki (Skor: 1)' : 'Perempuan (Skor: 0)'}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1 text-gray-500">2. Usia (Otomatis)</label>
                              <div className="font-bold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                                {calculateAge(formData.tglLahir)} Tahun 
                                <span className="text-sm font-medium text-gray-500 ml-2">
                                  (Skor: {calculateAge(formData.tglLahir) < 50 ? 0 : calculateAge(formData.tglLahir) < 60 ? 1 : 2})
                                </span>
                              </div>
                            </div>
                         </div>
                       </div>
                       <div id="pumaMerokok" className="scroll-mt-24 relative transition-all duration-300"><RadioGroup label="3. Apakah sasaran pernah merokok?" options={[{label: 'Tidak (0)', value: 0, color: 'red'}, {label: '< 20 bks/thn (0)', value: 1}, {label: '20 - 30 bks/thn (1)', value: 2}, {label: '> 30 bks/thn (2)', value: 3}]} value={formData.pumaMerokok} onChange={v => updateForm('pumaMerokok', v)}/></div>
                       <div id="pumaNapasPendek" className="scroll-mt-24 relative transition-all duration-300"><RadioGroup label="4. Saat berjalan lebih cepat atau jalan sedikit menanjak, apakah sering merasa napas pendek/sesak?" options={[{label: 'Tidak (0)', value: 0, color: 'red'}, {label: 'Ya (1)', value: 1, color: 'emerald'}]} value={formData.pumaNapasPendek} onChange={v => updateForm('pumaNapasPendek', v)}/></div>
                       <div id="pumaDahak" className="scroll-mt-24 relative transition-all duration-300"><RadioGroup label="5. Saat sedang tidak flu, apakah sering berdahak atau sulit mengeluarkan dahak?" options={[{label: 'Tidak (0)', value: 0, color: 'red'}, {label: 'Ya (1)', value: 1, color: 'emerald'}]} value={formData.pumaDahak} onChange={v => updateForm('pumaDahak', v)}/></div>
                       <div id="pumaBatuk" className="scroll-mt-24 relative transition-all duration-300"><RadioGroup label="6. Apakah biasanya batuk padahal tidak sedang flu?" options={[{label: 'Tidak (0)', value: 0, color: 'red'}, {label: 'Ya (1)', value: 1, color: 'emerald'}]} value={formData.pumaBatuk} onChange={v => updateForm('pumaBatuk', v)}/></div>
                       <div id="pumaSpirometri" className="scroll-mt-24 relative transition-all duration-300"><RadioGroup label="7. Pernahkah Dokter/Perawat meminta Anda melakukan pemeriksaan Spirometri (Fungsi Paru)?" options={[{label: 'Tidak (0)', value: 0, color: 'red'}, {label: 'Ya (1)', value: 1, color: 'emerald'}]} value={formData.pumaSpirometri} onChange={v => updateForm('pumaSpirometri', v)}/></div>
                     </div>
                   )}
                 </div>

                 <div>
                   <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><ActivityIcon className="text-red-600"/> Skrining Gejala TBC</h3>
                   <p className="text-gray-500 text-sm mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Untuk mengetahui apakah terdapat gejala yang mengarah pada Tuberkulosis (TBC).</p>
                   <div className="space-y-4">
                      <YesNoQuestion dangerIfYes={true} label="8. Apakah Anda mengalami batuk terus-menerus?" value={formData.tbcBatuk} onChange={v => updateForm('tbcBatuk', v)} icon={ActivityIcon}/>
                      <YesNoQuestion dangerIfYes={true} label="9. Apakah Anda mengalami demam yang berlangsung lebih dari 2 minggu?" value={formData.tbcDemam} onChange={v => updateForm('tbcDemam', v)} icon={ActivityIcon}/>
                      {(() => {
                         const previousRecord = riwayatIndex !== null ? patient?.riwayat?.[riwayatIndex + 1] : patient?.riwayat?.[0];
                         return (formData.bb && previousRecord?.bb && !isNaN(parseFloat(formData.bb))) ? (
                            <AutoResultQuestion isDanger={formData.tbcBbTurun} label="10. Dalam 2 bulan terakhir, apakah berat badan Anda turun atau tidak bertambah tanpa penyebab yang jelas?" reasoning={formData.tbcBbTurun ? (parseFloat(formData.bb) < parseFloat(previousRecord.bb) ? `Turun ${Math.abs(parseFloat(previousRecord.bb) - parseFloat(formData.bb)).toFixed(1)} kg` : 'Berat badan tetap (tidak naik)') : 'Berat badan naik (Aman)'} icon={ActivityIcon}/>
                         ) : (
                            <YesNoQuestion 
                               id="tbcBbTurun" 
                               dangerIfYes={true} 
                               label="10. Dalam 2 bulan terakhir, apakah berat badan Anda turun atau tidak bertambah tanpa penyebab yang jelas?" 
                               value={formData.tbcBbTurun} 
                               onChange={v => updateForm('tbcBbTurun', v)} 
                               icon={ActivityIcon}
                               badgeText="Manual (Data BB Kurang)"
                            />
                         );
                      })()}
                      <YesNoQuestion dangerIfYes={true} label="11. Apakah Anda pernah kontak erat dengan pasien TBC?" value={formData.tbcKontak} onChange={v => updateForm('tbcKontak', v)} icon={Users}/>
                   </div>
                 </div>

                 <div className="pb-8">
                   <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><UserCheck className="text-blue-600"/> Wawancara Usia Dewasa</h3>
                   <p className="text-gray-500 text-sm mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Penggunaan Alat Kontrasepsi.</p>
                   <div className="space-y-4">
                     <YesNoQuestion dangerIfYes={false} label="12. Apakah Anda atau pasangan menggunakan alat kontrasepsi?" value={formData.kontrasepsi} onChange={v => updateForm('kontrasepsi', v)} icon={Shield}/>
                     <AnimatePresence>
                       {formData.kontrasepsi && (
                         <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pl-4 md:pl-16 overflow-hidden">
                           <label className="block text-sm font-semibold mb-3">Pilih Jenis Kontrasepsi yang Digunakan:</label>
                           <select value={formData.kontrasepsiJenis} onChange={e => updateForm('kontrasepsiJenis', e.target.value)} className="w-full max-w-sm p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                              <option value="" disabled>Pilih Jenis Kontrasepsi...</option><option value="Pil">Pil</option><option value="Kondom">Kondom</option><option value="IUD/Spiral">IUD / Spiral</option><option value="Implan">Implan</option><option value="Suntik">Suntik</option><option value="Lainnya">Metode Lainnya</option>
                           </select>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 </div>
              </div>
            )}

            {((currentStep === 2 && mode === 'kader') || (currentStep === 5 && mode === 'bidan')) && (
              <div className="space-y-8">
                 <div className="text-center">
                    <h3 className="text-3xl font-bold mb-2">Kesimpulan Pemeriksaan</h3>
                    <p className="text-gray-500">Berdasarkan format Buku KIA Lansia / Kartu Bantu Z6.</p>
                 </div>
                 
                 {mode === 'bidan' && isTbcSuspect && (
                   <div className="p-4 bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 rounded-2xl border border-red-200 dark:border-red-800 flex items-start gap-4">
                     <AlertCircle className="shrink-0 mt-0.5" size={24} />
                     <div><h4 className="font-bold text-lg mb-1">Peringatan: Suspek TBC</h4><p className="text-sm">Pasien menunjukkan gejala TBC berdasarkan hasil skrining. <b>Wajib dirujuk ke faskes/puskesmas untuk pemeriksaan lanjutan.</b></p></div>
                   </div>
                 )}

                 <div className="grid gap-6">
                    <ResultCard 
                       title={`Status Form (${mode === 'kader' ? 'Kader' : rawMode === 'admin' ? 'Admin' : rawMode === 'ketua kader' ? 'Ketua Kader' : 'Bidan'})`} 
                       value="Data Siap Disimpan" 
                       isDanger={false} 
                       icon={CheckCircle2} 
                       desc={`Data hasil ${mode === 'kader' ? 'pengukuran fisik dasar' : 'skrining lanjutan'} sudah siap. Harap klik tombol 'Simpan Data' di bawah agar data benar-benar tersimpan ke dalam database.`}
                    />
                    {mode !== 'kader' && (
                      <>
                        {!isSkilasComplete() ? (
                          <ResultCard title="Skrining SKILAS" value="Belum Lengkap" isDanger={true} icon={Brain} desc="Ada poin SKILAS yang belum diisi. Klik di sini untuk melengkapi." onClick={() => {
                            setCurrentStep(2);
                            setTimeout(() => {
                              const missing = getFirstMissingSkilasField();
                              if (missing) {
                                const el = document.getElementById(missing);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  el.classList.add('ring-4', 'ring-red-400', 'rounded-2xl', 'transition-all');
                                  setTimeout(() => el.classList.remove('ring-4', 'ring-red-400'), 2000);
                                }
                              }
                            }, 300);
                          }}/>
                        ) : (
                          <ResultCard title="Skrining SKILAS" value={calculateSKILAS()} isDanger={calculateSKILAS().includes("Perlu Rujukan")} icon={Brain} desc="Pemeriksaan kognitif, mobilitas, nutrisi, dan sensorik."/>
                        )}
                        {!isAksComplete() ? (
                          <ResultCard title="Status Kemandirian (AKS)" value="Belum Lengkap" isDanger={true} icon={UserCheck} desc="Ada poin AKS yang belum diisi. Klik di sini untuk melengkapi." onClick={() => {
                            setCurrentStep(3);
                            setTimeout(() => {
                              const missing = getFirstMissingAksField();
                              if (missing) {
                                const el = document.getElementById(missing);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  el.classList.add('ring-4', 'ring-red-400', 'rounded-2xl', 'transition-all');
                                  setTimeout(() => el.classList.remove('ring-4', 'ring-red-400'), 2000);
                                }
                              }
                            }, 300);
                          }}/>
                        ) : (
                          <ResultCard title="Status Kemandirian (AKS)" value={`Skor: ${calculateAKS()} / 20`} isDanger={calculateAKS() < 20} icon={UserCheck} desc={`Kategori: ${getAksCategory(calculateAKS())}. ${calculateAKS() < 20 ? "Kemandirian berkurang, memerlukan pengawasan atau bantuan." : "Kemandirian penuh."}`}/>
                        )}
                        {!isPumaComplete() ? (
                          <ResultCard title="Skor PUMA (PPOK)" value="Belum Lengkap" isDanger={true} icon={Stethoscope} desc="Ada poin PUMA yang belum diisi. Klik di sini untuk melengkapi." onClick={() => {
                            setCurrentStep(4);
                            setTimeout(() => {
                              const missing = getFirstMissingPumaField();
                              if (missing) {
                                const el = document.getElementById(missing);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  el.classList.add('ring-4', 'ring-red-400', 'rounded-2xl', 'transition-all');
                                  setTimeout(() => el.classList.remove('ring-4', 'ring-red-400'), 2000);
                                }
                              }
                            }, 300);
                          }}/>
                        ) : (
                          <ResultCard title="Skor PUMA (PPOK)" value={(calculateAge(formData.tglLahir) < 40) ? "Tidak Dievaluasi (<40 thn)" : `Skor Total: ${calculatePUMA()}`} isDanger={calculatePUMA() >= 6} icon={Stethoscope} desc={calculatePUMA() >= 6 ? "Risiko tinggi PPOK. Perlu dirujuk ke Pustu/Puskesmas." : "Risiko lebih rendah / Skrining Awal."}/>
                        )}
                      </>
                    )}
                 </div>
                 
                 <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-bold mb-3">Tindak Lanjut & Catatan:</label>
                    <textarea value={formData.catatan} onChange={(e) => updateForm('catatan', e.target.value)} className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none resize-none" rows={3} placeholder="Tambahkan catatan khusus di sini..."></textarea>
                 </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-10 relative">
        {validationError && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-center gap-2 text-sm font-semibold shrink-0">
             <AlertCircle size={16} /> {validationError}
          </div>
        )}
        <div className="p-4 sm:p-6 flex flex-col-reverse sm:flex-row justify-between gap-3 items-center">
          <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0} icon={ChevronLeft} className="w-full sm:w-auto cursor-pointer">Sebelumnya</Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto cursor-pointer">Batal</Button>
            {currentStep < activeSteps.length - 1 ? (
              <Button variant="primary" onClick={handleNext} className="w-full sm:w-40 justify-center sm:justify-between px-6 bg-blue-600 hover:bg-blue-700 shadow-blue-200 cursor-pointer">Lanjut <ArrowRight size={18} /></Button>
            ) : (
              <Button variant="primary" onClick={handleFinalSave} className="w-full sm:w-40 justify-center bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 cursor-pointer">Simpan Data</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const calculateAge = (birthDate) => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return 0; // fallback if invalid date
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const YesNoQuestion = ({ label, value, onChange, icon: Icon, id, dangerIfYes, badgeText = null }) => {
  const greenClass = 'bg-emerald-50 text-emerald-600 border-emerald-500 dark:bg-emerald-900/20';
  const redClass = 'bg-red-50 text-red-600 border-red-500 dark:bg-red-900/20';
  
  const yaSelectedClass = dangerIfYes ? redClass : greenClass;
  const yaHoverClass = dangerIfYes ? 'hover:border-red-200' : 'hover:border-emerald-200';
  const yaClass = value === true ? yaSelectedClass : `border-gray-200 text-gray-500 dark:border-gray-700 ${yaHoverClass}`;

  const tidakSelectedClass = dangerIfYes ? greenClass : redClass;
  const tidakHoverClass = dangerIfYes ? 'hover:border-emerald-200' : 'hover:border-red-200';
  const tidakClass = value === false ? tidakSelectedClass : `border-gray-200 text-gray-500 dark:border-gray-700 ${tidakHoverClass}`;

  return (
    <div id={id} className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm scroll-mt-24 transition-all duration-300">
      {badgeText && (
        <div className="mb-3 pl-14">
          <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-lg">
            {badgeText}
          </span>
        </div>
      )}
      <div className="flex gap-4 mb-4">
         <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center shrink-0"><Icon size={20} /></div>
         <p className="font-semibold text-gray-800 dark:text-gray-200 leading-relaxed pt-1">{label}</p>
      </div>
      <div className="flex gap-3 pl-14">
        <button onClick={() => value === true ? onChange(null) : onChange(true)} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all cursor-pointer ${yaClass}`}>YA</button>
        <button onClick={() => value === false ? onChange(null) : onChange(false)} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all cursor-pointer ${tidakClass}`}>TIDAK</button>
      </div>
    </div>
  );
};

const AutoResultQuestion = ({ label, isDanger, reasoning, icon: Icon }: any) => {
  const isNull = isDanger === null || isDanger === undefined;
  const containerClass = isNull ? 'bg-gray-50 text-gray-500 border-gray-300 dark:bg-gray-900/40 dark:text-gray-400 dark:border-gray-700' : isDanger ? 'bg-red-50 text-red-600 border-red-500 dark:bg-red-900/20' : 'bg-emerald-50 text-emerald-600 border-emerald-500 dark:bg-emerald-900/20';
  return (
    <div id="auto-result-question" className={`p-5 rounded-2xl border-2 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center ${containerClass} transition-all duration-300`}>
      <div className="flex-1 flex gap-4 items-start">
         <div className="w-10 h-10 rounded-full bg-white/50 dark:bg-gray-800/50 flex items-center justify-center shrink-0 text-current"><Icon size={20} /></div>
         <p className="font-semibold leading-relaxed pt-1 text-gray-800 dark:text-gray-200">{label}</p>
      </div>
      <div className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold flex flex-col items-center border border-white/40 shadow-sm ${isNull ? 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400' : isDanger ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>
         <span className="text-[10px] uppercase opacity-70 tracking-wider">Hasil Otomatis</span><span>{isNull ? 'BELUM DIISI' : isDanger ? 'YA (Berisiko)' : 'TIDAK (Aman)'}</span>
         <span className="text-xs font-medium opacity-80 mt-0.5">{reasoning}</span>
      </div>
    </div>
  );
};

const AksScoreQuestion = ({ label, value, onChange, options, id = '' }: any) => (
  <div id={id} className="mb-6 scroll-mt-24 relative transition-all duration-300">
    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">{label}</label>
    <div className="space-y-2">
      {options.map((opt) => (
        <div key={opt.val} onClick={() => value === opt.val ? onChange(null) : onChange(opt.val)} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${value === opt.val ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300' : 'border-gray-200 bg-white hover:border-amber-200 dark:border-gray-700 dark:bg-gray-800'}`}>
          <div className={`w-5 h-5 mt-0.5 shrink-0 rounded-full border-2 flex items-center justify-center ${value === opt.val ? 'border-amber-600' : 'border-gray-400'}`}>
            {value === opt.val && <div className="w-2.5 h-2.5 rounded-full bg-amber-600"></div>}
          </div>
          <span className="font-medium text-sm leading-relaxed">{opt.text} <span className="text-gray-400 dark:text-gray-500 ml-1 font-bold">(Skor {opt.val})</span></span>
        </div>
      ))}
    </div>
  </div>
);

const ResultCard = ({ title, value, isDanger, icon: Icon, desc, onClick = undefined }: any) => (
  <div onClick={onClick} className={`p-6 rounded-3xl border-2 flex gap-5 items-center ${isDanger ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'} ${onClick ? 'cursor-pointer hover:shadow-md transition-all hover:border-red-400 dark:hover:border-red-400' : ''}`}>
    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${isDanger ? 'bg-red-200 text-red-700' : 'bg-emerald-200 text-emerald-700'}`}><Icon size={28} /></div>
    <div>
      <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{title}</h4>
      <div className={`text-2xl font-extrabold mb-1 ${isDanger ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>{value}</div>
      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{desc}</p>
    </div>
  </div>
);
