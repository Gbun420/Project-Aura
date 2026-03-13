import { motion } from 'framer-motion';

interface NeuralProfileProps {
  job: any;
  onClose: () => void;
}

export const NeuralProfile = ({ job, onClose }: NeuralProfileProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }} 
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-2xl bg-[#09090b] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div className="p-10">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-purple-400">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
             </div>
             <div>
               <h2 className="text-3xl font-bold text-white tracking-tight">{job.title}</h2>
               <p className="text-gray-400 text-sm font-mono mt-1 uppercase tracking-widest">{job.company} // {job.location}</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h4 className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-4">Neural Overlap</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>MGA Compliance</span>
                  <span className="text-green-400">100%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-green-400 w-full" /></div>
                
                <div className="flex justify-between text-sm text-gray-300">
                   <span>AML Knowledge</span>
                   <span className="text-green-400">95%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-green-400 w-[95%]" /></div>

                <div className="flex justify-between text-sm text-gray-300">
                   <span>Risk Management</span>
                   <span className="text-yellow-400">70%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 w-[70%]" /></div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
               <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-4">Culture Fit (AI)</h4>
               <p className="text-xs text-gray-400 leading-relaxed mb-4">
                 Your psychometric profile indicates a strong alignment with Betsson's "One Betsson" value system, particularly in <span className="text-white">Agile Ownership</span>.
               </p>
               <div className="flex gap-2">
                 <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] text-purple-300 uppercase font-bold">Resilient</span>
                 <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] text-cyan-300 uppercase font-bold">Data-Driven</span>
               </div>
            </div>
          </div>

          <div className="flex gap-4">
             <button className="flex-1 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-widest text-xs">
                Confirm 1-Click Apply
             </button>
             <button className="px-6 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors uppercase tracking-widest text-xs">
                Save
             </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
