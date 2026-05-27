"use client";

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Bot, Activity, Map, ArrowRight, Loader2 } from 'lucide-react';
import apiClient, { api, setToken } from '../../lib/api';

export default function DriverDashboard() {
  const [symptoms, setSymptoms] = useState('');
  const [isTriaging, setIsTriaging] = useState(false);
  const [triageResult, setTriageResult] = useState<any>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [routeResult, setRouteResult] = useState<any>(null);
  const [authStatus, setAuthStatus] = useState('Authenticating demo driver...');
  const [vitals, setVitals] = useState({ hr: '', bp: '', spo2: '' });
  const [isRerouting, setIsRerouting] = useState(false);

  useEffect(() => {
    // Auto-login demo driver to get token for AI APIs
    const autoLogin = async () => {
      try {
        const creds = { email: 'demo_driver@lifecorridor.io', password: 'password123' };
        try {
          await apiClient.post('/auth/register', { name: 'Demo Driver', role: 'driver', ...creds });
        } catch (e: any) {
          if (e.response?.status !== 409) throw e;
        }
        const res = await api.auth.login(creds.email, creds.password);
        setToken(res.tokens.accessToken);
        setAuthStatus('Ready: Driver Connected');
      } catch (err) {
        console.error(err);
        setAuthStatus('Auth failed. Is the Node server running?');
      }
    };
    autoLogin();
  }, []);

  const handleAITriage = async () => {
    if (!symptoms && !vitals.hr) return;
    setIsTriaging(true);
    try {
      const vitalsString = `HR: ${vitals.hr || 'N/A'}, BP: ${vitals.bp || 'N/A'}, SpO2: ${vitals.spo2 || 'N/A'}`;
      const data = await api.emergencies.triage(symptoms, vitalsString);
      setTriageResult(data);
    } catch (err) {
      console.error(err);
      alert('Triage failed. Check console.');
    } finally {
      setIsTriaging(false);
    }
  };

  const handleActivateCorridor = async () => {
    setIsRouting(true);
    try {
      const data = await api.routes.calculate({
        startLocation: { address: 'Current Location' },
        endLocation: { address: 'Nearest Apollo Hospital' }
      });
      setRouteResult(data);
      
      // Save to localStorage for the simulation to pick up
      localStorage.setItem('medical_vitals', JSON.stringify({
        state: triageResult?.severity === 'critical' ? 'Critical' : 'Stable',
        bpm: vitals.hr || '120',
        eta: `${data.durationMinutes || data.duration} mins`
      }));
      
    } catch (err) {
      console.error(err);
      alert('Routing failed. Check console.');
    } finally {
      setIsRouting(false);
    }
  };

  const handleSimulateBottleneck = async () => {
    setIsRerouting(true);
    try {
      const data = await api.routes.recalculate({
        currentLocation: 'Sector 5, Salt Lake',
        endLocation: 'Apollo Hospital'
      });
      setRouteResult(data);
      
      // Update ETA in simulation
      localStorage.setItem('medical_vitals', JSON.stringify({
        ...JSON.parse(localStorage.getItem('medical_vitals') || '{}'),
        eta: `${data.durationMinutes || data.duration} mins`
      }));
      
      alert('⚠️ Bottleneck detected! AI has successfully rerouted you.');
    } catch (err) {
      console.error(err);
      alert('Rerouting failed.');
    } finally {
      setIsRerouting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex justify-between items-center bg-slate-900/80 border border-slate-700/50 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
              <Activity size={28} />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-wider text-white">AMBULANCE DRIVER PORTAL</h1>
              <div className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${authStatus.includes('Ready') ? 'bg-emerald-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                {authStatus}
              </div>
            </div>
          </div>
          <a href="/simulation" className="px-6 py-3 bg-emerald-500 text-slate-900 font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-400 transition-colors">
            View 3D Simulation <ArrowRight size={18} />
          </a>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT COL: TRIAGE */}
          <div className="bg-slate-900/80 border border-slate-700/50 p-6 rounded-2xl flex flex-col">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bot className="text-cyan-400" /> AI Severity Triage
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Enter patient symptoms. The AI will categorize severity and identify required equipment instantly.
            </p>
            
            <textarea
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              placeholder="e.g., Patient has severe chest pain, sweating, left arm numbness..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 min-h-[100px] mb-4"
            />

            <div className="grid grid-cols-3 gap-3 mb-4">
              <input type="text" placeholder="HR (bpm)" value={vitals.hr} onChange={e => setVitals({...vitals, hr: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-cyan-500" />
              <input type="text" placeholder="BP (mmHg)" value={vitals.bp} onChange={e => setVitals({...vitals, bp: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-cyan-500" />
              <input type="text" placeholder="SpO2 (%)" value={vitals.spo2} onChange={e => setVitals({...vitals, spo2: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-cyan-500" />
            </div>

            <button 
              onClick={handleAITriage}
              disabled={isTriaging || (!symptoms && !vitals.hr)}
              className="w-full py-4 bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 rounded-xl font-bold hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isTriaging ? <Loader2 className="animate-spin" /> : <Bot />}
              Run 🤖 AI Triage
            </button>

            {triageResult && (
              <div className="mt-6 p-4 bg-slate-800 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400 font-bold tracking-widest mb-2">GROQ INFERENCE RESULT</div>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`px-4 py-2 rounded-lg font-black text-sm uppercase ${
                    triageResult.severity?.toLowerCase().includes('red') || triageResult.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {triageResult.severity}
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-slate-400">Required Prep: </span>
                  <span className="text-white font-medium">{triageResult.requiredEquipment?.join(', ') || 'Standard Kit'}</span>
                </div>
                {triageResult.hospitalPrep && (
                  <div className="text-sm mt-2">
                    <span className="text-slate-400">Hospital Action: </span>
                    <span className="text-white font-bold text-red-400">{triageResult.hospitalPrep}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COL: ROUTING */}
          <div className="bg-slate-900/80 border border-slate-700/50 p-6 rounded-2xl flex flex-col">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Map className="text-emerald-400" /> Green Corridor Request
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Activate the Green Corridor to lock down traffic lights ahead of you using predictive routing.
            </p>

            <div className="flex-1"></div>

            <button 
              onClick={handleActivateCorridor}
              disabled={isRouting}
              className="w-full py-6 bg-emerald-500 text-slate-900 rounded-xl font-black text-lg hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
            >
              {isRouting ? <Loader2 className="animate-spin" /> : <ShieldAlert />}
              ACTIVATE GREEN CORRIDOR
            </button>

            {routeResult && (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <div className="text-xs text-emerald-400 font-bold tracking-widest mb-2">🤖 AI TRAFFIC OPTIMIZER</div>
                <div className="text-white font-bold text-lg mb-1">{routeResult.optimalRouteName}</div>
                <div className="text-emerald-300 text-sm mb-3">ETA: {routeResult.durationMinutes || routeResult.duration} mins (Traffic: {routeResult.trafficLevel})</div>
                <div className="text-slate-400 text-sm italic border-l-2 border-slate-700 pl-3 mb-4">
                  "{routeResult.aiReasoning}"
                </div>
                
                <button
                  onClick={handleSimulateBottleneck}
                  disabled={isRerouting}
                  className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {isRerouting ? <Loader2 className="animate-spin" size={18} /> : <Activity size={18} />}
                  Simulate Bottleneck (AI Reroute)
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
