import { useCountUp } from '../../hooks/useCountUp';
import { TrendingUp } from 'lucide-react';

export function StatsCardSkeleton() {
  return (
    <div className="panel p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl skeleton" />
        <div className="w-6 h-4 skeleton rounded" />
      </div>
      <div className="h-7 w-16 skeleton rounded-lg mb-1.5" />
      <div className="h-3 w-24 skeleton rounded" />
    </div>
  );
}

function CountUpValue({ raw, fmt }) {
  const stripped = String(raw).replace(/[^0-9.]/g, '');
  const num = parseFloat(stripped);
  const counted = useCountUp(isNaN(num) ? 0 : num, 600);
  if (fmt === 'currency') return `$${counted.toLocaleString()}`;
  if (fmt === 'pct') return `${counted}%`;
  return String(counted);
}

const ACCENT_MAP = {
  green:   { iconBg: '#DCFCE7', iconColor: '#22C55E', dot: '#22C55E' },
  amber:   { iconBg: '#FEF3C7', iconColor: '#F59E0B', dot: '#F59E0B' },
  blue:    { iconBg: '#DBEAFE', iconColor: '#3B82F6', dot: '#3B82F6' },
  red:     { iconBg: '#FEE2E2', iconColor: '#EF4444', dot: '#EF4444' },
  neutral: { iconBg: '#F1F5F9', iconColor: '#64748B', dot: '#94A3B8' },
};

export default function StatsCard({ label, value, icon: Icon, accent, fmt }) {
  const { iconBg, iconColor, dot } = ACCENT_MAP[accent] ?? ACCENT_MAP.neutral;

  const stripped = String(value).replace(/[^0-9.]/g, '');
  const isNumeric = stripped !== '' && !isNaN(parseFloat(stripped));

  return (
    <div
      className="panel p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover cursor-default content-reveal group"
    >
      {/* Top row: icon + trend arrow */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        <TrendingUp className="w-3.5 h-3.5" style={{ color: dot, opacity: 0.6 }} />
      </div>

      {/* Value */}
      <p className="text-2xl font-mono font-bold tracking-tight mb-1" style={{ color: '#0F172A' }}>
        {isNumeric ? <CountUpValue raw={stripped} fmt={fmt} /> : value}
      </p>

      {/* Label */}
      <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#94A3B8' }}>
        {label}
      </p>
    </div>
  );
}
