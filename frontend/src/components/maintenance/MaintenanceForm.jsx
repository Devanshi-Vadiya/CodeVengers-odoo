import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle } from 'lucide-react';
import { useVehicles } from '../../hooks/useVehicles';

const INPUT_CLS = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/15 transition-colors appearance-none disabled:opacity-50";

export default function MaintenanceForm({ isOpen, onClose, onSubmit }) {
  const { vehicles, loading, error: vehiclesError } = useVehicles();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ vehicle_id: '', description: '', cost: '', priority: 'Medium' });

  useEffect(() => {
    if (isOpen) {
      setFormData({ vehicle_id: '', description: '', cost: '', priority: 'Medium' });
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicle_id || !formData.description || !formData.cost || !formData.priority) {
      setError('Please fill in all fields'); return;
    }
    onSubmit({ ...formData, vehicle_id: parseInt(formData.vehicle_id) });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden bg-white border border-slate-200 z-10 animate-in zoom-in-95 duration-200 my-auto">

        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <h2 className="text-lg font-display font-bold tracking-tight" style={{ color: '#0F172A' }}>Log Maintenance</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Vehicle</label>
            <select value={formData.vehicle_id} onChange={e => setFormData({ ...formData, vehicle_id: e.target.value })} className={INPUT_CLS} disabled={loading}>
              <option value="">{loading ? 'Loading vehicles...' : 'Select a vehicle'}</option>
              {vehicles?.map(v => <option key={v.id} value={v.id}>{v.reg_number} - {v.name}</option>)}
            </select>
            {vehiclesError && <p className="text-xs text-red-500 mt-1">Failed to load vehicles</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Priority</label>
            <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className={INPUT_CLS}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Cost ($)</label>
            <input type="number" min="0" step="0.01" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} className={`${INPUT_CLS} font-mono`} placeholder="e.g. 500.00" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={`${INPUT_CLS} min-h-[100px] resize-none`} placeholder="Describe the issue or required service..." />
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-slate-50">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary">
            Log Maintenance
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
