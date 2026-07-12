import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import vehicleService from '../../services/vehicleService';

export default function MaintenanceForm({ isOpen, onClose, onSubmit }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    vehicle_id: '',
    description: '',
    cost: '',
    priority: 'Medium'
  });

  useEffect(() => {
    if (isOpen) {
      fetchVehicles();
      setFormData({
        vehicle_id: '',
        description: '',
        cost: '',
        priority: 'Medium'
      });
      setError(null);
    }
  }, [isOpen]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      // Fetch ALL vehicles (not just available), so they can be flagged for maintenance
      let data;
      try {
        data = await vehicleService.getAll();
      } catch (apiErr) {
        // Fallback to mock data if backend is not running
        data = [
          { id: 101, reg_number: 'TRK-001', name: 'Freightliner Cascadia' },
          { id: 102, reg_number: 'TRK-002', name: 'Volvo VNL 860' },
          { id: 103, reg_number: 'TRK-003', name: 'Kenworth T680' }
        ];
      }
      setVehicles(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicle_id || !formData.description || !formData.cost || !formData.priority) {
      setError('Please fill in all fields');
      return;
    }
    onSubmit({
      ...formData,
      vehicle_id: parseInt(formData.vehicle_id)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060D1A]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="panel-elevated w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        <div className="px-6 py-4 border-b border-app-border flex items-center justify-between shrink-0 bg-[#16274A]">
          <h2 className="text-lg font-display font-bold text-text-primary tracking-tight">Log Maintenance</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-[#121F38] transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="bg-status-shop/10 border border-status-shop/20 text-status-shop p-3 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Vehicle</label>
            <select
              value={formData.vehicle_id}
              onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
              className="w-full bg-[#121F38] border border-app-border rounded-xl px-4 py-2.5 text-sm font-medium text-text-primary focus:outline-none focus:border-accent-signal focus:ring-1 focus:ring-accent-signal transition-colors appearance-none"
              disabled={loading}
            >
              <option value="">Select a vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.reg_number} - {v.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full bg-[#121F38] border border-app-border rounded-xl px-4 py-2.5 text-sm font-medium text-text-primary focus:outline-none focus:border-accent-signal focus:ring-1 focus:ring-accent-signal transition-colors appearance-none"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Estimated Cost ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="w-full bg-[#121F38] border border-app-border rounded-xl px-4 py-2.5 text-sm font-medium text-text-primary focus:outline-none focus:border-accent-signal focus:ring-1 focus:ring-accent-signal transition-colors font-mono"
              placeholder="e.g. 500.00"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#121F38] border border-app-border rounded-xl px-4 py-3 text-sm font-medium text-text-primary focus:outline-none focus:border-accent-signal focus:ring-1 focus:ring-accent-signal transition-colors min-h-[100px] resize-none"
              placeholder="Describe the issue or required service..."
            />
          </div>

        </form>

        <div className="px-6 py-4 border-t border-app-border flex items-center justify-end gap-3 shrink-0 bg-[#121F38]">
          <button
            type="button"
            onClick={onClose}
            style={{ color: '#8B9BB8', borderColor: '#22335A' }}
            className="px-4 py-2 rounded-lg text-sm font-semibold border hover:bg-[#16274A] transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{ backgroundColor: '#F5A623', color: '#0A1628' }}
            className="px-4 py-2 rounded-lg text-sm font-bold hover:brightness-110 transition-all active:scale-95 focus:outline-none"
          >
            Log Maintenance
          </button>
        </div>
      </div>
    </div>
  );
}
