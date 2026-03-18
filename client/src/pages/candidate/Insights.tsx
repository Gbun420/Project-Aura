import { useState, useEffect } from 'react';
import { TrendingUp as InsightsTrendingUp, Sparkles as InsightsSparkles, Target as InsightsTarget, Zap as InsightsZap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface Vacancy {
  id: string;
  title: string;
  status: string;
}

export default function CandidateInsights() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      if (!user) return;
      setLoading(true);
      // Fetch some published jobs a potential recommendations
      const { data } = await supabase
        .from('vacancies')
        .select('*')
        .eq('status', 'published')
        .limit(3);
      
      if (data) setRecommendations(data);
      setLoading(false);
    }
    fetchInsights();
  }, [user]);

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
           <TrendingUp className="text-purple-400" size={32} />
          Neural_Career_Insights
        </h1>
        <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
          Algorithmic role recommendations and market telemetry
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <Sparkles size={100} />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Neural_Match_Summary</h3>
            <p className="text-indigo-200/70 text-sm leading-relaxed max-w-xl">
              Based on your Skills Pass v2026, your match profile is high for <span className="text-white font-bold italic">Full-stack React Engineers</span> in the iGaming sector. Aura recommends sharpening your Node.js edge-function expertise to increase match velocity.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Curated_Recommendations</h3>
            {loading ? (
              <div className="p-12 border-2 border-dashed border-white/5 rounded-[2rem] text-center">
                <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Analyzing_Market_Vectors...</span>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid gap-4">
                {recommendations.map(job => (
                  <div key={job.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                        <Target size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{job.title}</h4>
                        <p className="text-[10px] text-slate-500 font-mono mt-1">NESTED_MATCH: 92% | EXPECTED_SALARY: HIGH</p>
                      </div>
                    </div>
                    <button 
                      title="Action required"
                      className="p-2 text-slate-500 hover:text-white transition-colors" 
                      aria-label="Action required"
                    >
                      <Zap size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 border-2 border-dashed border-white/5 rounded-[2rem] text-center">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">No_Recommendations_Detected_In_Current_Sync</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Market_Telemetry</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Hiring Velocity</span>
                <span className="text-emerald-400 font-black">+14.2%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[85%] rounded-full"></div>
              </div>
              <div className="flex justify-between items-center text-xs pt-2">
                <span className="text-slate-400 font-medium">Average Match Accuracy</span>
                <span className="text-blue-400 font-black">91%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[91%] rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/20">
            <h3 className="text-xs font-black text-white uppercase tracking-tight mb-2">Aura_Premium_Insights</h3>
            <p className="text-[10px] text-purple-200/60 leading-relaxed font-medium">
              Unlock the advanced salary predictor and competitor benchmark data with Aura Professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

