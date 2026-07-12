import { Car, History, User, TrendingUp, PieChart, Settings } from 'lucide-react';

// Generic "Coming Soon" placeholder used for stub pages
function ComingSoon({ title, icon: Icon, color = 'slate' }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-400'   },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-400' },
    slate:  { bg: 'bg-slate-100', icon: 'text-slate-400'  },
    emerald:{ bg: 'bg-emerald-50',icon: 'text-emerald-400'},
  };
  const c = colors[color] ?? colors.slate;
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${c.bg}`}>
          <Icon className={`w-8 h-8 ${c.icon}`} />
        </div>
        <p className="text-lg font-semibold text-slate-700 mb-1">{title}</p>
        <p className="text-sm text-slate-400">This module will be available after the backend is connected.</p>
      </div>
    </div>
  );
}

export function VehicleInfo()    { return <ComingSoon title="Vehicle Info"      icon={Car}      color="blue"   />; }
export function TripHistory()    { return <ComingSoon title="Trip History"      icon={History}  color="slate"  />; }
export function Profile()        { return <ComingSoon title="Profile"           icon={User}     color="slate"  />; }
export function Expenses()       { return <ComingSoon title="Expenses"          icon={TrendingUp} color="purple"/>; }
export function Analytics()      { return <ComingSoon title="Analytics"         icon={PieChart} color="purple" />; }
export function SettingsPage()   { return <ComingSoon title="Settings"          icon={Settings} color="slate"  />; }
