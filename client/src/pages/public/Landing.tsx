import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight as LandingArrowRight, Sparkles as LandingSparkles, ShieldCheck as LandingShieldCheck, Users as LandingUsers, Wand2 as LandingWand2 } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { useState } from 'react';

export default function PublicLanding() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchContractType, setSearchContractType] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    if (searchContractType && searchContractType !== 'Contract Type') params.set('type', searchContractType);
    navigate(`/portal?role=candidate&${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-nova-base text-white overflow-x-hidden selection:bg-nova-accent/30 selection:text-white">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 bg-nova-mesh opacity-40 pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_70%)] pointer-events-none" />

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-nova-base/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
            <Logo size={40} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform" />
            <div className="hidden sm:block">
              <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">Project</p>
              <p className="text-xl font-space font-bold tracking-tight">Nova</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-slate-400">
            <a className="hover:text-white transition-colors" href="#features">Architecture</a>
            <a className="hover:text-white transition-colors" href="#portals">Platform</a>
            <Link className="hover:text-white transition-colors" to="/compliance">Compliance</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              Access Portal
              <LandingArrowRight size={14} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-nova-base px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-slate-200 transition-all active:scale-95"
            >
              Join Network
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="relative pt-24 pb-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-nova-pulse animate-pulse mb-8">
                  <LandingSparkles size={12} />
                  Intelligence Layer Active
                </div>
                <h1 className="text-6xl lg:text-8xl font-black font-space tracking-tighter leading-[0.9] mb-8">
                  The Future of <br />
                  <span className="bg-gemini-gradient bg-clip-text text-transparent">Malta Talent.</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed font-medium">
                  High-performance talent matching powered by neural orchestration. 
                  Bridge the gap between vision and execution with Nova's intelligent recruitment engine.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-3 rounded-2xl bg-nova-accent px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-2xl shadow-nova-accent/30 hover:scale-105 transition-all"
                  >
                    Initiate Search
                    <LandingArrowRight size={18} />
                  </Link>
                  <a
                    href="#"
                    className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white backdrop-blur shadow-xl hover:bg-white/10 transition-all"
                  >
                    Network Status
                  </a>
                </div>
              </div>

              <div className="flex-1 w-full max-w-xl">
                <div className="nova-glass-card rounded-[2.5rem] p-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-nova-pulse/10 blur-3xl rounded-full" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold font-space mb-2">Neural Match Search</h3>
                    <p className="text-sm text-slate-500 mb-8">Parameters calibrated for the 2026 labor market.</p>
                    <form onSubmit={handleSearch} className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Job_Role</span>
                        <input
                          className="nova-input w-full rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-nova-pulse/30"
                          placeholder="e.g. Neural Systems Architect"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Location_Node</span>
                          <input
                            className="nova-input w-full rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-nova-pulse/30"
                            placeholder="Valletta Cluster"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Contract_Type</span>
                          <select 
                            aria-label="Contract Type"
                            className="nova-input w-full rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-nova-pulse/30 appearance-none"
                            value={searchContractType}
                            onChange={(e) => setSearchContractType(e.target.value)}
                          >
                            <option>Protocol_Type</option>
                            <option>Full-time</option>
                            <option>Hybrid</option>
                            <option>Remote</option>
                          </select>
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full mt-4 rounded-2xl bg-white text-nova-base py-5 text-sm font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                      >
                        Execute Match Query
                        <LandingSparkles size={16} />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="text-center mb-20">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-nova-pulse mb-4">Neural_Architecture</h2>
            <p className="text-4xl font-space font-bold">Unlocking High-Speed Recruitment.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: LandingShieldCheck, 
                title: 'Compliance Vault', 
                copy: 'Integrated Identità verification protocols ensure 100% regulatory alignment.',
                gradient: 'from-emerald-500/20 to-nova-base'
              },
              { 
                icon: LandingUsers,
                title: 'Peer matching', 
                copy: 'Neural-backed talent scoring reduces time-to-hire by 64% using real-time insights.',
                gradient: 'from-blue-500/20 to-nova-base'
              },
              { 
                icon: LandingWand2, 
                title: 'Auto Orchestration', 
                copy: 'Automated workflow triggers from legal intake to digital offer letters.',
                gradient: 'from-purple-500/20 to-nova-base'
              },
            ].map(({ icon: Icon, title, copy, gradient }) => (
              <div key={title} className={`group p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br ${gradient} hover:border-white/20 transition-all duration-500`}>
                <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-space font-bold mb-4">{title}</h3>
                <p className="text-slate-400 leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="portals" className="relative py-24 bg-white/5 backdrop-blur-3xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1">
              <h2 className="text-5xl font-space font-black tracking-tight mb-8">One Platform. <br />Universal Intelligence.</h2>
              <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                Nova synchronizes candidates, employers, and administrators in a single, high-fidelity environment. 
                Experience a unified command center designed for the future of work.
              </p>
              <div className="flex flex-wrap gap-4">
                {['Candidate_Alpha', 'Employer_Prime', 'Admin_Command'].map(role => (
                   <div key={role} className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors cursor-default">
                    {role}
                   </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="p-1 rounded-[3rem] bg-gradient-to-r from-nova-accent via-nova-pulse to-nova-accent animate-pulse-slow">
                <div className="rounded-[2.9rem] bg-nova-base p-10 text-center">
                  <div className="h-20 w-20 rounded-full border border-nova-pulse/30 bg-nova-pulse/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
                    <LandingSparkles size={32} className="text-nova-pulse" />
                  </div>
                  <h3 className="text-3xl font-space font-bold mb-4">Unified Pulse API</h3>
                  <p className="text-slate-400 mb-8">Scaling the Maltese recruitment economy through intelligent data orchestration.</p>
                  <Link to="/register" className="inline-block rounded-2xl bg-white text-nova-base px-8 py-4 text-xs font-black uppercase tracking-[0.2em] hover:scale-105 transition-all">
                    Initiate Onboarding
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-nova-base relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Logo size={24} className="text-white" />
                <span className="text-lg font-space font-bold">Nova_2026</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                The premier intelligence layer for recruitment in Malta. 
                Calibrated for high-velocity labor markets and automated compliance standards.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Compliance_Protocols</h4>
              <ul className="space-y-4 text-xs font-medium text-slate-500">
                <li>Identità Regulatory Ready</li>
                <li>Malta Licensing Ref: EA-2023-A</li>
                <li>GDPR Sovereignty Active</li>
                <li>Secure Ledger Verification</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Neural_Endpoints</h4>
              <p className="text-xs text-slate-500">primary: <a href="mailto:hello@nova.mt" className="text-nova-pulse hover:underline">hello@nova.mt</a></p>
              <div className="pt-4 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System_Stable_STB1</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            <span>© Nova Sovereignty • Malta</span>
            <span>Est. 2026 • Powered by Gemini Nova</span>
          </div>
        </div>
      </footer>
    </div>
  );
}