import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, Compass, ShieldCheck, TrendingUp, ArrowRight, 
  CheckCircle2, Navigation, Layers, Shield, BarChart3,
  Sparkles
} from 'lucide-react';

const ROLES = [
  {
    id: 'manager',
    title: 'Fleet Manager',
    tag: 'Command Center',
    description: 'Vehicle registry, real-time Kanban trip dispatch, and maintenance workflows.',
    accent: '#16A34A',
    accentLight: '#DCFCE7',
    borderHover: '#86EFAC',
    glow: 'rgba(34, 197, 94, 0.15)',
    icon: Car,
    features: ['Trip Dispatch Board', 'Fleet Asset Management'],
  },
  {
    id: 'driver',
    title: 'Fleet Driver',
    tag: 'Field Operations',
    description: 'Access assigned trips, live route telemetry, and submit actual fuel logs.',
    accent: '#2563EB',
    accentLight: '#DBEAFE',
    borderHover: '#93C5FD',
    glow: 'rgba(37, 99, 235, 0.15)',
    icon: Compass,
    features: ['Assigned Route Board', 'Trip & Fuel Logging'],
  },
  {
    id: 'safety',
    title: 'Safety Officer',
    tag: 'Compliance & Audit',
    description: 'Conduct pre-trip 6-point checks, monitor risk scores, and audit licenses.',
    accent: '#D97706',
    accentLight: '#FEF3C7',
    borderHover: '#FCD34D',
    glow: 'rgba(217, 119, 6, 0.15)',
    icon: ShieldCheck,
    features: ['Vehicle Safety Checklist', 'Driver Compliance Audit'],
  },
  {
    id: 'analyst',
    title: 'Financial Analyst',
    tag: 'Fiscal Intelligence',
    description: 'Track operational cost per km, vehicle ROI analytics, and expense rollups.',
    accent: '#7C3AED',
    accentLight: '#EDE9FE',
    borderHover: '#C4B5FD',
    glow: 'rgba(124, 58, 237, 0.15)',
    icon: TrendingUp,
    features: ['Cost / KM Tracking', 'Fleet ROI Analytics'],
  },
];

export default function RoleSelection() {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState(null);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden w-full bg-gradient-to-b from-[#F0FDF4]/70 via-[#F8FAFC] to-[#F1F5F9] text-slate-900 flex flex-col justify-between font-sans relative selection:bg-emerald-100 selection:text-emerald-800">
      
      {/* ── Background Geometric & Ambient Accents ── */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] rounded-full blur-[140px] pointer-events-none opacity-45"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.20) 0%, rgba(59,130,246,0.12) 60%, transparent 80%)' }}
      />

      {/* Decorative Navigation Rings in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-slate-200/50 pointer-events-none opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-dashed border-emerald-300/30 pointer-events-none opacity-40" />

      {/* ── Header ── */}
      <header className="h-16 px-6 sm:px-12 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200/80 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-emerald-500/25">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 font-display">
              Transit<span className="text-emerald-600">Ops</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
          <span>Enterprise Fleet Management</span>
        </div>
      </header>

      {/* ── Main Workspace Cards (Fits in Viewport without scroll) ── */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-4 sm:py-6 z-10 max-w-6xl mx-auto w-full">
        
        {/* Hero Title & Subtitle */}
        <div className="text-center space-y-2 mb-7 sm:mb-9 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-display">
            Welcome to <span className="text-emerald-600">TransitOps</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
            Select your workspace to access your designated fleet dashboard and operational controls.
          </p>
        </div>

        {/* 4 Rich Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isHovered = hoveredRole === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => navigate(`/login/${role.id}`)}
                className="group text-left bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-2xl hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                style={{
                  borderColor: isHovered ? role.borderHover : '#E2E8F0',
                  boxShadow: isHovered 
                    ? `0 20px 30px -10px ${role.glow}, 0 2px 6px rgba(0, 0, 0, 0.05)` 
                    : '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
                }}
              >
                {/* Top Role Color Line */}
                <div 
                  className="absolute top-0 left-0 w-full h-1.5 transition-all duration-300"
                  style={{
                    backgroundColor: role.accent,
                    opacity: isHovered ? 1 : 0.75,
                  }}
                />

                {/* Top Section: Icon + Pill Tag */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xs"
                      style={{ 
                        backgroundColor: role.accentLight,
                        color: role.accent,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span 
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                      style={{ 
                        color: role.accent, 
                        backgroundColor: `${role.accent}0D`,
                        borderColor: `${role.accent}25`
                      }}
                    >
                      {role.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-display group-hover:text-slate-950">
                      {role.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1.5 line-clamp-2">
                      {role.description}
                    </p>
                  </div>

                  {/* Key Features Preview */}
                  <div className="space-y-1.5 pt-1">
                    {role.features.map((feature, fIdx) => (
                      <div 
                        key={fIdx} 
                        className="flex items-center gap-2 text-[11px] font-medium text-slate-600 bg-slate-50/90 px-2.5 py-1 rounded-lg border border-slate-100"
                      >
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: role.accent }} />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div 
                  className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold transition-all duration-300"
                  style={{ color: isHovered ? role.accent : '#64748B' }}
                >
                  <span>Access Workspace</span>
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
                    style={{
                      backgroundColor: isHovered ? role.accent : '#F1F5F9',
                      color: isHovered ? '#FFFFFF' : '#64748B'
                    }}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-3.5 px-6 text-center text-xs text-slate-400 border-t border-slate-200/70 bg-white/50 backdrop-blur-xs shrink-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <p>&copy; {new Date().getFullYear()} TransitOps Inc. All rights reserved.</p>
          <p className="text-[11px] text-slate-400">
            Secure Role-Based Fleet Management Portal
          </p>
        </div>
      </footer>

    </div>
  );
}
