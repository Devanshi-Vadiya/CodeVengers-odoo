import { User, Car, Box, Check, X, Navigation } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function TripCard({ 
  trip, 
  canAction, 
  onDispatch, 
  onComplete, 
  onCancel 
}) {
  const { vehicle, driver } = trip;
  const capacityPct = vehicle?.max_capacity ? Math.min((trip.cargo_weight / vehicle.max_capacity) * 100, 100) : 0;
  
  return (
    <div className="bg-base p-4 rounded-xl shadow-sm border border-surface-raised flex flex-col gap-4 animate-in fade-in duration-300 w-full overflow-hidden transition-all hover:border-accent-signal/30">
      
      {/* Top Row: Status Badge & Trip ID */}
      <div className="flex items-center justify-between">
        <StatusBadge status={trip.status} />
        <span className="text-xs font-mono font-medium text-text-secondary">
          TRP-{trip.id.toString().padStart(4, '0')}
        </span>
      </div>

      {/* Route (Vertical Stack) */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-start gap-2.5">
          <div className="w-2 h-2 rounded-full bg-accent-signal mt-1.5 shrink-0 relative z-10 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <span className="text-sm font-bold text-text-primary leading-snug break-words flex-1">
            {trip.source}
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="w-px h-4 bg-surface-raised ml-[3px] shrink-0" />
        </div>
        <div className="flex items-start gap-2.5">
          <div className="w-2 h-2 rounded-full border-2 border-accent-signal bg-base mt-1.5 shrink-0 relative z-10" />
          <span className="text-sm font-bold text-text-primary leading-snug break-words flex-1">
            {trip.destination}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 bg-surface rounded-lg p-3 border border-surface-raised">
        {/* Vehicle */}
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Vehicle</span>
          <div className="flex items-center gap-1.5 text-xs text-text-primary font-medium overflow-hidden">
            <Car className="w-3.5 h-3.5 text-text-secondary shrink-0" />
            <span className="truncate">{vehicle?.name || 'Unknown'}</span>
          </div>
        </div>

        {/* Driver */}
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Driver</span>
          <div className="flex items-center gap-1.5 text-xs text-text-primary font-medium overflow-hidden">
            <User className="w-3.5 h-3.5 text-text-secondary shrink-0" />
            <span className="truncate">{driver?.name || 'Unassigned'}</span>
          </div>
        </div>

        {/* Cargo Progress */}
        <div className="col-span-2 flex flex-col gap-1.5 mt-1">
          <div className="flex items-center justify-between">
             <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
               <Box className="w-3 h-3" /> Cargo
             </span>
             <span className="text-[10px] font-mono font-bold text-text-primary">
               {trip.cargo_weight} / {vehicle?.max_capacity || 0} kg
             </span>
          </div>
          <div className="h-1.5 w-full bg-surface-raised rounded-full overflow-hidden">
             <div 
               className={`h-full rounded-full transition-all ${capacityPct > 90 ? 'bg-status-shop' : 'bg-status-available'}`}
               style={{ width: `${capacityPct}%` }}
             />
          </div>
        </div>
      </div>

      {/* Actions (Only if canAction is true) */}
      {canAction && (
        <div className="pt-1 flex items-center justify-end gap-2">
          {trip.status === 'draft' && (
            <>
              <button onClick={() => onCancel(trip)} className="px-3 py-1.5 text-xs font-semibold text-text-secondary bg-surface border border-surface-raised hover:bg-surface-raised hover:text-text-primary rounded-lg transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-signal/50">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button onClick={() => onDispatch(trip)} className="px-3 py-1.5 text-xs font-bold text-white bg-accent-signal hover:bg-blue-400 rounded-lg shadow-sm transition-all flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-signal/50">
                <Navigation className="w-3.5 h-3.5" /> Dispatch
              </button>
            </>
          )}
          {trip.status === 'dispatched' && (
            <>
              <button onClick={() => onCancel(trip)} className="px-3 py-1.5 text-xs font-semibold text-text-secondary bg-surface border border-surface-raised hover:bg-surface-raised hover:text-text-primary rounded-lg transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-signal/50">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button onClick={() => onComplete(trip)} className="px-3 py-1.5 text-xs font-bold text-white bg-status-available hover:bg-emerald-400 rounded-lg shadow-sm transition-all flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-signal/50">
                <Check className="w-3.5 h-3.5" /> Complete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
