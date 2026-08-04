import { useEffect, useState } from 'react';
import { Download, BarChart2, Zap } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import { useReports } from '../hooks/useReports';
import ReportTabs from '../components/reports/ReportTabs';
import ReportTable from '../components/reports/ReportTable';
import aiService from '../services/aiService';

// ─── Column Definitions per tab ────────────────────────────────────────────
const COLUMNS = {
  fuel_efficiency: [
    { key: 'vehicle', label: 'Vehicle', mono: true },
    { key: 'name', label: 'Model' },
    { key: 'liters', label: 'Liters', suffix: ' L', mono: true },
    { key: 'cost', label: 'Cost', prefix: '$', mono: true },
    {
      key: 'kmPerLiter',
      label: 'km/L',
      mono: true,
      render: (val) => (
        <span
          className="font-mono font-bold"
          style={{ color: val >= 5 ? '#22C55E' : val >= 4 ? '#F59E0B' : '#EF4444' }}
        >
          {val}
        </span>
      )
    },
    { key: 'trips', label: 'Trips', mono: true },
  ],
  utilization: [
    { key: 'vehicle', label: 'Vehicle', mono: true },
    { key: 'name', label: 'Model' },
    { key: 'activeDays', label: 'Active Days', mono: true },
    { key: 'totalDays', label: 'Total Days', mono: true },
    {
      key: 'utilization',
      label: 'Utilization %',
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E2E8F0', minWidth: '80px' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${val}%`,
                backgroundColor: val >= 80 ? '#22C55E' : val >= 50 ? '#F59E0B' : '#EF4444'
              }}
            />
          </div>
          <span
            className="font-mono font-bold text-sm w-10 text-right"
            style={{ color: val >= 80 ? '#22C55E' : val >= 50 ? '#F59E0B' : '#EF4444' }}
          >
            {val}%
          </span>
        </div>
      )
    },
  ],
  operational_cost: [
    { key: 'vehicle', label: 'Vehicle', mono: true },
    { key: 'name', label: 'Model' },
    { key: 'fuel', label: 'Fuel ($)', prefix: '$', mono: true },
    { key: 'maintenance', label: 'Maintenance ($)', prefix: '$', mono: true },
    { key: 'other', label: 'Other ($)', prefix: '$', mono: true },
    {
      key: 'total',
      label: 'Total ($)',
      render: (val) => (
        <span className="font-mono font-bold text-sm" style={{ color: '#22C55E' }}>
          ${val.toLocaleString()}
        </span>
      )
    },
  ],
  roi: [
    { key: 'vehicle', label: 'Vehicle', mono: true },
    { key: 'name', label: 'Model' },
    { key: 'revenue', label: 'Revenue ($)', prefix: '$', mono: true },
    { key: 'cost', label: 'Cost ($)', prefix: '$', mono: true },
    { key: 'profit', label: 'Profit ($)', prefix: '$', mono: true },
    {
      key: 'roi',
      label: 'ROI %',
      render: (val) => (
        <span className="font-mono font-bold text-sm" style={{ color: '#22C55E' }}>
          {val}%
        </span>
      )
    },
  ],
};

function UtilizationBar({ data }) {
  if (!data?.length) return null;
  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>
        Utilization by Vehicle
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={28}>
          <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="4 4" />
          <XAxis
            dataKey="vehicle"
            tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: '12px', color: '#0F172A',
              boxShadow: '0 4px 16px rgba(15,23,42,0.10)',
              fontSize: '13px',
            }}
            formatter={(v) => [`${v}%`, 'Utilization']}
            cursor={{ fill: 'rgba(34,197,94,0.05)' }}
          />
          <Bar dataKey="utilization" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.utilization >= 80 ? '#22C55E' : entry.utilization >= 50 ? '#F59E0B' : '#EF4444'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function ReportsPage() {
  const { role } = useAuth();
  const defaultTab = role === ROLES.ANALYST ? 'roi' : 'fuel_efficiency';
  const { activeTab, data, loading, switchTab, fetchTab, exportCsv } = useReports(defaultTab);
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => { fetchTab(defaultTab); }, []); // eslint-disable-line

  useEffect(() => {
    async function loadAnomalies() {
      try {
        const res = await aiService.getFuelAnomalies();
        setAnomalies(res.data || []);
      } catch (err) {
        // Degrade gracefully
      }
    }
    loadAnomalies();
  }, []);

  const cols = COLUMNS[activeTab] || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight" style={{ color: '#0F172A' }}>
            <span style={{ color: '#22C55E' }}>Fleet</span> Reports
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            Analyse fleet performance, costs, and ROI.
          </p>
        </div>
        <button
          id="export-csv-btn"
          onClick={exportCsv}
          disabled={loading || !data.length}
          className="btn-ghost disabled:opacity-40 disabled:pointer-events-none"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both" style={{ animationDelay: '100ms' }}>
        <ReportTabs activeTab={activeTab} onSwitch={switchTab} role={role} />
      </div>

      {/* Fuel Anomalies Banner */}
      {activeTab === 'fuel_efficiency' && anomalies.length > 0 && (
        <div className="p-4 rounded-xl border flex flex-col gap-2 animate-in fade-in" style={{ backgroundColor: '#FEFCE8', borderColor: '#FEF08A' }}>
          <div className="flex items-center gap-2 font-bold text-sm" style={{ color: '#A16207' }}>
            <Zap className="w-4 h-4 text-yellow-600" />
            <span>AI Fuel Anomaly Alert ({anomalies.length} Flagged Trips)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {anomalies.map((a, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/80 border border-yellow-200 text-xs flex flex-col justify-between">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>{a.vehicle_name}</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold ${a.deviationPct < 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {a.deviationPct > 0 ? `+${a.deviationPct}%` : `${a.deviationPct}%`}
                  </span>
                </div>
                <div className="text-slate-500 mt-1">
                  Trip #{a.trip_id} ({a.source} → {a.destination}): <strong className="text-slate-700">{a.tripEfficiency} km/L</strong> vs fleet avg {a.avgEfficiency} km/L
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart (utilization tab only) */}
      {activeTab === 'utilization' && !loading && data.length > 0 && (
        <div key={`chart-${activeTab}`} className="panel p-6 animate-in fade-in zoom-in-95 duration-500 fill-mode-both" style={{ animationDelay: '200ms' }}>
          <UtilizationBar data={data} />
        </div>
      )}

      {/* Table */}
      <div key={`table-${activeTab}`} className="panel overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '300ms' }}>
        <div className="px-6 py-4 border-b border-app-border flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-text-secondary" />
          <h3 className="text-sm font-bold text-text-primary capitalize">
            {activeTab.replace(/_/g, ' ')} Report
          </h3>
          {!loading && data.length > 0 && (
            <span className="ml-auto text-xs font-mono" style={{ color: '#94A3B8' }}>
              {data.length} vehicles
            </span>
          )}
        </div>
        <ReportTable columns={cols} data={data} loading={loading} />
      </div>
    </div>
  );
}
