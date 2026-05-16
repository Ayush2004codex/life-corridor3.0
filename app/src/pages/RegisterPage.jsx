import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Mail, Lock, Building2, Ambulance, Check } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password) { setError('Please create a password.'); return; }
    if (!role) { setError('Please select your role — Admin or Driver.'); return; }

    setLoading(true);
    const result = await register(name, email, password, role);
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin/dashboard' : '/driver/dashboard', { replace: true });
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  const roles = [
    { id: 'admin',  icon: <Building2 size={28} />,  label: 'Hospital Admin',    desc: 'Manage hospital ops, signals & analytics' },
    { id: 'driver', icon: <Ambulance size={28} />,   label: 'Ambulance Driver',  desc: 'Request corridors & navigate routes' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 80% 70% at 70% 80%, rgba(0,180,216,0.06) 0%, transparent 60%), linear-gradient(180deg, var(--color-dark) 0%, var(--color-dark-2) 100%)' }} />

      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors mb-7">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="glass rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] grad-bg rounded-t-3xl" />

          <div className="text-center mb-8">
            <div className="text-3xl mb-2">🚑</div>
            <h1 className="text-2xl font-extrabold mb-1">Create Account</h1>
            <p className="text-sm text-[var(--color-muted)]">Join the Life Corridor network</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)', color: '#ff6b6b' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Yash Keshri"
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-[var(--color-primary)]/30 disabled:opacity-50"
                  style={{ background: 'rgba(26,34,53,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text)' }} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@lifecorridor.io"
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-[var(--color-primary)]/30 disabled:opacity-50"
                  style={{ background: 'rgba(26,34,53,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text)' }} />
              </div>
            </div>

            {/* ── ROLE SELECTOR CARDS ── */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(r => (
                  <button type="button" key={r.id} onClick={() => setRole(r.id)}
                    className="relative rounded-2xl p-5 text-center transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                    style={{
                      background: role === r.id ? 'rgba(0,200,83,0.06)' : 'rgba(26,34,53,0.6)',
                      border: role === r.id ? '2px solid var(--color-primary)' : '2px solid rgba(255,255,255,0.06)',
                    }}>
                    {role === r.id && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full grad-bg flex items-center justify-center">
                        <Check size={12} className="text-black" />
                      </span>
                    )}
                    <div className="mb-2 text-[var(--color-primary)]">{r.icon}</div>
                    <div className="text-sm font-bold text-[var(--color-text)]">{r.label}</div>
                    <div className="text-[10px] text-[var(--color-muted)] mt-1">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-[var(--color-primary)]/30 disabled:opacity-50"
                  style={{ background: 'rgba(26,34,53,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text)' }} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-base font-bold text-black grad-bg transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--color-muted)] mt-6">
            Already have an account? <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
