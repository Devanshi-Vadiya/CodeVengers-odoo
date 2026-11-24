import { useState, useEffect } from 'react';
import { History, CheckCircle2, AlertTriangle, Search, Filter } from 'lucide-react';

export default function InspectionHistory() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'PASSED', 'FAILED'
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Load from local storage or initialize sample historical logs
    const saved = localStorage.getItem('inspectionHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    } else {
      const sampleLogs = [
        {
          id: 101,
          vehicle_name: 'Van-05',
          reg_number: 'KA-05-AB-1234',
          odometer: 12400,
          result: 'PASSED',
          defects: [],
          notes: 'Routine pre-dispatch safety verification complete. All fluids & tires optimal.',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 102,
          vehicle_name: 'Truck-12',
          reg_number: 'KA-05-AB-5678',
          odometer: 45200,
          result: 'PASSED',
          defects: [],
          notes: 'Emergency kit replenished. High beams checked.',
          date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 103,
          vehicle_name: 'Van-08',
          reg_number: 'KA-05-AB-9012',
          odometer: 8900,
          result: 'FAILED',
          defects: ['Brake Pads & Hydraulics', 'Engine Oil, Coolant & Transmission Fluid'],
          notes: 'Warning light active on dash, brake pedal soft. Sent to shop.',
          date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setHistory(sampleLogs);
      localStorage.setItem('inspectionHistory', JSON.stringify(sampleLogs));
    }
  }, []);

  const filteredHistory = history.filter(item => {
    const matchFilter = filter === 'all' || item.result === filter;
    const matchSearch = !search || 
      item.vehicle_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.reg_number?.toLowerCase().includes(search.toLowerCase()) ||
      item.notes?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#22C55E]" />
            Inspection <span className="text-[#22C55E]">History</span>
          </h1>
          <p className="text-sm mt-1 text-slate-500">
            Audit logs and records of vehicle safety checks, past defects, and repair flags.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {['all', 'PASSED', 'FAILED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                filter === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search history by vehicle or note..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-[#22C55E] outline-none"
            />
          </div>
          <span className="text-xs font-mono text-slate-400">{filteredHistory.length} Record(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Log Date</th>
                <th className="p-3.5">Vehicle</th>
                <th className="p-3.5">Odometer</th>
                <th className="p-3.5">Result</th>
                <th className="p-3.5">Reported Defects</th>
                <th className="p-3.5">Inspector Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No inspection records found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-mono text-slate-500">
                      {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900">
                      {item.reg_number} ({item.vehicle_name})
                    </td>
                    <td className="p-3.5 font-mono">{Number(item.odometer).toLocaleString()} km</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.result === 'PASSED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {item.result === 'PASSED' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {item.result}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs truncate">
                      {item.defects?.length > 0 ? (
                        <span className="text-red-700 font-medium">{item.defects.join(', ')}</span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="p-3.5 max-w-xs text-slate-500 truncate" title={item.notes}>
                      {item.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
