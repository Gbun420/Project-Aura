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

    // Modern 2026 Password Complexity Check (Hardened Grid v1.3)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMsg('IDENTITY_REJECTED: Credential requires 8+ chars, 1 uppercase, 1 number, and 1 symbol.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: 'https://aura-cloud-2026.vercel.app',
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
          setErrorMsg('IDENTITY_CONFLICT: Complexity failure or existing email. Use a stronger unique password.');
        } else {
          setErrorMsg(`AUTH_ERROR: ${error.message.toUpperCase()}`);
        }
    } else {
        alert("Aura Handshake Initiated! Please check your mission email for the verification link.");
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
          <div className="inline-block px-3 py-1 bg-aura-accent/20 text-aura-pulse text-[10px] font-black rounded-full mb-4 tracking-[0.3em] uppercase">Aura_v1.2_Sovereign</div>
          <h2 className="text-4xl font-black text-white tracking-tight">Create Identity</h2>
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
            <label className="text-[10px] font-black text-slate-500 ml-4 tracking-[0.2em] uppercase">Mission_Email</label>
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
            <label className="text-[10px] font-black text-slate-500 ml-4 tracking-[0.2em] uppercase">Secure_Credential</label>
            <input 
              type="password" 
              placeholder="Sovereign Password" 
              className="w-full aura-input rounded-2xl p-4 outline-none transition-all"
              required 
              autoComplete="new-password"
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
            <span className="text-[9px] text-aura-pulse ml-4 mt-1 block font-mono uppercase tracking-widest font-bold">
              IDENTITY_REQUIREMENT: 8+ Chars, 1 Upper, 1 Number, 1 Symbol
            </span>

          </div>

          {role === 'employer' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
              <label className="text-[10px] font-black text-gemini-purple ml-4 tracking-[0.2em] uppercase">Company_Identity</label>
              <input 
                type="text" 
                placeholder="e.g. Aura iGaming Malta" 
                className="w-full aura-input border-gemini-purple/30 rounded-2xl p-4 outline-none transition-all" 
                required 
                onChange={e => setFormData({...formData, company: e.target.value})} 
              />
            </div>
          )}

          <button 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] text-white font-black py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all mt-4 shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50 tracking-[0.2em] text-[11px] uppercase"
          >
            {loading ? "COMMITTING_TO_LEDGER..." : "Register_Identity_Pulse"}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8 text-[10px] font-black tracking-[0.2em] uppercase">
          Already Identified? <Link to="/login" className="text-gemini-blue hover:underline">Access_Portal</Link>
        </p>
      </div>
    </div>
  );
}
