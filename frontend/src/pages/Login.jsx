import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_DETAILS } from '../constants/roles';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock, ArrowLeft, Car, Users, ShieldCheck, TrendingUp } from 'lucide-react';

const iconMap = {
  manager: Car,
  driver: Users,
  safety: ShieldCheck,
  analyst: TrendingUp
};

const themeMap = {
  manager: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', text: 'text-blue-600', ring: 'focus:ring-blue-500' },
  driver: { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', text: 'text-emerald-600', ring: 'focus:ring-emerald-500' },
  safety: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700', text: 'text-orange-600', ring: 'focus:ring-orange-500' },
  analyst: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', text: 'text-purple-600', ring: 'focus:ring-purple-500' }
};

export default function Login() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  
  // Validate role
  const roleInfo = ROLE_DETAILS[roleId];
  
  useEffect(() => {
    if (!roleInfo) {
      navigate('/');
    }
  }, [roleInfo, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, ROLE_MAP } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await authService.login(email, password);
      login(res.data.token, res.data.user);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!roleInfo) return null;

  const Icon = iconMap[roleId];
  const theme = themeMap[roleId];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      <Link to="/" className="absolute top-8 left-8 flex items-center text-slate-500 hover:text-slate-800 transition-colors z-20 font-medium">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Roles
      </Link>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <div className="flex flex-col items-center mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 ${theme.bg}`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{roleInfo.title} Login</h1>
            <p className="text-sm text-slate-500 mt-1 text-center px-4">
              Access your secure workspace for {roleInfo.title.toLowerCase()} operations.
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="mb-5 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
            <strong>Demo:</strong> Use <code className="bg-blue-100 px-1 rounded">fleet@demo.com</code> / <code className="bg-blue-100 px-1 rounded">password123</code>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 ${theme.ring} focus:border-transparent transition-all text-sm outline-none`}
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 ${theme.ring} focus:border-transparent transition-all text-sm outline-none`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white ${theme.bg} ${theme.hover} focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.ring} transition-all disabled:opacity-70`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-5 w-5 text-white" />
              ) : (
                'Secure Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
