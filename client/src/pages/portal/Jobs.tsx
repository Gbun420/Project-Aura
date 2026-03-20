import { useState, useEffect } from 'react';
import { Briefcase, Plus, Filter, Search, MoreVertical, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import SEO from '../../components/SEO';
import JobPostingForm from '../../components/employer/JobPostingForm';

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
  const [showJobForm, setShowJobForm] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      
      try {
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
      } catch (err) {
        console.error('Error in fetchJobs:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [user, role]);

  const handleCreateVacancy = () => {
    setShowJobForm(true);
  };

  const handleJobFormClose = () => {
    setShowJobForm(false);
  };

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleJobFormClose();
    };
    if (showJobForm) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showJobForm]);

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <SEO title="Job Vacancies" noindex />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 font-space uppercase">
            <Briefcase className="text-nova-accent" size={32} />
            Vacancies
          </h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Manage your active neural matching requirements
          </p>
        </div>
        {role !== 'candidate' && (
          <button 
            className="flex items-center gap-2 px-8 py-4 bg-white text-nova-base rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-white/5 hover:bg-slate-200 active:scale-95"
            onClick={handleCreateVacancy}
          >
            <Plus size={16} /> Deploy_Requirement
          </button>
        )}
      </div>

      {/* Job Posting Form Modal */}
      {showJobForm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-nova-base/80 backdrop-blur-xl p-4 animate-in fade-in duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleJobFormClose();
          }}
        >
          <div className="relative bg-nova-base border border-white/5 rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-in zoom-in-95 duration-300 selection:bg-nova-accent/30">
            <button 
              onClick={handleJobFormClose}
              className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl transition-all z-10"
              aria-label="Close modal"
              title="Close modal"
            >
              <MoreVertical size={20} className="rotate-45" />
            </button>
            
            <div className="p-10">
              <JobPostingForm onClose={handleJobFormClose} />
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Neural_Search_Module..." 
            className="nova-input w-full rounded-[1.25rem] py-4 pl-12 pr-4 text-sm text-white focus:ring-2 focus:ring-nova-accent/30 transition-all uppercase font-mono tracking-tighter"
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
          {role !== 'candidate' && (
            <button 
              className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-blue-300 transition-colors"
              onClick={handleCreateVacancy}
            >
              Initialize_First_Vacancy
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vacancies.map((job: Vacancy) => (
            <div key={job.id} className="group p-8 rounded-[2.5rem] nova-glass-card hover:border-nova-accent/30 transition-all relative overflow-hidden flex flex-col min-h-[320px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-nova-accent/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-6">
                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                  job.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  job.status === 'draft' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {job.status}
                </div>
                <button 
                  title="More options"
                  className="text-slate-500 hover:text-white transition-colors" 
                  aria-label="More options"
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{job.title}</h3>
              <p className="text-slate-400 text-xs line-clamp-2 font-medium mb-6">{job.description}</p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Match_Probability</span>
                  <span className={`text-sm font-mono font-black ${
                    job.compliance_score >= 90 ? 'text-emerald-400' : 
                    job.compliance_score >= 70 ? 'text-amber-400' : 'text-red-400'
                  }`}>{job.compliance_score}.00%</span>
                </div>
                <button 
                  title="View external link"
                  className="text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all" 
                  aria-label="View external link"
                >
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