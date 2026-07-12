import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import { Car, Wrench, Map, Users, TrendingUp, AlertTriangle, CheckSquare, Battery, PieChart, Activity } from 'lucide-react';

export default function Dashboard() {
  const { role, user } = useAuth();

  // ---------------- MANAGER DASHBOARD ----------------
  if (role === ROLES.MANAGER) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manager Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Active Vehicles" value="42" icon={Car} bg="bg-blue-100" color="text-blue-600" />
          <StatCard title="Active Trips" value="20" icon={Map} bg="bg-indigo-100" color="text-indigo-600" />
          <StatCard title="Maintenance Alerts" value="4" icon={Wrench} bg="bg-orange-100" color="text-orange-600" />
        </div>
        <div className="bg-white/80 p-6 rounded-2xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h2>
          <p className="text-slate-500 text-sm">Trip TRP-104 dispatched successfully.</p>
        </div>
      </div>
    );
  }

  // ---------------- DRIVER DASHBOARD ----------------
  if (role === ROLES.DRIVER) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome, {user?.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard title="Assigned Vehicle" value="V-104" icon={Car} bg="bg-emerald-100" color="text-emerald-600" />
          <StatCard title="Today's Trip" value="TRP-104" icon={Map} bg="bg-blue-100" color="text-blue-600" />
          <StatCard title="Fuel Status" value="75%" icon={Battery} bg="bg-indigo-100" color="text-indigo-600" />
          <StatCard title="Trip History" value="142" icon={Activity} bg="bg-purple-100" color="text-purple-600" />
        </div>
      </div>
    );
  }

  // ---------------- SAFETY CHECKER DASHBOARD ----------------
  if (role === ROLES.SAFETY) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Safety Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard title="Pending Inspections" value="8" icon={CheckSquare} bg="bg-orange-100" color="text-orange-600" />
          <StatCard title="Maintenance Queue" value="12" icon={Wrench} bg="bg-red-100" color="text-red-600" />
          <StatCard title="Safety Violations" value="0" icon={AlertTriangle} bg="bg-emerald-100" color="text-emerald-600" />
          <StatCard title="Vehicle Health" value="94%" icon={Activity} bg="bg-blue-100" color="text-blue-600" />
        </div>
      </div>
    );
  }

  // ---------------- ANALYST DASHBOARD ----------------
  if (role === ROLES.ANALYST) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Revenue" value="$45.2k" icon={TrendingUp} bg="bg-emerald-100" color="text-emerald-600" />
          <StatCard title="Fleet Cost" value="$12.4k" icon={PieChart} bg="bg-purple-100" color="text-purple-600" />
          <StatCard title="Fuel Analytics" value="$3.2k" icon={Battery} bg="bg-blue-100" color="text-blue-600" />
        </div>
      </div>
    );
  }

  return null;
}

// Simple reusable widget for Dashboards
function StatCard({ title, value, icon: Icon, bg, color }) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${bg} ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
    </div>
  );
}
