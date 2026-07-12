import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import { Car, Wrench, Map, Users, TrendingUp, AlertTriangle, CheckSquare, Battery, PieChart, Activity } from 'lucide-react';

export default function Dashboard() {
  const { role, user } = useAuth();

  // ---------------- MANAGER DASHBOARD ----------------
  if (role === ROLES.MANAGER) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Manager Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Active Vehicles" value="42" icon={Car} />
          <StatCard title="Active Trips" value="20" icon={Map} />
          <StatCard title="Maintenance Alerts" value="4" icon={Wrench} urgent={true} />
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-surface-raised">
          <h2 className="text-lg font-bold text-text-primary mb-4">Recent Activity</h2>
          <p className="text-text-secondary text-sm">Trip <span className="font-mono text-xs">TRP-0104</span> dispatched successfully.</p>
        </div>
      </div>
    );
  }

  // ---------------- DRIVER DASHBOARD ----------------
  if (role === ROLES.DRIVER) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Welcome, {user?.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard title="Assigned Vehicle" value="V-104" icon={Car} />
          <StatCard title="Today's Trip" value="TRP-0104" icon={Map} urgent={true} />
          <StatCard title="Fuel Status" value="75%" icon={Battery} />
          <StatCard title="Trip History" value="142" icon={Activity} />
        </div>
      </div>
    );
  }

  // ---------------- SAFETY CHECKER DASHBOARD ----------------
  if (role === ROLES.SAFETY) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Safety Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard title="Pending Inspections" value="8" icon={CheckSquare} urgent={true} />
          <StatCard title="Maintenance Queue" value="12" icon={Wrench} urgent={true} />
          <StatCard title="Safety Violations" value="0" icon={AlertTriangle} />
          <StatCard title="Vehicle Health" value="94%" icon={Activity} />
        </div>
      </div>
    );
  }

  // ---------------- ANALYST DASHBOARD ----------------
  if (role === ROLES.ANALYST) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Financial Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Revenue" value="$45.2k" icon={TrendingUp} />
          <StatCard title="Fleet Cost" value="$12.4k" icon={PieChart} urgent={true} urgentColor="text-status-shop" urgentBg="bg-status-shop/10" urgentBorder="border-status-shop/30" />
          <StatCard title="Fuel Analytics" value="$3.2k" icon={Battery} />
        </div>
      </div>
    );
  }

  return null;
}

// Reusable KPI Widget with variable emphasis
function StatCard({ title, value, icon: Icon, urgent = false, urgentColor = 'text-status-shop', urgentBg = 'bg-status-shop/10', urgentBorder = 'border-status-shop/30' }) {
  const isUrgent = urgent && (Number(value) > 0 || value !== '0');
  
  const iconColor = isUrgent ? urgentColor : 'text-text-secondary';
  const iconBg = isUrgent ? urgentBg : 'bg-surface-raised';
  const cardBorder = isUrgent ? urgentBorder : 'border-surface-raised';

  return (
    <div className={`bg-surface rounded-2xl p-5 border transition-all ${cardBorder} ${isUrgent ? 'shadow-[0_0_15px_rgba(249,112,102,0.15)]' : 'shadow-none'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconBg} ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-3xl font-mono font-bold text-text-primary tracking-tight">{value}</h3>
      <p className="text-sm font-medium text-text-secondary mt-1 uppercase tracking-wider text-[11px]">{title}</p>
    </div>
  );
}
