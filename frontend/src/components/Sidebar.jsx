import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SIDEBAR_ITEMS } from '../constants/sidebarItems';

const ACCENT = '#22C55E';
const ACCENT_BG = '#DCFCE7';
const ACCENT_TEXT = '#16A34A';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const navItems = SIDEBAR_ITEMS[role] ?? [];

  return (
    <aside
      className="w-60 flex flex-col shrink-0 font-sans z-20 select-none"
      style={{
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        boxShadow: '2px 0 8px rgba(15,23,42,0.04)',
      }}
    >
      {/* Navigation items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto flex flex-col gap-1.5">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (pathname === '/' && item.href === '/dashboard');

          return (
            <Link
              key={item.href}
              to={item.href}
              className="w-full h-11 px-3 rounded-xl flex items-center gap-3 transition-all duration-150 focus:outline-none"
              style={
                isActive
                  ? {
                      backgroundColor: ACCENT_BG,
                      color: ACCENT_TEXT,
                      boxShadow: '0 2px 6px rgba(34,197,94,0.15)',
                    }
                  : {
                      color: '#64748B',
                    }
              }
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.color = '#0F172A';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#64748B';
                }
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150"
                style={
                  isActive
                    ? { backgroundColor: ACCENT, color: '#FFFFFF' }
                    : { backgroundColor: 'transparent' }
                }
              >
                {Icon && <Icon className="w-4 h-4" />}
              </div>
              <span className="text-sm font-semibold truncate tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button at bottom */}
      <div style={{ borderTop: '1px solid #E2E8F0' }} className="p-3">
        <button
          onClick={handleLogout}
          aria-label="Sign Out"
          className="w-full h-11 px-3 rounded-xl flex items-center gap-3 transition-all focus:outline-none"
          style={{ color: '#94A3B8' }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#FEF2F2';
            e.currentTarget.style.color = '#EF4444';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#94A3B8';
          }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold truncate tracking-tight">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
