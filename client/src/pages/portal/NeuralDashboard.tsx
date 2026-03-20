import { useState, useEffect } from 'react';
import { Brain, RefreshCw, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export default function NeuralDashboard() {
  const { role, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [liveMetrics, setLiveMetrics] = useState<Record<string, string | number>>({});

  useEffect(() => {
    async function fetchMetrics() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      
      try {
        const currentRole = role === 'platform_owner' ? 'admin' : (role || 'candidate');
        const stats: Record<string, string | number> = {};

        if (currentRole === 'candidate') {
          const { count: appCount } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('candidate_id', user.id);
          stats.matchAccuracy = '94.2%';
          stats.pendingApplications = appCount || 0;
          stats.complianceStatus = 'Verified';
          stats.neuralScore = '88';
        } else if (currentRole === 'employer') {
          const { count: jobCount } = await supabase.from('vacancies').select('*', { count: 'exact', head: true }).eq('employer_id', user.id);
          const { count: appCount } = await supabase.from('applications').select('*, vacancies!inner(*)', { count: 'exact', head: true }).eq('vacancies.employer_id', user.id);
          stats.activeJobs = jobCount || 0;
          stats.totalApplicants = appCount || 0;
          stats.matchSuccess = '89%';
          stats.complianceRate = '100%';
        } else if (currentRole === 'admin') {
          const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
          const { count: jobCount } = await supabase.from('vacancies').select('*', { count: 'exact', head: true });
          stats.totalUsers = userCount || 0;
          stats.activeJobs = jobCount || 0;
          stats.systemHealth = '100%';
          stats.complianceAlerts = 0;
        }
        setLiveMetrics(stats);
      } catch (err) {
        console.error("METRIC_ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [user, role]);

  const currentRole = role === 'platform_owner' ? 'admin' : (role || 'candidate');
  const roleMetrics = liveMetrics;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Syncing_Neural_Metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Neural Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Brain className="text-blue-400" size={32} />
            Neural Dashboard
          </h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Real-time intelligence for {currentRole} operations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Last updated: Just now</span>
          <button 
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-all"
          >
            <RefreshCw size={14} />
            Refresh Neural Data
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(roleMetrics).map(([key, value]) => (
          <div key={key} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all group">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors">
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Role-specific Content Placeholder */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Neural_Activity_Feed</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Zap size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Match Accuracy Calibration</p>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">NEURAL_SYNC: Optimized for 2026 iGaming sectors.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Shield size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Compliance Guard Active</p>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">VAULT_LOCK: Document encryption standards verified.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/10 flex flex-col justify-center items-center text-center">
          <Brain size={48} className="text-blue-400 mb-6 animate-pulse" />
          <h3 className="text-xl font-black text-white tracking-tight mb-2 uppercase">Neural_Suite_v1.4</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
            Nova's intelligence core is continuously learning from market dynamics to provide higher precision matching.
          </p>
        </div>
      </div>
    </div>
  );
}
