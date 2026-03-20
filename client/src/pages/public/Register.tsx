import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Logo } from '../../components/Logo';

export default function Register() {
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
  const [formData, setFormData] = useState({ email: '', password: '', company: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (role === 'employer' && !formData.company.trim()) {
      setErrorMsg('Company Name is required for Employers.');
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMsg('Password requires 8+ characters, 1 uppercase, 1 number, and 1 symbol.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          role,
          company_name: role === 'employer' ? formData.company.trim() : null,
          acquisition_source: searchParams.get('source') || 'direct',
          campaign_id: searchParams.get('campaign') || null,
          full_name: formData.email.split('@')[0]
        }
      }
    });

    if (error) {
      if (error.status === 422) {
        setErrorMsg('Email already taken or password too weak.');
      } else {
        setErrorMsg(error.message);
      }
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-nova-base flex items-center justify-center p-6 text-white selection:bg-nova-accent/30 selection:text-white relative overflow-hidden">
        {/* Background Sovereign Ambience */}
        <div className="fixed inset-0 z-0 bg-nova-mesh opacity-40 pointer-events-none" />
        <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.1),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-md nova-glass-card rounded-[2.5rem] p-10 shadow-2xl text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-nova-accent/10 blur-3xl rounded-full" />
          <Logo className="mx-auto text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" size={56} />
          <h2 className="mt-6 text-2xl font-black tracking-tight font-space uppercase">Check your email</h2>
          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 leading-relaxed">
            Verification link dispatched to <strong className="text-white">{formData.email}</strong>. 
            Activate your profile to proceed.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-8 w-full rounded-2xl bg-white text-nova-base py-5 text-sm font-black uppercase tracking-[0.2em] shadow-lg hover:bg-slate-200 transition-all active:scale-95"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nova-base flex items-center justify-center p-6 text-white selection:bg-nova-accent/30 selection:text-white relative overflow-hidden">
      {/* Background Sovereign Ambience */}
      <div className="fixed inset-0 z-0 bg-nova-mesh opacity-40 pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md nova-glass-card rounded-[2.5rem] p-10 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 left-0 w-32 h-32 bg-nova-accent/10 blur-3xl rounded-full" />
        <div className="text-center mb-8">
          <Logo className="mx-auto text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform" size={56} />
          <h2 className="mt-6 text-3xl font-black tracking-tight font-space uppercase">Join Nova</h2>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Initialize Operative Profile</p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1.5 rounded-[1.25rem] border border-white/10 bg-black/20 mb-8">
          <button 
            type="button"
            onClick={() => setRole('candidate')} 
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              role === 'candidate' 
                ? 'bg-nova-accent text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' 
                : 'text-slate-500 hover:text-white'
            }`}
          >
            Candidate
          </button>
          <button 
            type="button"
            onClick={() => setRole('employer')} 
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              role === 'employer' 
                ? 'bg-nova-accent text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' 
                : 'text-slate-500 hover:text-white'
            }`}
          >
            Employer
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Email Address</span>
            <input 
              type="email" 
              required 
              autoComplete="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="nova-input mt-2 w-full rounded-2xl px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-nova-pulse/30"
              placeholder="operator@nova.mt"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Password</span>
            <input 
              type="password" 
              required 
              autoComplete="new-password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})} 
              className="nova-input mt-2 w-full rounded-2xl px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-nova-pulse/30"
              placeholder="••••••••"
            />
            <span className="text-[10px] text-slate-500 ml-1 mt-1 block">
              8+ characters, 1 uppercase, 1 number, 1 symbol
            </span>
          </label>

          {role === 'employer' && (
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-[#9B72CB]">Company Name</span>
              <input 
                type="text" 
                required 
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})} 
                className="nova-input mt-2 w-full rounded-2xl px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-nova-pulse/30"
                placeholder="Division / Entity Name"
              />
            </label>
          )}

          {errorMsg && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMsg}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading} 
            className="w-full mt-4 rounded-2xl bg-white text-nova-base py-5 text-sm font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-60"
          >
            {loading ? 'Initializing…' : 'Establish Profile'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <span>Already registered?</span>{' '}
          <Link to="/login" className="text-nova-pulse font-black uppercase tracking-widest hover:underline">
            Portal Access
          </Link>
        </div>
      </div>
    </div>
  );
}
