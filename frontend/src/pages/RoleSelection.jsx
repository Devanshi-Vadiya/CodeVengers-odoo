import { useNavigate } from 'react-router-dom';
import { ROLE_DETAILS } from '../constants/roles';
import { Car, Users, ShieldCheck, TrendingUp, ChevronRight } from 'lucide-react';

const iconMap = {
  manager: Car,
  driver: Users,
  safety: ShieldCheck,
  analyst: TrendingUp
};

const bgColors = {
  manager: 'bg-blue-500',
  driver: 'bg-emerald-500',
  safety: 'bg-orange-500',
  analyst: 'bg-purple-500'
};

const hoverBorders = {
  manager: 'hover:border-blue-400 hover:shadow-blue-500/20',
  driver: 'hover:border-emerald-400 hover:shadow-emerald-500/20',
  safety: 'hover:border-orange-400 hover:shadow-orange-500/20',
  analyst: 'hover:border-purple-400 hover:shadow-purple-500/20'
};

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-5xl animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30 mb-6">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            TransitOps
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium">
            Choose your workspace to continue. Your dashboard will be tailored to your responsibilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(ROLE_DETAILS).map((role) => {
            const Icon = iconMap[role.id];
            
            return (
              <button
                key={role.id}
                onClick={() => navigate(`/login/${role.id}`)}
                className={`group relative text-left bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${hoverBorders[role.id]} overflow-hidden`}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className={`w-14 h-14 rounded-2xl ${bgColors[role.id]} flex items-center justify-center shadow-lg mb-6 transition-transform group-hover:scale-110 group-active:scale-95`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-8 h-10">
                  {role.description}
                </p>
                
                <div className="flex items-center text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                  Continue securely
                  <ChevronRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
