import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="w-12 h-12 text-red-600" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">403 Access Denied</h1>
      <p className="text-slate-500 max-w-md mb-8">
        You do not have the required permissions to view this page based on your current role.
      </p>
      <button 
        onClick={() => navigate('/dashboard')}
        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
      >
        Return to Dashboard
      </button>
    </div>
  );
}
