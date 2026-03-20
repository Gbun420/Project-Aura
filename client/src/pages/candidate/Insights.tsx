import { useState, useEffect } from 'react';
import { TrendingUp, Target, Briefcase, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface Vacancy {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

export default function CandidateInsights() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Vacancy[]>([]);
  const [appCount, setAppCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        // Fetch published jobs as recommendations
        const { data } = await supabase
          .from('vacancies')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (data) setRecommendations(data);

        // Fetch candidate's application count
        const { count: apps } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('candidate_id', user.id);
        
        setAppCount(apps || 0);

        // Fetch total available jobs
        const { count: jobs } = await supabase
          .from('vacancies')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');
        
        setJobCount(jobs || 0);
      } catch (err) {
        console.error('Insights fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [user]);

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
           <TrendingUp className="text-purple-400" size={32} />
          Career Insights
        </h1>
        <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
          Job recommendations and application overview
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <FileText size={16} />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">My Applications</span>
              </div>
              <p className="text-3xl font-black text-white">{appCount}</p>
            </div>
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <Briefcase size={16} />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available Jobs</span>
              </div>
              <p className="text-3xl font-black text-white">{jobCount}</p>
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Recommended Openings</h3>
            {loading ? (
              <div className="p-12 border-2 border-dashed border-white/5 rounded-[2rem] text-center">
                <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Loading recommendations...</span>
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
                        <p className="text-[10px] text-slate-500 font-mono mt-1">
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 border-2 border-dashed border-white/5 rounded-[2rem] text-center">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">No openings available right now</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/20">
            <h3 className="text-xs font-black text-white uppercase tracking-tight mb-2">Nova Pro Insights</h3>
            <p className="text-[10px] text-purple-200/60 leading-relaxed font-medium">
              Upgrade to Nova Professional for advanced salary predictions, competitor benchmarks, and priority job alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
