import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuraStore } from '../../store/useAuraStore';
import { HiringPipeline } from './HiringPipeline';
import { CandidateSummaryCard } from './CandidateSummaryCard';
import { DocumentDrawer } from '../DocumentDrawer';
import type { Job } from '../../types/aura';

interface NormalizedDashboardProps {
  onInterview: (job: Job) => void;
  onManifest: (job: Job) => void;
  isManifesting: boolean;
}

export const NormalizedDashboard = ({ onInterview, onManifest, isManifesting }: NormalizedDashboardProps) => {
  const aura = useAuraStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<{ name: string; role: string } | null>(null);

  const filteredJobs = aura.jobs.filter(j => j.sector === aura.userSector);

  const tcnSteps = [
    { id: 1, title: 'Identity Manifest', description: 'Passport & Bio-data verification.', eta: 'Done' },
    { id: 2, title: 'Pre-Departure Course (PDC)', description: 'Mandatory 20-hour integration course.', eta: aura.documents['PDC_CERT'] ? 'Done' : 'Pending' },
    { id: 3, title: 'Employer Submission', description: 'Automated Identità portal upload.', eta: 'TBD' },
    { id: 4, title: 'Identità Approval', description: 'Awaiting official approval in principle.', eta: 'Processing' },
    { id: 5, title: 'Aura Grant', description: 'Digital Permit issued to Aura Wallet.', eta: 'Final Step' },
  ];

  const handleOpenDrawer = (name: string, role: string) => {
    setSelectedCandidate({ name, role });
    setIsDrawerOpen(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900 font-sans">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Hiring Management</h1>
          <p className="text-sm text-gray-500 font-medium">Verified Identity: {aura.userId} • {aura.userSector}</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">Export Audit</button>
           <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm text-xs font-bold hover:bg-blue-700 transition-all">Add Candidate</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto space-y-8">
        {/* The New Hiring Pipeline */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Pipeline Status</h2>
          <HiringPipeline currentStage={aura.currentStepId - 1} />
        </section>

        {/* Candidate Summary Cards */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Candidates</h2>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {filteredJobs.length} Matches Found
            </span>
          </div>
          
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <CandidateSummaryCard 
                key={job.id}
                candidate={{
                  name: job.company === 'Mater Dei' ? 'Marco Rossi' : job.company === 'Betsson' ? 'Sarah Zammit' : 'New Candidate',
                  initials: job.company === 'Mater Dei' ? 'MR' : job.company === 'Betsson' ? 'SZ' : 'NC',
                  role: job.title,
                  daysLeft: job.company === 'Mater Dei' ? 4 : 30
                }}
                onUnlock={() => handleOpenDrawer(
                  job.company === 'Mater Dei' ? 'Marco Rossi' : job.company === 'Betsson' ? 'Sarah Zammit' : 'New Candidate',
                  job.title
                )}
              />
            ))}
          </div>
        </section>

        {/* Opportunity Feed (Simplified) */}
        <section className="pt-8 border-t border-gray-200">
           <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Market Opportunities</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {filteredJobs.map(job => (
               <div key={job.id} className="bg-white p-5 rounded-xl border border-gray-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{job.title}</h4>
                    <p className="text-[10px] text-gray-500">{job.company} • {job.salary_range}</p>
                  </div>
                  <button 
                    onClick={() => onInterview(job)}
                    className="text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:underline"
                  >
                    Details →
                  </button>
               </div>
             ))}
           </div>
        </section>
      </main>

      <DocumentDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        candidate={selectedCandidate}
        progress={aura.stepProgress}
        currentStepId={aura.currentStepId}
        steps={tcnSteps}
      />

      <footer className="max-w-5xl mx-auto mt-20 pb-10 border-t border-gray-200 pt-8 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
         <span>Aura Multi-Sector Nebula // 2026</span>
         <span>Identità-Verified Core v1.7.1</span>
      </footer>
    </div>
  );
};
