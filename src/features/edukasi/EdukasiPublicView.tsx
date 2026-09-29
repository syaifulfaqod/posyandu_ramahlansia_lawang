import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, Search, ActivityIcon, Brain, UserCheck, HeartPulse, ShieldAlert, Smile, Moon, Droplet, X } from 'lucide-react';
import { Portal } from '@/components/ui/Wrappers';
import { edukasiData } from '@/data/edukasiData';

const ICONS = {
  ActivityIcon: ActivityIcon,
  Brain: Brain,
  UserCheck: UserCheck,
  HeartPulse: HeartPulse,
  ShieldAlert: ShieldAlert,
  Smile: Smile,
  Moon: Moon,
  Droplet: Droplet
};

const COLORS = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 dark:bg-blue-900/20 dark:border-blue-800/50',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800/50',
  amber: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-500 dark:bg-amber-900/20 dark:border-amber-800/50',
  rose: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 dark:bg-rose-900/20 dark:border-rose-800/50',
  purple: 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-600 dark:bg-purple-900/20 dark:border-purple-800/50',
  cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100 group-hover:bg-cyan-600 dark:bg-cyan-900/20 dark:border-cyan-800/50',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800/50',
  red: 'bg-red-50 text-red-600 border-red-100 group-hover:bg-red-600 dark:bg-red-900/20 dark:border-red-800/50',
};

export const EdukasiPublicView = ({ onBack }) => {
  const [selectedEdukasi, setSelectedEdukasi] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEdukasi = edukasiData.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans p-4 transition-colors relative">
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 dark:border-gray-800 mb-6 sm:mb-8 gap-4 sm:gap-2">
         <button onClick={onBack} className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-gray-700 font-bold cursor-pointer text-[10px] sm:text-base whitespace-nowrap shrink-0">
           <ChevronLeft size={14} className="sm:w-5 sm:h-5 shrink-0" /> 
           <span className="hidden sm:inline">Kembali ke Beranda</span><span className="sm:hidden">Kembali</span>
         </button>
         <div className="flex items-center justify-end gap-1.5 sm:gap-2 text-emerald-600 dark:text-emerald-400 font-black text-lg sm:text-xl whitespace-nowrap overflow-hidden text-right self-end sm:self-auto">
           <ActivityIcon size={18} className="sm:w-6 sm:h-6 shrink-0" /> 
           <span className="truncate">Edukasi Kesehatan</span>
         </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pb-20">
         <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Info Kesehatan Lansia</h2>
              <p className="text-gray-500 mt-4 text-sm sm:text-base">Panduan praktis dan edukasi kesehatan untuk menjaga kebugaran di usia senja, persembahan dari tim KKN Ramah Lansia UMM Tahap 1.</p>
            </div>
            
            <div className="w-full md:w-auto flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 relative">
               <div className="pl-3 text-gray-400 absolute"><Search size={18}/></div>
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Cari topik kesehatan..." 
                 className="py-2.5 pl-10 pr-4 bg-transparent text-sm font-medium text-gray-800 dark:text-gray-200 outline-none w-full md:w-64"
               />
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
           {filteredEdukasi.map((edukasi) => {
             const IconComponent = ICONS[edukasi.icon] || ActivityIcon;
             const colorClass = COLORS[edukasi.color] || COLORS.blue;
             
             return (
               <div key={edukasi.id} className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group cursor-pointer flex flex-col h-full sm:hover:-translate-y-2" onClick={() => setSelectedEdukasi(edukasi)}>
                 <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center border transition-colors duration-300 mb-4 sm:mb-6 shrink-0 group-hover:text-white ${colorClass}`}>
                   <IconComponent size={20} className="sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
                 </div>
                 <h4 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-snug">{edukasi.title}</h4>
                 <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[11px] sm:text-sm flex-1 line-clamp-4 mb-4 sm:mb-6">{edukasi.excerpt}</p>
                 <div className="flex items-center text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 gap-1 group-hover:gap-3 transition-all mt-auto">Baca Selengkapnya <ArrowRight size={14} className="sm:w-4 sm:h-4"/></div>
               </div>
             )
           })}
           {filteredEdukasi.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                 <ActivityIcon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Tidak Ditemukan</h3>
                 <p className="text-gray-500">Materi edukasi dengan kata kunci pencarian tersebut tidak tersedia.</p>
              </div>
           )}
         </div>
      </div>

      <AnimatePresence>
        {selectedEdukasi && (
          <Portal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setSelectedEdukasi(null)}
                className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm cursor-pointer"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
              >
                <div className="p-6 sm:p-8 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white ${COLORS[selectedEdukasi.color].replace('group-hover:', '').split(' ').filter(c => c.startsWith('bg-')).map(c => c.replace('-50', '-500')).join(' ')}`}>
                       {React.createElement(ICONS[selectedEdukasi.icon] || ActivityIcon, { size: 24 })}
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">{selectedEdukasi.title}</h3>
                  </div>
                  <button onClick={() => setSelectedEdukasi(null)} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition-colors cursor-pointer shrink-0 ml-4">
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>
                
                <div className="p-6 sm:p-8 overflow-y-auto">
                  <div className="prose prose-sm sm:prose-base prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-li:leading-relaxed prose-li:my-2">
                     <p className="text-gray-700 dark:text-gray-300 font-medium text-base sm:text-lg italic mb-6">
                        "{selectedEdukasi.excerpt}"
                     </p>
                     
                     <div dangerouslySetInnerHTML={{ __html: selectedEdukasi.content.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                </div>
              </motion.div>
            </div>
          </Portal>
        )}
      </AnimatePresence>
    </div>
  )
};
