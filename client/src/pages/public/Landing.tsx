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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={42} className="text-slate-900 drop-shadow-sm" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Welcome to</p>
              <p className="text-lg font-semibold">Nova</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600 font-medium">
            <a className="hover:text-slate-900" href="#features">Features</a>
            <a className="hover:text-slate-900" href="#portals">Portals</a>
            <Link className="hover:text-slate-900" to="/compliance">Compliance</Link>
            <Link className="hover:text-slate-900 font-semibold text-[#4285F4]" to="/register">Sign Up</Link>
            <Link className="hover:text-slate-900" to="/login">Log In</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              Employer Portal
              <LandingArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition"
            >
              Browse Talent
            </Link>
          </div>
        </div>
      </header>

      {/* Update Announcement */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="flex items-center gap-2">
               <LandingSparkles size={16} className="text-blue-600" />
              <span className="font-semibold text-blue-900">New specific jobs added:</span>
              <span className="text-blue-800">Hundreds of exclusive Malta jobs are now live.</span>
            </div>
            <Link to="/register" className="ml-4 text-xs font-semibold text-blue-700 hover:underline">
              Find out more →
            </Link>
          </div>
        </div>
      </div>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-20%,rgba(66,133,244,0.2),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(155,114,203,0.18),transparent_40%)]" />
          <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-16">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                   <LandingSparkles size={14} className="text-indigo-600" />
                  Malta's Intelligent Talent Network
                </div>
                <h1 className="mt-6 text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 font-['Space_Grotesk']">
                  Welcome to Nova.
                  <span className="text-indigo-600 block mt-2">
                    Hire smarter, faster.
                  </span>
                </h1>
                <p className="mt-6 text-lg text-slate-600 max-w-xl">
                  Seamless hiring and intelligent talent matching for
                  agencies and employers who need clarity, speed, and confidence in the Maltese market.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition"
                  >
                    Post a Vacancy
                    <LandingArrowRight size={16} />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                  >
                    Explore Roles
                  </Link>
                </div>
                <div className="mt-10 flex items-center gap-6 text-xs font-semibold text-slate-500">
                  <span>Built for the Maltese market</span>
                  <span>Identità-ready compliance</span>
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
                  <h3 className="text-sm font-semibold text-slate-700">Quick Job Search</h3>
                  <p className="text-xs text-slate-500 mt-1">Match roles and talent with advanced filters.</p>
                  <div className="mt-5 grid gap-3">
                    <input
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/20"
                      placeholder="Job title, keyword, or skill"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#9B72CB]/20"
                        placeholder="Location"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                      />
                      <select 
                        aria-label="Contract Type"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#9B72CB]/20"
                        value={searchContractType}
                        onChange={(e) => setSearchContractType(e.target.value)}
                      >
                        <option>Contract Type</option>
                        <option>Full-time</option>
                        <option>Hybrid</option>
                        <option>Remote</option>
                      </select>
                    </div>
                    <button 
                      onClick={handleSearch}
                      className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200/40 transition"
                    >
                      Search Opportunities
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </div>
            </section>

            <section id="features" className="max-w-6xl mx-auto px-6 py-16">            <div className="grid lg:grid-cols-3 gap-6">
              {[
                { 
                   icon: LandingShieldCheck, 
                  title: 'Compliance Confidence', 
                  copy: 'Automated Identità checks keep every placement audit-ready.',
                  badge: 'GDPR & Malta Compliant'
                },
                { 
                   icon: LandingUsers,
                  title: 'Talent Network', 
                  copy: 'Connect directly with the best-fit candidates with clear match signals.',
                  badge: 'Smart Matching'
                },
                { 
                   icon: LandingWand2, 
                  title: 'Workflow Automation', 
                  copy: 'From intake to offer, every step is orchestrated inside Nova.',
                  badge: 'Powerful Tools'
                },
              ].map(({ icon: Icon, title, copy, badge }) => (
                <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-semibold text-[#4285F4] bg-blue-50 px-2 py-1 rounded-full">
                      {badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-6 pb-20">
            <div className="rounded-3xl bg-gradient-to-r from-[#4285F4]/5 to-[#9B72CB]/5 border border-slate-200 p-10 text-center">
              <LandingSparkles size={24} className="text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-slate-900 font-['Space_Grotesk']">Ready to find your next role?</h2>
              <p className="mt-3 text-slate-600 max-w-lg mx-auto">Sign up to browse live opportunities from employers across Malta. New roles are posted daily.</p>
              <div className="mt-6 flex justify-center gap-4">
                <Link to="/register" className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition">
                  Browse Jobs <LandingArrowRight size={16} />
                </Link>
                <Link to="/register" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
                  Post a Vacancy
                </Link>
              </div>
            </div>
          </section>
          <section id="portals" className="bg-white border-t border-slate-200">
            <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
              <div>
                <h2 className="text-3xl font-semibold text-slate-900 font-['Space_Grotesk']">One portal. Three command centers.</h2>
                <p className="mt-4 text-slate-600">
                  Nova keeps candidates, employers, and administrators in sync with a single secure workspace.
                  Roles automatically route to the correct dashboard without manual switching.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/login" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                    Candidate Portal
                  </Link>
                  <Link to="/login" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                    Employer Portal
                  </Link>
                  <Link to="/login" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                    Admin Command
                  </Link>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-blue-50 p-6">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Nova Pulse</p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900">Unified hiring intelligence</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Built for scale with smart compliance, audit trails, and talent analytics.
                  </p>
                  <button className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                    Book a Demo
                    <LandingArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>

        </main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-xs text-slate-500 mb-8 border-b border-slate-100 pb-8">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-widest mb-4">Nova Platform</h4>
                <p className="leading-relaxed">
                  The premier recruitment platform calibrated for the Maltese labor market. 
                  Built for agencies and employers who prioritize compliance and speed.
                </p>
                <div className="mt-3 flex items-center gap-2">
                   <LandingSparkles size={12} className="text-[#4285F4]" />
                  <span className="text-xs font-semibold">Nova Core Active</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-widest mb-4">Compliance & Regulatory</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                     <LandingShieldCheck size={12} className="text-green-500" />
                    <span>Primary Contact: <a href="mailto:hello@novamalta.com" className="text-blue-600 hover:underline">hello@novamalta.com</a></span>
                  </li>
                  <li>Compliance Officer: Designation Active</li>
                  <li>Regulatory Response: within 48 hours</li>
                  <li>Licensed under Maltese Employment Agencies Regulations 2023</li>
                  <li>Automated Document Verification: Active</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-widest mb-4">Data Protection</h4>
                <p className="leading-relaxed mb-2">
                  GDPR Article 13/14 Compliant. All secure candidate data processed locally.
                </p>
                <p className="italic mb-2">Data Controller: Nova</p>
                <div className="text-xs text-slate-400">
                  <span className="font-semibold">Security:</span> AES-256 Encryption
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10px] text-slate-400 uppercase tracking-widest">
              <span>Nova • Malta • All rights reserved</span>
              <span>Compliance-ready. Built for scale.</span>
            </div>
          </div>
          </footer>
          </div>
          );
          }