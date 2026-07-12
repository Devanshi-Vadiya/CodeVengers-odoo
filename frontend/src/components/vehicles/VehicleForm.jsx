import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import vehicleService from '../../services/vehicleService';

const VEHICLE_TYPES = ['Truck', 'Van', 'Sedan', 'SUV', 'Pickup', 'Bus', 'Motorcycle'];

const EMPTY_FORM = {
  reg_number: '',
  name: '',
  type: '',
  max_capacity: '',
  odometer: '',
  acquisition_cost: '',
};

export default function VehicleForm({ isOpen, onClose, vehicle, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!vehicle;

  useEffect(() => {
    if (isOpen) {
      setForm(vehicle ? {
        reg_number: vehicle.reg_number ?? '',
        name: vehicle.name ?? '',
        type: vehicle.type ?? '',
        max_capacity: vehicle.max_capacity ?? '',
        odometer: vehicle.odometer ?? '',
        acquisition_cost: vehicle.acquisition_cost ?? '',
      } : EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen, vehicle]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.reg_number.trim()) e.reg_number = 'Registration number is required';
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.type) e.type = 'Type is required';
    if (!form.max_capacity || Number(form.max_capacity) <= 0) e.max_capacity = 'Capacity must be greater than 0';
    if (form.odometer === '' || Number(form.odometer) < 0) e.odometer = 'Odometer must be 0 or more';
    if (!form.acquisition_cost || Number(form.acquisition_cost) <= 0) e.acquisition_cost = 'Acquisition cost must be greater than 0';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    // clear field-level error on change
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        max_capacity: Number(form.max_capacity),
        odometer: Number(form.odometer),
        acquisition_cost: Number(form.acquisition_cost),
      };
      if (isEditing) {
        await vehicleService.update(vehicle.id, payload);
        onSuccess('Vehicle updated successfully');
      } else {
        await vehicleService.create(payload);
        onSuccess('Vehicle registered successfully');
      }
      onClose();
    } catch (err) {
      const code = err.response?.data?.code;
      const msg = err.response?.data?.message;
      if (err.response?.status === 409 || code === 'REG_NUMBER_EXISTS') {
        setErrors(er => ({ ...er, reg_number: msg || 'Registration number already exists' }));
      } else {
        setErrors({ form: msg || 'Something went wrong. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative h-full w-full max-w-lg bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Vehicle' : 'Register New Vehicle'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEditing ? 'Update vehicle details below.' : 'Fill in the details to register a vehicle.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errors.form && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {errors.form}
            </div>
          )}

          <Field label="Registration Number" error={errors.reg_number}>
            <input
              name="reg_number"
              value={form.reg_number}
              onChange={handleChange}
              disabled={isEditing}
              placeholder="e.g. TN-01-AB-1234"
              className={inputCls(errors.reg_number, isEditing)}
            />
          </Field>

          <Field label="Vehicle Name" error={errors.name}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Van-05"
              className={inputCls(errors.name)}
            />
          </Field>

          <Field label="Type" error={errors.type}>
            <select name="type" value={form.type} onChange={handleChange} className={inputCls(errors.type)}>
              <option value="">Select type…</option>
              {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Max Capacity (kg)" error={errors.max_capacity}>
              <input
                name="max_capacity"
                type="number"
                min="1"
                value={form.max_capacity}
                onChange={handleChange}
                placeholder="500"
                className={inputCls(errors.max_capacity)}
              />
            </Field>

            <Field label="Odometer (km)" error={errors.odometer}>
              <input
                name="odometer"
                type="number"
                min="0"
                value={form.odometer}
                onChange={handleChange}
                placeholder="0"
                className={inputCls(errors.odometer)}
              />
            </Field>
          </div>

          <Field label="Acquisition Cost ($)" error={errors.acquisition_cost}>
            <input
              name="acquisition_cost"
              type="number"
              min="1"
              step="0.01"
              value={form.acquisition_cost}
              onChange={handleChange}
              placeholder="25000"
              className={inputCls(errors.acquisition_cost)}
            />
          </Field>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {submitting ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
            ) : (isEditing ? 'Save Changes' : 'Register Vehicle')}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasError, disabled) {
  return [
    'w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all outline-none',
    hasError
      ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-300'
      : 'border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400',
    disabled ? 'opacity-60 cursor-not-allowed' : '',
  ].join(' ');
}
