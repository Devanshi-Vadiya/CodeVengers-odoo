import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SIDEBAR_ITEMS } from '../constants/sidebarItems';
import { Car, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { role, logout } = useAuth();
  const location = useLocation();

  const navigation = SIDEBAR_ITEMS[role] || [];

  return (
    <aside className="w-72 flex-shrink-0 bg-slate-900 text-white flex flex-col shadow-2xl relative z-20">
      <div className="h-20 flex items-center px-8 border-b border-white/10 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            TransitOps
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
              )}
              <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
}
