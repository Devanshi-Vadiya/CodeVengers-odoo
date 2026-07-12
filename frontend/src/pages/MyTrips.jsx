import { Map } from 'lucide-react';

export default function MyTrips() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Trips</h1>
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <Map className="w-8 h-8 text-blue-400" />
        </div>
        <p className="text-lg font-semibold text-slate-700 mb-1">My Trips</p>
        <p className="text-sm text-slate-400">Your assigned trips will appear here once connected to the backend.</p>
      </div>
    </div>
  );
}
