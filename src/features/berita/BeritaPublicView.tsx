import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, FileText, Calendar, User, X, ArrowRight, Search } from 'lucide-react';
import { Portal } from '@/components/ui/Wrappers';

export const BeritaPublicView = ({ onBack, beritaList }) => {
  const [selectedBerita, setSelectedBerita] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBerita = beritaList.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans p-4 transition-colors relative">
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 dark:border-gray-800 mb-6 sm:mb-8 gap-4 sm:gap-2">
         <button onClick={onBack} className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-gray-700 font-bold cursor-pointer text-[10px] sm:text-base whitespace-nowrap shrink-0">
           <ChevronLeft size={14} className="sm:w-5 sm:h-5 shrink-0" /> 
           <span className="hidden sm:inline">Kembali ke Beranda</span><span className="sm:hidden">Kembali</span>
         </button>
         <div className="flex items-center justify-end gap-1.5 sm:gap-2 text-violet-600 dark:text-violet-400 font-black text-lg sm:text-xl whitespace-nowrap overflow-hidden text-right self-end sm:self-auto">
           <FileText size={18} className="sm:w-6 sm:h-6 shrink-0" /> 
           <span className="truncate">Berita & Informasi</span>
         </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pb-20">
         <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Semua Berita</h2>
              <p className="text-gray-500 mt-4 text-sm sm:text-base">Kumpulan artikel kesehatan, laporan kegiatan, dan informasi terbaru dari Posyandu Ramah Lansia Lawang.</p>
            </div>
            
            <div className="w-full md:w-auto flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 relative">
               <div className="pl-3 text-gray-400 absolute"><Search size={18}/></div>
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Cari berita atau kategori..." 
                 className="py-2.5 pl-10 pr-4 bg-transparent text-sm font-medium text-gray-800 dark:text-gray-200 outline-none w-full md:w-64"
               />
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredBerita.map((berita) => (
             <div key={berita.id} className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-violet-200 transition-all duration-300 group flex flex-col cursor-pointer sm:hover:-translate-y-2" onClick={() => setSelectedBerita(berita)}>
               <div className="h-40 sm:h-48 overflow-hidden relative">
                 <img src={berita.image} alt={berita.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-violet-600 dark:text-violet-400 shadow-sm">{berita.category}</div>
               </div>
               <div className="p-4 sm:p-6 flex-1 flex flex-col">
                 <div className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3 font-semibold flex items-center gap-1.5 sm:gap-2"><Calendar size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="truncate">{berita.date}</span></div>
                 <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-tight line-clamp-2">{berita.title}</h3>
                 <p className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 flex-1 leading-relaxed line-clamp-3">{berita.excerpt}</p>
                 <div className="flex items-center text-xs sm:text-sm font-bold text-violet-600 dark:text-violet-400 gap-1 group-hover:gap-3 transition-all mt-auto">Baca Selengkapnya <ArrowRight size={14} className="sm:w-4 sm:h-4"/></div>
               </div>
             </div>
           ))}
           {filteredBerita.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                 <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Tidak Ditemukan</h3>
                 <p className="text-gray-500">Berita dengan kata kunci pencarian tersebut tidak tersedia.</p>
              </div>
           )}
         </div>
      </div>

      <AnimatePresence>
        {selectedBerita && (
          <Portal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6">
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
                className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
              >
                <div className="relative h-48 sm:h-80 shrink-0">
                  <img src={selectedBerita.image} alt={selectedBerita.title} className="w-full h-full object-cover sm:object-contain bg-black/10 backdrop-blur-sm" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
                  <button onClick={() => setSelectedBerita(null)} className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors cursor-pointer z-10">
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                    <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-violet-600 text-white text-[10px] sm:text-xs font-bold rounded-full mb-2 sm:mb-3 shadow-sm">{selectedBerita.category}</span>
                    <h3 className="text-xl sm:text-3xl font-bold text-white leading-tight">{selectedBerita.title}</h3>
                  </div>
                </div>
                <div className="p-4 sm:p-8 overflow-y-auto">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1.5 sm:gap-2 font-semibold"><Calendar size={14} className="sm:w-4 sm:h-4"/> {selectedBerita.date}</div>
                    <div className="flex items-center gap-1.5 sm:gap-2 font-semibold"><User size={14} className="sm:w-4 sm:h-4"/> {selectedBerita.author}</div>
                  </div>
                  <div className="prose prose-sm sm:prose-base prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-a:text-violet-600">
                    {selectedBerita.content ? (
                       <div dangerouslySetInnerHTML={{ __html: selectedBerita.content }} />
                    ) : (
                       <p className="text-gray-700 dark:text-gray-300 sm:text-lg">{selectedBerita.excerpt}</p>
                    )}
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
