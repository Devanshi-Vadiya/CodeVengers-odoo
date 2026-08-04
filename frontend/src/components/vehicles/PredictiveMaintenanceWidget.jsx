import { useState, useEffect } from 'react';
import { Cpu, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import aiService from '../../services/aiService';

export default function PredictiveMaintenanceWidget({ vehicleId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPredictiveData() {
      try {
        setLoading(true);
        setError(false);
        const res = await aiService.getPredictiveMaintenance(vehicleId || 1);
        if (isMounted) {
          setData(res.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadPredictiveData();
    return () => { isMounted = false; };
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="panel p-5 animate-pulse flex flex-col justify-between" style={{ minHeight: '180px' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-surface-raised rounded-lg" />
          <div className="h-4 w-36 bg-surface-raised rounded-lg" />
        </div>
        <div className="h-3 w-48 bg-surface-raised rounded-lg mt-4" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="panel p-4 flex items-center gap-3 text-xs" style={{ backgroundColor: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' }}>
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <span>Predictive AI insights unavailable for this vehicle.</span>
      </div>
    );
  }

  const { riskPercent, recommendation, factors } = data;

  const color = riskPercent > 70 ? '#EF4444' : riskPercent > 40 ? '#F59E0B' : '#22C55E';
  const bgBadge = riskPercent > 70 ? '#FEF2F2' : riskPercent > 40 ? '#FEF3C7' : '#F0FDF4';

  return (
    <div className="panel p-6 border transition-all duration-300 hover:shadow-md" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#DCFCE7' }}>
            <Cpu className="w-5 h-5" style={{ color: '#22C55E' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight" style={{ color: '#0F172A' }}>
              Predictive Maintenance Score
            </h3>
            <p className="text-xs" style={{ color: '#64748B' }}>
              AI Risk Analysis Heuristic
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-bold font-mono border" style={{ backgroundColor: bgBadge, color: color, borderColor: `${color}40` }}>
          {riskPercent}% Risk
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${riskPercent}%`, backgroundColor: color }}
        />
      </div>

      {/* Recommendation Card */}
      <div className="p-3.5 rounded-xl flex items-center gap-3 mb-4 text-sm font-medium border" style={{ backgroundColor: bgBadge, borderColor: `${color}30`, color: color }}>
        {riskPercent > 70 ? (
          <AlertTriangle className="w-5 h-5 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 shrink-0" />
        )}
        <span>{recommendation}</span>
      </div>

      {/* Factors List */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Contributing Factors</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
          {factors.map((factor, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col">
              <span className="text-xs text-slate-500 font-medium">{factor.name}</span>
              <span className="text-xs font-bold font-mono text-slate-800 mt-0.5">{factor.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
