import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuraStore } from '../store/useAuraStore';
import { PermitBadge } from './PermitBadge';
import QRCode from 'react-qr-code';

export const AuraPassport = () => {
  const aura = useAuraStore();
  const isPDCVerified = !!aura.documents['PDC_CERT'];
  const isGranted = aura.permit.status === 'GRANTED';
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isGranted) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [isGranted]);

  return (
    <div className="relative">
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 z-[100] pointer-events-none">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: '50%', y: '50%', scale: 0 }}
                animate={{ 
                  x: `${Math.random() * 100}%`, 
                  y: `${Math.random() * 100}%`, 
                  scale: Math.random() * 1.5,
                  rotate: Math.random() * 360 
                }}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`max-w-sm mx-auto p-1 rounded-[2.5rem] shadow-[0_0_60px_rgba(34,211,238,0.2)] border transition-all duration-1000 ${
          isGranted ? 'bg-gradient-to-br from-amber-500 via-red-600 to-amber-500 border-amber-400/50' : 'bg-gradient-to-br from-slate-900 to-black border-slate-800'
        }`}
      >
        <div className="bg-slate-900/90 backdrop-blur-3xl rounded-[2.3rem] p-8 overflow-hidden relative">
          {/* Holographic Aura Background */}
          <div className={`absolute -top-20 -left-20 w-40 h-40 blur-[80px] rounded-full transition-colors duration-1000 ${isGranted ? 'bg-amber-500/20' : 'bg-cyan-500/10'}`} />
          <div className={`absolute -bottom-20 -right-20 w-40 h-40 blur-[80px] rounded-full transition-colors duration-1000 ${isGranted ? 'bg-red-500/20' : 'bg-purple-500/10'}`} />
          
          {isGranted && aura.permit.data && <PermitBadge permitData={aura.permit.data} />}

          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <h2 className="text-white font-mono text-lg tracking-tighter uppercase">AURA_PASSPORT</h2>
              <p className={`text-[10px] font-mono tracking-widest uppercase mt-1 ${isGranted ? 'text-amber-400' : 'text-cyan-400'}`}>
                Status: {isGranted ? 'LEGAL_RESIDENT' : isPDCVerified ? 'ACTIVE_SYNC' : 'PENDING_PDC'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-white leading-none">{aura.auraScore}</span>
              <p className="text-[10px] text-slate-500 font-mono">NEURAL_RANK</p>
            </div>
          </div>

          {/* Dynamic QR Sync */}
          <div className="bg-white p-4 rounded-3xl mb-8 flex justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-10">
            <QRCode 
              value={`aura://verify/${aura.userId}/${aura.auraScore}/${isGranted ? aura.permit.data?.permitId : 'none'}`} 
              size={180}
              fgColor="#0f172a"
            />
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500 text-[10px] uppercase font-mono">ID_Hash</span>
              <span className="text-white text-[10px] font-mono">{aura.userId}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500 text-[10px] uppercase font-mono">Sector_Domain</span>
              <span className="text-white text-xs font-semibold uppercase">{aura.userSector}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500 text-[10px] uppercase font-mono">Valid_Until</span>
              <span className="text-white text-[10px] font-mono">{isGranted ? aura.permit.data?.expiry : 'MANIFEST_PENDING'}</span>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isGranted) {
                alert("AURA_OS: Generating secure PDF manifest... Identity Handshake complete.");
              } else {
                alert("AURA_OS: Generating .pkpass binary... Sovereign handshake complete.");
              }
            }}
            className="w-full mt-10 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-mono text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            {isGranted ? 'DOWNLOAD_PERMIT_PDF' : 'ADD_TO_APPLE_WALLET'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
