import { useState } from 'react';
import { Plus, RefreshCw, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import { useTrips } from '../hooks/useTrips';
import TripKanbanBoard, { TripKanbanSkeleton } from '../components/trips/TripKanbanBoard';
import TripForm from '../components/trips/TripForm';

export default function Trips() {
  const { role } = useAuth();
  const canAction = role === ROLES.MANAGER;

  const { trips, loading, error, refetch, dispatchTrip, completeTrip, cancelTrip } = useTrips();
  const [formOpen, setFormOpen] = useState(false);

  const [completingTrip, setCompletingTrip] = useState(null);
  const [actualDistance, setActualDistance] = useState('');
  const [fuelConsumed, setFuelConsumed] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const handleSuccess = (msg) => { toast.success(msg); refetch(); };

  const handleDispatch = async (trip) => {
    try {
      await dispatchTrip(trip.id);
      toast.success('Trip dispatched successfully!');
      refetch();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to dispatch trip';
      toast.error(msg, { duration: 5000 });
    }
  };

  const handleCancel = async (trip) => {
    if (!window.confirm('Are you sure you want to cancel this trip?')) return;
    try {
      await cancelTrip(trip.id);
      toast.success('Trip cancelled.');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel trip');
    }
  };

  const submitComplete = async () => {
    if (!actualDistance || Number(actualDistance) <= 0) return toast.error('Enter valid actual distance');
    if (!fuelConsumed  || Number(fuelConsumed)  <= 0) return toast.error('Enter valid fuel consumed');

    setActionLoading(true);
    try {
      await completeTrip(completingTrip.id, {
        actual_distance: Number(actualDistance),
        fuel_consumed:   Number(fuelConsumed),
      });
      toast.success('Trip marked as completed!');
      setCompletingTrip(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete trip');
    } finally {
      setActionLoading(false);
    }
  };

  const openCompleteModal = (trip) => {
    setCompletingTrip(trip);
    setActualDistance(trip.planned_distance || '');
    setFuelConsumed('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight" style={{ color: '#0F172A' }}>
            Trip <span style={{ color: '#22C55E' }}>Management</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            {loading ? 'Loading...' : `${trips.length} active and past trips`}
          </p>
        </div>
        {canAction && (
          <button onClick={() => setFormOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Create Trip
          </button>
        )}
      </div>

      {/* Main Kanban Area */}
      {loading ? (
        <TripKanbanSkeleton />
      ) : error ? (
        <div
          className="flex-1 flex flex-col items-center justify-center py-16 rounded-2xl"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <RefreshCw className="w-8 h-8 mb-4" style={{ color: '#EF4444' }} />
          <p className="font-semibold mb-2" style={{ color: '#0F172A' }}>Failed to load trips</p>
          <button onClick={refetch} className="btn-primary">Retry</button>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <TripKanbanBoard
            trips={trips}
            canAction={canAction}
            onDispatch={handleDispatch}
            onComplete={openCompleteModal}
            onCancel={handleCancel}
          />
        </div>
      )}

      <TripForm isOpen={formOpen} onClose={() => setFormOpen(false)} onSuccess={handleSuccess} />

      {/* Complete Trip Modal */}
      {completingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setCompletingTrip(null)} />
          <div
            className="relative rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(15,23,42,0.18)' }}
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#0F172A' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DCFCE7' }}>
                <Check className="w-4 h-4" style={{ color: '#22C55E' }} />
              </div>
              Complete Trip
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#64748B' }}>
                  Actual Distance (km)
                </label>
                <input
                  type="number"
                  value={actualDistance}
                  onChange={e => setActualDistance(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#64748B' }}>
                  Fuel Consumed (Liters)
                </label>
                <input
                  type="number"
                  value={fuelConsumed}
                  onChange={e => setFuelConsumed(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setCompletingTrip(null)} className="btn-ghost">Cancel</button>
              <button
                onClick={submitComplete}
                disabled={actionLoading}
                className="btn-primary disabled:opacity-60"
              >
                {actionLoading ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
