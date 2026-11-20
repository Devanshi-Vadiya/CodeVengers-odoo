import { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Server, Database, Shield, Sliders, 
  RefreshCw, CheckCircle2, AlertTriangle, Save, Globe, Cpu, User, 
  Lock, RotateCcw, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ROLE_DETAILS } from '../constants/roles';
import settingsService from '../services/settingsService';

export default function Settings() {
  const { user, role } = useAuth();
  const roleInfo = ROLE_DETAILS?.[role] ?? {};

  const [activeTab, setActiveTab] = useState('connection'); // 'connection', 'fleet', 'profile', 'diagnostics'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    online: false,
    latency: null,
    dbStatus: 'unknown',
    url: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  });

  const [formData, setFormData] = useState({
    companyName: 'TransitOps Fleet Logistics',
    fuelPricePerLiter: 1.50,
    defaultPerKmRate: 2.50,
    minSafetyScore: 75,
    maintenanceAlertDays: 7,
    speedLimitKmh: 90,
    systemMode: 'hybrid',
    notificationEmail: 'fleet-admin@transitops.com',
    enableAiPredictions: true,
    enableSmsAlerts: false,
  });

  const [apiUrl, setApiUrl] = useState(
    localStorage.getItem('custom_api_url') || import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  );

  useEffect(() => {
    loadSettings();
    pingBackend();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsService.getSettings();
      if (res.data?.settings) {
        setFormData(prev => ({ ...prev, ...res.data.settings }));
      }
      if (res.data?.backendStatus) {
        setConnectionStatus(prev => ({
          ...prev,
          online: res.data.backendStatus.status === 'online',
          dbStatus: res.data.backendStatus.dbStatus || 'offline',
        }));
      }
    } catch {
      // Fallback loaded from storage
    } finally {
      setLoading(false);
    }
  };

  const pingBackend = async () => {
    setTestingConnection(true);
    const start = performance.now();
    try {
      const health = await settingsService.checkHealth();
      const end = performance.now();
      const roundTrip = Math.round(end - start);

      if (health.online) {
        setConnectionStatus({
          online: true,
          latency: roundTrip,
          dbStatus: health.data?.data?.dbStatus || 'connected',
          url: apiUrl
        });
        toast.success(`Backend reached in ${roundTrip}ms`);
      } else {
        setConnectionStatus({
          online: false,
          latency: null,
          dbStatus: 'offline',
          url: apiUrl
        });
        toast.error('Backend server is currently offline or unreachable.');
      }
    } catch {
      setConnectionStatus({
        online: false,
        latency: null,
        dbStatus: 'offline',
        url: apiUrl
      });
      toast.error('Could not connect to backend.');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveApiUrl = () => {
    localStorage.setItem('custom_api_url', apiUrl);
    toast.success('API endpoint updated. Testing connection...');
    pingBackend();
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await settingsService.updateSettings(formData);
      if (res.offlineSaved) {
        toast.success('Settings saved to local storage (Backend offline).');
      } else {
        toast.success('Settings updated and synced with backend successfully!');
      }
    } catch (err) {
      toast.error('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-[#22C55E]" />
            System & Fleet <span className="text-[#22C55E]">Settings</span>
          </h1>
          <p className="text-sm mt-1 text-slate-500">
            Configure backend connection, fleet thresholds, operational business rules, and system profile.
          </p>
        </div>

        {/* Live Backend Status Pill */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            connectionStatus.online 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
              : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${connectionStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {connectionStatus.online 
              ? `Backend Connected (${connectionStatus.latency ?? '<50'}ms)` 
              : 'Hybrid Mode (Fallback Ready)'}
          </div>
          <button 
            onClick={pingBackend} 
            disabled={testingConnection}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            title="Refresh Connection"
          >
            <RefreshCw className={`w-4 h-4 ${testingConnection ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('connection')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'connection'
              ? 'border-[#22C55E] text-[#16A34A]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          Backend & API Connection
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'fleet'
              ? 'border-[#22C55E] text-[#16A34A]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Fleet Rules & Pricing
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-[#22C55E] text-[#16A34A]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          Role & Access Info
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'diagnostics'
              ? 'border-[#22C55E] text-[#16A34A]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          Diagnostics & Maintenance
        </button>
      </div>

      {/* ── TAB 1: Backend Connection ── */}
      {activeTab === 'connection' && (
        <div className="space-y-6">
          {/* Status Banner */}
          <div className={`p-5 rounded-2xl border ${
            connectionStatus.online 
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50/60 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl ${connectionStatus.online ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {connectionStatus.online ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold">
                  {connectionStatus.online ? 'Backend Service Connected & Active' : 'Backend Running in Hybrid Fallback Mode'}
                </h3>
                <p className="text-sm mt-1 text-slate-600">
                  {connectionStatus.online 
                    ? 'The frontend is actively communicating with the Express API and PostgreSQL database. Live queries and transactions are synced.'
                    : 'The frontend could not reach the Express server on localhost:5000 or the remote URL. The system seamlessly preserves local workflows and mock data so operations never stop.'}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
                  <span className="px-2.5 py-1 bg-white/80 rounded-md border border-slate-200">
                    Target: <strong>{connectionStatus.url}</strong>
                  </span>
                  <span className="px-2.5 py-1 bg-white/80 rounded-md border border-slate-200">
                    Database: <strong>{connectionStatus.dbStatus}</strong>
                  </span>
                  {connectionStatus.latency && (
                    <span className="px-2.5 py-1 bg-white/80 rounded-md border border-slate-200">
                      Ping: <strong>{connectionStatus.latency}ms</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* API Endpoint Configuration */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">API Base Endpoint Configuration</h3>
            <p className="text-sm text-slate-500 mb-5">
              Specify the Express backend API URL. In local development this is usually <code>http://localhost:5000/api</code>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={apiUrl}
                  onChange={e => setApiUrl(e.target.value)}
                  placeholder="http://localhost:5000/api"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:bg-white focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveApiUrl}
                disabled={testingConnection}
                className="btn-primary shrink-0"
              >
                <Save className="w-4 h-4" /> Apply &amp; Test
              </button>
            </div>
          </div>

          {/* Quick Setup Instructions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">How to Run the Backend Locally</h3>
            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs space-y-2 overflow-x-auto">
              <p className="text-slate-400"># Navigate to backend directory and start the server</p>
              <p><span className="text-emerald-400">cd</span> backend</p>
              <p><span className="text-emerald-400">npm</span> run dev</p>
              <p className="text-slate-400 mt-2"># Server will listen on http://localhost:5000</p>
              <p className="text-slate-400"># Health endpoint: http://localhost:5000/api/health</p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Fleet Rules & Pricing ── */}
      {activeTab === 'fleet' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Fleet Operations &amp; Business Rules</h3>
              <p className="text-sm text-slate-500">Configure core formulas for ROI calculations, speed caps, and safety flags.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-[#22C55E] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Revenue Rate ($ per KM)
                </label>
                <input
                  type="number"
                  step="0.10"
                  min="0.10"
                  value={formData.defaultPerKmRate}
                  onChange={e => setFormData({ ...formData, defaultPerKmRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:bg-white focus:border-[#22C55E] outline-none"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Used by ROI calculation engine: Revenue = Distance × Rate</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Standard Fuel Cost Baseline ($/L)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0.50"
                  value={formData.fuelPricePerLiter}
                  onChange={e => setFormData({ ...formData, fuelPricePerLiter: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:bg-white focus:border-[#22C55E] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Driver Minimum Safety Score Cutoff
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={formData.minSafetyScore}
                  onChange={e => setFormData({ ...formData, minSafetyScore: parseInt(e.target.value) || 75 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:bg-white focus:border-[#22C55E] outline-none"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Drivers below this score will trigger safety alerts</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Maintenance Overdue Threshold (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formData.maintenanceAlertDays}
                  onChange={e => setFormData({ ...formData, maintenanceAlertDays: parseInt(e.target.value) || 7 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:bg-white focus:border-[#22C55E] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Fleet Speed Limit Warning (km/h)
                </label>
                <input
                  type="number"
                  min="40"
                  max="150"
                  value={formData.speedLimitKmh}
                  onChange={e => setFormData({ ...formData, speedLimitKmh: parseInt(e.target.value) || 90 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:bg-white focus:border-[#22C55E] outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── TAB 3: User Role & Access Info ── */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Current Session Profile</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 font-medium">Logged In As</span>
                <p className="text-base font-bold text-slate-800 mt-1">{user?.name || 'Demo User'}</p>
                <p className="text-xs text-slate-500">{user?.email || 'user@demo.com'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 font-medium">Assigned Role</span>
                <p className="text-base font-bold text-slate-800 mt-1 capitalize">{roleInfo?.title || role}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#22C55E]/10 text-[#16A34A]">
                  {role}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 font-medium">Authentication Token</span>
                <p className="text-xs font-mono text-slate-600 mt-2 truncate">
                  {localStorage.getItem('token') ? `${localStorage.getItem('token').slice(0, 24)}...` : 'None (Guest)'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">Role Permissions Matrix</h3>
            <p className="text-sm text-slate-500 mb-4">TransitOps strictly enforces privileges across all 4 system roles:</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Module</th>
                    <th className="p-3">Fleet Manager</th>
                    <th className="p-3">Driver</th>
                    <th className="p-3">Safety Officer</th>
                    <th className="p-3">Financial Analyst</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="p-3 font-medium">Vehicle Registry</td>
                    <td className="p-3 text-emerald-600 font-bold">Full CRUD</td>
                    <td className="p-3 text-slate-400">Assigned View</td>
                    <td className="p-3 text-blue-600">View &amp; Inspect</td>
                    <td className="p-3 text-slate-400">View Costs</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Trip Dispatch Board</td>
                    <td className="p-3 text-emerald-600 font-bold">Create &amp; Dispatch</td>
                    <td className="p-3 text-emerald-600 font-bold">Progress / Complete</td>
                    <td className="p-3 text-slate-400">View Only</td>
                    <td className="p-3 text-slate-400">Reports View</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Maintenance Workflows</td>
                    <td className="p-3 text-emerald-600 font-bold">Full CRUD</td>
                    <td className="p-3 text-slate-400">Report Issue</td>
                    <td className="p-3 text-emerald-600 font-bold">Open &amp; Close Logs</td>
                    <td className="p-3 text-slate-400">View Expenses</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Driver Safety Compliance</td>
                    <td className="p-3 text-emerald-600 font-bold">Manage Roster</td>
                    <td className="p-3 text-slate-400">Own Profile</td>
                    <td className="p-3 text-emerald-600 font-bold">Audit &amp; Suspend</td>
                    <td className="p-3 text-slate-400">—</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Financial &amp; ROI Reports</td>
                    <td className="p-3 text-blue-600">Overview</td>
                    <td className="p-3 text-slate-400">—</td>
                    <td className="p-3 text-slate-400">—</td>
                    <td className="p-3 text-emerald-600 font-bold">Full Analysis &amp; Export</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: Diagnostics ── */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">Data Storage &amp; Engine Diagnostics</h3>
            <p className="text-sm text-slate-500 mb-6">Manage application cache, test response times, or reset test records.</p>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('fleetSettings');
                  localStorage.removeItem('mockUser');
                  toast.success('Local application cache cleared.');
                }}
                className="btn-ghost border border-slate-200"
              >
                <RotateCcw className="w-4 h-4 text-slate-600" />
                Clear Local Cache
              </button>

              <button
                type="button"
                onClick={pingBackend}
                disabled={testingConnection}
                className="btn-primary"
              >
                <Activity className="w-4 h-4" />
                Run Full Health Ping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
