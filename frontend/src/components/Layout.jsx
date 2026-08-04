import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import {
  Car, LayoutDashboard, Truck, Users, Map, Wrench,
  DollarSign, BarChart2, Settings, Search, Bell, X,
} from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { ROLE_DETAILS, ROLES } from '../constants/roles';

// Map each route segment → searchable keyword context
const PAGE_META = {
  dashboard:   { label: 'Dashboard',   Icon: LayoutDashboard },
  vehicles:    { label: 'Vehicles',    Icon: Truck           },
  drivers:     { label: 'Drivers',     Icon: Users           },
  trips:       { label: 'Trips',       Icon: Map             },
  maintenance: { label: 'Maintenance', Icon: Wrench          },
  finance:     { label: 'Finance',     Icon: DollarSign      },
  reports:     { label: 'Reports',     Icon: BarChart2       },
  settings:    { label: 'Settings',    Icon: Settings        },
};

// Context-aware placeholder text per page
const SEARCH_PLACEHOLDERS = {
  dashboard:   'Search dashboard…',
  vehicles:    'Search by name, reg number, or status…',
  drivers:     'Search by name or license number…',
  trips:       'Search trips by origin, destination, or status…',
  maintenance: 'Search maintenance logs…',
  finance:     'Search expenses or fuel logs…',
  reports:     'Search reports…',
  settings:    'Search settings…',
};

const ACCENT = '#22C55E';

export default function Layout() {
  const { role, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const roleInfo = ROLE_DETAILS?.[role] ?? {};
  const segment = location.pathname.split('/')[1] || 'dashboard';
  const meta = PAGE_META[segment] ?? {
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    Icon: LayoutDashboard,
  };
  const roleName = Object.keys(ROLES).find(k => ROLES[k] === role) ?? 'User';

  // Expose search query globally via URL param so pages can read it
  const handleSearch = useCallback((val) => {
    setSearchQuery(val);
    const params = new URLSearchParams(location.search);
    if (val.trim()) {
      params.set('q', val.trim());
    } else {
      params.delete('q');
    }
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  }, [location, navigate]);

  const clearSearch = () => handleSearch('');

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div
      className="flex flex-col h-screen overflow-hidden font-sans"
      style={{ background: '#F5F7FA' }}
    >
      {/* ── Global Header ── */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 1px 4px rgba(15,23,42,0.05)',
        }}
        className="h-14 flex items-center shrink-0 z-30 px-4 gap-4"
      >
        {/* Brand logo — same width as sidebar */}
        <div
          className="w-16 flex items-center justify-center shrink-0"
          style={{ borderRight: '1px solid #E2E8F0' }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: ACCENT,
              boxShadow: '0 2px 8px rgba(34,197,94,0.30)',
            }}
          >
            <Car className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* ── Search bar (functional) ── */}
        <div className="flex-1 max-w-xl relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: '#94A3B8' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            placeholder={SEARCH_PLACEHOLDERS[segment] ?? 'Search…'}
            className="w-full pl-10 pr-8 py-2 text-sm rounded-xl outline-none transition-all"
            style={{
              backgroundColor: '#F5F7FA',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
            }}
            onFocus={e => {
              e.target.style.borderColor = ACCENT;
              e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.10)';
              e.target.style.backgroundColor = '#FFFFFF';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#E2E8F0';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#F5F7FA';
            }}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-3 ml-auto">

          {/* Date */}
          <span className="hidden lg:block text-xs text-slate-400 font-medium">{today}</span>

          {/* Operational status pill */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest"
            style={{
              backgroundColor: 'rgba(34,197,94,0.10)',
              color: '#16A34A',
              border: '1px solid rgba(34,197,94,0.25)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            Operational
          </div>

          {/* Notifications bell */}
          <button
            className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors focus:outline-none"
            style={{ color: '#94A3B8' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F0FDF4'; e.currentTarget.style.color = '#16A34A'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}
          >
            <Bell className="w-4 h-4" />
            {/* Notification dot */}
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: '#EF4444', border: '1.5px solid #FFFFFF' }}
            />
          </button>

          {/* User chip */}
          <div className="flex items-center gap-2.5 pl-3" style={{ borderLeft: '1px solid #E2E8F0' }}>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-none" style={{ color: '#0F172A' }}>
                {user?.name}
              </p>
              <p className="text-[11px] mt-0.5 capitalize" style={{ color: '#64748B' }}>
                {roleInfo?.title ?? role}
              </p>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 text-white"
              style={{ backgroundColor: ACCENT }}
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6" style={{ background: '#F5F7FA' }}>
          <div key={location.pathname} className="max-w-7xl mx-auto h-full page-enter">
            <Outlet context={{ searchQuery }} />
          </div>
        </main>
      </div>
    </div>
  );
}
