import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }

    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate(result.role === 'admin' ? '/admin/dashboard' : '/driver/dashboard', { replace: true });
      } else {
        setError(result.message);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* BG */}
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 80% 70% at 30% 20%, rgba(0,200,83,0.06) 0%, transparent 60%), linear-gradient(180deg, var(--color-dark) 0%, var(--color-dark-2) 100%)' }} />

      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors mb-7">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="glass rounded-3xl p-10 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] grad-bg rounded-t-3xl" />

          <div className="text-center mb-8">
            <div className="text-3xl mb-2">🚑</div>
            <h1 className="text-2xl font-extrabold mb-1">Welcome Back 👋</h1>
            <p className="text-sm text-[var(--color-muted)]">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)', color: '#ff6b6b' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@lifecorridor.io"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  style={{ background: 'rgba(26,34,53,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text)' }} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  style={{ background: 'rgba(26,34,53,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text)' }} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-base font-bold text-black grad-bg transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="mt-5 p-3 rounded-xl text-center text-xs leading-relaxed" style={{ background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.15)', color: 'var(--color-secondary)' }}>
            <strong className="text-[var(--color-text)]">Demo:</strong> admin@lifecorridor.io or driver@lifecorridor.io — any password
          </div>

          <p className="text-center text-sm text-[var(--color-muted)] mt-6">
            Don't have an account? <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
