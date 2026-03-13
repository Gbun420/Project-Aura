import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../store/useNotificationStore';
import type { AuraPing } from '../store/useNotificationStore';

const PingItem = ({ ping }: { ping: AuraPing }) => {
  const borderColor = ping.severity === 'CRITICAL' ? 'border-red-500' : ping.severity === 'HIGH' ? 'border-amber-500' : 'border-cyan-400';
  const textColor = ping.severity === 'CRITICAL' ? 'text-red-400' : ping.severity === 'HIGH' ? 'text-amber-400' : 'text-cyan-400';
  const glowColor = ping.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : ping.severity === 'HIGH' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 211, 238, 0.2)';

  return (
    <motion.div
      initial={{ x: 300, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 300, opacity: 0, scale: 0.9 }}
      className={`w-80 bg-slate-900/60 backdrop-blur-2xl border-l-4 ${borderColor} p-5 rounded-r-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative overflow-hidden mb-4`}
      style={{ boxShadow: `0 10px 30px ${glowColor}` }}
    >
      {/* Background Pulse */}
      <motion.div 
        animate={{ opacity: [0.05, 0.1, 0.05] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className={`absolute inset-0 bg-gradient-to-r from-transparent to-white/5`}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className={`text-[9px] font-black font-mono ${textColor} tracking-[0.2em] uppercase`}>{ping.type}</span>
          <p className="text-white text-[11px] mt-1.5 leading-relaxed font-medium">{ping.message}</p>
        </div>
        <div className={`h-2 w-2 rounded-full animate-ping mt-1 ${ping.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-cyan-400'}`} />
      </div>
      <div className="mt-4 flex justify-between items-center relative z-10">
        <span className="text-[8px] text-slate-500 font-mono tracking-widest">
          {new Date(ping.timestamp).toLocaleTimeString()} // SYNC_ACTIVE
        </span>
        <div className="flex gap-1">
           {[1,2,3].map(i => <div key={i} className={`w-1 h-1 rounded-full ${i === 1 ? (ping.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-cyan-400') : 'bg-white/10'}`} />)}
        </div>
      </div>
    </motion.div>
  );
};

export const AuraPingOverlay = () => {
  const { pings } = useNotificationStore();

  return (
    <div className="fixed bottom-10 right-10 z-[200] flex flex-col items-end pointer-events-none">
      <AnimatePresence mode="popLayout">
        {pings.map((ping) => (
          <PingItem key={ping.id} ping={ping} />
        ))}
      </AnimatePresence>
    </div>
  );
};
