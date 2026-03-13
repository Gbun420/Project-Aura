import React from 'react';

export const HiringPipeline = ({ currentStage }: { currentStage: number }) => {
  const stages = ["Applied", "Interview", "PDC Verified", "Fee Pending", "Ready"];
  
  return (
    <div className="flex items-center justify-between w-full px-4 py-8 bg-white rounded-lg border border-gray-100">
      {stages.map((stage, index) => (
        <div key={stage} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold 
              ${index <= currentStage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {index + 1}
            </div>
            <span className={`text-[10px] mt-2 font-semibold uppercase tracking-wider 
              ${index <= currentStage ? 'text-blue-600' : 'text-gray-400'}`}>
              {stage}
            </span>
          </div>
          {index < stages.length - 1 && (
            <div className={`h-[2px] flex-1 mx-2 ${index < currentStage ? 'bg-blue-600' : 'bg-gray-100'}`} />
          )}
        </div>
      ))}
    </div>
  );
};
