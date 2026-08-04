import { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, RefreshCw, Search, Car, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import { useVehicles } from '../hooks/useVehicles';
import VehicleTable, { VehicleTableSkeleton } from '../components/vehicles/VehicleTable';
import VehicleForm from '../components/vehicles/VehicleForm';

const STATUS_FILTERS = ['all', 'available', 'on_trip', 'in_shop', 'retired'];

const CHIP_STYLES = {
  all:       { active: { bg: 'transparent', text: '#0F172A', border: '#94A3B8' }, label: 'All'        },
  available: { active: { bg: '#22C55E',    text: '#FFFFFF',  border: '#22C55E' }, label: 'Available'  },
  on_trip:   { active: { bg: '#3B82F6',    text: '#FFFFFF',  border: '#3B82F6' }, label: 'On Trip'    },
  in_shop:   { active: { bg: '#F59E0B',    text: '#FFFFFF',  border: '#F59E0B' }, label: 'In Shop'    },
  retired:   { active: { bg: '#94A3B8',    text: '#FFFFFF',  border: '#94A3B8' }, label: 'Retired'    },
};

export default function VehiclesPage() {
  const { role } = useAuth();
  const canEdit = role === ROLES.MANAGER;

  // Get search from layout context (functional search via URL)
  const outletCtx = useOutletContext() ?? {};
  const globalSearch = outletCtx.searchQuery ?? '';

  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const { vehicles, loading, error, refetch } = useVehicles();

  // Sync global header search → local search
  useEffect(() => {
    if (globalSearch !== undefined) setLocalSearch(globalSearch);
  }, [globalSearch]);

  const search = localSearch;

  const filtered = useMemo(() => {
    return vehicles.filter(v => {
      const matchSearch =
        !search ||
        v.reg_number?.toLowerCase().includes(search.toLowerCase()) ||
        v.name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [vehicles, search, statusFilter]);

  const openCreate = () => { setEditingVehicle(null); setFormOpen(true); };
  const openEdit   = (v) => { setEditingVehicle(v);   setFormOpen(true); };

  const handleSuccess = (message) => {
    toast.success(message);
    refetch();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight" style={{ color: '#0F172A' }}>
            Vehicle <span style={{ color: '#22C55E' }}>Registry</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            {loading ? 'Loading…' : `${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} registered`}
          </p>
        </div>
        {canEdit && (
          <button onClick={openCreate} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        )}
      </div>

      {/* Filter bar: search + status chips in one row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0 max-w-sm">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: '#CBD5E1' }}
          />
          <input
            type="text"
            placeholder="Search by name or reg number…"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-8 py-2 text-sm rounded-xl outline-none transition-all"
            style={{
              backgroundColor: '#F5F7FA',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#22C55E';
              e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.10)';
              e.target.style.backgroundColor = '#FFFFFF';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#E2E8F0';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#F5F7FA';
            }}
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
              style={{ color: '#CBD5E1' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-widest mr-1" style={{ color: '#94A3B8' }}>
            Status
          </span>
          {STATUS_FILTERS.map(s => {
            const chip = CHIP_STYLES[s];
            const isActive = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1 text-xs font-semibold rounded-full border transition-all"
                style={
                  isActive
                    ? { backgroundColor: chip.active.bg, color: chip.active.text, borderColor: chip.active.border ?? chip.active.bg, fontWeight: 700 }
                    : { backgroundColor: 'transparent', color: '#64748B', borderColor: '#E2E8F0' }
                }
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content states */}
      {loading && <VehicleTableSkeleton />}

      {!loading && error && (
        <div className="panel flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#FEE2E2' }}>
            <RefreshCw className="w-7 h-7" style={{ color: '#EF4444' }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: '#0F172A' }}>Failed to load vehicles</p>
          <p className="text-sm mb-4" style={{ color: '#64748B' }}>{error}</p>
          <button onClick={refetch} className="btn-primary">Retry</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="panel flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#F0FDF4' }}>
            <Car className="w-8 h-8" style={{ color: '#22C55E' }} />
          </div>
          <p className="font-bold text-lg mb-1" style={{ color: '#0F172A' }}>
            {search || statusFilter !== 'all' ? 'No vehicles match your filters' : 'No vehicles yet'}
          </p>
          <p className="text-sm mb-5" style={{ color: '#64748B' }}>
            {search || statusFilter !== 'all'
              ? 'Try adjusting your search or filter.'
              : 'Add a vehicle to start managing your fleet.'}
          </p>
          {canEdit && !search && statusFilter === 'all' && (
            <button onClick={openCreate} className="btn-primary">
              <Plus className="w-4 h-4" /> Register Vehicle
            </button>
          )}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <VehicleTable vehicles={filtered} canEdit={canEdit} onEdit={openEdit} />
      )}

      <VehicleForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        vehicle={editingVehicle}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
