import { Brain, Sparkles, Lock, Cpu } from '../icons';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  status: string;
  description: string;
}

export default function PortalModulePlaceholder({ title, status, description }: Props) {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center p-6">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-12 text-center shadow-2xl overflow-hidden relative group">
          {/* Animated Border/Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10">
            <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-8 shadow-xl shadow-indigo-500/20">
              <Cpu size={40} className="text-white animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-300">
                {status}
              </span>
            </div>

            <h2 className="text-4xl font-semibold text-white mb-4 tracking-tight font-['Space_Grotesk'] leading-tight">
              {title}
            </h2>
            
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm mx-auto mb-10 font-light">
              {description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-left">
                <Brain size={18} className="text-indigo-400 mb-2" />
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Engine</p>
                <p className="text-sm text-slate-300">Neural Sync 2.0</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-left">
                <Lock size={18} className="text-emerald-400 mb-2" />
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">State</p>
                <p className="text-sm text-slate-300">Immutable Vault</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
