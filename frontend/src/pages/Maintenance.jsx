import { useState } from 'react';
import { Plus, AlertCircle, X, Check } from 'lucide-react';
import { useMaintenance } from '../hooks/useMaintenance';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import MaintenanceList, { MaintenanceListSkeleton } from '../components/maintenance/MaintenanceList';
import MaintenanceForm from '../components/maintenance/MaintenanceForm';
import PredictiveMaintenanceWidget from '../components/vehicles/PredictiveMaintenanceWidget';

export default function MaintenancePage() {
  const { logs, loading, error, createLog, closeLog } = useMaintenance();
  const { role } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const canAction = role === ROLES.MANAGER || role === ROLES.SAFETY;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleCreate = async (data) => {
    try {
      const newLog = await createLog(data);
      setIsFormOpen(false);
      showToast(
        `Vehicle ${newLog.vehicle?.reg_number || data.vehicle_id} is now hidden from trip dispatch.`,
        'success'
      );
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleClose = async (log) => {
    const notes = window.prompt(
      `Enter closing notes for Maintenance Log on ${log.vehicle?.reg_number}:`
    );
    if (notes === null) return;
    try {
      await closeLog(log.id, notes);
      showToast(
        `Maintenance completed. Vehicle ${log.vehicle?.reg_number} is now available for dispatch.`,
        'success'
      );
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight" style={{ color: '#0F172A' }}>
            Predictive <span style={{ color: '#22C55E' }}>Maintenance</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            Track and manage vehicle repairs and inspections.
          </p>
        </div>
        {canAction && (
          <button onClick={() => setIsFormOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Log Maintenance
          </button>
        )}
      </div>

      {/* AI Predictive Maintenance Score Widget */}
      <PredictiveMaintenanceWidget vehicleId={1} />

      {/* Toast Banner */}
      {toast && (
        <div
          className="shrink-0 px-4 py-3.5 rounded-xl flex items-center justify-between border animate-in fade-in slide-in-from-top-4"
          style={
            toast.type === 'success'
              ? { backgroundColor: '#F0FDF4', borderColor: 'rgba(34,197,94,0.25)', color: '#16A34A' }
              : { backgroundColor: '#FEF2F2', borderColor: 'rgba(239,68,68,0.25)', color: '#DC2626' }
          }
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success'
              ? <Check className="w-5 h-5 shrink-0" />
              : <AlertCircle className="w-5 h-5 shrink-0" />
            }
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="p-1 rounded-lg transition-colors hover:opacity-60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      {error && !logs.length ? (
        <div className="panel p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FEF3C7' }}>
            <AlertCircle className="w-7 h-7" style={{ color: '#F59E0B', opacity: 0.8 }} />
          </div>
          <h3 className="text-lg font-bold mb-1" style={{ color: '#0F172A' }}>Failed to load</h3>
          <p style={{ color: '#64748B' }}>{error}</p>
        </div>
      ) : loading ? (
        <MaintenanceListSkeleton />
      ) : (
        <MaintenanceList logs={logs} canAction={canAction} onClose={handleClose} />
      )}

      <MaintenanceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
