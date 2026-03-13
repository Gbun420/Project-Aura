import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  id: number;
  title: string;
  description: string;
  eta: string;
}

interface DocumentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    name: string;
    role: string;
  } | null;
  progress: number;
  currentStepId: number;
  steps: Step[];
}

export const DocumentDrawer = ({ isOpen, onClose, candidate, progress, currentStepId, steps }: DocumentDrawerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-[101] p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{candidate?.name}</h2>
                <p className="text-sm text-gray-500">{candidate?.role}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="mb-10">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Compliance Track</h3>
              <div className="relative pl-8">
                <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gray-100">
                  <motion.div 
                    className="w-full bg-blue-600" 
                    initial={{ height: 0 }}
                    animate={{ height: `${progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <div className="space-y-8">
                  {steps.map((step) => {
                    const isCompleted = step.id < currentStepId;
                    const isActive = step.id === currentStepId;
                    return (
                      <div key={step.id} className="relative">
                        <div className={`absolute -left-[29px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-500 bg-white ${
                          isCompleted ? 'border-blue-600 bg-blue-600 text-white' : 
                          isActive ? 'border-blue-600 text-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.2)]' : 
                          'border-gray-200 text-gray-300'
                        }`}>
                          {isCompleted ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          ) : (
                            <span className="text-[10px] font-bold">{step.id}</span>
                          )}
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold ${step.id > currentStepId ? 'text-gray-400' : 'text-gray-900'}`}>{step.title}</h4>
                          <p className="text-[11px] text-gray-500 leading-relaxed mt-1">{step.description}</p>
                          <div className="mt-1 text-[9px] font-bold text-blue-600 uppercase tracking-tight">{step.eta}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-gray-900 text-white font-bold text-xs rounded-lg hover:bg-black transition-colors uppercase tracking-widest shadow-lg">
              Download Full Audit Trail
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
