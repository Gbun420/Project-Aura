import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth'; 
import { supabase } from './lib/supabase';

/**
 * AURA SOVEREIGN HUB - HEARTBEAT v2.3.7
 * Final Alignment: Batch 02 & A11Y Hardening
 */

export default function App() {
  const { user, profile, loading } = useAuth();
  const [view, setView] = useState<'manifest' | 'hub'>('manifest');
  const [leads, setLeads] = useState<any[]>([]);

  // SYSTEM LOGIC: Post-Handshake Audit
  useEffect(() => {
    if (user && profile) {
      setView('hub');
      auditLedger();
    }
  }, [user, profile]);

  const auditLedger = async () => {
    // Fetching Batch 02 (Luca & Elena) once DB push is complete
    const { data, error } = await supabase
      .from('introduction_ledger')
      .select('*')
      .limit(10);
    
    if (!error && data) setLeads(data);
  };

  if (loading) return (
    <div className="h-screen bg-[#050505] flex items-center justify-center font-mono">
      <div className="text-center">
        <div className="w-12 h-[1px] bg-cyan-400 mx-auto mb-4 animate-pulse" />
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.6em]">Syncing Aura JWT</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/20 antialiased">
      <AnimatePresence mode="wait">
        {view === 'manifest' ? (
          <motion.div 
            key="m" 
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="h-screen flex items-center justify-center"
          >
            <div 
              onClick={() => setView('hub')} 
              className="group cursor-pointer p-24 border border-white/5 bg-white/[0.01] rounded-[5rem] transition-all hover:border-cyan-500/30"
            >
              <h1 className="text-[12rem] font-black italic tracking-tighter leading-none text-white group-hover:text-cyan-400">AURA</h1>
              <p className="text-center font-mono text-[9px] uppercase tracking-[0.5em] text-gray-600 mt-6">Ignite Sovereign Engine</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-16">
            <header className="flex justify-between items-start mb-24">
              <div>
                <h2 className="text-4xl font-black italic tracking-tighter">AURA HUB</h2>
                <div className="flex items-center gap-3 mt-3">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                  <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">v2.3.7 // Batch 02 Staged</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl text-right">
                <p className="text-[9px] font-mono text-gray-500 uppercase">Sovereign Role</p>
                <p className="text-xs font-bold text-white uppercase tracking-tight">{profile?.role || 'Unassigned'}</p>
              </div>
            </header>

            <div className="grid grid-cols-12 gap-12">
              {/* Introduction Ledger (Batch 02) */}
              <div className="col-span-8 space-y-4">
                <h3 className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em] mb-10">Neural Ledger // Introductions</h3>
                <div className="grid grid-cols-2 gap-6">
                  {leads.length > 0 ? leads.map(lead => (
                    <div key={lead.id} className="p-10 bg-white/[0.02] border border-white/5 rounded-[3.5rem] hover:bg-white/[0.04] transition-all">
                      <div className="flex justify-between mb-8">
                        <span className="text-[10px] font-mono text-cyan-400">98% Sync</span>
                        <div className="w-3 h-3 bg-cyan-400 rounded-full blur-[4px]" />
                      </div>
                      <h4 className="text-2xl font-black italic tracking-tight">{lead.full_name || 'Neural Lead'}</h4>
                      <p className="text-gray-500 text-xs mt-2">{lead.role_context || 'Matching in progress...'}</p>
                    </div>
                  )) : (
                    <div className="col-span-2 p-20 border-2 border-dashed border-white/5 rounded-[4rem] text-center">
                      <p className="text-gray-700 font-mono text-[10px] uppercase tracking-widest">Awaiting Handshake Spark...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Step-Sync Progress */}
              <div className="col-span-4 h-full">
                <div className="sticky top-16 p-10 bg-white/[0.01] border border-white/5 rounded-[4rem] backdrop-blur-3xl">
                  <h3 className="text-lg font-bold mb-12">Step-Sync™</h3>
                  <div className="space-y-12">
                    {['Manifest', 'Metadata-Fix', 'Batch 02 Audit', 'Grant Permit'].map((step, i) => (
                      <div key={i} className="flex gap-8 items-center">
                        <div className={`w-4 h-4 rounded-full ${i < 3 ? 'bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'bg-white/5'}`} />
                        <div>
                          <p className={`text-[9px] font-mono uppercase tracking-widest ${i < 3 ? 'text-cyan-400' : 'text-gray-700'}`}>Phase 0{i+1}</p>
                          <p className={`text-sm font-bold tracking-tight ${i < 3 ? 'text-white' : 'text-gray-700'}`}>{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
