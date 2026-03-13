import { motion } from 'framer-motion';
import type { PermitData } from '../types/aura';

export const PermitBadge = ({ permitData }: { permitData: PermitData }) => {
  return (
    <motion.div 
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      className="absolute top-4 right-4 z-20 p-2.5 bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.6)] border border-white/20 overflow-hidden"
    >
      {/* Shimmer Effect */}
      <motion.div 
        animate={{ x: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
      />
      
      <div className="flex flex-col items-center relative z-10">
        <div className="text-[7px] font-black text-white tracking-[0.2em] uppercase mb-0.5">RESIDENCY_GRANTED</div>
        <div className="text-[10px] text-white font-mono font-bold">{permitData.permitId}</div>
        <div className="flex gap-1 mt-1">
           {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-white rounded-full opacity-50" />)}
        </div>
      </div>
    </motion.div>
  );
};
