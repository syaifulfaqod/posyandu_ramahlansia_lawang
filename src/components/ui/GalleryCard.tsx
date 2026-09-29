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


export const GalleryCard = ({ imgUrl, title, desc, is16x9 = false }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all h-72 w-full">
      <img src={imgUrl} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform pointer-events-none">
        <h4 className="text-white font-bold text-lg mb-1 leading-tight">{title}</h4>
        <p className="text-gray-300 text-sm font-medium">{desc}</p>
      </div>
    </div>
  );
};
