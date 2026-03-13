import { motion } from 'framer-motion';
import { UI_LABELS } from '../../constants/labels';

export const LandingAura = ({ onManifest }: { onManifest: () => void }) => {
  return (
    <section className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black">
      {/* Background Starfield simulation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="z-10 text-center space-y-12"
      >
        <div className="space-y-4">
          <h1 className="text-8xl font-extralight text-white tracking-[0.2em] relative">
            AURA<span className="text-cyan-400 font-black italic">.MT</span>
            <motion.div 
              className="absolute -inset-x-10 -inset-y-4 border border-cyan-500/20 rounded-full blur-md"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 4 }}
            />
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.8em] pl-4">
            {UI_LABELS.PULSE}: SYSTEM_ACTIVE_2026
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onManifest}
            className="px-12 py-5 bg-white text-black font-black font-mono text-xs uppercase tracking-[0.3em] rounded-full transition-all"
          >
            {UI_LABELS.MANIFEST}
          </motion.button>
          
          <motion.button 
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            className="px-12 py-5 border border-white/10 text-white font-black font-mono text-xs uppercase tracking-[0.3em] rounded-full backdrop-blur-md transition-all"
          >
            {UI_LABELS.GALAXY}
          </motion.button>
        </div>

        <div className="pt-12">
          <p className="text-[8px] text-gray-700 font-mono uppercase tracking-[0.5em]">
            Zero-G Employment Protocol // Malta 2026
          </p>
        </div>
      </motion.div>
    </section>
  );
};
