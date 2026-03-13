import React from 'react';
import { motion } from 'framer-motion';

/**
 * AURA_OS: AURA PULSE GRID v1.0
 * Triage UI for visualizing regulatory urgency and placement status.
 */

interface PulseItem {
  candidateId: string;
  candidateName: string;
  status: 'PENDING' | 'RELEASED';
  pdcClock: number;
  riskLevel: 'CRITICAL' | 'STABLE';
  revenuePotential: number;
}

export const AuraPulseGrid = ({ pulses }: { pulses: PulseItem[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {pulses.map((pulse) => (
        <motion.div 
          key={pulse.candidateId} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className={`p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden ${
            pulse.riskLevel === 'CRITICAL' 
              ? 'bg-red-950/20 border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.15)]' 
              : 'bg-black/40 backdrop-blur-2xl border-white/10 shadow-2xl'
          }`}
        >
          {/* Urgency Glow */}
          {pulse.riskLevel === 'CRITICAL' && (
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 blur-[60px] rounded-full animate-pulse" />
          )}

          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h4 className="text-xl font-bold text-white tracking-tight">{pulse.candidateName}</h4>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">ID: {pulse.candidateId.substring(0,8)}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
              pulse.status === 'RELEASED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {pulse.status === 'PENDING' ? 'HANDSHAKE_LOGGED' : 'MANIFEST_RELEASED'}
            </span>
          </div>
          
          <div className="space-y-4 mb-8 relative z-10">
            <div className="flex justify-between items-end">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">PDC_EXPIRE_CLOCK</p>
              <p className={`font-mono text-sm font-bold ${pulse.riskLevel === 'CRITICAL' ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
                {pulse.pdcClock} DAYS LEFT
              </p>
            </div>
            
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(pulse.pdcClock / 42) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full shadow-[0_0_10px_currentColor] ${
                  pulse.riskLevel === 'CRITICAL' ? 'bg-red-500' : 'bg-cyan-400'
                }`}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
            <div>
              <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Revenue_Delta</p>
              <p className="text-lg font-mono text-white">€{pulse.revenuePotential.toLocaleString()}</p>
            </div>
            {pulse.status === 'PENDING' ? (
              <button className="px-6 py-3 bg-amber-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                Manifest_Release
              </button>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-[9px] font-black uppercase tracking-widest">PAID</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
