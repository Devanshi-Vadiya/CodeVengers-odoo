import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { ROLE_DETAILS } from '../constants/roles';

export default function Layout() {
  const { role, user } = useAuth();
  const location = useLocation();

  const roleInfo = ROLE_DETAILS[role];

  // Derive title from pathname
  const pathName = location.pathname.split('/')[1] || 'dashboard';
  const title = pathName.charAt(0).toUpperCase() + pathName.slice(1).replace('-', ' ');

  return (
    <div className="flex h-screen bg-base text-text-primary overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <header className="h-20 bg-surface border-b border-surface-raised flex items-center justify-between px-8 shadow-sm relative z-20">
          <h2 className="text-xl font-display font-semibold text-text-primary">{title}</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
              <p className="text-xs text-text-secondary capitalize">{roleInfo?.title}</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-surface-raised bg-${roleInfo?.color || 'blue'}-500`}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 relative">
          {/* Subtle glow for the dark background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-signal/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
