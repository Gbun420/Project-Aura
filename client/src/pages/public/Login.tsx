import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Logo } from '../../components/Logo';

export default function Login() {
  const { user, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={`/portal/${role}`} replace />;
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const redirectTo = (location.state as { from?: Location })?.from?.pathname;
    navigate(redirectTo || '/portal', { replace: true });
  };

  return (
    <div className="min-h-screen bg-nova-base flex items-center justify-center p-6 text-white selection:bg-nova-accent/30 selection:text-white relative overflow-hidden">
      {/* Background Sovereign Ambience */}
      <div className="fixed inset-0 z-0 bg-nova-mesh opacity-40 pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md nova-glass-card rounded-[2.5rem] p-10 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-nova-pulse/10 blur-3xl rounded-full" />
        <div className="text-center mb-8">
          <Logo className="mx-auto text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform" size={56} />
          <h2 className="mt-6 text-3xl font-black tracking-tight font-space uppercase">Access Nova</h2>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Neural Network Entry</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Email Address</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="nova-input mt-2 w-full rounded-2xl px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-nova-pulse/30"
              placeholder="operator@nova.mt"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="nova-input mt-2 w-full rounded-2xl px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-nova-pulse/30"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 rounded-2xl bg-white text-nova-base py-5 text-sm font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-60"
          >
            {loading ? 'Authenticating…' : 'Establish Link'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <span>New operative?</span>{' '}
          <Link to="/register" className="text-nova-pulse font-black uppercase tracking-widest hover:underline">
            Register Unit
          </Link>
        </div>
      </div>
    </div>
  );
}
