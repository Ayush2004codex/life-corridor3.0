import { Link } from 'react-router-dom';
import { Ambulance, Shield, Zap, MapPin, BarChart3, Clock, ChevronRight } from 'lucide-react';

const features = [
  { icon: <Zap size={24} />,       title: 'Smart Traffic Control',   desc: 'AI-driven signals automatically switch green for approaching ambulances — zero manual intervention.' },
  { icon: <MapPin size={24} />,     title: 'Real-Time Tracking',     desc: 'GPS-based live ambulance tracking with sub-second updates, ETA prediction, and route visualization.' },
  { icon: <Ambulance size={24} />,  title: 'Emergency Alerts',       desc: 'Multi-channel alerts to nearby drivers, pedestrians, and hospitals via SMS, app, and digital boards.' },
  { icon: <Shield size={24} />,     title: 'Role-Based Access',      desc: 'Secure authentication with separate admin and driver interfaces — granular control over every component.' },
  { icon: <BarChart3 size={24} />,  title: 'Analytics Dashboard',    desc: 'Real-time and historical analytics on response times, fuel efficiency, and lives-saved metrics.' },
  { icon: <Clock size={24} />,      title: 'Sub-200ms Latency',      desc: 'Edge-deployed signal controllers communicate with <200ms latency — signals change before the ambulance arrives.' },
];

const stats = [
  { num: '1,247', label: 'Lives Saved' },
  { num: '4.2x',  label: 'Faster Response' },
  { num: '98.7%', label: 'Signal Accuracy' },
  { num: '8',     label: 'Zones Active' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-3.5"
           style={{ background: 'rgba(10,15,26,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,200,83,0.15)' }}>
        <div className="text-xl font-extrabold grad-text cursor-pointer select-none">🚑 Life<span className="font-light">Corridor</span></div>
        <div className="hidden md:flex items-center gap-7">
          {['Features','How it Works','Impact'].map(s => (
            <a key={s} href={`#${s.toLowerCase().replace(/ /g,'')}`} className="text-[var(--color-muted)] text-sm font-medium hover:text-[var(--color-primary)] transition-colors cursor-pointer">{s}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login"
                className="px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
            Log In
          </Link>
          <Link to="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg grad-bg"
                style={{ boxShadow: '0 4px 16px rgba(0,200,83,0.2)' }}>
            Sign Up
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(0,200,83,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 80% 50%, rgba(0,180,216,0.06) 0%, transparent 70%), linear-gradient(180deg, var(--color-dark) 0%, var(--color-dark-2) 100%)' }} />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(0,200,83,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,83,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', animation: 'grid-move 20s linear infinite' }} />

        <div className="relative text-center max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
               style={{ border: '1px solid rgba(0,200,83,0.3)', color: 'var(--color-primary)', background: 'rgba(0,200,83,0.05)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" style={{ animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
            Smart Kolkata Innovation • Active
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] mb-5">
            <span className="grad-text">Life Corridor</span><br />
            Saving Lives Through<br />Smart Mobility
          </h1>

          <p className="text-base md:text-lg text-[var(--color-muted)] max-w-xl mx-auto mb-9 leading-relaxed">
            Kolkata's first AI-powered Smart Green Corridor system. Real-time ambulance routing with intelligent traffic signal control — because every second counts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-black grad-bg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl" style={{ boxShadow: '0 12px 30px rgba(0,200,83,0.3)' }}>
              🚀 Get Started Free <ChevronRight size={18} />
            </Link>
            <a href="#features" className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-medium transition-all duration-300 hover:-translate-y-0.5" style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--color-text)' }}>
              🚦 Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-10 mt-14">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold grad-text">{s.num}</div>
                <div className="text-xs text-[var(--color-muted)] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-primary)] mb-3">⚡ Core Technology</p>
          <h2 className="text-3xl md:text-4xl font-extrabold grad-text">Intelligent Features</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl p-7 transition-all duration-300 cursor-default card-glow"
                 style={{ background: 'var(--color-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-13 h-13 rounded-xl flex items-center justify-center mb-5 text-[var(--color-primary)]"
                   style={{ background: 'rgba(0,200,83,0.12)' }}>{f.icon}</div>
              <h3 className="text-base font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="howitworks" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-primary)] mb-3">⚙️ Process</p>
          <h2 className="text-3xl md:text-4xl font-extrabold grad-text">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: 1, icon: '📞', title: 'Emergency Request', desc: 'Driver triggers an emergency request. GPS location captured instantly.' },
            { num: 2, icon: '🤖', title: 'AI Route Optimization', desc: 'ML engine analyzes 47 real-time parameters to compute the fastest route.' },
            { num: 3, icon: '🚦', title: 'Signal Control', desc: 'Edge controllers create a continuous green corridor up to 2km ahead.' },
            { num: 4, icon: '🏥', title: 'Hospital Ready', desc: 'Destination hospital receives ETA, patient condition, and prep details.' },
          ].map(s => (
            <div key={s.num} className="rounded-2xl p-7 text-center transition-all duration-300 card-glow"
                 style={{ background: 'var(--color-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-12 h-12 rounded-full grad-bg text-black text-lg font-extrabold flex items-center justify-center mx-auto mb-4">{s.num}</div>
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="text-sm font-bold mb-2">{s.title}</h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── IMPACT ── */}
      <section id="impact" className="py-20 px-6" style={{ background: 'var(--color-dark-2)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-primary)] mb-3">📈 Impact</p>
          <h2 className="text-3xl md:text-4xl font-extrabold grad-text mb-12">Real-World Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { n: '1,247', l: '💚 Lives Saved' }, { n: '4.2x', l: '⚡ Faster Response' }, { n: '38%', l: '⛽ Fuel Saved' },
              { n: '₹2.4Cr', l: '💰 Annual Savings' }, { n: '99.2%', l: '🎯 Uptime' }, { n: '8', l: '🌆 Zones Active' },
            ].map(s => (
              <div key={s.l} className="rounded-2xl p-6 text-center" style={{ background: 'var(--color-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-3xl font-black grad-text">{s.n}</div>
                <div className="text-xs text-[var(--color-muted)] mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold grad-text mb-4">Ready to Save Lives?</h2>
        <p className="text-[var(--color-muted)] mb-8">Join Kolkata's Smart Green Corridor system as a Hospital Admin or Ambulance Driver.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="px-8 py-3.5 rounded-xl text-base font-semibold text-black grad-bg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
            Create Free Account →
          </Link>
          <Link to="/login" className="px-8 py-3.5 rounded-xl text-base font-medium transition-all duration-300 hover:-translate-y-0.5" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
            Sign In →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6 text-center text-xs text-[var(--color-muted)]" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        © 2026 Life Corridor. Built with ❤️ at Narula Institute of Technology, Kolkata.
      </footer>
    </div>
  );
}
