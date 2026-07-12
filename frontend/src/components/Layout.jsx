import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { ROLE_DETAILS } from '../constants/roles';

export default function Layout() {
  const { role, user } = useAuth();
  const location = useLocation();

  const roleInfo = ROLE_DETAILS?.[role] ?? {};
  const pathName = location.pathname.split('/')[1] || 'dashboard';
  const title = pathName.charAt(0).toUpperCase() + pathName.slice(1).replace(/-/g, ' ');

  return (
    <div style={{ backgroundColor: '#0D0F14', color: '#F5F6F8' }} className="flex h-screen overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          style={{ backgroundColor: '#161A23', borderColor: '#262B38' }}
          className="h-16 px-8 flex items-center justify-between border-b shrink-0"
        >
          <h2 className="text-base font-display font-semibold text-text-primary capitalize">{title}</h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-text-primary leading-none">{user?.name}</p>
              <p className="text-xs text-text-secondary mt-0.5 capitalize">{roleInfo?.title ?? role}</p>
            </div>
            <div
              style={{ backgroundColor: '#F5A623', color: '#0D0F14' }}
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
