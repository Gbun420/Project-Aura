import { motion } from 'framer-motion';

const UPDATES = [
  "Identità: Bio-capture appointment slots for TCNs delayed by 48hrs due to Msida maintenance.",
  "MGA Policy Alert: New AML checks required for Crypto-based salaries effective Q3 2026.",
  "Housing Authority: Lease registration API experiencing high latency (200ms).",
  "Jobsplus: Labor Market Test waivers available for Senior React Developers."
];

export const PredictivePulse = () => {
  return (
    <div className="w-full h-10 bg-black/60 border-t border-white/5 overflow-hidden flex items-center relative backdrop-blur-md">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10" />
      
      <div className="px-4 flex items-center gap-3 z-20 bg-[#050505]">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[9px] font-black tracking-widest text-red-400 uppercase">Live Pulse</span>
      </div>

      <motion.div 
        className="flex gap-12 whitespace-nowrap pl-4"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        whileHover={{ animationPlayState: "paused" }}
      >
        {[...UPDATES, ...UPDATES].map((update, i) => (
          <span key={i} className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <span className="text-purple-500">::</span> {update}
          </span>
        ))}
      </motion.div>
    </div>
  );
};
