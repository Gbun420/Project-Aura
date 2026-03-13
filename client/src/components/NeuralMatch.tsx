import React, { useEffect, useState } from 'react';
import { Cpu, Loader2 } from 'lucide-react';
import { getMatchScore } from '../services/neural';

interface NeuralMatchProps {
  profileId: string;
  jobId: string;
}

export const NeuralMatch: React.FC<NeuralMatchProps> = ({ profileId, jobId }) => {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScore() {
      try {
        setLoading(true);
        const matchScore = await getMatchScore(profileId, jobId);
        setScore(matchScore);
      } catch (err) {
        console.error('Failed to fetch match score:', err);
      } finally {
        setLoading(false);
      }
    }

    if (profileId && jobId) {
      fetchScore();
    }
  }, [profileId, jobId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-blue-400 animate-pulse">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Neural Matching...</span>
      </div>
    );
  }

  if (score === null) return null;

  const percentage = Math.round(score * 100);
  
  // Color logic based on score
  let colorClass = "text-red-500 border-red-500/20 bg-red-500/10";
  if (percentage >= 70) colorClass = "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
  else if (percentage >= 40) colorClass = "text-amber-500 border-amber-500/20 bg-amber-500/10";

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${colorClass}`}>
      <Cpu className="w-3.5 h-3.5" />
      <span>Neural Match: {percentage}%</span>
    </div>
  );
};

export default NeuralMatch;
