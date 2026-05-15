"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, HeartPulse, User, Lock, Mail, Phone, Droplet } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth & redirect
    localStorage.setItem('user_session', JSON.stringify({ role: 'user', name: 'Ayush' }));
    router.push('/booking');
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-200">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 text-center border-b border-slate-800/50">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <HeartPulse size={32} />
          </div>
          <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            LIFE-CORRIDOR
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-medium tracking-wide">AI-Powered Emergency Response Network</p>
        </div>

        {/* Form Area */}
        <div className="p-8">
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-3 text-sm font-bold tracking-wider transition-colors border-b-2 ${isLogin ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              SECURE LOGIN
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-3 text-sm font-bold tracking-wider transition-colors border-b-2 ${!isLogin ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              REGISTER
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input required type="text" placeholder="Full Legal Name" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input required type="tel" placeholder="Primary Contact Number" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600" />
                </div>
                <div className="relative">
                  <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500/50" size={18} />
                  <select required className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-slate-300 appearance-none">
                    <option value="">Select Blood Group (Required)</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                </div>
              </motion.div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input required type="email" placeholder="Email Address" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600" />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input required type="password" placeholder="Biometric / Password" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600" />
            </div>

            {isLogin && (
              <div className="flex justify-between items-center px-1">
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/50" />
                  Remember me
                </label>
                <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300">Forgot Password?</a>
              </div>
            )}

            <button type="submit" className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-black tracking-widest py-4 rounded-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
              <Activity size={20} />
              {isLogin ? 'INITIALIZE SESSION' : 'CREATE HEALTH ID'}
            </button>
            
          </form>

          {/* Quick SOS Auth Bypass */}
          <div className="mt-8 pt-6 border-t border-slate-800/50">
            <button onClick={() => router.push('/booking')} className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold tracking-widest py-3 rounded-xl hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all flex items-center justify-center gap-2 text-sm">
              <ShieldAlert size={18} />
              QUICK SOS (SKIP AUTH)
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
