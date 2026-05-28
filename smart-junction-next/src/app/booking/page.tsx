"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, AlertTriangle, ShieldAlert, HeartPulse, Stethoscope, Activity, CheckCircle2, Siren, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CivilianBookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: Dual Choice, 1: Manual Form, 2: Tracking
  const [status, setStatus] = useState('idle'); // idle, searching, notified, accepted, en_route
  const [locationGranted, setLocationGranted] = useState(false);
  const [showLocModal, setShowLocModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState('Current Location (Agarpara)');
  
  const [booking, setBooking] = useState({
    civilianPhone: '',
    pickup: 'Current Location (Agarpara)',
    destination: 'Apollo Gleneagles',
    type: 'General Transport',
    severity: 'Stable',
    notes: '',
    hospitalType: '',
    bedAvailability: ''
  });

  const requestLocationPermission = (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    if (locationGranted) {
      if (action === 'sos') requestCriticalSOS();
      else if (action === 'manual') setStep(1);
      return;
    }
    setPendingAction(action);
    setShowLocModal(true);
  };

  const handleAllowLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
          setUserLocation(`📍 Live GPS (${loc})`);
          setBooking(prev => ({ ...prev, pickup: `📍 Live GPS (${loc})` }));
          setLocationGranted(true);
          setShowLocModal(false);
          if (pendingAction === 'sos') requestCriticalSOS();
          else if (pendingAction === 'manual') setStep(1);
        },
        () => {
          setLocationGranted(true);
          setShowLocModal(false);
          if (pendingAction === 'sos') requestCriticalSOS();
          else if (pendingAction === 'manual') setStep(1);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationGranted(true);
      setShowLocModal(false);
      if (pendingAction === 'sos') requestCriticalSOS();
      else if (pendingAction === 'manual') setStep(1);
    }
  };

  const handleDenyLocation = () => {
    setLocationGranted(true);
    setShowLocModal(false);
    if (pendingAction === 'sos') requestCriticalSOS();
    else if (pendingAction === 'manual') setStep(1);
  };

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

  const requestCriticalSOS = () => {
    const sosBooking = {
      civilianPhone: booking.civilianPhone,
      pickup: userLocation,
      destination: 'Sagar Dutta Medical College',
      type: 'Code Red - Critical Trauma',
      severity: 'Critical',
      notes: 'AUTO-DISPATCH via Quick SOS',
      hospitalType: 'Government (Auto-Assigned)',
      bedAvailability: 'ICU: 2 | Gen: 5'
    };
    setBooking(sosBooking);
    
    setStatus('searching');
    setStep(2);
    
    setTimeout(() => {
      setStatus('notified');
      localStorage.setItem('dispatch_request', JSON.stringify({
        id: 'SOS-' + Math.floor(Math.random()*10000),
        ...sosBooking,
        timestamp: Date.now()
      }));
      localStorage.setItem('dispatch_accepted', 'false');
      
      // Trigger Dispatch Twilio Alerts
      fetch('/api/emergencies/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospital: sosBooking.destination,
          eta: 'Calculating...',
          trackLink: 'http://localhost:3000/booking'
        })
      }).catch(err => console.error('Alerts failed:', err));
    }, 2000);
  };

  const requestManualAmbulance = () => {
    const finalBooking = {
      ...booking,
      hospitalType: booking.destination.includes('Sagar Dutta') || booking.destination.includes('SSKM') ? 'Government (Manual)' : 'Private (Manual)',
      bedAvailability: 'Pending/Unknown'
    };
    setBooking(finalBooking);

    setStatus('searching');
    setStep(2);
    
    setTimeout(() => {
      setStatus('notified');
      localStorage.setItem('dispatch_request', JSON.stringify({
        id: 'EMG-' + Math.floor(Math.random()*10000),
        ...finalBooking,
        timestamp: Date.now()
      }));
      localStorage.setItem('dispatch_accepted', 'false');
      
      // Trigger Dispatch Twilio Alerts
      fetch('/api/emergencies/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospital: finalBooking.destination,
          eta: 'Calculating...',
          trackLink: 'http://localhost:3000/booking'
        })
      }).catch(err => console.error('Alerts failed:', err));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-y-auto font-sans relative flex flex-col">
      
      {/* Background Simulation */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none fixed">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-auto p-4 pt-12 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <HeartPulse size={24} />
            </div>
            <div>
              <h1 className="font-black tracking-wider text-white text-sm">LIFE-CORRIDOR</h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest">CIVILIAN NETWORK</p>
            </div>
          </div>
          <button type="button" onClick={() => router.push('/auth')} className="text-xs border border-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors font-medium">Log Out</button>
        </header>

        <AnimatePresence mode="wait">
          
          {/* STEP 0: DUAL FLOW SELECTION */}
          {step === 0 && (
            <motion.div 
              key="flow-selection"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col justify-center gap-6 pb-20"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-black text-white tracking-wide mb-2">Select Emergency Response</h2>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">Choose an automated SOS dispatch for critical emergencies or manually enter details for general transport.</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <div className="text-[10px] text-emerald-400 font-bold tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> YOUR PHONE NUMBER (FOR DRIVER CONTACT)
                </div>
                <input type="tel" placeholder="+91 9876543210" value={booking.civilianPhone} onChange={e => setBooking({...booking, civilianPhone: e.target.value})} className="w-full bg-transparent border-b border-slate-600 outline-none text-white text-lg font-mono pb-2 focus:border-emerald-500 transition-colors" />
              </div>

              {/* Path A: Critical SOS */}
              <button type="button" 
                onClick={(e) => requestLocationPermission(e, 'sos')}
                className="group relative overflow-hidden bg-red-950/40 border-2 border-red-500/50 p-6 rounded-3xl text-left hover:bg-red-900/50 transition-all hover:border-red-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.3)]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                    <Siren size={28} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-widest text-white mb-1">CRITICAL SOS</h3>
                    <p className="text-red-200 text-xs font-medium mb-3">Auto-dispatch to nearest Govt. Hospital</p>
                    <ul className="text-xs text-red-300/80 space-y-1">
                      <li className="flex items-center gap-1"><CheckCircle2 size={10} /> Nearest Govt. Hospital Auto-Assigned</li>
                      <li className="flex items-center gap-1"><CheckCircle2 size={10} /> Live Bed Availability Check</li>
                      <li className="flex items-center gap-1"><CheckCircle2 size={10} /> Green Corridor Override Activated</li>
                    </ul>
                  </div>
                </div>
              </button>

              {/* Path B: Manual Transport */}
              <button type="button" 
                onClick={(e) => requestLocationPermission(e, 'manual')}
                className="group relative overflow-hidden bg-slate-900/60 border border-slate-700 p-6 rounded-3xl text-left hover:bg-slate-800 transition-all hover:border-cyan-500/50"
              >
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all">
                    <UserPlus size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-widest text-white mb-1">MANUAL TRANSPORT</h3>
                    <p className="text-slate-400 text-xs font-medium mb-3">Non-critical, select custom destination</p>
                    <ul className="text-xs text-slate-500 space-y-1">
                      <li className="flex items-center gap-1"><CheckCircle2 size={10} /> Select specific Private/Govt hospital</li>
                      <li className="flex items-center gap-1"><CheckCircle2 size={10} /> Input custom medical context</li>
                      <li className="flex items-center gap-1"><CheckCircle2 size={10} /> Standard routing & dispatch</li>
                    </ul>
                  </div>
                </div>
              </button>

            </motion.div>
          )}

          {/* STEP 1: MANUAL BOOKING FORM */}
          {step === 1 && (
            <motion.div 
              key="booking-form"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-5 pb-20"
            >
              <button type="button" onClick={() => setStep(0)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2 w-fit">
                ← Back to Emergency Selection
              </button>

              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl shadow-xl">
                <h2 className="text-sm font-bold text-cyan-400 tracking-widest mb-6 flex items-center gap-2">
                  <Navigation size={16} /> ROUTE DETAILS (MANUAL)
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
                      <div className="text-[10px] text-slate-400 font-bold tracking-widest mb-1">DESTINATION HOSPITAL</div>
                      <select value={booking.destination} onChange={e => setBooking({...booking, destination: e.target.value})} className="w-full bg-transparent border-none outline-none text-white font-medium appearance-none cursor-pointer">
                        <optgroup label="Government Hospitals" className="bg-slate-900 text-slate-400 font-bold">
                          <option value="Sagar Dutta Medical College" className="bg-slate-800 text-white font-medium">Sagar Dutta Medical College (2.5 km)</option>
                          <option value="Barrackpore Sub-Divisional" className="bg-slate-800 text-white font-medium">Barrackpore Sub-Divisional (6.1 km)</option>
                          <option value="SSKM Hospital, Kolkata" className="bg-slate-800 text-white font-medium">SSKM Hospital, Kolkata (12.4 km)</option>
                        </optgroup>
                        <optgroup label="Private Hospitals" className="bg-slate-900 text-slate-400 font-bold">
                          <option value="Apollo Gleneagles" className="bg-slate-800 text-white font-medium">Apollo Gleneagles (8.5 km)</option>
                          <option value="Fortis Hospital" className="bg-slate-800 text-white font-medium">Fortis Hospital (9.2 km)</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl shadow-xl">
                <h2 className="text-sm font-bold text-amber-400 tracking-widest mb-6 flex items-center gap-2">
                  <Stethoscope size={16} /> MEDICAL CONTEXT
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 font-bold tracking-widest mb-1">EMERGENCY TYPE</div>
                      <select value={booking.type} onChange={e => setBooking({...booking, type: e.target.value})} className="w-full bg-transparent border-none outline-none text-white font-medium appearance-none cursor-pointer">
                        <option value="General Transport" className="bg-slate-800 text-white">General Transport</option>
                        <option value="Maternal" className="bg-slate-800 text-white">Maternal</option>
                        <option value="Minor Accident" className="bg-slate-800 text-white">Minor Accident</option>
                        <option value="Checkup/Dialysis" className="bg-slate-800 text-white">Checkup/Dialysis</option>
                      </select>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 font-bold tracking-widest mb-1">SEVERITY</div>
                      <select value={booking.severity} onChange={e => setBooking({...booking, severity: e.target.value})} className="w-full bg-transparent border-none outline-none text-white font-medium appearance-none cursor-pointer">
                        <option value="Stable" className="bg-slate-800 text-white">Code Green (Stable)</option>
                        <option value="High Risk" className="bg-slate-800 text-white">Code Yellow (High Risk)</option>
                        <option value="Critical" className="bg-slate-800 text-white">Code Red (Critical)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 font-bold tracking-widest mb-1">ADDITIONAL NOTES (OPTIONAL)</div>
                    <input type="text" placeholder="e.g., Patient needs wheelchair..." value={booking.notes} onChange={e => setBooking({...booking, notes: e.target.value})} className="w-full bg-transparent border-none outline-none text-white text-sm" />
                  </div>
                </div>
              </div>

              <button type="button" onClick={requestManualAmbulance} className="w-full mt-auto mb-8 bg-cyan-600 text-white font-black tracking-widest py-5 rounded-2xl hover:bg-cyan-500 hover:shadow-[0_0_40px_rgba(8,145,178,0.5)] transition-all flex items-center justify-center gap-3 text-lg">
                <Navigation size={24} />
                DISPATCH MANUAL TRANSPORT
              </button>

            </motion.div>
          )}

          {/* STEP 2: TRACKING VIEW (RADAR) */}
          {step === 2 && (
            <motion.div 
              key="tracking-view"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col gap-6"
            >
              
              {/* Radar Animation Area */}
              <div className="relative h-64 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl">
                
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
                  <iframe src="/civilian-map.html" className="w-full h-full border-0 absolute inset-0 z-20"></iframe>
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
                      <div className="font-bold text-sm text-white">Destination: {booking.destination}</div>
                      <div className="text-xs text-slate-400">{booking.hospitalType}</div>
                      {booking.bedAvailability !== 'Pending/Unknown' && (
                        <div className="text-xs text-cyan-400 font-bold mt-1 bg-cyan-500/10 inline-block px-2 py-0.5 rounded border border-cyan-500/20">
                          {booking.bedAvailability}
                        </div>
                      )}
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
                      <div className="text-xs text-emerald-400 font-medium">Approaching from {booking.destination}</div>
                    </div>
                  </div>

                </div>
              </div>
              
              {status === 'en_route' && (
                <button type="button" onClick={() => window.open('/simulation', '_blank')} className="w-full mt-auto mb-8 bg-slate-800 border border-cyan-500/50 text-cyan-400 font-bold tracking-widest py-4 rounded-2xl hover:bg-slate-700 transition-all text-sm">
                  🌐 OPEN 3D CORRIDOR TRACKING
                </button>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Location Permission Modal */}
      <AnimatePresence>
        {showLocModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center text-4xl mx-auto mb-5 animate-pulse">
                📍
              </div>
              <h3 className="text-xl font-black text-white mb-2">Allow Location Access</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Life Corridor needs your <span className="text-emerald-400 font-bold">precise location</span> to dispatch the nearest ambulance and calculate the fastest route to you.
              </p>
              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center gap-3 bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                  <span className="text-lg">🚑</span>
                  <span className="text-xs text-slate-300"><strong className="text-white">Faster Dispatch</strong> — Nearest ambulance finds you</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                  <span className="text-lg">🗺️</span>
                  <span className="text-xs text-slate-300"><strong className="text-white">Live Tracking</strong> — Real-time ambulance position</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                  <span className="text-lg">🔒</span>
                  <span className="text-xs text-slate-300"><strong className="text-white">Privacy Safe</strong> — Used only for this emergency</span>
                </div>
              </div>
              <button type="button"
                onClick={handleAllowLocation}
                className="w-full py-4 rounded-2xl bg-emerald-500 text-black font-black tracking-wider text-sm hover:bg-emerald-400 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] mb-3"
              >
                ✅ Allow Location Access
              </button>
              <button type="button"
                onClick={handleDenyLocation}
                className="w-full py-3 rounded-2xl border border-slate-700 text-slate-400 text-xs font-medium hover:bg-slate-800 transition-all"
              >
                Continue without location
              </button>
              <p className="text-[10px] text-slate-600 mt-4">By allowing, you agree to our <a href="/privacy-policy.html" className="text-emerald-500 underline">Privacy Policy</a></p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
