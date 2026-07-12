import { useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, BarChart2, ShieldCheck, Zap, Check } from 'lucide-react';

// ── Design Tokens (marketing surface — independent from app palette) ─────────
const CREAM    = '#FAF7F2';
const ESPRESSO = '#3D2B26';
const AMBER    = '#D4890A';
const AMBER_LT = '#F5A623';
const WARM_BORDER = '#E8DDD0';
const MUTED    = '#8B7355';
const CARD_BG  = '#FFFFFF';

const styles = {
  page: {
    backgroundColor: CREAM,
    fontFamily: 'Inter, sans-serif',
    color: ESPRESSO,
    minHeight: '100vh',
    overflowX: 'hidden',
  },
  nav: {
    backgroundColor: CREAM,
    borderBottom: `1px solid ${WARM_BORDER}`,
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
};

// ── Reusable primitives ───────────────────────────────────────────────────────
function NavLink({ children }) {
  return (
    <span style={{
      fontFamily: '"DM Sans", sans-serif',
      letterSpacing: '0.1em',
      fontSize: '0.72rem',
      fontWeight: 500,
      textTransform: 'uppercase',
      color: MUTED,
      cursor: 'pointer',
      transition: 'color 0.2s',
    }}
      onMouseEnter={e => e.target.style.color = ESPRESSO}
      onMouseLeave={e => e.target.style.color = MUTED}
    >
      {children}
    </span>
  );
}

function CtaButton({ children, onClick, variant = 'primary', size = 'md' }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    fontFamily: 'Inter, sans-serif', fontWeight: 600,
    cursor: 'pointer', border: 'none', transition: 'all 0.2s',
    borderRadius: '10px',
  };
  const sizes = {
    md: { padding: '0.65rem 1.5rem', fontSize: '0.875rem' },
    lg: { padding: '0.9rem 2rem',    fontSize: '1rem'      },
  };
  const variants = {
    primary: { backgroundColor: ESPRESSO, color: AMBER_LT },
    outline: { backgroundColor: 'transparent', color: ESPRESSO, border: `1.5px solid ${WARM_BORDER}` },
  };
  return (
    <button
      style={{ ...base, ...sizes[size], ...variants[variant] }}
      onClick={onClick}
      onMouseEnter={e => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = '#5A3F38';
        else e.currentTarget.style.backgroundColor = '#F0E8DC';
      }}
      onMouseLeave={e => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = ESPRESSO;
        else e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {children}
    </button>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, body, accent }) {
  return (
    <div style={{
      backgroundColor: CARD_BG, border: `1px solid ${WARM_BORDER}`,
      borderRadius: '20px', padding: '2rem',
      boxShadow: '0 2px 8px rgba(61,43,38,0.07)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(61,43,38,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(61,43,38,0.07)';
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 14, display: 'flex',
        alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem',
        backgroundColor: accent + '18',
      }}>
        <Icon size={22} style={{ color: accent }} />
      </div>
      <h3 style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '1.1rem', color: ESPRESSO, marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: MUTED, fontSize: '0.9rem', lineHeight: 1.7 }}>{body}</p>
    </div>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 900, fontSize: '3rem', color: ESPRESSO, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginTop: '0.4rem' }}>
        {label}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>

      {/* ── Navbar ── */}
      <header style={styles.nav}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: ESPRESSO, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={16} style={{ color: AMBER_LT }} />
            </div>
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '1.05rem', color: ESPRESSO, letterSpacing: '-0.01em' }}>
              TransitOps
            </span>
          </div>

          {/* Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <NavLink>Platform</NavLink>
            <NavLink>Solutions</NavLink>
            <NavLink>Pricing</NavLink>
            <NavLink>About</NavLink>
          </nav>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <CtaButton variant="outline" onClick={() => navigate('/select-role')}>Sign in</CtaButton>
            <CtaButton variant="primary" onClick={() => navigate('/select-role')}>
              Get started <ArrowRight size={15} />
            </CtaButton>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '6rem 2rem 4rem', textAlign: 'center' }}>
        {/* Eyebrow badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: AMBER + '18', border: `1px solid ${AMBER}40`,
          borderRadius: 999, padding: '0.35rem 1rem', marginBottom: '2.5rem',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: AMBER }} />
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: AMBER }}>
            Fleet Intelligence Platform
          </span>
        </div>

        {/* Main headline — Fraunces bold + italic accent */}
        <h1 style={{
          fontFamily: 'Fraunces, serif',
          fontWeight: 900,
          fontSize: 'clamp(3.2rem, 7vw, 6.5rem)',
          lineHeight: 1.0,
          letterSpacing: '-0.03em',
          color: ESPRESSO,
          marginBottom: '1.75rem',
        }}>
          Scale Your{' '}
          <span style={{ fontStyle: 'italic', color: AMBER, fontWeight: 600 }}>Supply Chain.</span>
          <br />
          Command Every{' '}
          <span style={{ fontStyle: 'italic', fontWeight: 600 }}>Mile.</span>
        </h1>

        {/* Sub-copy */}
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '1.15rem', lineHeight: 1.75,
          color: MUTED, maxWidth: 540, margin: '0 auto 3rem', fontWeight: 400,
        }}>
          TransitOps gives fleet managers, dispatchers and analysts a single command
          center — live trip tracking, predictive maintenance, and ROI analytics
          in one elegant workspace.
        </p>

        {/* CTA row */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <CtaButton size="lg" variant="primary" onClick={() => navigate('/select-role')}>
            Open the platform <ArrowRight size={16} />
          </CtaButton>
          <CtaButton size="lg" variant="outline" onClick={() => navigate('/select-role')}>
            View live demo
          </CtaButton>
        </div>

        {/* Trust line */}
        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: MUTED, fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.05em' }}>
          No setup fee · Onboard in 15 minutes · SOC 2 Type II
        </p>
      </section>

      {/* ── Stats strip ── */}
      <section style={{ backgroundColor: ESPRESSO, padding: '3rem 2rem' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '2.5rem',
        }}>
          {[
            { value: '48k+', label: 'Trips Dispatched' },
            { value: '99.4%', label: 'Uptime SLA' },
            { value: '3.2×', label: 'Faster Dispatch' },
            { value: '$1.2M', label: 'Avg Annual Savings' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 900, fontSize: '2.8rem', color: AMBER_LT, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: '0.4rem' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '6rem 2rem' }}>
        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: AMBER, fontWeight: 600, marginBottom: '0.75rem' }}>
            What's inside
          </p>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: ESPRESSO, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            Built for the people who{' '}
            <span style={{ fontStyle: 'italic', color: AMBER }}>move things.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <FeatureCard icon={Truck}       accent="#D4890A" title="Live Dispatch"         body="Drag-and-drop Kanban board with real-time trip status, driver assignment, and instant status updates." />
          <FeatureCard icon={BarChart2}   accent="#3B82F6" title="Finance & ROI"         body="Per-vehicle cost tracking — fuel, maintenance, and operational expenses with automated ROI calculation." />
          <FeatureCard icon={ShieldCheck} accent="#10B981" title="Predictive Maintenance" body="Flag vehicles before they break. Automatic status toggle hides in-shop vehicles from dispatch." />
          <FeatureCard icon={Zap}         accent="#8B5CF6" title="Role-Based Access"      body="Fleet Manager, Driver, Safety Officer and Financial Analyst each see only what they need — nothing more." />
        </div>
      </section>

      {/* ── Proof strip ── */}
      <section style={{ backgroundColor: '#F5F0E8', borderTop: `1px solid ${WARM_BORDER}`, borderBottom: `1px solid ${WARM_BORDER}`, padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontStyle: 'italic', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', textAlign: 'center', color: ESPRESSO, marginBottom: '3rem', letterSpacing: '-0.01em' }}>
            "TransitOps cut our dispatch time in half and gave every manager<br />their own command center."
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
            <StatPill value="48%" label="Reduction in idle time" />
            <StatPill value="3×" label="Faster incident response" />
            <StatPill value="$0" label="Setup cost" />
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: '7rem 2rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: 700, margin: '0 auto',
          backgroundColor: ESPRESSO, borderRadius: 28, padding: '4rem 3rem',
          boxShadow: '0 24px 80px rgba(61,43,38,0.25)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Ambient glow */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%', backgroundColor: AMBER + '20', filter: 'blur(60px)', pointerEvents: 'none' }} />

          <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FAF7F2', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '1rem', position: 'relative' }}>
            Your fleet, fully <span style={{ fontStyle: 'italic', color: AMBER_LT }}>in control.</span>
          </h2>
          <p style={{ color: 'rgba(250,247,242,0.6)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem', position: 'relative' }}>
            Open TransitOps and select your workspace — no registration required for this demo.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <button
              onClick={() => navigate('/select-role')}
              style={{
                backgroundColor: AMBER_LT, color: ESPRESSO, fontFamily: 'Inter, sans-serif',
                fontWeight: 700, fontSize: '1rem', padding: '0.85rem 2.25rem',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFB83D'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = AMBER_LT}
            >
              Enter the platform <ArrowRight size={16} />
            </button>
          </div>
          {/* Checklist */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {['All roles included', 'Live mock data', 'Full feature access'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(250,247,242,0.55)', fontSize: '0.8rem' }}>
                <Check size={13} style={{ color: AMBER_LT }} /> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${WARM_BORDER}`, padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.78rem', letterSpacing: '0.06em', color: MUTED }}>
          © 2026 TransitOps · Built for CodeVengers Odoo Hackathon
        </p>
      </footer>
    </div>
  );
}
