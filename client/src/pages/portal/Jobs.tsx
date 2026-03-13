import { useState, useEffect } from 'react';
import { Briefcase, Plus, Filter, Search, MoreVertical, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import SEO from '../../components/SEO';

interface Vacancy {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'flagged';
  compliance_score: number;
  created_at: string;
}

export default function Jobs() {
  const { user, role } = useAuth();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      if (!user) return;
      setLoading(true);
      
      let query = supabase.from('vacancies').select('*');
      
      if (role === 'candidate') {
        // Candidates see all published jobs
        query = query.eq('status', 'published');
      } else {
        // Employers and Admins see their own jobs
        query = query.eq('employer_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
      } else if (data) {
        setVacancies(data);
      }
      setLoading(false);
    }

    fetchJobs();
  }, [user, role]);

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <SEO title="Job Vacancies" noindex />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Briefcase className="text-blue-400" size={32} />
            Job Vacancies
          </h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Manage your active neural matching requirements
          </p>
        </div>
        {role !== 'candidate' && (
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20">
            <Plus size={16} /> Create_New_Vacancy
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search_Jobs_System..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors uppercase font-mono"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
          <Filter size={14} /> Refine_Search
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Syncing_Neural_Vacancies...</span>
        </div>
      ) : vacancies.length === 0 ? (
        <div className="p-20 border-2 border-dashed border-white/5 rounded-[3rem] text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/5 mb-6">
            <Briefcase className="text-slate-500" size={32} />
          </div>
          <h3 className="text-white font-bold mb-2 uppercase tracking-tight">Vault_Empty</h3>
          <p className="text-slate-500 text-sm mb-8 font-medium">No job vacancies detected in your neural network.</p>
          <button className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-blue-300 transition-colors">
            Initialize_First_Vacancy
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((job: Vacancy) => (
            <div key={job.id} className="group p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all hover:bg-white/[0.07] relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                  job.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  job.status === 'draft' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {job.status}
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{job.title}</h3>
              <p className="text-slate-400 text-xs line-clamp-2 font-medium mb-6">{job.description}</p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Compliance_Score</span>
                  <span className={`text-xs font-mono font-bold ${
                    job.compliance_score >= 90 ? 'text-emerald-400' : 
                    job.compliance_score >= 70 ? 'text-amber-400' : 'text-red-400'
                  }`}>{job.compliance_score}%</span>
                </div>
                <button className="text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all">
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
