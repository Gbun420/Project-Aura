import { useState, useEffect, useCallback } from 'react';
import { Brain, RefreshCw, Briefcase, Users, FileText, Zap, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const currentRole = role === 'platform_owner' ? 'admin' : (role || 'candidate');
      const metrics: { label: string; value: string | number; icon: typeof Brain }[] = [];

      if (currentRole === 'candidate') {
        const qApps = query(collection(db, 'applications'), where('candidate_id', '==', user.uid));
        const qJobs = query(collection(db, 'vacancies'), where('status', '==', 'published'));
        
        const [snapApps, snapJobs] = await Promise.all([getDocs(qApps), getDocs(qJobs)]);
        
        metrics.push(
          { label: 'My Applications', value: snapApps.size, icon: FileText },
          { label: 'Available Jobs', value: snapJobs.size, icon: Briefcase },
        );
      } else if (currentRole === 'employer') {
        const qJobs = query(collection(db, 'vacancies'), where('employer_id', '==', user.uid));
        const qApps = query(collection(db, 'applications'), where('employer_id', '==', user.uid));
        
        const [snapJobs, snapApps] = await Promise.all([getDocs(qJobs), getDocs(qApps)]);
        
        metrics.push(
          { label: 'Active Jobs', value: snapJobs.size, icon: Briefcase },
          { label: 'Total Applicants', value: snapApps.size, icon: Users },
        );
      } else if (currentRole === 'admin') {
        const snapUsers = await getDocs(collection(db, 'profiles'));
        const snapJobs = await getDocs(collection(db, 'vacancies'));
        const snapApps = await getDocs(collection(db, 'applications'));
        
        metrics.push(
          { label: 'Total Users', value: snapUsers.size, icon: Users },
          { label: 'Total Jobs', value: snapJobs.size, icon: Briefcase },
          { label: 'Total Applications', value: snapApps.size, icon: FileText },
        );
      }

      setStats(metrics);

      // Fetch recent activity
      const qActivity = query(
        collection(db, 'audit_trails'),
        orderBy('timestamp', 'desc'),
        limit(5)
      );
      const snapActivity = await getDocs(qActivity);
      const activity = snapActivity.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AuditEntry[];

      if (activity) setRecentActivity(activity);
    } catch (err) {
      console.error("METRIC_ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, [user, role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 font-space uppercase">
            <Brain className="text-nova-pulse" size={32} />
            Dashboard
          </h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
            {currentRole} overview
          </p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 px-5 py-2.5 bg-nova-accent/10 border border-nova-accent/20 text-nova-accent rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-nova-accent/20 transition-all active:scale-95"
        >
          <RefreshCw size={14} />
          Sync System
        </button>
      </div>

      {/* Stats Grid */}
      {stats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="nova-glass-card rounded-[2.5rem] p-8 hover:bg-white/10 transition-all group border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-nova-accent/5 blur-3xl rounded-full" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-nova-pulse/10 rounded-xl text-nova-pulse">
                  <stat.icon size={18} />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
              </div>
              <span className="text-4xl font-black text-white tracking-tighter group-hover:text-nova-accent transition-colors block">
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
        <div className="nova-glass-card p-10 rounded-[3rem] border border-white/5">
          <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-nova-pulse rounded-full animate-pulse" />
            Live Activity Feed
          </h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-6">
              {recentActivity.map((entry) => (
                <div key={entry.id} className="flex items-start gap-5 group/item">
                  <div className="p-2.5 bg-nova-pulse/10 rounded-xl text-nova-pulse mt-0.5 group-hover/item:bg-nova-pulse group-hover/item:text-white transition-all">
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
        
        <div className="nova-glass-card p-10 rounded-[3rem] border border-white/5 flex flex-col justify-center items-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-nova-mesh opacity-20 group-hover:opacity-30 transition-opacity" />
          <Brain size={56} className="text-nova-pulse mb-8 relative z-10 drop-shadow-[0_0_15px_rgba(79,70,229,0.4)] animate-pulse" />
          <h3 className="text-2xl font-black text-white tracking-tight mb-3 uppercase font-space relative z-10">Nova Core</h3>
          <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs font-black uppercase tracking-widest relative z-10">
            Sovereign recruitment intelligence. Neural matching online.
          </p>
        </div>
      </div>
    </div>
  );
}
