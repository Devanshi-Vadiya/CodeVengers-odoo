import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router-dom';
import { Plus, Users, RefreshCw, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import { useDrivers } from '../hooks/useDrivers';
import driverService from '../services/driverService';
import DriverTable, { DriverTableSkeleton } from '../components/drivers/DriverTable';
import DriverForm from '../components/drivers/DriverForm';

const STATUS_FILTERS = ['all', 'available', 'on_trip', 'off_duty', 'suspended'];

const CHIP_STYLES = {
  all:       { active: { bg: 'transparent', text: '#0F172A', border: '#94A3B8' }, label: 'All'       },
  available: { active: { bg: '#22C55E',    text: '#FFFFFF',  border: '#22C55E' }, label: 'Available' },
  on_trip:   { active: { bg: '#3B82F6',    text: '#FFFFFF',  border: '#3B82F6' }, label: 'On Trip'   },
  off_duty:  { active: { bg: '#94A3B8',    text: '#FFFFFF',  border: '#94A3B8' }, label: 'Off Duty'  },
  suspended: { active: { bg: '#EF4444',    text: '#FFFFFF',  border: '#EF4444' }, label: 'Suspended' },
};

export default function Drivers() {
  const { role } = useAuth();
  const canEdit    = role === ROLES.MANAGER;
  const canSuspend = role === ROLES.SAFETY || role === ROLES.MANAGER;

  const outletCtx = useOutletContext() ?? {};
  const globalSearch = outletCtx.searchQuery ?? '';

  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const [suspending, setSuspending] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendLoading, setSuspendLoading] = useState(false);

  const { drivers, loading, error, refetch } = useDrivers();

  useEffect(() => {
    if (globalSearch !== undefined) setLocalSearch(globalSearch);
  }, [globalSearch]);

  const search = localSearch;

  const filtered = useMemo(() => {
    return drivers.filter(d => {
      const matchSearch =
        !search ||
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.license_number?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [drivers, search, statusFilter]);

  const openCreate = () => { setEditingDriver(null); setFormOpen(true); };
  const openEdit   = (d) => { setEditingDriver(d);   setFormOpen(true); };

  const handleSuccess = (message) => { toast.success(message); refetch(); };

  const openSuspend = (driver) => { setSuspending(driver); setSuspendReason(''); };

  const handleSuspend = async () => {
    if (!suspendReason.trim()) { toast.error('Please enter a reason'); return; }
    setSuspendLoading(true);
    try {
      await driverService.suspend(suspending.id, suspendReason);
      toast.success(`${suspending.name} has been suspended`);
      setSuspending(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to suspend driver');
    } finally {
      setSuspendLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight" style={{ color: '#0F172A' }}>
            Driver <span style={{ color: '#22C55E' }}>Management</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            {loading ? 'Loading…' : `${drivers.length} driver${drivers.length !== 1 ? 's' : ''} on roster`}
          </p>
        </div>
        {canEdit && (
          <button onClick={openCreate} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Driver
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
            placeholder="Search by name or license number…"
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

      {/* Loading */}
      {loading && <DriverTableSkeleton />}

      {/* Error */}
      {!loading && error && (
        <div className="panel flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#FEE2E2' }}>
            <RefreshCw className="w-7 h-7" style={{ color: '#EF4444' }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: '#0F172A' }}>Failed to load drivers</p>
          <p className="text-sm mb-4" style={{ color: '#64748B' }}>{error}</p>
          <button onClick={refetch} className="btn-primary">Retry</button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="panel flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#F0FDF4' }}>
            <Users className="w-8 h-8" style={{ color: '#22C55E' }} />
          </div>
          <p className="font-bold text-lg mb-1" style={{ color: '#0F172A' }}>
            {search || statusFilter !== 'all' ? 'No drivers match your filters' : 'No drivers on roster yet'}
          </p>
          <p className="text-sm mb-5" style={{ color: '#64748B' }}>
            {search || statusFilter !== 'all' ? 'Try adjusting your search or filter.' : 'Add a driver to get started.'}
          </p>
          {canEdit && !search && statusFilter === 'all' && (
            <button onClick={openCreate} className="btn-primary">
              <Plus className="w-4 h-4" /> Add Driver
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <DriverTable
          drivers={filtered}
          canEdit={canEdit}
          canSuspend={canSuspend}
          onEdit={openEdit}
          onSuspend={openSuspend}
        />
      )}

      <DriverForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        driver={editingDriver}
        onSuccess={handleSuccess}
      />

      {/* Suspend Confirmation Modal */}
      {suspending && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSuspending(null)} />
          <div
            className="relative rounded-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200 my-auto z-10"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(15,23,42,0.18)' }}
          >
            <h3 className="text-lg font-bold mb-1" style={{ color: '#0F172A' }}>Suspend Driver</h3>
            <p className="text-sm mb-5" style={{ color: '#64748B' }}>
              Enter the reason for suspending{' '}
              <span className="font-semibold" style={{ color: '#0F172A' }}>{suspending.name}</span>.
              This will set their status to{' '}
              <span className="font-semibold" style={{ color: '#EF4444' }}>Suspended</span>.
            </p>
            <textarea
              value={suspendReason}
              onChange={e => setSuspendReason(e.target.value)}
              placeholder="Reason for suspension…"
              rows={3}
              className="input-field resize-none mb-4"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSuspending(null)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={suspendLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl transition-colors disabled:opacity-60"
                style={{ backgroundColor: '#EF4444' }}
                onMouseEnter={e => { if (!suspendLoading) e.currentTarget.style.backgroundColor = '#DC2626'; }}
                onMouseLeave={e => { if (!suspendLoading) e.currentTarget.style.backgroundColor = '#EF4444'; }}
              >
                {suspendLoading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Suspending…</>
                  : 'Confirm Suspend'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
