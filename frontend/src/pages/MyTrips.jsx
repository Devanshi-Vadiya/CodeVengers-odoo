import { useState, useMemo } from 'react';
import { Map, Clock, CheckCircle2, AlertCircle, Navigation, Truck, User, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../hooks/useTrips';

export default function MyTrips() {
  const { user } = useAuth();
  const { trips, loading, error, refetch, dispatchTrip, completeTrip } = useTrips();

  const [completingTrip, setCompletingTrip] = useState(null);
  const [actualDistance, setActualDistance] = useState('');
  const [fuelConsumed, setFuelConsumed] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filter trips for this driver or show assigned trips
  const myTripsList = useMemo(() => {
    if (!trips.length) return [];
    // If user has a name or id matching driver
    const driverTrips = trips.filter(t => 
      t.driver?.id === user?.id || 
      t.driver?.name?.toLowerCase().includes(user?.name?.toLowerCase() || '') ||
      t.driver_id === user?.id
    );
    // If no exact match (e.g. demo driver), show trips assigned to demo driver or first active trips
    return driverTrips.length > 0 ? driverTrips : trips;
  }, [trips, user]);

  const activeTrip = myTripsList.find(t => t.status === 'dispatched');
  const upcomingTrips = myTripsList.filter(t => t.status === 'draft');
  const pastTrips = myTripsList.filter(t => t.status === 'completed' || t.status === 'cancelled');

  const handleStartTrip = async (trip) => {
    try {
      await dispatchTrip(trip.id);
      toast.success('Trip started! Drive safely.');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start trip');
    }
  };

  const handleOpenCompleteModal = (trip) => {
    setCompletingTrip(trip);
    setActualDistance(trip.planned_distance || '');
    setFuelConsumed('');
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!actualDistance || !fuelConsumed) {
      toast.error('Please enter distance and fuel consumed');
      return;
    }

    setSubmitting(true);
    try {
      await completeTrip(completingTrip.id, {
        actual_distance: Number(actualDistance),
        fuel_consumed: Number(fuelConsumed)
      });
      toast.success('Trip completed and logged successfully!');
      setCompletingTrip(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark trip complete');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Map className="w-6 h-6 text-[#22C55E]" />
            Driver <span className="text-[#22C55E]">Trip Board</span>
          </h1>
          <p className="text-sm mt-1 text-slate-500">
            Welcome back, {user?.name || 'Driver'}. View your route assignments and report trip progress.
          </p>
        </div>

        <button 
          onClick={refetch}
          className="btn-ghost border border-slate-200 self-start sm:self-auto"
        >
          Refresh Trips
        </button>
      </div>

      {/* Active Trip Hero Banner */}
      {activeTrip ? (
        <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-50 via-white to-blue-50 border border-emerald-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Trip in Progress
              </div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span>{activeTrip.source}</span>
                <ArrowRight className="w-5 h-5 text-emerald-600" />
                <span>{activeTrip.destination}</span>
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  Vehicle: <strong>{activeTrip.vehicle?.name || `Vehicle #${activeTrip.vehicle_id}`}</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  Planned: <strong>{activeTrip.planned_distance} km</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  Cargo: <strong>{activeTrip.cargo_weight} kg</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => handleOpenCompleteModal(activeTrip)}
              className="btn-primary py-3 px-6 text-sm font-bold shadow-lg shadow-emerald-500/20 shrink-0"
            >
              <CheckCircle2 className="w-5 h-5" />
              Complete Trip &amp; Log Fuel
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-6 bg-white border border-slate-200 text-center py-8">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Trip Currently in Transit</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            You are currently available. Check upcoming assigned trips below or dispatch a scheduled run.
          </p>
        </div>
      )}

      {/* Upcoming Assigned Trips */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Upcoming Assigned Trips ({upcomingTrips.length})</h2>
        {upcomingTrips.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 bg-white rounded-xl border border-slate-200 text-center">
            No pending trips waiting for dispatch.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingTrips.map(trip => (
              <div key={trip.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                      Draft / Ready
                    </span>
                    <span className="text-xs font-mono text-slate-400">Trip #{trip.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {trip.source} → {trip.destination}
                  </h3>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Vehicle: <strong className="text-slate-700">{trip.vehicle?.name || `Vehicle #${trip.vehicle_id}`}</strong></p>
                    <p>Planned Distance: <strong className="text-slate-700">{trip.planned_distance} km</strong></p>
                    <p>Cargo Payload: <strong className="text-slate-700">{trip.cargo_weight} kg</strong></p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => handleStartTrip(trip)}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Start Trip (Dispatch)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Completed Trips */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-slate-900">Completed &amp; Recent Runs ({pastTrips.length})</h2>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Trip ID</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Distance</th>
                  <th className="p-3">Fuel Consumed</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {pastTrips.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-800">#{t.id}</td>
                    <td className="p-3 font-medium text-slate-900">{t.source} → {t.destination}</td>
                    <td className="p-3">{t.vehicle?.name || `Vehicle #${t.vehicle_id}`}</td>
                    <td className="p-3 font-mono">{t.actual_distance || t.planned_distance} km</td>
                    <td className="p-3 font-mono">{t.fuel_consumed ? `${t.fuel_consumed} L` : '—'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
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

      {/* Modal for Completing Trip */}
      {completingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Complete Trip #{completingTrip.id}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {completingTrip.source} → {completingTrip.destination}
              </p>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Actual Distance Traveled (km)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={actualDistance}
                  onChange={e => setActualDistance(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:bg-white focus:border-[#22C55E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Fuel Consumed (Liters)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={fuelConsumed}
                  onChange={e => setFuelConsumed(e.target.value)}
                  placeholder="e.g. 28.5"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:bg-white focus:border-[#22C55E] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCompletingTrip(null)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                >
                  {submitting ? 'Submitting...' : 'Confirm & Complete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
