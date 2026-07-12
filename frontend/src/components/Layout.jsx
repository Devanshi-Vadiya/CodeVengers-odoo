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
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden bg-slate-50">
        <header className="h-20 bg-white/70 backdrop-blur-lg border-b border-slate-200 flex items-center justify-between px-8 shadow-sm relative z-20">
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{roleInfo?.title}</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white bg-${roleInfo?.color || 'blue'}-500`}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
