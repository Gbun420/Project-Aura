import React from 'react';

interface Candidate {
  initials: string;
  name: string;
  role: string;
  daysLeft: number;
}

export const CandidateSummaryCard = ({ candidate, onUnlock }: { candidate: Candidate; onUnlock: () => void }) => {
  return (
    <div className="flex items-center justify-between p-5 mb-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="bg-blue-50 p-3 rounded-lg text-blue-700 font-bold w-12 h-12 flex items-center justify-center">
          {candidate.initials}
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{candidate.name}</h3>
          <p className="text-xs text-gray-500">{candidate.role}</p>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">PDC Status</div>
        <div className={`text-xs font-bold px-2 py-1 rounded ${
          candidate.daysLeft < 7 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {candidate.daysLeft} Days Remaining
        </div>
      </div>

      <button 
        onClick={onUnlock}
        className="ml-6 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors shadow-sm"
      >
        Unlock Docs
      </button>
    </div>
  );
};
