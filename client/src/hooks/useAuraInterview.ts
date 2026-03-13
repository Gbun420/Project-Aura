import { useState } from 'react';
import type { InterviewQuestion } from '../types/aura';

export const useAuraInterview = (_jobId: string) => {
  const [stage, setStage] = useState(0);
  
  const questions: InterviewQuestion[] = [
    { 
      id: 'q1', 
      category: 'COMPLIANCE', 
      text: "How would you handle a discrepancy in 2026 Identità reporting standards?", 
      expectedKeywords: ['transparency', 'documentation', 'MGA', 'reporting'] 
    },
    { 
      id: 'q2', 
      category: 'TECH', 
      text: "Describe your experience with multi-sector synchronization in 5G environments.", 
      expectedKeywords: ['latency', '5G', 'real-time', 'synchronization'] 
    }
  ];

  const submitResponse = (_response: string) => {
    setStage(prev => prev + 1);
  };

  return { 
    currentQuestion: questions[stage], 
    stage, 
    submitResponse, 
    isComplete: stage >= questions.length 
  };
};
