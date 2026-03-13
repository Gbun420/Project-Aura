import { motion, AnimatePresence } from 'framer-motion';
import { useAuraStore } from '../store/useAuraStore';

export const DocumentVault = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { documents, uploadDoc } = useAuraStore();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-96 bg-slate-900/80 backdrop-blur-xl border-l border-cyan-500/30 z-[70] p-6 shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-cyan-400 font-mono text-xl tracking-tighter">DOCUMENT_VAULT_v1.0</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-6">
              {['Passport', 'MGA_Compliance_CV', 'Ref_Letter', 'PDC_CERT'].map((type) => (
                <div key={type} className="group relative p-4 border border-slate-700 bg-slate-800/40 rounded-lg hover:border-cyan-500/50 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{type}</span>
                    <span className={`h-2 w-2 rounded-full ${documents[type] ? 'bg-cyan-400 animate-pulse' : 'bg-red-500'}`} />
                  </div>
                  <button 
                    onClick={() => uploadDoc(type)}
                    className="mt-2 w-full py-2 bg-cyan-500/10 text-cyan-400 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-500/20 transition-all"
                  >
                    Manifest {type}
                  </button>
                </div>
              ))}
            </div>

            <div className="absolute bottom-10 left-6 right-6">
              <button 
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono text-sm tracking-widest rounded shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform"
              >
                SYNC_WITH_IDENTITÀ
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
