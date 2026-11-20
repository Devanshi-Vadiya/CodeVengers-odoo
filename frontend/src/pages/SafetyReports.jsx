import { useMemo } from 'react';
import { AlertTriangle, ShieldCheck, UserX, Clock, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useDrivers } from '../hooks/useDrivers';
import { useVehicles } from '../hooks/useVehicles';

export default function SafetyReports() {
  const { drivers, loading: driversLoading } = useDrivers();
  const { vehicles, loading: vehiclesLoading } = useVehicles();

  const stats = useMemo(() => {
    const total = drivers.length || 1;
    const avgScore = Math.round(drivers.reduce((acc, d) => acc + (d.safety_score || 85), 0) / total);
    const suspended = drivers.filter(d => d.status === 'suspended');
    const expiredLicenses = drivers.filter(d => d.isLicenseExpired);
    const expiringSoon = drivers.filter(d => {
      if (!d.license_expiry) return false;
      const diff = (new Date(d.license_expiry) - new Date()) / (1000 * 60 * 60 * 24);
      return diff > 0 && diff <= 30;
    });

    return { avgScore, suspended, expiredLicenses, expiringSoon };
  }, [drivers]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          Safety &amp; Compliance <span className="text-[#22C55E]">Reports</span>
        </h1>
        <p className="text-sm mt-1 text-slate-500">
          Monitor driver license compliance, risk scores, suspensions, and vehicle road-safety status.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Fleet Avg Safety Score</p>
            <p className="text-3xl font-mono font-bold text-slate-900 mt-1">{stats.avgScore}/100</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Suspended Drivers</p>
            <p className="text-3xl font-mono font-bold text-red-600 mt-1">{stats.suspended.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <UserX className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Expired Licenses</p>
            <p className="text-3xl font-mono font-bold text-amber-600 mt-1">{stats.expiredLicenses.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Licenses Expiring (30d)</p>
            <p className="text-3xl font-mono font-bold text-blue-600 mt-1">{stats.expiringSoon.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Driver Risk Compliance Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Driver Safety Audit Roster</h2>
          <span className="text-xs font-mono text-slate-400">{drivers.length} Drivers Audited</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Driver Name</th>
                <th className="p-3">License No.</th>
                <th className="p-3">Category</th>
                <th className="p-3">License Expiry</th>
                <th className="p-3">Safety Score</th>
                <th className="p-3">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {drivers.map(d => {
                const score = d.safety_score || 85;
                const isSuspended = d.status === 'suspended';
                const isExpired = d.isLicenseExpired;

                return (
                  <tr key={d.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-900">{d.name}</td>
                    <td className="p-3 font-mono">{d.license_number || 'N/A'}</td>
                    <td className="p-3 font-mono">{d.license_category || 'Commercial'}</td>
                    <td className="p-3 font-mono">
                      {d.license_expiry ? String(d.license_expiry).split('T')[0] : 'N/A'}
                    </td>
                    <td className="p-3">
                      <span className={`font-mono font-bold ${
                        score >= 85 ? 'text-emerald-600' : score >= 70 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {score}/100
                      </span>
                    </td>
                    <td className="p-3">
                      {isSuspended ? (
                        <span className="px-2 py-0.5 rounded font-bold uppercase bg-red-100 text-red-800 text-[10px]">
                          Suspended
                        </span>
                      ) : isExpired ? (
                        <span className="px-2 py-0.5 rounded font-bold uppercase bg-amber-100 text-amber-800 text-[10px]">
                          License Expired
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded font-bold uppercase bg-emerald-100 text-emerald-800 text-[10px]">
                          Compliant
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
