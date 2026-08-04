import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, MapPin, Truck, User, Scale, Navigation, Plus } from 'lucide-react';
import { useVehicles } from '../../hooks/useVehicles';
import { useDrivers } from '../../hooks/useDrivers';
import tripService from '../../services/tripService';

const EMPTY_FORM = {
  source: '',
  destination: '',
  vehicle_id: '',
  driver_id: '',
  cargo_weight: '',
  planned_distance: '',
};

export default function TripForm({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch available vehicles and drivers
  const { vehicles } = useVehicles();
  const { drivers } = useDrivers();
  const availableVehicles = vehicles.filter(v => v.status === 'available');
  const availableDrivers = drivers.filter(d => d.status === 'available' && !d.isLicenseExpired);

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.source.trim()) e.source = 'Source location is required';
    if (!form.destination.trim()) e.destination = 'Destination is required';
    if (!form.vehicle_id) e.vehicle_id = 'Please select an available vehicle';
    if (!form.driver_id) e.driver_id = 'Please select an available driver';
    if (!form.cargo_weight || Number(form.cargo_weight) <= 0) e.cargo_weight = 'Valid cargo weight required';
    if (!form.planned_distance || Number(form.planned_distance) <= 0) e.planned_distance = 'Valid distance required';

    // Client-side pre-check for capacity
    if (form.vehicle_id && form.cargo_weight) {
      const selectedVehicle = availableVehicles.find(v => v.id === Number(form.vehicle_id));
      if (selectedVehicle && Number(form.cargo_weight) > selectedVehicle.max_capacity) {
        e.cargo_weight = `Exceeds max capacity (${selectedVehicle.max_capacity} kg)`;
      }
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) { setErrors(ve); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        vehicle_id: Number(form.vehicle_id),
        driver_id: Number(form.driver_id),
        cargo_weight: Number(form.cargo_weight),
        planned_distance: Number(form.planned_distance),
      };
      await tripService.create(payload);
      onSuccess('Trip created successfully as Draft');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create trip.';
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedVehicle = availableVehicles.find(v => v.id === Number(form.vehicle_id));

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Full-screen Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 animate-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DCFCE7' }}>
              <Plus className="w-5 h-5" style={{ color: '#22C55E' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#0F172A' }}>Create New Trip</h2>
              <p className="text-xs" style={{ color: '#64748B' }}>Draft a new trip and assign available resources.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errors.form && (
            <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200/80 rounded-xl text-red-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Route Info Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Source Depot / Port" icon={MapPin} error={errors.source}>
              <input
                name="source"
                value={form.source}
                onChange={handleChange}
                placeholder="e.g. Ahmedabad Depot"
                className={inputStyle(errors.source)}
              />
            </Field>
            <Field label="Destination Hub" icon={Navigation} error={errors.destination}>
              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="e.g. Surat Warehouse"
                className={inputStyle(errors.destination)}
              />
            </Field>
          </div>

          {/* Vehicle Assignment */}
          <Field label="Assign Vehicle" icon={Truck} error={errors.vehicle_id}>
            <select
              name="vehicle_id"
              value={form.vehicle_id}
              onChange={handleChange}
              className={inputStyle(errors.vehicle_id)}
            >
              <option value="">Select available vehicle…</option>
              {availableVehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.reg_number}) — Max {v.max_capacity} kg
                </option>
              ))}
            </select>
            {selectedVehicle && (
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                Max load limit: <strong>{selectedVehicle.max_capacity} kg</strong>
              </p>
            )}
          </Field>

          {/* Driver Assignment */}
          <Field label="Assign Driver" icon={User} error={errors.driver_id}>
            <select
              name="driver_id"
              value={form.driver_id}
              onChange={handleChange}
              className={inputStyle(errors.driver_id)}
            >
              <option value="">Select available driver…</option>
              {availableDrivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} (License: {d.license || d.license_number})
                </option>
              ))}
            </select>
          </Field>

          {/* Metrics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Cargo Weight (kg)" icon={Scale} error={errors.cargo_weight}>
              <input
                name="cargo_weight"
                type="number"
                min="1"
                value={form.cargo_weight}
                onChange={handleChange}
                placeholder="e.g. 1500"
                className={inputStyle(errors.cargo_weight)}
              />
            </Field>
            <Field label="Planned Distance (km)" icon={Navigation} error={errors.planned_distance}>
              <input
                name="planned_distance"
                type="number"
                min="1"
                value={form.planned_distance}
                onChange={handleChange}
                placeholder="e.g. 280"
                className={inputStyle(errors.planned_distance)}
              />
            </Field>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? 'Creating…' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

function Field({ label, icon: Icon, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-red-600">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

function inputStyle(hasError) {
  return `w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all ${
    hasError
      ? 'border-red-300 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-200'
      : 'border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/15'
  }`;
}
