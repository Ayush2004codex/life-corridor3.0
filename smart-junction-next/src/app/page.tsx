"use client";

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ShieldAlert, Activity, Cpu, Zap, Radio, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import the components from the simulation page logic
// Since we want to keep it in one file for now to ensure a clean build
import SmartJunctionDashboard from './simulation/Simulation';

export default function LandingPage3D() {
  const [showSim, setShowSim] = useState(false);

  if (showSim) {
    return <SmartJunctionDashboard />;
  }

  return (
    <div className="w-screen h-screen bg-[#020617] text-slate-200 overflow-hidden relative">
      
      {/* 3D BACKGROUND (RE-USING THE SIMULATION AS A HERO BACKDROP) */}
      <div className="absolute inset-0 z-0 opacity-40">
        <SmartJunctionDashboard isBackground={true} />
      </div>

      {/* OVERLAY CONTENT */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-transparent via-[#020617]/40 to-[#020617]">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold tracking-widest text-emerald-400">NEXT-GEN EMERGENCY DISPATCH</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black mb-6 tracking-tighter"
        >
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            LIFE CORRIDOR
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
        >
          Experience the future of smart mobility. Our AI-driven Green Corridor system 
          synchronizes city infrastructure in real-time to save lives when every second counts.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          <button 
            onClick={() => setShowSim(true)}
            className="px-10 py-5 bg-emerald-500 text-slate-950 font-black rounded-2xl flex items-center gap-3 hover:bg-emerald-400 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
          >
            ENTER 3D COMMAND CENTER <ChevronRight size={20} />
          </button>
          <a 
            href="/index.html"
            className="px-10 py-5 bg-slate-900/80 border border-slate-700/50 text-white font-bold rounded-2xl flex items-center gap-3 hover:bg-slate-800 transition-all"
          >
            VIEW STATIC SITE
          </a>
        </motion.div>

        {/* STATS STRIP */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-slate-800/50 pt-12"
        >
          <div className="text-center">
            <div className="text-3xl font-black text-white">1,247</div>
            <div className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">LIVES SAVED</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-emerald-400">4.2x</div>
            <div className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">FASTER RESPONSE</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-cyan-400">98.7%</div>
            <div className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">SIGNAL ACCURACY</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-blue-400">8</div>
            <div className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">ACTIVE ZONES</div>
          </div>
        </motion.div>
      </div>

      {/* AMBIENT LOGO */}
      <div className="absolute top-8 left-8 z-20 flex items-center gap-2">
        <ShieldAlert className="text-emerald-500" size={24} />
        <span className="font-black tracking-tighter text-xl">LIFE CORRIDOR</span>
      </div>
    </div>
  );
}
