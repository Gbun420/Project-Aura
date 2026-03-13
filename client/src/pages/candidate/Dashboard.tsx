import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, Sparkles, Cpu, Send, Check } from 'lucide-react';
import AuraWallet from '../../components/AuraWallet';

type Vacancy = {
  id: string;
  title: string;
  description: string;
  compliance_score: number;
  status: string;
  created_at: string;
  last_activity_at?: string;
  response_rate?: number;
  employer?: { company_name?: string | null } | null;
};

type Application = any;

type MatchResult = {
  matchScore: number;
  alignment: string[];
  gaps: string[];
};

export default function CandidateDashboard() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, MatchResult>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [tcnStatus, setTcnStatus] = useState<string>('not_applicable');

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('tcn_status').eq('id', user.id).single();
        if (data && mounted) setTcnStatus(data.tcn_status);
      }
    };
    loadProfile();

    const loadMyApplications = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) return;

        const { data, error } = await supabase
          .from('applications')
          .select('id, status, created_at, job:vacancies(title, employer:profiles(company_name))')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted) setMyApplications(data || []);
      } catch (err) {
        console.error("Error loading my applications:", err);
      } finally {
        if (mounted) setAppsLoading(false);
      }
    };
    loadMyApplications();

    const loadVacancies = async () => {
      try {
        const response = await fetch('/api/hiring/hub');
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to load vacancies');
        if (mounted) setVacancies(data.vacancies || []);
      } catch (err) {
        // Log error to telemetry but don't disrupt the pulse stream
        console.error('LID_FETCH_ERR:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadVacancies();

    return () => { mounted = false; };
  }, []);

  const handleCalculateMatch = async (jobId: string, description: string) => {
    setMatchLoading(jobId);
    try {
      const resumeText = "Experienced HR operations specialist with a focus on compliance and iGaming. Strong background in Maltese labor laws (DIER) and Identità work permit processes.";
      const response = await fetch('/api/ai/neural', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESUME_MATCH',
          payload: { resumeText, jobDescription: description }
        })
      });
      const result = await response.json();
      if (response.ok) {
        const finalScore = tcnStatus === 'verified_skills_pass' ? Math.min(100, result.matchScore + 15) : result.matchScore;
        setMatches(prev => ({ ...prev, [jobId]: { ...result, matchScore: finalScore } }));
      }
    } finally {
      setMatchLoading(null);
    }
  };

  const handleSubmitApplication = async (jobId: string) => {
    const match = matches[jobId];
    if (!match) return;
    setSubmitting(jobId);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const response = await fetch('/api/hiring/hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          action: 'SUBMIT_APPLICATION',
          jobId,
          matchScore: match.matchScore,
          aiAnalysis: match
        })
      });
      if (response.ok) setSubmitted(prev => ({ ...prev, [jobId]: true }));
    } finally {
      setSubmitting(null);
    }
  };

  const handleSkillsPassUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVerifying(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const response = await fetch('/api/ai/neural', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'VERIFY_SKILLS_PASS', payload: { fileData: base64, mimeType: file.type } })
      });
      const result = await response.json();
      if (result.verified && result.confidence > 0.8) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').update({ tcn_status: 'verified_skills_pass' }).eq('id', user.id);
          setTcnStatus('verified_skills_pass');
          alert("AURA_CORE: Skills Pass Verified! +15% Neural Boost Applied.");
        }
      } else {
        alert(result.reasoning || "Verification failed.");
      }
      setVerifying(false);
    };
  };

  return (
    <div className="space-y-10">
      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-aura-accent mb-2">NEURAL_MISSION_CONTROL_V1.1</p>
          <h1 className="text-4xl font-black text-white tracking-tight">Candidate Overview</h1>
        </div>
        <div className="flex flex-wrap gap-4">
          {[
            { label: 'ACTIVE_MISSIONS', value: myApplications.length },
            { label: 'MATCH_SCORE', value: 'A+' },
            { label: 'COMPLIANCE', value: tcnStatus === 'verified_skills_pass' ? '100%' : '85%' },
          ].map(item => (
            <div key={item.label} className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">{item.label}</p>
              <p className="text-base font-black text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </header>

      {/* HARDENED GRID ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: Active Applications (Spans 8) */}
        <div className="lg:col-span-8 space-y-8">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-aura-accent border-b border-white/5 pb-4">My_Active_Applications</h3>
          <div className="grid gap-4">
            {appsLoading ? (
              <div className="text-xs font-mono text-slate-600 animate-pulse uppercase tracking-widest py-8">Initialising_Handshake_Feed...</div>
            ) : myApplications.length === 0 ? (
              <div className="p-12 rounded-[2.5rem] border-2 border-dashed border-white/5 text-center bg-white/[0.01]">
                <p className="text-slate-600 text-xs uppercase font-black tracking-widest">No_Missions_Engaged</p>
              </div>
            ) : (
              myApplications.map((app: Application) => (
                <div key={app.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between group hover:border-white/20 transition-all">
                  <div>
                    <p className="text-lg font-black text-white tracking-tight">{app.job?.[0]?.title}</p>
                    <p className="text-xs text-aura-accent font-bold uppercase tracking-widest mt-1">{app.job?.[0]?.employer?.[0]?.company_name}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border 
                    ${app.status === 'shortlisted' ? 'bg-aura-accent/20 text-white border-aura-accent/30' :
                      app.status === 'interview' ? 'bg-aura-pulse/20 text-aura-pulse border-aura-pulse/30' :
                      'bg-white/5 text-slate-400 border-white/10'}`}>
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Opportunities Pulse */}
          <div className="pt-10 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-aura-accent">Aura_Match_Pulse</h3>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{vacancies.length}_Neural_Matches_Found</span>
            </div>
            <div className="grid gap-6">
              {loading ? (
                <div className="text-xs font-mono text-slate-600 animate-pulse uppercase tracking-widest py-12 text-center">Scanning_Network_For_Sync...</div>
              ) : (
                vacancies.map((vacancy) => (
                  <div key={vacancy.id} className="group relative rounded-[2.5rem] bg-white/5 border border-white/10 p-8 hover:border-aura-pulse/30 transition-all overflow-hidden">
                    <div className="absolute inset-0 bg-aura-glass-gradient opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
                      <div className="flex-1 space-y-4">
                        <div>
                          <h4 className="text-2xl font-black text-white tracking-tight">{vacancy.title}</h4>
                          <p className="text-xs font-black text-aura-accent uppercase tracking-widest mt-1">{vacancy.employer?.company_name || 'Aura_Employer'}</p>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl line-clamp-2">{vacancy.description}</p>
                        {matches[vacancy.id] && (
                          <div className="mt-8 p-6 rounded-3xl bg-aura-accent/5 border border-aura-accent/20 animate-in fade-in zoom-in-95">
                            <div className="flex items-center gap-6 mb-6">
                              <span className="text-5xl font-black bg-gemini-gradient bg-clip-text text-transparent font-mono tracking-tighter">{matches[vacancy.id].matchScore}%</span>
                              <div className="h-10 w-px bg-white/10" />
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural_Match_Score</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-8">
                              <div>
                                <p className="text-[9px] font-black text-aura-pulse uppercase tracking-[0.3em] mb-3">Core_Alignments</p>
                                <ul className="space-y-2">
                                  {matches[vacancy.id].alignment.map((item: string, i: number) => (
                                    <li key={i} className="text-[11px] text-slate-300 flex items-start gap-2 italic"><span className="text-aura-pulse">•</span> {item}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-gemini-pink uppercase tracking-[0.3em] mb-3">Growth_Gaps</p>
                                <ul className="space-y-2">
                                  {matches[vacancy.id].gaps.map((item: string, i: number) => (
                                    <li key={i} className="text-[11px] text-slate-300 flex items-start gap-2 italic"><span className="text-gemini-pink">•</span> {item}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-4 min-w-[240px]">
                        <div className="flex flex-wrap gap-3">
                          <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Compliance_{vacancy.compliance_score}%</span>
                          </div>
                          {vacancy.last_activity_at && new Date(vacancy.last_activity_at).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000) && (
                            <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Verified_Active</span>
                            </div>
                          )}
                          {vacancy.response_rate && vacancy.response_rate > 70 && (
                            <div className="px-4 py-1.5 bg-aura-accent/10 border border-aura-accent/30 rounded-full">
                              <span className="text-[9px] font-black text-aura-accent uppercase tracking-widest">High_Response_{Math.round(vacancy.response_rate)}%</span>
                            </div>
                          )}
                        </div>
                        {submitted[vacancy.id] ? (
                          <div className="w-full flex items-center justify-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                            <Check size={16} className="text-emerald-400" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Identity_Handshake_Sent</span>
                          </div>
                        ) : !matches[vacancy.id] ? (
                          <button disabled={matchLoading === vacancy.id} onClick={() => handleCalculateMatch(vacancy.id, vacancy.description)} className="w-full py-4 rounded-2xl bg-gemini-gradient text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-aura-accent/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                            {matchLoading === vacancy.id ? <><div className="h-3 w-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />Calibrating_Neural_Sync...</> : <><Sparkles size={14} />Calculate_Aura_Match</>}
                          </button>
                        ) : (
                          <button disabled={submitting === vacancy.id} onClick={() => handleSubmitApplication(vacancy.id)} className="w-full py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-xl">
                            <Send size={14} />Submit_Verified_Identity
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Wallet & Compliance (Spans 4) */}
        <div className="lg:col-span-4 space-y-10">
          <AuraWallet tcnStatus={tcnStatus} applicationsCount={myApplications.length} />

          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-aura-accent">Compliance_Vault</h3>
            <div className="p-8 rounded-[2.5rem] bg-gemini-gradient relative overflow-hidden group shadow-2xl shadow-aura-accent/20">
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <ShieldCheck size={24} className="text-white" />
                  {tcnStatus === 'verified_skills_pass' ? (
                    <span className="bg-emerald-500/30 border border-emerald-500/50 text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Verified_2026</span>
                  ) : (
                    <span className="bg-white/20 text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse">Pending_Audit</span>
                  )}
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">2026_Skills_Pass_Sync</h4>
                <p className="text-xs text-white/70 leading-relaxed mb-8">Boost your Neural Match Score by <span className="font-black text-white underline">+15%</span> through Identità Malta verification.</p>
                {tcnStatus !== 'verified_skills_pass' ? (
                  <label className={`w-full flex flex-col items-center justify-center border-2 border-dashed border-white/40 rounded-2xl p-8 cursor-pointer hover:bg-white/10 transition-all ${verifying ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleSkillsPassUpload} />
                    <Cpu size={32} className="mb-4 text-white" />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{verifying ? "Executing_Multimodal_Audit..." : "Upload_2026_Certificate"}</p>
                  </label>
                ) : (
                  <div className="flex items-center gap-4 p-5 bg-white/10 rounded-2xl border border-white/20">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Check size={20} /></div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest leading-relaxed">Regulatory_Shield_Active<br/><span className="text-white/50">Verified_for_Maltese_Market</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
