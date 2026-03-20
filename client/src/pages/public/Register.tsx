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
      <div className="min-h-screen bg-[#0F1114] flex items-center justify-center p-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(66,133,244,0.25),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(155,114,203,0.2),transparent_35%)]" />
        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl text-center">
          <Logo className="mx-auto text-white" size={48} />
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">Check your email</h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            We've sent a verification link to <strong className="text-white">{formData.email}</strong>. 
            Click the link to activate your account.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:opacity-90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1114] flex items-center justify-center p-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(66,133,244,0.25),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(155,114,203,0.2),transparent_35%)]" />
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <Logo className="mx-auto text-white" size={48} />
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Join Nova</h2>
          <p className="mt-2 text-sm text-slate-400">Create your account to get started.</p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1 rounded-xl border border-white/10 bg-white/5 mb-6">
          <button 
            type="button"
            onClick={() => setRole('candidate')} 
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'candidate' 
                ? 'bg-[#4285F4] text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Candidate
          </button>
          <button 
            type="button"
            onClick={() => setRole('employer')} 
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'employer' 
                ? 'bg-[#9B72CB] text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
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
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#9B72CB]"
              placeholder="you@company.com"
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
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#9B72CB]"
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
                className="mt-2 w-full rounded-xl border border-[#9B72CB]/30 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#9B72CB]"
                placeholder="e.g. Nova Inc."
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
            className="w-full rounded-xl bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <span>Already have an account?</span>{' '}
          <Link to="/login" className="text-[#4285F4] font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
