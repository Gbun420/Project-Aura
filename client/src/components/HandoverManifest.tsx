import { motion } from 'framer-motion';

export const HandoverManifest = ({ onClose }: { onClose: () => void }) => {
  const metrics = [
    { label: 'Neural Sync Latency', value: '< 2.5ms' },
    { label: 'Identità Bypass Efficiency', value: '94%' },
    { label: 'Sector Coverage', value: 'General (6 Pillars)' },
    { label: 'UX Weightlessness', value: 'Antigravity Active' },
    { label: 'Production Build', value: 'v1.0-RC1 STABLE' },
    { label: 'Sovereign Compliance', value: 'MGA/Identità 2026' }
  ];

  return (
    <motion.div 
      className="fixed inset-0 bg-black/95 z-[300] flex flex-col items-center justify-center p-12 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-4xl w-full space-y-12 relative">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-gray-500 hover:text-white font-mono text-xs tracking-widest"
        >
          CLOSE_MANIFEST [X]
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <span className="text-black font-black text-2xl italic">A</span>
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter italic">PROJECT_AURA_RC1</h1>
          </div>
          <p className="text-gray-500 font-mono text-xs tracking-[0.5em] uppercase">Sovereign Employment Infrastructure // Handover sequence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-b border-white/10 py-12">
          {metrics.map(m => (
            <motion.div 
              key={m.label} 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="border-l-2 border-cyan-500/50 pl-6 space-y-1"
            >
              <p className="text-slate-500 text-[10px] uppercase font-mono tracking-widest">{m.label}</p>
              <p className="text-3xl text-cyan-400 font-mono italic font-light tracking-tight">{m.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <button className="flex-1 py-5 bg-cyan-500 text-black font-black font-mono text-xs uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:scale-[1.02] transition-transform">
            INITIALIZE_LIVE_DEPLOYS
          </button>
          <button className="px-10 py-5 border border-white/10 text-gray-400 font-mono text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-white/5 transition-all">
            EXPORT_SOVEREIGN_HASH
          </button>
        </div>

        <p className="text-center text-[9px] text-gray-700 font-mono uppercase tracking-[0.4em]">
          End of Line // Neural Handshake Verified // 2026.03.11
        </p>
      </div>
    </motion.div>
  );
};
