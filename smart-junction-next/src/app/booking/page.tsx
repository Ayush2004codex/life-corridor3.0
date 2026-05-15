"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, AlertTriangle, ShieldAlert, HeartPulse, Stethoscope, ChevronRight, CheckCircle2, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CivilianBookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('idle'); // idle, searching, notified, accepted, en_route
  
  const [booking, setBooking] = useState({
    pickup: 'Current Location (Agarpara)',
    destination: 'SSKM Hospital, Kolkata',
    type: 'Cardiac Arrest',
    severity: 'Critical',
    notes: ''
  });

  useEffect(() => {
    // Listen for driver accepting
    const interval = setInterval(() => {
      if (status === 'searching' || status === 'notified') {
        const acc = localStorage.getItem('dispatch_accepted');
        if (acc === 'true') {
          setStatus('accepted');
          setTimeout(() => setStatus('en_route'), 2000);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const requestAmbulance = () => {
    setStatus('searching');
    setStep(2);
    
    // Simulate AI searching
    setTimeout(() => {
      setStatus('notified');
      // Fire event to driver dashboard
      localStorage.setItem('dispatch_request', JSON.stringify({
        id: 'EMG-' + Math.floor(Math.random()*10000),
        ...booking,
        timestamp: Date.now()
      }));
      localStorage.setItem('dispatch_accepted', 'false');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans relative">
      
      {/* Background Map Simulation */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto p-4 pt-12 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center animate-pulse">
              <HeartPulse size={24} />
            </div>
            <div>
              <h1 className="font-black tracking-wider text-white">EMERGENCY DISPATCH</h1>
              <p className="text-xs text-slate-400 font-medium">Life-Corridor Civilian Network</p>
            </div>
          </div>
          <button onClick={() => router.push('/auth')} className="text-xs border border-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">Log Out</button>
        </header>

        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div 
              key="booking-form"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-6"
            >
              
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl shadow-xl">
                <h2 className="text-sm font-bold text-emerald-400 tracking-widest mb-6 flex items-center gap-2">
                  <Navigation size={16} /> ROUTE DETAILS
                </h2>
                <div className="space-y-4 relative">
                  <div className="absolute left-[19px] top-8 bottom-8 w-[2px] bg-slate-700"></div>
                  
                  <div className="relative z-10 flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center shrink-0">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                    <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 font-bold tracking-widest mb-1">PICKUP LOCATION</div>
                      <input type="text" value={booking.pickup} onChange={e => setBooking({...booking, pickup: e.target.value})} className="w-full bg-transparent border-none outline-none text-white font-medium" />
                    </div>
                  </div>

                  <div className="relative z-10 flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-cyan-500 flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-cyan-500" />
                    </div>
                    <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 font-bold tracking-widest mb-1">DESTINATION (NEAREST)</div>
                      <select value={booking.destination} onChange={e => setBooking({...booking, destination: e.target.value})} className="w-full bg-transparent border-none outline-none text-white font-medium appearance-none cursor-pointer">
                        <option value="SSKM Hospital, Kolkata">SSKM Hospital, Kolkata (3.2 km)</option>
                        <option value="RG Kar Medical College">RG Kar Medical College (4.5 km)</option>
                        <option value="Apollo Gleneagles">Apollo Gleneagles (5.8 km)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl shadow-xl">
                <h2 className="text-sm font-bold text-red-400 tracking-widest mb-6 flex items-center gap-2">
                  <Stethoscope size={16} /> MEDICAL CONTEXT
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 font-bold tracking-widest mb-1">EMERGENCY TYPE</div>
                      <select value={booking.type} onChange={e => setBooking({...booking, type: e.target.value})} className="w-full bg-transparent border-none outline-none text-white font-medium appearance-none cursor-pointer">
                        <option value="Cardiac Arrest">Cardiac Arrest</option>
                        <option value="Accident / Trauma">Accident / Trauma</option>
                        <option value="Stroke">Stroke</option>
                        <option value="Fire Injury">Fire Injury</option>
                        <option value="Maternal">Maternal</option>
                      </select>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 font-bold tracking-widest mb-1">SEVERITY</div>
                      <select value={booking.severity} onChange={e => setBooking({...booking, severity: e.target.value})} className="w-full bg-transparent border-none outline-none text-white font-medium appearance-none cursor-pointer">
                        <option value="Critical">Code Red (Critical)</option>
                        <option value="High Risk">Code Yellow (High Risk)</option>
                        <option value="Stable">Code Green (Stable)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 font-bold tracking-widest mb-1">ADDITIONAL NOTES (OPTIONAL)</div>
                    <input type="text" placeholder="e.g., Patient is unconscious, 5th floor no elevator..." value={booking.notes} onChange={e => setBooking({...booking, notes: e.target.value})} className="w-full bg-transparent border-none outline-none text-white text-sm" />
                  </div>
                </div>
              </div>

              <button onClick={requestAmbulance} className="w-full mt-auto mb-8 bg-red-600 text-white font-black tracking-widest py-5 rounded-2xl hover:bg-red-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-3 text-lg">
                <AlertTriangle size={24} className="animate-pulse" />
                DISPATCH AMBULANCE NOW
              </button>

            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="tracking-view"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col gap-6"
            >
              
              {/* Radar Animation Area */}
              <div className="relative h-64 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl">
                
                {/* Radar Rings */}
                <div className="absolute w-32 h-32 rounded-full border border-emerald-500/20"></div>
                <div className="absolute w-64 h-64 rounded-full border border-emerald-500/20"></div>
                
                {status === 'searching' && (
                  <>
                    <div className="absolute w-full h-full bg-[conic-gradient(from_0deg,transparent,rgba(16,185,129,0.2),transparent)] animate-spin" style={{ animationDuration: '3s' }}></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center animate-ping text-emerald-400 mb-4">
                        <Activity size={32} />
                      </div>
                      <h2 className="text-xl font-bold tracking-widest text-emerald-400">AI SEARCHING...</h2>
                      <p className="text-sm text-slate-400">Locating nearest available ALS Ambulance</p>
                    </div>
                  </>
                )}

                {status === 'notified' && (
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-4 ring-4 ring-cyan-500/30">
                      <ShieldAlert size={32} />
                    </div>
                    <h2 className="text-xl font-bold tracking-widest text-cyan-400">DRIVER NOTIFIED</h2>
                    <p className="text-sm text-slate-400">AMB-007 is reviewing your request</p>
                  </div>
                )}

                {status === 'accepted' && (
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-[0_0_30px_rgba(34,197,94,0.6)]">
                      <CheckCircle2 size={32} />
                    </motion.div>
                    <h2 className="text-xl font-bold tracking-widest text-green-400">REQUEST ACCEPTED</h2>
                    <p className="text-sm text-slate-400">Hospital has been alerted. Activating Corridor.</p>
                  </div>
                )}

                {status === 'en_route' && (
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white mb-4 shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse">
                      <span className="text-2xl transform -scale-x-100 block">🚑</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-widest text-red-400">AMBULANCE EN ROUTE</h2>
                    <p className="text-sm text-slate-400">Green corridor is active. Please stay calm.</p>
                  </div>
                )}

              </div>

              {/* Status Timeline */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl">
                <div className="space-y-6">
                  
                  <div className="flex gap-4 opacity-100">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900"><CheckCircle2 size={12} /></div>
                      <div className="w-0.5 h-8 bg-emerald-500 mt-2"></div>
                    </div>
                    <div>
                      <div className="font-bold text-sm">Emergency Triggered</div>
                      <div className="text-xs text-slate-400">Location and medical details transmitted.</div>
                    </div>
                  </div>

                  <div className={`flex gap-4 transition-opacity duration-500 ${status === 'searching' ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${(status==='notified'||status==='accepted'||status==='en_route') ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 border border-slate-600'}`}>{(status==='notified'||status==='accepted'||status==='en_route') ? <CheckCircle2 size={12} /> : null}</div>
                      <div className={`w-0.5 h-8 mt-2 ${(status==='notified'||status==='accepted'||status==='en_route') ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
                    </div>
                    <div>
                      <div className="font-bold text-sm">Driver Assigned</div>
                      <div className="text-xs text-slate-400">Nearest ALS ambulance selected via AI.</div>
                    </div>
                  </div>

                  <div className={`flex gap-4 transition-opacity duration-500 ${(status==='searching'||status==='notified') ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${(status==='accepted'||status==='en_route') ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 border border-slate-600'}`}>{(status==='accepted'||status==='en_route') ? <CheckCircle2 size={12} /> : null}</div>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">Ambulance Dispatched</div>
                      <div className="text-xs text-emerald-400 font-medium">ETA: 6 Minutes • Distance: 3.2 km</div>
                    </div>
                  </div>

                </div>
              </div>
              
              {status === 'en_route' && (
                <button onClick={() => window.open('/simulation', '_blank')} className="w-full mt-auto mb-8 bg-slate-800 border border-cyan-500/50 text-cyan-400 font-bold tracking-widest py-4 rounded-2xl hover:bg-slate-700 transition-all text-sm">
                  🌐 OPEN 3D CORRIDOR TRACKING
                </button>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
