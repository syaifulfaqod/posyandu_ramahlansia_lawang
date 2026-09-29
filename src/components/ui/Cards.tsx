import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, trend, trendUp, color, subtitle, onClick }: any) => {
  const colors: any = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-200 dark:shadow-none',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-200 dark:shadow-none',
    amber: 'from-amber-400 to-amber-500 shadow-amber-200 dark:shadow-none',
    red: 'from-red-500 to-red-600 shadow-red-200 dark:shadow-none',
  };
  return (
    <div onClick={onClick} className={`group bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`}>
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${colors[color]}`}></div>
      <div className="flex justify-between items-start mb-4 sm:mb-6 relative z-10">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br text-white shadow-lg ${colors[color]}`}><Icon className="w-5 h-5 sm:w-6 sm:h-6" /></div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
            {trendUp ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}{trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <div className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">{value}</div>
        <h4 className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-semibold mt-1">{title}</h4>
        {subtitle && <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export const BentoChartCard = ({ title, subtitle, percentage, color, icon: Icon, status }: any) => {
  const colorMap: any = {
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', light: 'bg-emerald-50 dark:bg-emerald-900/20' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-400', light: 'bg-blue-50 dark:bg-blue-900/20' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', light: 'bg-amber-50 dark:bg-amber-900/20' },
  };
  const theme = colorMap[color];
  return (
    <div className={`rounded-2xl p-2.5 sm:p-5 flex flex-col justify-between border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors ${theme.light}`}>
      <div className="flex justify-between items-start mb-4 sm:mb-8">
        <div><h4 className={`text-xs sm:text-lg font-bold ${theme.text}`}>{title}</h4><p className="text-[9px] sm:text-xs text-gray-500 font-medium mt-0.5 hidden sm:block">{subtitle}</p></div>
        <div className={`p-1.5 sm:p-2 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm ${theme.text}`}><Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" /></div>
      </div>
      <div>
        <div className="flex justify-between items-end mb-2 flex-wrap sm:flex-nowrap gap-1">
          <span className="text-xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tighter">{percentage}%</span>
          <span className={`text-[8px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm ${theme.text} whitespace-nowrap`}>{status}</span>
        </div>
        <div className="w-full bg-white/50 dark:bg-gray-900/50 rounded-full h-1.5 sm:h-3 overflow-hidden shadow-inner">
          <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className={`h-full rounded-full ${theme.bg} relative overflow-hidden`}>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
