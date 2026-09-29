import React from 'react';

export const Badge = ({ type, children }: any) => {
  const styles: any = {
    Normal: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200',
    Pantau: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200',
    Rujuk: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
    Terdaftar: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
    Default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200'
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[type] || styles.Default}`}>{children}</span>;
};

export const Button = ({ children, variant = 'primary', icon: Icon, className = '', ...props }: any) => {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  const variants: any = {
    primary: "bg-blue-700 hover:bg-blue-800 text-white shadow-sm shadow-blue-200 dark:shadow-none",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-750",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-sm shadow-green-200 dark:shadow-none",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
    ghost: "hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-300"
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{Icon && <Icon size={18} />}{children}</button>;
};

export const RadioGroup = ({ options, value, onChange, label }: any) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>}
    <div className="flex flex-wrap gap-3">
      {options.map((opt: any) => {
        const isSelected = value === opt.value;
        const color = opt.color || 'emerald';
        const activeClass = color === 'red' 
          ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300'
          : 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-500 dark:text-emerald-300';
        return (
          <button 
            type="button" 
            key={opt.value} 
            onClick={() => isSelected ? onChange(null) : onChange(opt.value)}
            className={`flex-1 sm:flex-none cursor-pointer flex items-center justify-center px-4 py-3 rounded-xl border-2 transition-all ${isSelected ? activeClass : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
            <span className="font-medium text-sm text-center leading-tight">{opt.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);
