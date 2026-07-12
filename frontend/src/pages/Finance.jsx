import { useState, useEffect } from 'react';
import { Wallet, ChevronDown, Check, AlertCircle, X } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import CostSummaryCard from '../components/finance/CostSummaryCard';
import FuelLogForm from '../components/finance/FuelLogForm';
import ExpenseForm from '../components/finance/ExpenseForm';

// Mock vehicles — replaces API call when backend is unavailable
const MOCK_VEHICLES = [
  { id: 101, reg_number: 'TRK-001', name: 'Freightliner Cascadia' },
  { id: 102, reg_number: 'TRK-002', name: 'Volvo VNL 860' },
  { id: 103, reg_number: 'TRK-003', name: 'Kenworth T680' },
];

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

export default function FinancePage() {
  const [vehicles] = useState(MOCK_VEHICLES);
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
      // Refetch costs for the selected vehicle
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
      // Refetch costs for the selected vehicle
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
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Finance</h1>
          <p className="text-text-secondary mt-1">Track fuel costs and operational expenses per vehicle.</p>
        </div>

        {/* Vehicle Selector */}
        <div className="relative min-w-[240px]">
          <div className="flex items-center gap-2 panel px-4 py-2.5 rounded-xl cursor-pointer">
            <Wallet className="w-4 h-4 text-accent-signal shrink-0" />
            <select
              value={selectedVehicle?.id || ''}
              onChange={e => {
                const v = vehicles.find(v => String(v.id) === e.target.value);
                setSelectedVehicle(v || null);
              }}
              className="flex-1 bg-transparent text-sm font-medium text-text-primary focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">Select a vehicle…</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.reg_number} — {v.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-text-secondary shrink-0 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Cost Summary */}
      <CostSummaryCard costs={costs} loading={costsLoading} />

      {/* Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
