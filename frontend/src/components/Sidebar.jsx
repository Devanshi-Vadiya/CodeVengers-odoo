import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SIDEBAR_ITEMS } from '../constants/sidebarItems';
import { ROLES } from '../constants/roles';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = SIDEBAR_ITEMS[role] || [];
  const roleName = Object.keys(ROLES).find(key => ROLES[key] === role) || 'User';

  return (
    <aside className="w-72 bg-surface border-r border-surface-raised flex flex-col shrink-0 font-sans">
      
      {/* Brand Header */}
      <div className="h-20 px-8 flex items-center gap-3 border-b border-surface-raised">
        <div className="w-8 h-8 rounded bg-accent-signal flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Car className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-text-primary tracking-tight">TransitOps</h1>
          <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">{roleName}</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
          
          return (
            <Link 
              key={item.href} 
              to={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-lg transition-all font-medium text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-signal/50 ${
                isActive 
                  ? 'bg-surface-raised text-text-primary' 
                  : 'text-text-secondary hover:bg-surface-raised/50 hover:text-text-primary'
              }`}
            >
              {Icon && <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-accent-signal' : 'text-text-secondary'}`} />}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-surface-raised">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-text-secondary hover:bg-surface-raised hover:text-red-400 transition-colors font-medium text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-signal/50"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
