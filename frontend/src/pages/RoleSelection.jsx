import { useNavigate } from 'react-router-dom';
import { ROLE_DETAILS } from '../constants/roles';
import { Car, Users, ShieldCheck, TrendingUp, ChevronRight, ArrowRight } from 'lucide-react';

const iconMap = {
  manager: Car,
  driver: Users,
  safety: ShieldCheck,
  analyst: TrendingUp
};

export default function RoleSelection() {
  const navigate = useNavigate();
  const ACCENT = '#F5A623';
  const NAVY = '#1C2333';

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1C2333] flex flex-col font-sans selection:bg-[#F5A623] selection:text-[#1C2333]">
      
      {/* ── HEADER ── */}
      <header className="h-20 px-8 flex items-center justify-between bg-white border-b border-[#E8E2D8]">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
            style={{ backgroundColor: ACCENT }}
          >
            <Car className="w-5 h-5 text-[#1C2333]" />
          </div>
          <span className="font-bold text-xl tracking-tight" style={{ color: NAVY }}>
            TransitOps
          </span>
        </div>
        <div className="text-sm font-medium text-slate-500">
          Enterprise Fleet Management
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#F5A623]/5 to-transparent pointer-events-none" />

        <div className="w-full max-w-5xl relative z-10">
          
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: NAVY }}>
              Welcome to TransitOps
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              Select your designated workspace to access your tailored dashboard, tools, and real-time fleet insights.
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(ROLE_DETAILS).map((role, index) => {
              const Icon = iconMap[role.id];
              
              return (
                <button
                  key={role.id}
                  onClick={() => navigate(`/login/${role.id}`)}
                  className="group text-left bg-white border border-[#E8E2D8] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1C2333]/5 relative overflow-hidden flex flex-col h-full animate-in fade-in zoom-in-95 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Top Accent Bar on Hover */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#F5A623] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                  
                  {/* Icon Container */}
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 transition-colors group-hover:bg-[#F5A623]/10 group-hover:border-[#F5A623]/20">
                    <Icon className="w-6 h-6 text-slate-600 group-hover:text-[#F5A623] transition-colors" />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>{role.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6">
                      {role.description}
                    </p>
                  </div>
                  
                  {/* Action Link */}
                  <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-[#1C2333] transition-colors mt-auto">
                    Access Portal
                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="py-8 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} TransitOps Inc. All rights reserved.</p>
        <p className="mt-1 text-xs text-slate-400">Secure Enterprise Portal</p>
      </footer>

    </div>
  );
}
