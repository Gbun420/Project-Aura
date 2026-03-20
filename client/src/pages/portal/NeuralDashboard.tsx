import { useState, useEffect } from 'react';
import { Brain, RefreshCw, Briefcase, Users, FileText, Zap, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface AuditEntry {
  id: string;
  action: string;
  entity_type: string;
  timestamp: string;
}

export default function NeuralDashboard() {
  const { role, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ label: string; value: string | number; icon: typeof Brain }[]>([]);
  const [recentActivity, setRecentActivity] = useState<AuditEntry[]>([]);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const currentRole = role === 'platform_owner' ? 'admin' : (role || 'candidate');
      const metrics: { label: string; value: string | number; icon: typeof Brain }[] = [];

      if (currentRole === 'candidate') {
        const { count: appCount } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('candidate_id', user.id);
        const { count: jobCount } = await supabase.from('vacancies').select('*', { count: 'exact', head: true }).eq('status', 'published');
        metrics.push(
          { label: 'My Applications', value: appCount || 0, icon: FileText },
          { label: 'Available Jobs', value: jobCount || 0, icon: Briefcase },
        );
      } else if (currentRole === 'employer') {
        const { count: jobCount } = await supabase.from('vacancies').select('*', { count: 'exact', head: true }).eq('employer_id', user.id);
        const { count: appCount } = await supabase.from('applications').select('*, vacancies!inner(*)', { count: 'exact', head: true }).eq('vacancies.employer_id', user.id);
        metrics.push(
          { label: 'Active Jobs', value: jobCount || 0, icon: Briefcase },
          { label: 'Total Applicants', value: appCount || 0, icon: Users },
        );
      } else if (currentRole === 'admin') {
        const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: jobCount } = await supabase.from('vacancies').select('*', { count: 'exact', head: true });
        const { count: appCount } = await supabase.from('applications').select('*', { count: 'exact', head: true });
        metrics.push(
          { label: 'Total Users', value: userCount || 0, icon: Users },
          { label: 'Total Jobs', value: jobCount || 0, icon: Briefcase },
          { label: 'Total Applications', value: appCount || 0, icon: FileText },
        );
      }

      setStats(metrics);

      // Fetch recent activity
      const { data: activity } = await supabase
        .from('audit_trails')
        .select('id, action, entity_type, timestamp')
        .order('timestamp', { ascending: false })
        .limit(5);

      if (activity) setRecentActivity(activity);
    } catch (err) {
      console.error("METRIC_ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, role]);

  const currentRole = role === 'platform_owner' ? 'admin' : (role || 'candidate');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Brain className="text-blue-400" size={32} />
            Dashboard
          </h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
            {currentRole} overview
          </p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      {stats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <stat.icon size={16} />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
              <span className="text-3xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 border-2 border-dashed border-white/5 rounded-[2rem] text-center">
          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">No data available yet</p>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((entry) => (
                <div key={entry.id} className="flex items-start gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 mt-0.5">
                    <Zap size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{entry.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={10} className="text-slate-600" />
                      <p className="text-[10px] text-slate-500 font-mono">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-xs font-medium">No recent activity recorded.</p>
          )}
        </div>
        
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/10 flex flex-col justify-center items-center text-center">
          <Brain size={48} className="text-blue-400 mb-6 animate-pulse" />
          <h3 className="text-xl font-black text-white tracking-tight mb-2 uppercase">Nova Platform</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
            Your intelligent recruitment command center. All metrics shown are live from your account data.
          </p>
        </div>
      </div>
    </div>
  );
}
