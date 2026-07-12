import { DollarSign, Droplet, Wrench, Receipt } from 'lucide-react';

export default function CostSummaryCard({ costs, loading }) {
  if (loading) {
    return (
      <div className="panel p-6 animate-pulse">
        <div className="h-6 w-1/3 bg-surface-raised rounded-lg mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-surface-raised rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!costs) {
    return (
      <div className="panel p-10 flex flex-col items-center justify-center text-center">
        <DollarSign className="w-12 h-12 text-text-secondary opacity-30 mb-3" />
        <p className="text-text-secondary font-medium">Select a vehicle to view its cost summary.</p>
      </div>
    );
  }

  const formatCost = (val) => `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="panel p-6">
      <h3 className="text-lg font-bold font-display text-text-primary mb-6">Vehicle Cost Summary</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Operational Cost */}
        <div className="bg-[#121F38] border border-accent-signal/30 p-5 rounded-2xl flex flex-col shadow-lg shadow-accent-signal/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-accent-signal/10 rounded-lg text-accent-signal">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Total Ops Cost</span>
          </div>
          <span className="text-3xl font-mono font-bold text-text-primary">{formatCost(costs.operationalCost)}</span>
        </div>

        {/* Fuel Total */}
        <div className="bg-[#121F38] border border-app-border p-5 rounded-2xl flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-status-dispatched/10 rounded-lg text-status-dispatched">
              <Droplet className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Fuel Cost</span>
          </div>
          <span className="text-2xl font-mono font-bold text-text-primary">{formatCost(costs.fuelTotal)}</span>
        </div>

        {/* Maintenance Total */}
        <div className="bg-[#121F38] border border-app-border p-5 rounded-2xl flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-status-shop/10 rounded-lg text-status-shop">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Maintenance</span>
          </div>
          <span className="text-2xl font-mono font-bold text-text-primary">{formatCost(costs.maintenanceTotal)}</span>
        </div>

        {/* Expense Total */}
        <div className="bg-[#121F38] border border-app-border p-5 rounded-2xl flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-status-available/10 rounded-lg text-status-available">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Other Expenses</span>
          </div>
          <span className="text-2xl font-mono font-bold text-text-primary">{formatCost(costs.expenseTotal)}</span>
        </div>

      </div>
    </div>
  );
}
