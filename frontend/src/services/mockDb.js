/**
 * mockDb.js — Shared in-memory state for all mock services.
 * All changes (create/update/delete) are reflected immediately across the app.
 */

// ── Vehicles ─────────────────────────────────────────────────────────────────
export const vehicles = [
  { id: 1, name: 'TRK-001', reg_number: 'GJ-01-AA-1001', type: 'Truck',     status: 'available',    year: 2021, max_capacity: 5000 },
  { id: 2, name: 'TRK-002', reg_number: 'GJ-01-AA-1002', type: 'Truck',     status: 'available',    year: 2020, max_capacity: 4500 },
  { id: 3, name: 'VAN-001', reg_number: 'GJ-01-AB-2001', type: 'Van',       status: 'in_trip',      year: 2022, max_capacity: 1500 },
  { id: 4, name: 'VAN-002', reg_number: 'GJ-01-AB-2002', type: 'Van',       status: 'available',    year: 2023, max_capacity: 1500 },
  { id: 5, name: 'TRK-003', reg_number: 'GJ-01-AC-3001', type: 'Truck',     status: 'maintenance',  year: 2019, max_capacity: 6000 },
  { id: 6, name: 'BUS-001', reg_number: 'GJ-01-AD-4001', type: 'Bus',       status: 'available',    year: 2022, max_capacity: 2000 },
  { id: 7, name: 'TRK-004', reg_number: 'GJ-01-AE-5001', type: 'Truck',     status: 'available',    year: 2021, max_capacity: 5500 },
];

// ── Drivers ──────────────────────────────────────────────────────────────────
export const drivers = [
  { id: 1, name: 'Rajesh Kumar',   license: 'DL-0420110012345', status: 'available',   phone: '9876543210', experience_years: 8 },
  { id: 2, name: 'Suresh Patel',   license: 'DL-0420110012346', status: 'on_trip',     phone: '9876543211', experience_years: 5 },
  { id: 3, name: 'Amit Singh',     license: 'DL-0420110012347', status: 'available',   phone: '9876543212', experience_years: 3 },
  { id: 4, name: 'Priya Sharma',   license: 'DL-0420110012348', status: 'available',   phone: '9876543213', experience_years: 6 },
  { id: 5, name: 'Vijay Verma',    license: 'DL-0420110012349', status: 'off_duty',    phone: '9876543214', experience_years: 10 },
  { id: 6, name: 'Deepak Yadav',   license: 'DL-0420110012350', status: 'available',   phone: '9876543215', experience_years: 4 },
];

// ── Trips ─────────────────────────────────────────────────────────────────────
export const trips = [
  {
    id: 1, source: 'Ahmedabad Depot', destination: 'Surat Warehouse',
    status: 'dispatched', planned_distance: 280, actual_distance: null,
    cargo_weight: 3200, fuel_consumed: null,
    vehicle: { id: 3, name: 'VAN-001', max_capacity: 1500 },
    driver:  { id: 2, name: 'Suresh Patel' },
    created_at: '2026-07-10T08:00:00Z',
  },
  {
    id: 2, source: 'Gandhinagar Hub', destination: 'Vadodara Plant',
    status: 'draft', planned_distance: 120, actual_distance: null,
    cargo_weight: 1800, fuel_consumed: null,
    vehicle: { id: 1, name: 'TRK-001', max_capacity: 5000 },
    driver:  { id: 1, name: 'Rajesh Kumar' },
    created_at: '2026-07-11T09:00:00Z',
  },
  {
    id: 3, source: 'Rajkot Yard', destination: 'Bhavnagar Port',
    status: 'draft', planned_distance: 190, actual_distance: null,
    cargo_weight: 4100, fuel_consumed: null,
    vehicle: { id: 2, name: 'TRK-002', max_capacity: 4500 },
    driver:  { id: 3, name: 'Amit Singh' },
    created_at: '2026-07-12T07:30:00Z',
  },
  {
    id: 4, source: 'Mehsana Cold Store', destination: 'Anand Factory',
    status: 'completed', planned_distance: 95, actual_distance: 98,
    cargo_weight: 900, fuel_consumed: 14,
    vehicle: { id: 4, name: 'VAN-002', max_capacity: 1500 },
    driver:  { id: 4, name: 'Priya Sharma' },
    created_at: '2026-07-09T06:00:00Z',
  },
  {
    id: 5, source: 'Jamnagar Terminal', destination: 'Morbi Unit',
    status: 'cancelled', planned_distance: 65, actual_distance: null,
    cargo_weight: 600, fuel_consumed: null,
    vehicle: { id: 6, name: 'BUS-001', max_capacity: 2000 },
    driver:  { id: 6, name: 'Deepak Yadav' },
    created_at: '2026-07-08T10:00:00Z',
  },
  {
    id: 6, source: 'Surat Port', destination: 'Mumbai Gateway',
    status: 'draft', planned_distance: 310, actual_distance: null,
    cargo_weight: 5200, fuel_consumed: null,
    vehicle: { id: 7, name: 'TRK-004', max_capacity: 5500 },
    driver:  { id: 1, name: 'Rajesh Kumar' },
    created_at: '2026-07-12T10:00:00Z',
  },
];

// ── Maintenance ───────────────────────────────────────────────────────────────
export const maintenance = [
  {
    id: 1, vehicle_id: 5, vehicle: { id: 5, name: 'TRK-003', reg_number: 'GJ-01-AC-3001' },
    type: 'repair', description: 'Engine overhaul — cylinder head gasket replacement',
    status: 'open', scheduled_date: '2026-07-08', closing_notes: null,
    opened_at: '2026-07-08T08:00:00Z', cost: 1200, priority: 'High',
  },
  {
    id: 2, vehicle_id: 1, vehicle: { id: 1, name: 'TRK-001', reg_number: 'GJ-01-AA-1001' },
    type: 'inspection', description: 'Annual safety inspection and brake check',
    status: 'open', scheduled_date: '2026-07-10', closing_notes: null,
    opened_at: '2026-07-08T09:00:00Z', cost: 450, priority: 'Medium',
  },
  {
    id: 3, vehicle_id: 4, vehicle: { id: 4, name: 'VAN-002', reg_number: 'GJ-01-AB-2002' },
    type: 'routine', description: 'Oil change and filter replacement (40,000 km service)',
    status: 'closed', scheduled_date: '2026-07-05', closing_notes: 'Completed — all filters replaced.',
    opened_at: '2026-07-05T07:00:00Z', cost: 120, priority: 'Low',
  },
  {
    id: 4, vehicle_id: 2, vehicle: { id: 2, name: 'TRK-002', reg_number: 'GJ-01-AA-1002' },
    type: 'inspection', description: 'Tyre pressure and alignment check',
    status: 'open', scheduled_date: '2026-07-14', closing_notes: null,
    opened_at: '2026-07-12T06:00:00Z', cost: 80, priority: 'Medium',
  },
];

// ── Fuel Logs ─────────────────────────────────────────────────────────────────
export const fuelLogs = [
  { id: 1, vehicle_id: 1, vehicle: { id: 1, name: 'TRK-001' }, liters: 80,  cost_per_liter: 93.5, total_cost: 7480, date: '2026-07-01' },
  { id: 2, vehicle_id: 3, vehicle: { id: 3, name: 'VAN-001' }, liters: 45,  cost_per_liter: 93.5, total_cost: 4207, date: '2026-07-03' },
  { id: 3, vehicle_id: 2, vehicle: { id: 2, name: 'TRK-002' }, liters: 95,  cost_per_liter: 94.0, total_cost: 8930, date: '2026-07-07' },
  { id: 4, vehicle_id: 7, vehicle: { id: 7, name: 'TRK-004' }, liters: 70,  cost_per_liter: 93.5, total_cost: 6545, date: '2026-07-10' },
];

// ── Expenses ──────────────────────────────────────────────────────────────────
export const expenses = [
  { id: 1, vehicle_id: 1, vehicle: { id: 1, name: 'TRK-001' }, type: 'toll',     amount: 850,  date: '2026-07-02', description: 'NH-48 tolls' },
  { id: 2, vehicle_id: 3, vehicle: { id: 3, name: 'VAN-001' }, type: 'parking',  amount: 300,  date: '2026-07-04', description: 'Surat warehouse parking' },
  { id: 3, vehicle_id: 2, vehicle: { id: 2, name: 'TRK-002' }, type: 'other',    amount: 1200, date: '2026-07-08', description: 'Driver daily allowance' },
];

let nextId = { vehicles: 8, drivers: 7, trips: 7, maintenance: 5, fuelLogs: 5, expenses: 4 };

// ── Helper to simulate network delay ─────────────────────────────────────────
export const delay = (ms = 250) => new Promise(r => setTimeout(r, ms));

// ── ID generator ──────────────────────────────────────────────────────────────
export const nextIdFor = (key) => nextId[key]++;
