import React from 'react';

interface Candidate {
  id: string;
  name: string;
  status: 'PENDING' | 'RELEASED';
  pdcDays: number;
}

export const SimplePulse = ({ candidates }: { candidates: Candidate[] }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden text-gray-800">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Current Pipeline</h2>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live_Status_2026</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-gray-50/30">
              <th className="px-6 py-3">Candidate</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Compliance Gate</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {candidates.map(c => (
              <tr key={c.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{c.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono">ID: {c.id.substring(0,8)}</div>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                     c.status === 'RELEASED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                   }`}>
                     {c.status === 'RELEASED' ? 'Ready to Hire' : 'Interviewing'}
                   </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${c.pdcDays < 7 ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                    <span className="text-xs font-medium text-gray-600">
                      {c.pdcDays < 7 ? `Review required (${c.pdcDays} days left)` : 'PDC Verified'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:text-blue-800 transition-colors">
                    Open File →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
