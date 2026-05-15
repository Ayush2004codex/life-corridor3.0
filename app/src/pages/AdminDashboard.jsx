import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut, Activity, Bed, Radio, Heart } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [emergencies, setEmergencies] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [emergencyData, ambulanceData, signalData] = await Promise.all([
        api.emergencies.getAll(),
        api.ambulances.getAll(),
        api.signals.getAll(),
      ]);
      setEmergencies(emergencyData || []);
      setAmbulances(ambulanceData || []);
      setSignals(signalData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const activeEmergencies = emergencies.filter(e => e.status !== 'completed' && e.status !== 'cancelled');
  const availableBeds = 12; // Will integrate with hospital data
  const activeCorridors = emergencies.filter(e => e.status === 'en-route').length;
  const livesSaved = emergencies.filter(e => e.status === 'completed').length;

  const stats = [
    { icon: <Activity size={20} />, num: activeEmergencies.length.toString(), label: 'Active Emergencies' },
    { icon: <Bed size={20} />, num: availableBeds.toString(), label: 'Beds Available' },
    { icon: <Radio size={20} />, num: activeCorridors.toString(), label: 'Active Corridors' },
    { icon: <Heart size={20} />, num: livesSaved.toString(), label: 'Completed Today' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-dark)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00c853]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-dark)' }}>
      <nav className="flex items-center justify-between px-6 md:px-10 py-3.5" style={{ background: 'rgba(10,15,26,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,200,83,0.15)' }}>
        <div className="flex items-center gap-3">
          <span className="text-xl font-extrabold grad-text">Life<span className="font-light">Corridor</span></span>
          <span className="text-sm text-[var(--color-muted)]">| Admin Portal</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-sm text-[var(--color-muted)]">Hello, <strong className="text-[var(--color-text)]">{user?.name || 'Admin'}</strong></span>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{ border: '1px solid var(--color-warn)', color: 'var(--color-warn)' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <h1 className="text-2xl font-extrabold mb-1">Hospital Management Overview</h1>
        <p className="text-sm text-[var(--color-muted)] mb-8">Real-time monitoring of emergency requests and corridor management.</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)', color: '#ff6b6b' }}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl p-6" style={{ background: 'var(--color-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[var(--color-primary)] mb-2">{s.icon}</div>
              <div className="text-3xl font-extrabold grad-text">{s.num}</div>
              <div className="text-xs text-[var(--color-muted)] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6" style={{ background: 'var(--color-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">🚑 Active Incoming Requests</h2>
            <div className="space-y-3">
              {activeEmergencies.length > 0 ? (
                activeEmergencies.map(emergency => (
                  <div key={emergency._id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--color-card-2)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(0,200,83,0.12)' }}>🚨</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{emergency.requestNumber} — {emergency.type}</div>
                      <div className="text-xs text-[var(--color-muted)]">Patient: {emergency.patientName} • Status: {emergency.status}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: 'rgba(0,200,83,0.15)', color: 'var(--color-primary)' }}>
                      {emergency.status.toUpperCase()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-[var(--color-muted)] text-center py-4">No active emergencies</div>
              )}
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: 'var(--color-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">🚦 Signal Status</h2>
            <div className="grid grid-cols-2 gap-3">
              {signals.slice(0, 4).map((signal, idx) => (
                <div key={signal._id || idx} className="rounded-xl p-4 text-center" style={{ background: 'var(--color-card-2)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="text-xs font-semibold mb-2">Signal {idx + 1}</div>
                  <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ background: signal.status === 'green' ? '#00c853' : '#ff4444', boxShadow: `0 0 12px ${signal.status === 'green' ? '#00c853' : '#ff4444'}` }} />
                  <div className="text-[11px] font-semibold" style={{ color: signal.status === 'green' ? '#00c853' : '#ff4444' }}>
                    {signal.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 rounded-xl text-sm font-semibold text-black grad-bg transition-all hover:opacity-90">⚡ Manage Signals</button>
          </div>
        </div>
      </div>
    </div>
  );
}
