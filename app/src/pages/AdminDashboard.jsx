import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Activity, Bed, Radio, Heart } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/', { replace: true }); };

  const stats = [
    { icon: <Activity size={20} />, num: '4', label: 'Incoming Ambulances' },
    { icon: <Bed size={20} />,      num: '12', label: 'Beds Available' },
    { icon: <Radio size={20} />,    num: '8',  label: 'Active Corridors' },
    { icon: <Heart size={20} />,    num: '3',  label: 'Lives Saved Today' },
  ];

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
        <p className="text-sm text-[var(--color-muted)] mb-8">Monitor incoming requests, manage bed availability, and oversee signal corridors.</p>

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
              {[
                { id: 'AMB-007', type: 'Cardiac Emergency', from: 'Agarpara', eta: '4 mins', bed: 'ICU 1' },
                { id: 'AMB-012', type: 'Trauma / Accident', from: 'Salt Lake', eta: '7 mins', bed: 'Trauma 3' },
              ].map(a => (
                <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--color-card-2)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(0,200,83,0.12)' }}>🚨</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{a.id} — {a.type}</div>
                    <div className="text-xs text-[var(--color-muted)]">En route from {a.from} • ETA: {a.eta}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: 'rgba(0,200,83,0.15)', color: 'var(--color-primary)' }}>PREPARING {a.bed}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: 'var(--color-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">🚦 Signal Control Overview</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Gate 1 Appr.', color: '#00c853' },
                { name: 'Main Road',    color: '#00c853' },
                { name: 'South Appr.',  color: '#ff4444' },
                { name: 'East Appr.',   color: '#ff4444' },
              ].map(s => (
                <div key={s.name} className="rounded-xl p-4 text-center" style={{ background: 'var(--color-card-2)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="text-xs font-semibold mb-2">{s.name}</div>
                  <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ background: s.color, boxShadow: `0 0 12px ${s.color}` }} />
                  <div className="text-[11px] font-semibold" style={{ color: s.color }}>{s.color === '#00c853' ? 'GREEN' : 'RED'}</div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 rounded-xl text-sm font-semibold text-black grad-bg transition-all hover:opacity-90">⚡ Override All Green</button>
          </div>
        </div>
      </div>
    </div>
  );
}
