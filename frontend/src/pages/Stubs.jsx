import { useState, useEffect } from 'react';
import { 
  Car, History, User, TrendingUp, PieChart, ShieldCheck, 
  DollarSign, Truck, Calendar, MapPin, Gauge, Fuel, CheckCircle2,
  AlertCircle, ArrowUpRight, ArrowDownRight, Award, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../hooks/useVehicles';
import { useTrips } from '../hooks/useTrips';
import financeService from '../services/financeService';
import toast from 'react-hot-toast';

// ── 1. DRIVER: Vehicle Info Page ─────────────────────────────────────────────
export function VehicleInfo() {
  const { vehicles } = useVehicles();
  const assignedVehicle = vehicles[0] || {
    name: 'Van-05',
    reg_number: 'KA-05-AB-1234',
    type: 'Van',
    odometer: 12400,
    max_capacity: 500,
    status: 'available',
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl pb-12">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <Car className="w-6 h-6 text-blue-600" />
          Assigned <span className="text-blue-600">Vehicle Details</span>
        </h1>
        <p className="text-sm mt-1 text-slate-500">
          Operational specifications, maintenance condition, and telemetry for your vehicle.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{assignedVehicle.name}</h2>
              <p className="text-sm font-mono text-slate-500">{assignedVehicle.reg_number}</p>
            </div>
          </div>

          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
            assignedVehicle.status === 'available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            Status: {assignedVehicle.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium">Vehicle Category</span>
            <p className="text-base font-bold text-slate-900 mt-1 capitalize">{assignedVehicle.type || 'Commercial'}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium">Odometer</span>
            <p className="text-base font-mono font-bold text-slate-900 mt-1">
              {Number(assignedVehicle.odometer || 12400).toLocaleString()} km
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium">Max Payload Capacity</span>
            <p className="text-base font-mono font-bold text-slate-900 mt-1">
              {assignedVehicle.max_capacity} kg
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium">Safety Inspection</span>
            <p className="text-base font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Passed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 2. DRIVER: Trip History Page ─────────────────────────────────────────────
export function TripHistory() {
  const { trips, loading } = useTrips();
  const pastTrips = trips.filter(t => t.status === 'completed' || t.status === 'cancelled');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl pb-12">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <History className="w-6 h-6 text-[#22C55E]" />
          My Completed <span className="text-[#22C55E]">Trip History</span>
        </h1>
        <p className="text-sm mt-1 text-slate-500">
          Review your past transit logs, logged distances, and fuel metrics.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Trip ID</th>
                <th className="p-3.5">Origin → Destination</th>
                <th className="p-3.5">Vehicle</th>
                <th className="p-3.5">Distance</th>
                <th className="p-3.5">Fuel Used</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {pastTrips.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-mono font-bold text-slate-900">#{t.id}</td>
                  <td className="p-3.5 font-semibold text-slate-900">{t.source} → {t.destination}</td>
                  <td className="p-3.5">{t.vehicle?.name || `Vehicle ${t.vehicle_id}`}</td>
                  <td className="p-3.5 font-mono">{t.actual_distance || t.planned_distance} km</td>
                  <td className="p-3.5 font-mono">{t.fuel_consumed ? `${t.fuel_consumed} L` : '—'}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── 3. USER: Profile Page ────────────────────────────────────────────────────
export function Profile() {
  const { user, role } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <User className="w-6 h-6 text-slate-700" />
          Driver <span className="text-[#22C55E]">Profile</span>
        </h1>
        <p className="text-sm mt-1 text-slate-500">
          Account information, commercial driving credentials, and safety performance score.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-[#22C55E] text-white flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Demo Driver'}</h2>
            <p className="text-sm text-slate-500">{user?.email || 'driver@demo.com'}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Fleet Driver
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Commercial License Number</span>
            <p className="text-sm font-mono font-bold text-slate-900">DL-99881-2021</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs text-slate-400 font-medium">License Category</span>
            <p className="text-sm font-bold text-slate-900">Heavy Goods Vehicle (HGV / LMV)</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs text-slate-400 font-medium">License Expiration</span>
            <p className="text-sm font-mono font-bold text-emerald-600">Valid until 2027-01-01 (Active)</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Safety Merit Score</span>
            <p className="text-sm font-mono font-bold text-emerald-600 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-500" /> 92 / 100 (Excellent)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 4. ANALYST: Expenses Management Page ──────────────────────────────────────
export function Expenses() {
  const [expensesList, setExpensesList] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    financeService.getAllExpenses().then(res => {
      setExpensesList(res.data || []);
    });
  }, []);

  const totalExpense = expensesList.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const filtered = categoryFilter === 'all' 
    ? expensesList 
    : expensesList.filter(e => e.type?.toLowerCase() === categoryFilter.toLowerCase());

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Operational <span className="text-purple-600">Expenses</span>
          </h1>
          <p className="text-sm mt-1 text-slate-500">
            Log and review non-fuel operating expenses across toll charges, insurance, permits, and upkeep.
          </p>
        </div>

        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-right">
          <p className="text-[10px] uppercase font-bold tracking-wider text-purple-600">Total Recorded Expenses</p>
          <p className="text-xl font-mono font-bold text-purple-900">${totalExpense.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex gap-2">
            {['all', 'toll', 'permit', 'insurance', 'service'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                  categoryFilter === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-slate-400">{filtered.length} Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Expense ID</th>
                <th className="p-3.5">Vehicle</th>
                <th className="p-3.5">Expense Category</th>
                <th className="p-3.5">Amount ($)</th>
                <th className="p-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-mono font-bold text-slate-900">#{item.id}</td>
                  <td className="p-3.5 font-semibold text-slate-900">
                    {item.vehicle?.name || `Vehicle #${item.vehicle_id}`}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] uppercase bg-purple-50 text-purple-700 border border-purple-200">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-600">
                    ${Number(item.amount).toLocaleString()}
                  </td>
                  <td className="p-3.5 font-mono text-slate-500">
                    {item.date ? String(item.date).split('T')[0] : '2026-07-11'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── 5. ANALYST: Financial Analytics Page ─────────────────────────────────────
export function Analytics() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl pb-12">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <PieChart className="w-6 h-6 text-purple-600" />
          Fleet Financial <span className="text-purple-600">Analytics</span>
        </h1>
        <p className="text-sm mt-1 text-slate-500">
          Executive financial breakdown, fleet margin trends, and ROI cost recovery distribution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Total Capital Outlay</p>
          <p className="text-2xl font-mono font-bold text-slate-900 mt-1">$142,500</p>
          <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12% YoY Efficiency
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Net Fleet Operating Margin</p>
          <p className="text-2xl font-mono font-bold text-emerald-600 mt-1">34.8%</p>
          <div className="mt-2 text-xs text-slate-500">
            Target benchmark: &gt; 30.0%
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Average Cost / KM</p>
          <p className="text-2xl font-mono font-bold text-purple-900 mt-1">$0.82 / km</p>
          <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" /> -4.1% Cost reduction
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Capital Expenditure &amp; Fleet Cost Allocation</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Fuel Consumption (48%)</span>
              <span>$24,600</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '48%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Maintenance &amp; Repairs (28%)</span>
              <span>$14,350</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '28%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Tolls, Taxes &amp; Permits (14%)</span>
              <span>$7,175</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '14%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Insurance &amp; Licensing (10%)</span>
              <span>$5,125</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '10%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
