import { useState, useEffect, useRef } from 'react';
import { Wallet, ChevronDown, Check, AlertCircle, X, Loader2 } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { useVehicles } from '../hooks/useVehicles';
import CostSummaryCard from '../components/finance/CostSummaryCard';
import FuelLogForm from '../components/finance/FuelLogForm';
import ExpenseForm from '../components/finance/ExpenseForm';

function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-6 duration-300 ${
        type === 'success'
          ? 'bg-status-available/10 border-status-available/20 text-status-available'
          : 'bg-status-shop/10 border-status-shop/20 text-status-shop'
      }`}
    >
      {type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 p-0.5 hover:opacity-70 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Fully custom dark dropdown — avoids the browser's native white popup
function VehicleDropdown({ vehicles, selected, onSelect, loading }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative min-w-[260px]">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E2D8',
          color: selected ? '#1C2333' : '#6B7280',
          boxShadow: '0 1px 3px rgba(28,35,51,0.07)'
        }}
        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-signal hover:border-accent-signal/50"
      >
        <Wallet className="w-4 h-4 text-accent-signal shrink-0" />
        <span className="flex-1 text-left truncate">
          {loading ? 'Loading vehicles...' : selected ? `${selected.reg_number} — ${selected.name}` : 'Select a vehicle…'}
        </span>
        <ChevronDown
          className="w-4 h-4 text-text-secondary shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Menu */}
      {open && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E2D8',
            boxShadow: '0 8px 32px rgba(28,35,51,0.14)',
          }}
          className="absolute z-50 top-full mt-1.5 w-full rounded-xl overflow-hidden"
        >
          {/* Empty option */}
          <button
            type="button"
            onClick={() => { onSelect(null); setOpen(false); }}
            style={{ color: '#6B7280' }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-base-mid transition-colors text-left"
          >
            <span className="w-4 h-4 shrink-0" />
            Select a vehicle…
          </button>
          {/* Divider */}
          <div style={{ borderTop: '1px solid #22335A' }} />
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-5 h-5 text-accent-signal animate-spin" />
            </div>
          ) : (
            vehicles.map((v, index) => (
              <button
                key={v.id}
                type="button"
                onClick={() => { onSelect(v); setOpen(false); }}
                style={{ color: selected?.id === v.id ? '#F5A623' : '#1C2333', animationDelay: `${index * 50}ms` }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-base-mid transition-colors text-left animate-in fade-in slide-in-from-top-2 duration-300 fill-mode-both"
              >
                <Check
                  className="w-4 h-4 shrink-0"
                  style={{ opacity: selected?.id === v.id ? 1 : 0, color: '#F5A623' }}
                />
                <span className="font-mono font-semibold">{v.reg_number}</span>
                <span style={{ color: '#8B9BB8' }}>— {v.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function FinancePage() {
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [toast, setToast] = useState(null);
  const [fuelLoading, setFuelLoading] = useState(false);
  const [expenseLoading, setExpenseLoading] = useState(false);

  const { costs, loading: costsLoading, fetchCosts, submitFuelLog, submitExpense } = useFinance();

  useEffect(() => {
    if (selectedVehicle) {
      fetchCosts(selectedVehicle.id);
    }
  }, [selectedVehicle, fetchCosts]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFuelSubmit = async (data) => {
    try {
      setFuelLoading(true);
      await submitFuelLog(data);
      if (selectedVehicle) await fetchCosts(selectedVehicle.id);
      showToast(`Fuel log added for ${selectedVehicle?.reg_number} — $${Number(data.cost).toFixed(2)}`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setFuelLoading(false);
    }
  };

  const handleExpenseSubmit = async (data) => {
    try {
      setExpenseLoading(true);
      await submitExpense(data);
      if (selectedVehicle) await fetchCosts(selectedVehicle.id);
      showToast(`${data.type} expense of $${Number(data.amount).toFixed(2)} logged for ${selectedVehicle?.reg_number}`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setExpenseLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-fraunces font-bold text-text-primary tracking-tight">Fleet <em style={{ fontStyle: 'italic', fontWeight: 600 }}>Finance</em></h1>
          <p className="text-text-secondary mt-1">Track fuel costs and operational expenses per vehicle.</p>
        </div>

        {/* Vehicle Selector — fully custom dark dropdown */}
        <VehicleDropdown
          vehicles={vehicles}
          loading={vehiclesLoading}
          selected={selectedVehicle}
          onSelect={setSelectedVehicle}
        />
      </div>

      {/* Cost Summary */}
      <div className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
        <CostSummaryCard costs={costs} loading={costsLoading} />
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both" style={{ animationDelay: '200ms' }}>
        <FuelLogForm
          onSubmit={handleFuelSubmit}
          loading={fuelLoading}
          selectedVehicleId={selectedVehicle?.id}
        />
        <ExpenseForm
          onSubmit={handleExpenseSubmit}
          loading={expenseLoading}
          selectedVehicleId={selectedVehicle?.id}
        />
      </div>

      {!selectedVehicle && (
        <p className="text-center text-sm text-text-secondary py-4 animate-pulse">
          ↑ Select a vehicle above to enable the forms and view cost summary.
        </p>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

