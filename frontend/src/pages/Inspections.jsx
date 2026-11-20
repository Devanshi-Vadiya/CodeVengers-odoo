import { useState } from 'react';
import { CheckSquare, ShieldAlert, CheckCircle2, AlertTriangle, Truck, Save, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useVehicles } from '../hooks/useVehicles';
import maintenanceService from '../services/maintenanceService';

const CHECKLIST_ITEMS = [
  { id: 'brakes', label: 'Brake Pads & Hydraulics', description: 'Check pedal resistance and brake fluid level' },
  { id: 'tires', label: 'Tire Pressure & Tread Depth', description: 'Inspect for minimum 3mm tread and no punctures' },
  { id: 'lights', label: 'Headlights, Indicators & Brake Lights', description: 'Ensure all high/low beams and hazard signals work' },
  { id: 'fluids', label: 'Engine Oil, Coolant & Transmission Fluid', description: 'Verify levels are within operational limits' },
  { id: 'wipers', label: 'Windshield & Wiper Blades', description: 'Check for glass cracks and smooth wiper clearance' },
  { id: 'emergency', label: 'Emergency Kit & Fire Extinguisher', description: 'Confirm safety triangles and charged extinguisher on board' },
];

export default function Inspections() {
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [checklist, setChecklist] = useState({
    brakes: true,
    tires: true,
    lights: true,
    fluids: true,
    wipers: true,
    emergency: true,
  });
  const [odometer, setOdometer] = useState('');
  const [inspectorNotes, setInspectorNotes] = useState('');
  const [autoFlagMaintenance, setAutoFlagMaintenance] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedVehicle = vehicles.find(v => v.id === Number(selectedVehicleId));
  const failedItems = CHECKLIST_ITEMS.filter(item => !checklist[item.id]);
  const isPassed = failedItems.length === 0;

  const toggleItem = (id) => {
    setChecklist(prev => {
      const next = { ...prev, [id]: !prev[id] };
      // If any item failed, suggest auto-flagging maintenance
      const willFail = Object.values(next).some(v => v === false);
      if (willFail) setAutoFlagMaintenance(true);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicleId) {
      toast.error('Please select a vehicle to inspect');
      return;
    }

    setSubmitting(true);
    try {
      // Store inspection record in local storage / mock history
      const inspectionRecord = {
        id: Date.now(),
        vehicle_id: Number(selectedVehicleId),
        vehicle_name: selectedVehicle?.name || `Vehicle ${selectedVehicleId}`,
        reg_number: selectedVehicle?.reg_number || 'N/A',
        odometer: odometer || selectedVehicle?.odometer || 0,
        result: isPassed ? 'PASSED' : 'FAILED',
        defects: failedItems.map(f => f.label),
        notes: inspectorNotes,
        date: new Date().toISOString(),
      };

      const past = JSON.parse(localStorage.getItem('inspectionHistory') || '[]');
      past.unshift(inspectionRecord);
      localStorage.setItem('inspectionHistory', JSON.stringify(past));

      // If failed and autoFlagMaintenance is checked, open maintenance ticket!
      if (!isPassed && autoFlagMaintenance) {
        await maintenanceService.create({
          vehicle_id: Number(selectedVehicleId),
          description: `Safety Inspection Failure: ${failedItems.map(f => f.label).join(', ')}. Notes: ${inspectorNotes || 'Flagged by Safety Officer'}`,
          priority: 'High',
          cost: 0,
        });
        toast.success(`Vehicle inspection logged: FAILED. Maintenance ticket automatically created.`);
      } else {
        toast.success(`Vehicle inspection successfully logged: ${isPassed ? 'PASSED' : 'FAILED'}`);
      }

      // Reset form
      setInspectorNotes('');
      setOdometer('');
      setChecklist({
        brakes: true,
        tires: true,
        lights: true,
        fluids: true,
        wipers: true,
        emergency: true,
      });
      setAutoFlagMaintenance(false);
    } catch (err) {
      toast.error('Failed to save inspection: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <CheckSquare className="w-6 h-6 text-[#22C55E]" />
          Vehicle Safety <span className="text-[#22C55E]">Inspection</span>
        </h1>
        <p className="text-sm mt-1 text-slate-500">
          Conduct standard safety compliance checks before and after dispatch runs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Selection & Metadata */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">1. Select Target Vehicle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Vehicle on Roster
              </label>
              <select
                value={selectedVehicleId}
                onChange={e => {
                  setSelectedVehicleId(e.target.value);
                  const v = vehicles.find(veh => veh.id === Number(e.target.value));
                  if (v?.odometer) setOdometer(v.odometer);
                }}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-[#22C55E] outline-none"
              >
                <option value="">Select a vehicle...</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.reg_number} — {v.name} ({v.type}) [{v.status}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Current Odometer (km)
              </label>
              <input
                type="number"
                value={odometer}
                onChange={e => setOdometer(e.target.value)}
                placeholder="e.g. 54200"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:bg-white focus:border-[#22C55E] outline-none"
              />
            </div>
          </div>
        </div>

        {/* 6-Point Inspection Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">2. Pre-Dispatch 6-Point Checklist</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              isPassed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {isPassed ? 'Status: All Items Passed' : `Status: ${failedItems.length} Defect(s) Found`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {CHECKLIST_ITEMS.map(item => {
              const passed = checklist[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    passed
                      ? 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50/80'
                      : 'bg-red-50/40 border-red-200 hover:bg-red-50/80'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    passed ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {passed ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${passed ? 'text-slate-900' : 'text-red-900'}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                    <span className={`inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider ${
                      passed ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                      {passed ? 'Passed ✓' : 'Defect Reported ✗'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes & Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">3. Inspector Comments &amp; Corrective Action</h2>
          <div>
            <textarea
              rows={3}
              value={inspectorNotes}
              onChange={e => setInspectorNotes(e.target.value)}
              placeholder="Record any observation, tire wear details, or defect notes..."
              className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-[#22C55E] outline-none"
            />
          </div>

          {!isPassed && (
            <label className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={autoFlagMaintenance}
                onChange={e => setAutoFlagMaintenance(e.target.checked)}
                className="w-4 h-4 accent-amber-600 rounded"
              />
              <span className="text-sm font-semibold text-amber-900">
                Immediately pull vehicle from dispatch and open High-Priority Maintenance Ticket
              </span>
            </label>
          )}

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`btn-primary ${!isPassed ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Recording...' : isPassed ? 'Log Inspection as Passed' : 'Submit Inspection with Defect Log'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
