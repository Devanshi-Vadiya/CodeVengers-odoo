import { useState, useEffect, useRef } from 'react';
import { Wallet, ChevronDown, Check, AlertCircle, X } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import CostSummaryCard from '../components/finance/CostSummaryCard';
import FuelLogForm from '../components/finance/FuelLogForm';
import ExpenseForm from '../components/finance/ExpenseForm';

const MOCK_VEHICLES = [
  { id: 1, reg_number: 'TRK-001', name: 'Freightliner Cascadia' },
  { id: 2, reg_number: 'TRK-002', name: 'Volvo VNL 860' },
  { id: 3, reg_number: 'VAN-001', name: 'Ford Transit' },
];

function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-6 duration-300`}
      style={
        type === 'success'
          ? { backgroundColor: '#F0FDF4', borderColor: 'rgba(34,197,94,0.25)', color: '#16A34A' }
          : { backgroundColor: '#FEF2F2', borderColor: 'rgba(239,68,68,0.25)', color: '#DC2626' }
      }
    >
      {type === 'success'
        ? <Check className="w-5 h-5 shrink-0" />
        : <AlertCircle className="w-5 h-5 shrink-0" />
      }
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 p-0.5 hover:opacity-70 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function VehicleDropdown({ vehicles, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative min-w-[260px]">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none"
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${open ? '#22C55E' : '#E2E8F0'}`,
          color: selected ? '#0F172A' : '#94A3B8',
          boxShadow: open ? '0 0 0 3px rgba(34,197,94,0.10)' : '0 1px 3px rgba(15,23,42,0.06)',
        }}
      >
        <Wallet className="w-4 h-4 shrink-0" style={{ color: '#22C55E' }} />
        <span className="flex-1 text-left truncate">
          {selected ? `${selected.reg_number} — ${selected.name}` : 'Select a vehicle…'}
        </span>
        <ChevronDown
          className="w-4 h-4 shrink-0 transition-transform duration-200"
          style={{ color: '#94A3B8', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 top-full mt-1.5 w-full rounded-xl overflow-hidden"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 32px rgba(15,23,42,0.12)',
          }}
        >
          <button
            type="button"
            onClick={() => { onSelect(null); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
            style={{ color: '#94A3B8' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5F7FA'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span className="w-4 h-4 shrink-0" />
            Select a vehicle…
          </button>
          <div style={{ borderTop: '1px solid #E2E8F0' }} />
          {vehicles.map(v => (
            <button
              key={v.id}
              type="button"
              onClick={() => { onSelect(v); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
              style={{ color: selected?.id === v.id ? '#16A34A' : '#0F172A' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F0FDF4'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Check
                className="w-4 h-4 shrink-0"
                style={{ opacity: selected?.id === v.id ? 1 : 0, color: '#22C55E' }}
              />
              <span className="font-mono font-semibold">{v.reg_number}</span>
              <span style={{ color: '#94A3B8' }}>— {v.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FinancePage() {
  const [vehicles] = useState(MOCK_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [toast, setToast] = useState(null);
  const [fuelLoading, setFuelLoading] = useState(false);
  const [expenseLoading, setExpenseLoading] = useState(false);

  const { costs, loading: costsLoading, fetchCosts, submitFuelLog, submitExpense } = useFinance();

  useEffect(() => {
    if (selectedVehicle) fetchCosts(selectedVehicle.id);
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
          <h1 className="text-2xl font-display font-bold tracking-tight" style={{ color: '#0F172A' }}>
            Fleet <span style={{ color: '#22C55E' }}>Finance</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            Track fuel costs and operational expenses per vehicle.
          </p>
        </div>
        <VehicleDropdown vehicles={vehicles} selected={selectedVehicle} onSelect={setSelectedVehicle} />
      </div>

      <CostSummaryCard costs={costs} loading={costsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FuelLogForm onSubmit={handleFuelSubmit} loading={fuelLoading} selectedVehicleId={selectedVehicle?.id} />
        <ExpenseForm onSubmit={handleExpenseSubmit} loading={expenseLoading} selectedVehicleId={selectedVehicle?.id} />
      </div>

      {!selectedVehicle && (
        <p className="text-center text-sm py-4" style={{ color: '#94A3B8' }}>
          ↑ Select a vehicle above to enable the forms and view cost summary.
        </p>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
