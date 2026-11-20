import { useNavigate } from 'react-router-dom';
import { Plus, Truck, Wrench, Map, ShieldCheck, BarChart2, DollarSign, PieChart, Car, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isDriver, isSafety, isAnalyst } from '../../constants/roles';

// Fleet Manager: Full operational actions
const MANAGER_ACTIONS = [
  {
    id: 'register-vehicle',
    label: 'Register Vehicle',
    icon: Truck,
    path: '/vehicles',
    accent: '#22C55E',
    description: 'Add a new vehicle to the fleet',
  },
  {
    id: 'create-trip',
    label: 'Create Trip',
    icon: Plus,
    path: '/trips',
    accent: '#3B82F6',
    description: 'Dispatch a new trip assignment',
  },
  {
    id: 'log-maintenance',
    label: 'Log Maintenance',
    icon: Wrench,
    path: '/maintenance',
    accent: '#F59E0B',
    description: 'Flag a vehicle for service',
  },
];

// Drivers: View assigned trips and vehicle info
const DRIVER_ACTIONS = [
  {
    id: 'my-trips',
    label: 'My Trips',
    icon: Map,
    path: '/my-trips',
    accent: '#22C55E',
    description: 'View your assigned trips for today',
  },
  {
    id: 'vehicle-info',
    label: 'My Vehicle',
    icon: Car,
    path: '/vehicle-info',
    accent: '#3B82F6',
    description: 'Inspect assigned vehicle telemetry & specs',
  },
  {
    id: 'driver-profile',
    label: 'Driver Profile',
    icon: User,
    path: '/profile',
    accent: '#8B5CF6',
    description: 'Check license validity and safety scores',
  },
];

// Safety Checker: Focus on maintenance logs, inspections, and safety compliance (NO Register Vehicle / Create Trip)
const SAFETY_ACTIONS = [
  {
    id: 'log-maintenance',
    label: 'Log Maintenance',
    icon: Wrench,
    path: '/maintenance',
    accent: '#F59E0B',
    description: 'Flag a vehicle for service or repair',
  },
  {
    id: 'inspections',
    label: 'Vehicle Inspections',
    icon: ShieldCheck,
    path: '/inspections',
    accent: '#8B5CF6',
    description: 'Run or review vehicle safety checks',
  },
  {
    id: 'safety-reports',
    label: 'Safety Reports',
    icon: BarChart2,
    path: '/safety-reports',
    accent: '#EC4899',
    description: 'View safety audit and compliance data',
  },
];

// Financial Analyst: Focus on financial logs, operational expenses, and ROI reports (NO Register Vehicle / Create Trip)
const ANALYST_ACTIONS = [
  {
    id: 'fleet-finance',
    label: 'Fleet Finance',
    icon: DollarSign,
    path: '/finance',
    accent: '#22C55E',
    description: 'Track fuel costs & operational expenses',
  },
  {
    id: 'expenses',
    label: 'Log Expense',
    icon: PieChart,
    path: '/expenses',
    accent: '#3B82F6',
    description: 'Record non-fuel operational costs',
  },
  {
    id: 'fleet-reports',
    label: 'Fleet Reports',
    icon: BarChart2,
    path: '/reports',
    accent: '#8B5CF6',
    description: 'Analyze vehicle ROI and fuel efficiency',
  },
];

export default function QuickActions() {
  const navigate = useNavigate();
  const { role } = useAuth();

  const actions =
    isDriver(role)  ? DRIVER_ACTIONS  :
    isSafety(role)  ? SAFETY_ACTIONS  :
    isAnalyst(role) ? ANALYST_ACTIONS :
    MANAGER_ACTIONS;

  return (
    <div className="panel p-5">
      <h3 className="text-sm font-bold font-display mb-4" style={{ color: '#0F172A' }}>Quick Actions</h3>
      <div className="flex flex-col gap-3">
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              id={action.id}
              onClick={() => navigate(action.path)}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group text-left hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-signal/30"
              style={{
                backgroundColor: `${action.accent}10`,
                border: `1px solid ${action.accent}28`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${action.accent}20`, color: action.accent }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{action.label}</p>
                <p className="text-[11px] text-text-secondary mt-0.5">{action.description}</p>
              </div>
              <div className="ml-auto text-text-secondary group-hover:text-text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
