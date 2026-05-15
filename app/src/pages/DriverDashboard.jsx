import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Clock, Radio, Gauge, MapPin } from 'lucide-react';
import { api } from '../services/api';

export default function DriverDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [corridorActive, setCorridorActive] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    destinationHospital: '',
    emergencyType: 'accident',
    patientName: '',
  });

  const ambRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const data = await api.hospitals.getAll();
      setHospitals(data || []);
      if (data && data.length > 0) {
        setFormData(prev => ({ ...prev, destinationHospital: data[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      setError('Failed to load hospitals');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const activateCorridor = async (e) => {
    e.preventDefault();

    if (!formData.patientName.trim()) {
      setError('Please enter patient name');
      return;
    }

    if (!formData.destinationHospital) {
      setError('Please select a hospital');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.emergencies.create({
        type: formData.emergencyType,
        priority: 'high',
        patientName: formData.patientName,
        pickupLocation: {
          latitude: 22.5726,
          longitude: 88.3639,
          address: 'Current Location, Kolkata',
        },
        destinationHospital: formData.destinationHospital,
      });

      console.log('Emergency created:', response);
      setCorridorActive(true);
      setArrived(false);
      setFormData({ ...formData, patientName: '' });
      setError(null);
    } catch (err) {
      console.error('Error creating emergency:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create emergency request';
      setError(errorMsg);
      setCorridorActive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!corridorActive) return;

    const routePoints = [
      { x: 94, y: 340 },
      { x: 94, y: 154 },
      { x: 414, y: 154 },
      { x: 414, y: 74 },
      { x: 750, y: 74 },
    ];

    let currentSegment = 0;
    let progress = 0;
    const speed = 0.005;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (currentSegment >= routePoints.length - 1) {
        clearInterval(intervalRef.current);
        setArrived(true);
        return;
      }

      progress += speed;
      if (progress >= 1) {
        progress = 0;
        currentSegment++;
      }

      if (currentSegment < routePoints.length - 1 && ambRef.current) {
        const p1 = routePoints[currentSegment];
        const p2 = routePoints[currentSegment + 1];
        const cx = p1.x + (p2.x - p1.x) * progress;
        const cy = p1.y + (p2.y - p1.y) * progress;
        ambRef.current.setAttribute('transform', `translate(${cx}, ${cy})`);
      }
    }, 50);

    return () => clearInterval(intervalRef.current);
  }, [corridorActive]);

  const mapSpeed = arrived ? '0' : corridorActive ? '65' : '0';
  const mapSignals = corridorActive ? '6/6' : '0/6';
  const mapEta = arrived ? 'Arrived' : corridorActive ? '6m' : '--';
  const mapDist = arrived ? '0 km' : corridorActive ? '4.2 km' : '--';

  return (
    <div className="min-h-screen pb-10" style={{ background: 'var(--color-dark)' }}>
      <nav className="flex items-center justify-between px-6 md:px-10 py-3.5" style={{ background: 'rgba(10,15,26,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,200,83,0.15)' }}>
        <div className="flex items-center gap-3">
          <span className="text-xl font-extrabold grad-text">Life<span className="font-light">Corridor</span></span>
          <span className="text-sm text-[var(--color-muted)]">| Driver App</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-sm text-[var(--color-muted)]">Hello, <strong className="text-[var(--color-text)]">{user?.name || 'Driver'}</strong></span>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{ border: '1px solid var(--color-warn)', color: 'var(--color-warn)' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <h1 className="text-2xl font-extrabold mb-1">Ambulance Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)] mb-8">Request emergency corridors, view active routes, and navigate safely.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Corridor Request */}
          <div className="rounded-2xl p-7" style={{ background: 'var(--color-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">🚀 Request Emergency Corridor</h2>
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)', color: '#ff6b6b' }}>
                {error}
              </div>
            )}
            <form onSubmit={activateCorridor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Patient Name</label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="Patient name"
                  disabled={loading || corridorActive}
                  className="w-full px-4 py-3.5 rounded-xl text-sm disabled:opacity-50"
                  style={{ background: 'var(--color-card-2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Pickup Location</label>
                <input
                  readOnly
                  value="Current Location (Kolkata)"
                  className="w-full px-4 py-3.5 rounded-xl text-sm"
                  style={{ background: 'var(--color-card-2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Destination Hospital</label>
                <select
                  value={formData.destinationHospital}
                  onChange={e => setFormData({ ...formData, destinationHospital: e.target.value })}
                  disabled={loading || corridorActive}
                  className="w-full px-4 py-3.5 rounded-xl text-sm appearance-none cursor-pointer disabled:opacity-50"
                  style={{ background: 'var(--color-card-2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text)' }}
                >
                  {hospitals.map(h => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Emergency Type</label>
                <select
                  value={formData.emergencyType}
                  onChange={e => setFormData({ ...formData, emergencyType: e.target.value })}
                  disabled={loading || corridorActive}
                  className="w-full px-4 py-3.5 rounded-xl text-sm appearance-none cursor-pointer disabled:opacity-50"
                  style={{ background: 'var(--color-card-2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text)' }}
                >
                  <option value="accident">Trauma / Accident</option>
                  <option value="heart-attack">Cardiac Emergency</option>
                  <option value="stroke">Stroke</option>
                  <option value="burn">Burns</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading || corridorActive}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-black grad-bg transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? 'Creating...' : corridorActive ? 'Corridor Activated' : 'Activate Green Corridor'}
              </button>
              {corridorActive && !arrived && (
                <div className="p-5 rounded-xl" style={{ background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.3)' }}>
                  <div className="text-base font-bold text-[var(--color-primary)] mb-1 flex items-center gap-2">✅ Corridor Active!</div>
                  <p className="text-xs text-[var(--color-text)] leading-relaxed">Route calculated. <strong>All signals ahead overridden to green.</strong> ETA ≈ 6 minutes.</p>
                </div>
              )}
            </form>
          </div>

          {/* Live Nav */}
          <div className="rounded-2xl p-7" style={{ background: 'var(--color-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">📍 Live Navigation Status</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Clock size={18} />, val: mapEta, label: 'Current ETA' },
                { icon: <Radio size={18} />, val: mapSignals, label: 'Signals Cleared' },
                { icon: <Gauge size={18} />, val: mapSpeed, label: 'Speed (km/h)' },
                { icon: <MapPin size={18} />, val: mapDist, label: 'Distance Left' },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-5 text-center" style={{ background: 'var(--color-card-2)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="text-[var(--color-primary)] flex justify-center mb-2">{s.icon}</div>
                  <div className="text-2xl font-extrabold grad-text">{s.val}</div>
                  <div className="text-[11px] text-[var(--color-muted)] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 rounded-xl" style={{ background: 'var(--color-card-2)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="text-xs text-[var(--color-muted)] mb-1">NEXT TURN</div>
              <div className="text-base font-semibold flex items-center gap-3">
                <span className="text-2xl">{arrived ? '✅' : '⬆️'}</span> {arrived ? 'You have arrived at destination' : 'Continue straight on BT Road for 2.4 km'}
              </div>
            </div>
          </div>
        </div>

        {/* ── MAP COMPONENT ── */}
        <div className="rounded-2xl p-7" style={{ background: 'var(--color-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2">🗺️ Live Ambulance Tracking</h2>
          
          <div className="relative rounded-2xl overflow-hidden h-[380px]" style={{ background: 'var(--color-card-2)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <svg className="w-full h-full" viewBox="0 0 900 380">
              <rect fill="#0d1526" width="900" height="380"/>
              {/* Major roads horizontal */}
              <rect y="60" width="900" height="28" fill="#1a2235"/>
              <rect y="140" width="900" height="28" fill="#1a2235"/>
              <rect y="220" width="900" height="28" fill="#1a2235"/>
              <rect y="300" width="900" height="28" fill="#1a2235"/>
              {/* Major roads vertical */}
              <rect x="80" width="28" height="380" fill="#1a2235"/>
              <rect x="240" width="28" height="380" fill="#1a2235"/>
              <rect x="400" width="28" height="380" fill="#1a2235"/>
              <rect x="560" width="28" height="380" fill="#1a2235"/>
              <rect x="720" width="28" height="380" fill="#1a2235"/>
              {/* Road markings */}
              <line x1="0" y1="74" x2="900" y2="74" stroke="#2a3550" strokeDasharray="20,15" strokeWidth="1"/>
              <line x1="0" y1="154" x2="900" y2="154" stroke="#2a3550" strokeDasharray="20,15" strokeWidth="1"/>
              <line x1="0" y1="234" x2="900" y2="234" stroke="#2a3550" strokeDasharray="20,15" strokeWidth="1"/>
              
              {/* Buildings */}
              <rect x="110" y="10" width="120" height="45" rx="4" fill="#162035"/>
              <rect x="280" y="10" width="100" height="45" rx="4" fill="#162035"/>
              <rect x="440" y="10" width="100" height="45" rx="4" fill="#162035"/>
              <rect x="110" y="95" width="120" height="40" rx="4" fill="#162035"/>
              <rect x="280" y="95" width="100" height="40" rx="4" fill="#162035"/>
              <rect x="440" y="95" width="100" height="40" rx="4" fill="#162035"/>
              <rect x="600" y="95" width="110" height="40" rx="4" fill="#162035"/>
              <rect x="110" y="175" width="120" height="40" rx="4" fill="#162035"/>
              <rect x="280" y="175" width="100" height="40" rx="4" fill="#162035"/>
              <rect x="440" y="175" width="100" height="40" rx="4" fill="#162035"/>
              <rect x="600" y="175" width="110" height="40" rx="4" fill="#162035"/>
              <rect x="110" y="255" width="120" height="40" rx="4" fill="#162035"/>
              <rect x="280" y="255" width="100" height="40" rx="4" fill="#162035"/>
              <rect x="440" y="255" width="100" height="40" rx="4" fill="#162035"/>
              <rect x="600" y="255" width="110" height="40" rx="4" fill="#162035"/>
              
              {/* Route highlight */}
              <polyline points="94,340 94,154 414,154 414,74 750,74" fill="none" stroke="#00c853" strokeWidth="3" strokeDasharray="8,4" opacity="0.8"/>
              
              {/* Signal dots on map */}
              <circle cx="94" cy="154" r="6" fill={corridorActive ? "#00c853" : "#ff4444"}/>
              <circle cx="254" cy="154" r="6" fill={corridorActive ? "#00c853" : "#ff4444"}/>
              <circle cx="414" cy="154" r="6" fill={corridorActive ? "#00c853" : "#ff4444"}/>
              <circle cx="414" cy="74" r="6" fill={corridorActive ? "#00c853" : "#ff4444"}/>
              <circle cx="574" cy="74" r="6" fill={corridorActive ? "#00c853" : "#ff4444"}/>
              <circle cx="734" cy="74" r="6" fill={corridorActive ? "#00c853" : "#ff4444"}/>
              
              {/* Hospital marker */}
              <rect x="720" y="50" width="50" height="40" rx="6" fill="#00b4d8" opacity="0.2"/>
              <text x="745" y="76" fill="#00b4d8" textAnchor="middle" fontSize="18">🏥</text>
              <text x="745" y="32" fill="#00b4d8" textAnchor="middle" fontSize="9" fontWeight="600" fontFamily="Poppins">DESTINATION</text>
              
              {/* Source */}
              <rect x="60" y="315" width="65" height="34" rx="5" fill="rgba(0,200,83,0.15)" opacity="0.9"/>
              <text x="92" y="335" fill="#00c853" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Poppins">PICKUP</text>
              
              {/* Ambulance marker */}
              <g ref={ambRef} transform="translate(94, 340)">
                <circle cx="0" cy="0" r="14" fill="rgba(0,200,83,0.2)">
                  <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
                </circle>
                <text x="0" y="5" fontSize="16" textAnchor="middle">🚑</text>
              </g>
            </svg>
            
            <div className="absolute top-4 right-4 p-4 rounded-xl text-xs" style={{ background: 'rgba(10,15,26,0.9)', border: '1px solid rgba(0,200,83,0.2)', backdropFilter: 'blur(10px)' }}>
              <div className="flex justify-between gap-5 mb-2"><span className="text-[var(--color-muted)]">Ambulance ID</span><span className="font-semibold text-[var(--color-primary)]">AMB-007</span></div>
              <div className="flex justify-between gap-5 mb-2"><span className="text-[var(--color-muted)]">Speed</span><span className="font-semibold text-[var(--color-primary)]">{mapSpeed} km/h</span></div>
              <div className="flex justify-between gap-5 mb-2"><span className="text-[var(--color-muted)]">Signals Clear</span><span className="font-semibold text-[var(--color-primary)]">{mapSignals}</span></div>
              <div className="flex justify-between gap-5"><span className="text-[var(--color-muted)]">Status</span><span className="font-semibold text-[var(--color-primary)]">{arrived ? '✅ Completed' : corridorActive ? '🟢 Active' : '🔴 Inactive'}</span></div>
            </div>
            
            <div className="absolute top-4 left-4 px-4 py-2 rounded-xl text-sm font-bold text-[var(--color-primary)]" style={{ background: 'rgba(0,200,83,0.15)', border: '1px solid rgba(0,200,83,0.3)' }}>
              ⏱ ETA: {mapEta}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
