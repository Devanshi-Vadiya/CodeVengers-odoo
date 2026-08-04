import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_DETAILS } from '../constants/roles';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock, ArrowLeft, Car, Users, ShieldCheck, TrendingUp, Zap } from 'lucide-react';

const DEMO_CREDS = {
  manager:  { email: 'fleet@demo.com',    password: 'password123' },
  driver:   { email: 'driver@demo.com',   password: 'password123' },
  safety:   { email: 'safety@demo.com',   password: 'password123' },
  analyst:  { email: 'analyst@demo.com',  password: 'password123' },
};

const iconMap = {
  manager: Car,
  driver:  Users,
  safety:  ShieldCheck,
  analyst: TrendingUp,
};

const roleAccentColor = {
  manager: '#22C55E',
  driver:  '#3B82F6',
  safety:  '#F59E0B',
  analyst: '#8B5CF6',
};

const ACCENT = '#22C55E';

export default function Login() {
  const { roleId }  = useParams();
  const navigate    = useNavigate();
  const roleInfo    = ROLE_DETAILS[roleId];

  useEffect(() => { if (!roleInfo) navigate('/'); }, [roleInfo, navigate]);

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const demo = DEMO_CREDS[roleId];
  const accent = roleAccentColor[roleId] ?? ACCENT;

  useEffect(() => {
    if (demo) { setEmail(demo.email); setPassword(demo.password); }
  }, [roleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await authService.login(email, password);
      login(res.token, res.user);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid credentials. Demo: fleet@demo.com / password123');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!roleInfo) return null;
  const Icon = iconMap[roleId];

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      style={{ backgroundColor: '#F5F7FA', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Soft background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: `${accent}10` }}
      />

      {/* Back link */}
      <Link
        to="/select-role"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium transition-colors z-20"
        style={{ color: '#94A3B8' }}
        onMouseEnter={e => e.currentTarget.style.color = '#0F172A'}
        onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to roles
      </Link>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-[400px]">
        <div
          className="page-enter"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 20,
            padding: '2.25rem',
            boxShadow: '0 8px 32px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.06)',
          }}
        >
          {/* Icon + title */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: 60, height: 60, borderRadius: 16,
                margin: '0 auto 1rem',
                backgroundColor: accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 8px 20px ${accent}35`,
              }}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700, fontSize: '1.5rem',
              color: '#0F172A', letterSpacing: '-0.025em',
            }}>
              {roleInfo.title}
              <em style={{ fontStyle: 'italic', fontWeight: 600, color: accent }}> Login</em>
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.35rem' }}>
              Access your secure workspace
            </p>
          </div>

          {/* Demo hint */}
          <div style={{
            backgroundColor: `${accent}0D`,
            border: `1px solid ${accent}30`,
            borderRadius: 10, padding: '0.6rem 0.9rem',
            marginBottom: '1.4rem',
            fontSize: '0.78rem', color: accent,
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>Credentials pre-filled — just click <strong>Sign In</strong></span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748B', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#CBD5E1' }} />
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="input-field"
                  style={{ paddingLeft: 36 }}
                  onFocus={e => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}15`; e.target.style.backgroundColor = '#FFFFFF'; }}
                  onBlur={e  => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#F5F7FA'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748B', marginBottom: '0.35rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#CBD5E1' }} />
                <input
                  type="password" required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  style={{ paddingLeft: 36 }}
                  onFocus={e => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}15`; e.target.style.backgroundColor = '#FFFFFF'; }}
                  onBlur={e  => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#F5F7FA'; }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%', padding: '0.75rem',
                backgroundColor: isSubmitting ? '#86EFAC' : accent,
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9rem',
                border: 'none', borderRadius: 10,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'background-color 150ms ease, box-shadow 150ms ease',
                marginTop: '0.3rem',
                boxShadow: `0 4px 14px ${accent}30`,
              }}
              onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.backgroundColor = '#16A34A'; e.currentTarget.style.boxShadow = `0 6px 18px ${accent}40`; } }}
              onMouseLeave={e => { if (!isSubmitting) { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.boxShadow = `0 4px 14px ${accent}30`; } }}
            >
              {isSubmitting
                ? <><Loader2 className="animate-spin w-4 h-4" /> Signing in…</>
                : 'Sign In →'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
