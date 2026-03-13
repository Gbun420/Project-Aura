import { motion } from 'framer-motion';
import type { Job } from '../types/aura';

interface GoldenJobCardProps {
  job: Job;
  syncScore: number;
  onManifest: (job: Job) => void;
  isManifesting: boolean;
}

export const GoldenJobCard = ({ job, syncScore, onManifest, isManifesting }: GoldenJobCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative p-6 rounded-[2rem] bg-gradient-to-br from-amber-500/15 via-black to-black border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.1)] overflow-hidden group"
    >
      {/* Animated Nebula Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#f59e0b_0%,_transparent_70%)] blur-[60px]"
        />
      </div>

      <div className="absolute -top-3 -right-3 px-4 py-1.5 bg-amber-500 text-black text-[9px] font-black rounded-full tracking-tighter uppercase animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10">
        GOLDEN_MANIFEST_ELIGIBLE
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12l4 6-10 13L2 9l4-6z"/></svg>
          </div>
          <div className="text-right">
            <span className="text-xs font-black text-amber-500 tracking-widest">{syncScore}%_SYNC</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight mb-1">{job.title}</h3>
        <p className="text-amber-500/80 font-mono text-[10px] uppercase tracking-widest mb-6">
          {job.company} // {job.sector}
        </p>

        <div className="space-y-4">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${syncScore}%` }} 
              className="h-full bg-gradient-to-r from-amber-600 to-yellow-400" 
            />
          </div>

          <button 
            disabled={isManifesting || job.isApplied}
            onClick={(e) => { e.stopPropagation(); onManifest(job); }}
            className={`w-full py-4 rounded-2xl font-mono text-[10px] font-black tracking-[0.3em] transition-all relative overflow-hidden ${
              job.isApplied 
                ? 'bg-white/5 border border-white/10 text-gray-500' 
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]'
            }`}
          >
            {isManifesting ? (
              <div className="flex items-center justify-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                </motion.div>
                HANDSHAKING...
              </div>
            ) : job.isApplied ? 'MANIFESTED' : 'EXECUTE_GOLDEN_MANIFEST'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
