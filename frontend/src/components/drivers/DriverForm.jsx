import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, UserPlus, UserCheck } from 'lucide-react';
import driverService from '../../services/driverService';

const LICENSE_CATEGORIES = ['LMV', 'HGV', 'PSV', 'MCWG', 'Transport'];

const EMPTY_FORM = {
  name: '',
  license_number: '',
  license_category: '',
  license_expiry: '',
  contact: '',
  safety_score: '85',
};

export default function DriverForm({ isOpen, onClose, driver, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!driver;

  useEffect(() => {
    if (isOpen) {
      setForm(driver ? {
        name:             driver.name ?? '',
        license_number:   driver.license_number ?? '',
        license_category: driver.license_category ?? '',
        license_expiry:   driver.license_expiry?.split('T')[0] ?? '',
        contact:          driver.contact ?? '',
        safety_score:     driver.safety_score ?? '85',
      } : EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen, driver]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.name.trim())             e.name             = 'Name is required';
    if (!form.license_number.trim())   e.license_number   = 'License number is required';
    if (!form.license_category)        e.license_category = 'Category is required';
    if (!form.license_expiry)          e.license_expiry   = 'Expiry date is required';
    if (!form.contact.trim())          e.contact          = 'Contact is required';
    if (form.safety_score === '' || Number(form.safety_score) < 0 || Number(form.safety_score) > 100)
      e.safety_score = 'Safety score must be between 0 and 100';
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
      const payload = { ...form, safety_score: Number(form.safety_score) };
      if (isEditing) {
        await driverService.update(driver.id, payload);
        onSuccess('Driver updated successfully');
      } else {
        await driverService.create(payload);
        onSuccess('Driver registered successfully');
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message;
      setErrors({ form: msg || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DCFCE7' }}>
              {isEditing ? (
                <UserCheck className="w-5 h-5" style={{ color: '#22C55E' }} />
              ) : (
                <UserPlus className="w-5 h-5" style={{ color: '#22C55E' }} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#0F172A' }}>
                {isEditing ? 'Edit Driver Profile' : 'Register New Driver'}
              </h2>
              <p className="text-xs" style={{ color: '#64748B' }}>
                {isEditing ? 'Update driver information and license details.' : 'Add a driver to your roster and assign safety parameters.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.form && (
            <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200/80 rounded-xl text-red-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          <Field label="Full Name *" error={errors.name}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Rajesh Kumar"
              className={inputCls(errors.name)}
            />
          </Field>

          <Field label="License Number *" error={errors.license_number}>
            <input
              name="license_number"
              value={form.license_number}
              onChange={handleChange}
              placeholder="e.g. DL-0420110012345"
              className={inputCls(errors.license_number)}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="License Category *" error={errors.license_category}>
              <select
                name="license_category"
                value={form.license_category}
                onChange={handleChange}
                className={inputCls(errors.license_category)}
              >
                <option value="">Select category…</option>
                {LICENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </Field>

            <Field label="License Expiry *" error={errors.license_expiry}>
              <input
                name="license_expiry"
                type="date"
                value={form.license_expiry}
                onChange={handleChange}
                className={inputCls(errors.license_expiry)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Contact Phone *" error={errors.contact}>
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className={inputCls(errors.contact)}
              />
            </Field>

            <Field label="Initial Safety Score (0-100)" error={errors.safety_score}>
              <input
                name="safety_score"
                type="number"
                min="0"
                max="100"
                value={form.safety_score}
                onChange={handleChange}
                placeholder="85"
                className={inputCls(errors.safety_score)}
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
              {submitting ? 'Saving…' : (isEditing ? 'Save Changes' : 'Register Driver')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-red-600">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasError) {
  return `w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all ${
    hasError
      ? 'border-red-300 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-200'
      : 'border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/15'
  }`;
}
