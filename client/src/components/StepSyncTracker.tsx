import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Info } from 'lucide-react';

const steps = [
  { id: 1, title: 'Pre-Departure Course', desc: 'Mandatory Skills Pass & Integration course (New 2026 Req.)', status: 'complete' },
  { id: 2, title: 'Employer Submission', desc: 'Identity Malta Online Portal application (Form C2)', status: 'complete' },
  { id: 3, title: 'Approval in Principle', desc: 'Waiting for official Letter of Approval from Identità', status: 'current' },
  { id: 4, title: 'Biometrics & Housing', desc: 'VFS Appointment + Housing Authority Lease Registration', status: 'upcoming' },
  { id: 5, title: 'Interim Receipt', desc: 'Temporary authorization to work in Malta issued', status: 'upcoming' },
  { id: 6, title: 'Residence Card', desc: 'Collection of the physical e-Residence card in Msida', status: 'upcoming' },
];

export const StepSyncTracker = () => {
  return (
    <div className="aura-glass p-8 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(123,44,191,0.1)]">
      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
        Step-Sync <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">LIVE TRACKER</span>
      </h2>
      <p className="text-gray-400 text-sm mb-8">Real-time status of your Maltese Single Permit (TCN Path)</p>
      
      <div className="space-y-6 relative">
        {/* The Neon Connecting Line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-purple-600 to-gray-800" />
        
        {steps.map((step) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-6 items-start group"
          >
            <div className="relative z-10 mt-1">
              {step.status === 'complete' ? (
                <CheckCircle2 className="text-cyan-400 w-8 h-8 fill-cyan-400/10" />
              ) : step.status === 'current' ? (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Clock className="text-purple-500 w-8 h-8" />
                </motion.div>
              ) : (
                <Circle className="text-gray-600 w-8 h-8" />
              )}
            </div>
            
            <div className={`flex-1 p-4 rounded-xl transition-all duration-300 ${
              step.status === 'current' ? 'bg-white/5 border border-purple-500/30 glow-uv' : ''
            }`}>
              <h3 className={`font-semibold ${step.status === 'upcoming' ? 'text-gray-500' : 'text-white'}`}>
                {step.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{step.desc}</p>
              
              {step.status === 'current' && (
                <div className="mt-3 flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 w-fit px-3 py-1 rounded-full border border-purple-500/20">
                  <Info size={14} /> Expect 8-12 weeks processing time
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
