import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

export default function Register() {
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
  const [formData, setFormData] = useState({ email: '', password: '', company: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Employer requires company name
    if (role === 'employer' && !formData.company.trim()) {
      setErrorMsg('MISSING_FIELD: Company Name is required for Employers.');
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMsg('Password requires 8+ chars, 1 uppercase, 1 number, and 1 symbol.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: 'https://project-nova-one.vercel.app',
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
          setErrorMsg('Email taken or password too weak.');
        } else {
          setErrorMsg(error.message);
        }
    } else {
        alert("Registration complete! Please check your email for the verification link.");
        navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-aura-base flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_70%)]" />
      
      <div className="w-full max-w-xl aura-glass-card rounded-[2.5rem] p-10 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-black rounded-full mb-4 tracking-[0.3em] uppercase">Nova Platform</div>
          <h2 className="text-4xl font-black text-white tracking-tight">Create Account</h2>
        </div>

        {errorMsg && (
          <div className="aura-alert-high p-4 rounded-2xl mb-8 text-[11px] animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="font-bold mr-2">⚠</span> {errorMsg}
          </div>
        )}

        <div className="flex p-1 bg-black/40 rounded-2xl mb-8 border border-white/5 relative overflow-hidden group">
          <button 
            type="button"
            onClick={() => setRole('candidate')} 
            className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all z-10 tracking-widest ${role === 'candidate' ? 'bg-gemini-blue text-white shadow-lg shadow-gemini-blue/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            CANDIDATE
          </button>
          <button 
            type="button"
            onClick={() => setRole('employer')} 
            className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all z-10 tracking-widest ${role === 'employer' ? 'bg-gemini-purple text-white shadow-lg shadow-gemini-purple/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            EMPLOYER
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 ml-4 tracking-[0.2em] uppercase">Email Address</label>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full aura-input rounded-2xl p-4 outline-none transition-all"
              required 
              autoComplete="email"
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 ml-4 tracking-[0.2em] uppercase">Password</label>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full aura-input rounded-2xl p-4 outline-none transition-all"
              required 
              autoComplete="new-password"
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
            <span className="text-[9px] text-indigo-400 ml-4 mt-1 block font-mono uppercase tracking-widest font-bold">
              Requirements: 8+ Chars, 1 Upper, 1 Number, 1 Symbol
            </span>

          </div>

          {role === 'employer' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
              <label className="text-[10px] font-black text-gemini-purple ml-4 tracking-[0.2em] uppercase">Company Name</label>
              <input 
                type="text" 
                placeholder="e.g. Nova Inc." 
                className="w-full aura-input border-gemini-purple/30 rounded-2xl p-4 outline-none transition-all" 
                required 
                onChange={e => setFormData({...formData, company: e.target.value})} 
              />
            </div>
          )}

          <button 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-black py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all mt-4 shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50 tracking-[0.2em] text-[11px] uppercase"
          >
            {loading ? "Creating Account..." : "Register Account"}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8 text-[10px] font-black tracking-[0.2em] uppercase">
          Already have an account? <Link to="/login" className="text-gemini-blue hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
