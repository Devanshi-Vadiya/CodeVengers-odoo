import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SIDEBAR_ITEMS } from '../constants/sidebarItems';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const navItems = SIDEBAR_ITEMS[role] ?? [];
  
  // Amber brand accent
  const ACCENT = '#F5A623';

  return (
    <aside
      style={{ backgroundColor: '#060D1A', borderRight: '1px solid #22335A' }}
      className="w-64 flex flex-col shrink-0 font-sans z-0"
    >
      {/* Nav */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-0.5">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');

          return (
            <Link
              key={item.href}
              to={item.href}
              style={isActive ? {
                borderLeft: `3px solid ${ACCENT}`,
                color: ACCENT,
                backgroundColor: '#16274A', // Surface elevated, matches header
              } : {
                borderLeft: '3px solid transparent',
                color: '#8B9BB8', // text-secondary
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-r-lg text-sm font-medium transition-all focus:outline-none hover:bg-[#121F38] hover:text-text-primary"
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ borderTop: '1px solid #22335A' }} className="p-3">
        <button
          onClick={handleLogout}
          style={{ color: '#8B9BB8' }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium hover:bg-[#121F38] hover:text-red-400 transition-colors focus:outline-none"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
