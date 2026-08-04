import { useNavigate } from 'react-router-dom';
import { ROLE_DETAILS } from '../constants/roles';
import { Car, Users, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';

const iconMap = {
  manager: Car,
  driver:  Users,
  safety:  ShieldCheck,
  analyst: TrendingUp,
};

// Each role gets a green-family accent for consistency with the app theme
const roleAccents = {
  manager: { bg: '#DCFCE7', iconBg: '#22C55E', badge: 'Fleet Manager',    border: 'rgba(34,197,94,0.20)' },
  driver:  { bg: '#DBEAFE', iconBg: '#3B82F6', badge: 'Driver',           border: 'rgba(59,130,246,0.20)' },
  safety:  { bg: '#FEF3C7', iconBg: '#F59E0B', badge: 'Safety Officer',   border: 'rgba(245,158,11,0.20)' },
  analyst: { bg: '#EDE9FE', iconBg: '#8B5CF6', badge: 'Analyst',          border: 'rgba(139,92,246,0.20)' },
};

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans"
      style={{ backgroundColor: '#F5F7FA' }}
    >
      {/* Soft background blobs */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: 'rgba(34,197,94,0.07)' }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: 'rgba(59,130,246,0.06)' }}
      />

      <div className="relative z-10 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header */}
        <div className="text-center mb-14">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: '#22C55E',
                boxShadow: '0 8px 24px rgba(34,197,94,0.30)',
              }}
            >
              <Car className="w-6 h-6 text-white" />
            </div>
            <span
              className="font-display font-extrabold text-3xl tracking-tight"
              style={{ color: '#0F172A' }}
            >
              TransitOps
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: '#0F172A' }}>
            Choose your workspace
          </h1>
          <p className="text-base" style={{ color: '#64748B' }}>
            Your dashboard will be tailored to your role and responsibilities.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.values(ROLE_DETAILS).map((role) => {
            const Icon = iconMap[role.id];
            const accent = roleAccents[role.id] ?? roleAccents.manager;

            return (
              <button
                key={role.id}
                onClick={() => navigate(`/login/${role.id}`)}
                className="group text-left rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1.5 focus:outline-none"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${accent.border}`,
                  boxShadow: '0 1px 4px rgba(15,23,42,0.06)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.10)';
                  e.currentTarget.style.borderColor = accent.iconBg;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 1px 4px rgba(15,23,42,0.06)';
                  e.currentTarget.style.borderColor = accent.border;
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: accent.iconBg }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Title + description */}
                <h3 className="text-base font-bold mb-1.5" style={{ color: '#0F172A' }}>
                  {role.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#64748B' }}>
                  {role.description}
                </p>

                {/* CTA row */}
                <div
                  className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-150"
                  style={{ color: accent.iconBg }}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-10" style={{ color: '#94A3B8' }}>
          All data is encrypted and access is role-restricted. &nbsp;·&nbsp; TransitOps v2.0
        </p>
      </div>
    </div>
  );
}
