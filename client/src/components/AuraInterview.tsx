import { motion } from 'framer-motion';
import type { InterviewQuestion } from '../types/aura';

interface AuraInterviewProps {
  question: InterviewQuestion;
  onResponse: (data: string) => void;
}

export const AuraInterview = ({ question, onResponse }: AuraInterviewProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900/60 backdrop-blur-3xl p-10 border border-cyan-500/20 rounded-3xl shadow-2xl text-center max-w-2xl mx-auto z-50 relative"
    >
      <div className="mb-6">
        <span className="text-xs font-mono text-cyan-400 tracking-[0.3em] uppercase">AI_SCREENING_ACTIVE</span>
        <h2 className="text-2xl text-white mt-4 font-light italic leading-relaxed">"{question.text}"</h2>
      </div>

      {/* Neural Voice Visualizer */}
      <div className="flex justify-center items-center h-32 space-x-1.5 mb-10">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [20, 80 + Math.random() * 40, 20] }}
            transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: "easeInOut", delay: i * 0.05 }}
            className="w-1.5 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]"
          />
        ))}
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => onResponse("SIMULATED_NEURAL_RESPONSE")}
          className="w-full py-4 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black rounded-xl font-mono text-sm font-black tracking-widest transition-all"
        >
          END_RECORDING & SYNC_NEBULA
        </button>
        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Aura Voice-Verified // MGA-Standard 2026</p>
      </div>
    </motion.div>
  );
};
