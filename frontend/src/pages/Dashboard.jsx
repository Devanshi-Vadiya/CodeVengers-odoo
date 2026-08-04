import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { ROLE_DETAILS } from '../constants/roles';
import StatsCard, { StatsCardSkeleton } from '../components/dashboard/StatsCard';
import OverdueList from '../components/dashboard/OverdueList';
import QuickActions from '../components/dashboard/QuickActions';
import {
  Car, Map, Users, Wrench, CheckCircle, Fuel, Gauge, Activity, Calendar,
} from 'lucide-react';

const STAT_DEFS = [
  { key: 'totalVehicles',       label: 'Total Vehicles',     icon: Car,         accent: 'blue'    },
  { key: 'activeTrips',         label: 'Active Trips',       icon: Map,         accent: 'green'   },
  { key: 'availableDrivers',    label: 'Avail. Drivers',     icon: Users,       accent: 'green'   },
  { key: 'maintenanceAlerts',   label: 'Maint. Alerts',      icon: Wrench,      accent: 'red'     },
  { key: 'completedTripsToday', label: 'Trips Today',        icon: CheckCircle, accent: 'green'   },
  { key: 'fuelSpendThisWeek',   label: 'Fuel Spend (7d)',    icon: Fuel,        accent: 'amber',  format: 'currency' },
  { key: 'dispatchRate',        label: 'Dispatch Rate',      icon: Gauge,       accent: 'blue',   format: 'pct'      },
];

function formatValue(raw, fmt) {
  if (raw == null) return '—';
  if (fmt === 'currency') return `$${Number(raw).toLocaleString()}`;
  if (fmt === 'pct') return `${raw}%`;
  return String(raw);
}

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric',
});

export default function Dashboard() {
  const { role, user } = useAuth();
  const { stats, overdue, upcoming, loading } = useDashboard();
  const roleInfo = ROLE_DETAILS?.[role] ?? {};

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Hero banner ── */}
      <div
        className="rounded-2xl p-7 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{
          background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 60%, #BBF7D0 100%)',
          border: '1px solid rgba(34,197,94,0.18)',
          boxShadow: '0 2px 8px rgba(34,197,94,0.10)',
        }}
      >
        {/* Ambient glow blob */}
        <div
          className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}
        />
        <div
          className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: 'rgba(59,130,246,0.07)' }}
        />

        <div className="relative z-10">
          {/* Date row */}
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-3.5 h-3.5" style={{ color: '#16A34A' }} />
            <span className="text-xs font-semibold" style={{ color: '#16A34A' }}>{today}</span>
          </div>

          <h1 className="text-2xl font-display font-bold tracking-tight mb-1.5" style={{ color: '#0F172A' }}>
            Welcome back,{' '}
            <span style={{ color: '#16A34A' }}>{user?.name?.split(' ')[0] || 'User'}!</span>
          </h1>
          <p className="text-sm" style={{ color: '#64748B' }}>
            Here's what's happening with your fleet today.
          </p>

          {/* Role badge */}
          <span
            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest"
            style={{
              backgroundColor: 'rgba(34,197,94,0.15)',
              color: '#16A34A',
              border: '1px solid rgba(34,197,94,0.30)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            {roleInfo?.title ?? role}
          </span>
        </div>

        {/* Live active trips counter */}
        <div
          className="relative z-10 rounded-2xl p-4 min-w-[170px] flex items-center justify-between gap-4 shrink-0"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(34,197,94,0.20)',
            boxShadow: '0 2px 8px rgba(34,197,94,0.12)',
          }}
        >
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: '#94A3B8' }}>
              Active Trips
            </p>
            <p className="font-mono text-3xl font-bold" style={{ color: '#0F172A' }}>
              {loading ? '—' : stats?.activeTrips ?? '—'}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
          >
            <Activity className="w-5 h-5" style={{ color: '#22C55E' }} />
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => <StatsCardSkeleton key={i} />)
          : STAT_DEFS.map(def => (
              <StatsCard
                key={def.key}
                label={def.label}
                value={formatValue(stats?.[def.key], def.format)}
                icon={def.icon}
                accent={def.accent}
                fmt={def.format}
              />
            ))}
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <OverdueList overdue={overdue} upcoming={upcoming} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
