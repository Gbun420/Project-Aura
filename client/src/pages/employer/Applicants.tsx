import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Lock, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NovaAssistant from '../../components/employer/NovaAssistant';
import GoldenManifestCard from '../../components/employer/GoldenManifestCard';

type Applicant = {
  id: string;
  match_score: number;
  ai_analysis: {
    alignment: string[];
    behavioralAlignment?: string;
    culturalFit?: number;
    gaps: string[];
  };
  status: string;
  created_at: string;
  candidate: {
    full_name: string;
    email: string;
    role: string;
    tcn_status: string;
    resume_text?: string;
    _metadata?: {
      blurred: boolean;
      upgrade_prompt: string;
      match_quality: number;
    };
  };
  _compliance?: {
    tcn_ready: boolean;
    expiry?: string;
    verification_id?: string;
  } | null;
};

type Vacancy = {
  id: string;
  title: string;
};

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied', color: 'bg-white/5 border-white/10 text-slate-400' },
  { value: 'shortlisted', label: 'Shortlist', color: 'bg-nova-accent/20 text-white border-nova-accent/30' },
  { value: 'interview', label: 'Interview', color: 'bg-nova-pulse/20 text-nova-pulse border-nova-pulse/30' },
  { value: 'rejected', label: 'Reject', color: 'bg-gemini-pink/20 text-gemini-pink border-gemini-pink/30' },
  { value: 'offered', label: 'Offer', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
];

export default function EmployerApplicants() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isBlurred, setIsBlurred] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState<Applicant | null>(null);
  const [hiredApplicant, setHiredApplicant] = useState<Applicant | null>(null);
  const navigate = useNavigate();

  const handleUpgradeRedirect = () => {
    navigate('/portal/employer/pricing');
  };

  const loadApplicants = async (jobId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const response = await fetch('/api/hiring/hub', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          action: 'LIST_APPLICANTS',
          jobId: jobId
        })
      });
      const data = await response.json();
      if (response.ok) {
        setApplicants(data.applicants || []);
        setIsBlurred(data.metadata?.isBlurred);
      } else {
        setError(data.error || "Failed to load applicants");
      }
    } catch (err) {
        console.error("APP_LOAD_ERR:", err);
        setError("An error occurred while loading applicants");
      } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadVacancies = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      const response = await fetch('/api/hiring/hub', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'LIST_VACANCIES' })
      });
      const data = await response.json();
      if (response.ok) {
        setVacancies(data.vacancies || []);
        if (data.vacancies?.length > 0) {
          const firstJobId = data.vacancies[0].id;
          setSelectedJobId(firstJobId);
          loadApplicants(firstJobId);
        }
      }
    };
    loadVacancies();
  }, []);

  const handleHire = async (app: Applicant) => {
    const salary = prompt("Enter Final Agreed Salary (€) for Ledger Sync:", "45000");
    if (!salary) return;

    setUpdatingId(app.id);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const response = await fetch('/api/hiring/hub', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          action: 'COMMIT_TO_LEDGER',
          applicationId: app.id,
          finalSalary: parseFloat(salary),
          matchScore: app.match_score
        })
      });

      if (response.ok) {
        setApplicants(prev => prev.map(a => 
          a.id === app.id ? { ...a, status: 'hired' } : a
        ));
        setHiredApplicant(app);
      } else {
        const data = await response.json();
        alert(data.error || "Ledger commit failed");
      }
    } catch (err) {
      console.error("Hire error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    setUpdatingId(applicationId);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const response = await fetch('/api/hiring/hub', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          action: 'UPDATE_APPLICATION_STATUS',
          applicationId,
          newStatus
        })
      });

      if (response.ok) {
        setApplicants(prev => prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        ));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 bg-nova-base min-h-screen text-white font-manrope pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-nova-accent mb-2">Neural_Leaderboard_v1.1</p>
          <h2 className="text-4xl font-black tracking-tight">Applicant Review</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-end">
          {isBlurred && (
            <button 
              onClick={handleUpgradeRedirect}
              className="bg-gemini-gradient px-6 py-3 rounded-2xl text-[10px] font-black uppercase text-white shadow-xl shadow-nova-accent/20 animate-pulse hover:scale-105 transition-all tracking-widest"
            >
              Unlock_Pioneer_Special
            </button>
          )}
          <select 
            title="Select Mission Vacancy"
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              loadApplicants(e.target.value);
            }}
            className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm focus:ring-2 focus:ring-nova-accent outline-none transition-all min-w-[280px] font-bold"
          >
            {vacancies.map(job => (
              <option key={job.id} value={job.id} className="bg-nova-base">{job.title}</option>
            ))}
          </select>
        </div>
      </div>

      {isBlurred && (
        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-nova-glass-gradient opacity-30" />
          <div className="h-16 w-16 rounded-3xl bg-nova-accent/20 flex items-center justify-center text-nova-accent relative z-10">
            <Lock size={32} />
          </div>
          <div className="flex-1 relative z-10">
            <h3 className="text-xl font-black uppercase tracking-tight">Identity_Protection_Active</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-2xl">First 50 employers unlock all identities and 2026 TCN compliance history for just <strong>€29/mo</strong>. Secure your regulatory shield before the price returns to €49.</p>
          </div>
          <button 
            onClick={handleUpgradeRedirect}
            className="w-full md:w-auto bg-white text-black px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all relative z-10"
          >
            Unlock_Pioneer_Price
          </button>
        </div>
      )}

      {error && (
        <div className="p-6 bg-gemini-pink/10 border border-gemini-pink/30 text-gemini-pink rounded-3xl text-xs font-black uppercase tracking-widest">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="h-12 w-12 border-4 border-nova-accent/20 border-t-nova-accent rounded-full animate-spin mx-auto" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Syncing_Neural_Match_Data...</p>
          </div>
        ) : applicants.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">No_Applicants_Found_For_Mission</p>
          </div>
        ) : (
          applicants.map((app) => (
            <div key={app.id} className={`group relative rounded-[2.5rem] border transition-all overflow-hidden p-8 
              ${app.status === 'rejected' ? 'bg-black/40 border-white/5 opacity-40' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
              
              <div className="absolute top-0 right-0 p-8 flex flex-col items-end gap-4">
                <div className="flex flex-col items-end gap-2">
                  <div className="text-6xl font-black bg-gemini-gradient bg-clip-text text-transparent opacity-20 group-hover:opacity-100 transition-opacity font-mono tracking-tighter">
                    {app.match_score}%
                  </div>
                  {app.ai_analysis?.culturalFit && (
                    <div className="text-[10px] font-black text-nova-accent uppercase tracking-widest bg-nova-accent/5 px-2 py-0.5 rounded border border-nova-accent/20">
                      Culture_Fit: {app.ai_analysis.culturalFit}%
                    </div>
                  )}
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border 
                    ${STATUS_OPTIONS.find(o => o.value === app.status)?.color}`}>
                    {app.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="h-20 w-20 rounded-[2rem] bg-nova-glass border border-white/10 flex items-center justify-center text-2xl font-black text-nova-accent shadow-inner">
                   {app.candidate.full_name.charAt(0)}
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <h3 className={`text-2xl font-black tracking-tight ${isBlurred ? 'text-slate-500' : 'text-white'}`}>
                        {app.candidate.full_name}
                      </h3>
                      {app.candidate.tcn_status === 'verified_skills_pass' && (
                        <div className="px-4 py-1.5 bg-nova-pulse/10 border border-nova-pulse/30 rounded-full flex items-center gap-2 animate-pulse">
                          <div className="h-1.5 w-1.5 rounded-full bg-nova-pulse shadow-[0_0_8px_#22D3EE]" />
                          <span className="text-[9px] font-black font-mono text-nova-pulse uppercase tracking-widest text-white">Skills_Pass_Verified</span>
                        </div>
                      )}
                    </div>
                    <p className={`text-xs mt-2 font-mono tracking-widest ${isBlurred ? 'text-slate-700 italic' : 'text-nova-accent'}`}>
                      {app.candidate.email}
                    </p>
                  </div>

                  {app.ai_analysis && (
                    <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                      <div className="space-y-6">
                        <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Neural_Alignments</p>
                          <ul className="space-y-3">
                            {(app.ai_analysis.alignment || []).map((item: string, i: number) => (
                              <li key={i} className="text-[11px] text-slate-300 flex items-start gap-3">
                                <span className="h-1 w-1 rounded-full bg-nova-accent mt-1.5 flex-shrink-0" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {app.ai_analysis.behavioralAlignment && (
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <p className="text-[9px] font-black text-nova-pulse uppercase tracking-[0.3em] mb-2">Behavioral_Fit</p>
                            <p className="text-[11px] text-slate-400 italic leading-relaxed">{app.ai_analysis.behavioralAlignment}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-end items-end gap-4">
                        <div className="flex flex-wrap gap-2 justify-end">
                          {STATUS_OPTIONS.filter(opt => opt.value !== app.status).map((opt) => (
                            <button
                              key={opt.value}
                              disabled={updatingId === app.id || isBlurred}
                              onClick={() => handleStatusUpdate(app.id, opt.value)}
                              className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
                                ${opt.color} ${updatingId === app.id || isBlurred ? 'opacity-20 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto mt-2">
                           {app.status === 'offered' && (
                             <button 
                               onClick={() => handleHire(app)}
                               className="flex-1 sm:flex-none rounded-xl bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl shadow-white/5"
                             >
                               Commit_Mission
                             </button>
                           )}
                           <button 
                             onClick={() => setActiveAssistant(app)}
                             className="flex-1 sm:flex-none rounded-xl bg-nova-accent text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-3 shadow-xl shadow-nova-accent/10"
                           >
                            <MessageSquare size={14} />
                            Consult_AI
                          </button>
                           <button 
                             disabled={isBlurred}
                             className={`flex-1 sm:flex-none rounded-xl px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all
                               ${isBlurred ? 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed' : 'bg-white text-black hover:opacity-90'}`}
                           >
                            {isBlurred ? "Unlock_Identity" : "Contact_Identity"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {activeAssistant && (
        <NovaAssistant 
          candidateContext={{
            candidateId: activeAssistant.id,
            matchScore: activeAssistant.match_score,
            tcnStatus: activeAssistant.candidate.tcn_status,
            isPro: !isBlurred
          }}
          onClose={() => setActiveAssistant(null)}
          onUpgrade={handleUpgradeRedirect}
        />
      )}

      {hiredApplicant && (
        <GoldenManifestCard 
          applicationId={hiredApplicant.id}
          candidateName={hiredApplicant.candidate.full_name}
          matchScore={hiredApplicant.match_score}
          onClose={() => setHiredApplicant(null)}
        />
      )}
    </div>
  );
}
