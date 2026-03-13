import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

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
    <div className="min-h-screen bg-[#0F1114] flex items-center justify-center p-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(66,133,244,0.25),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(155,114,203,0.2),transparent_35%)]" />
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-[#4285F4] via-[#9B72CB] to-[#D96570]" />
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Access AURA_CORE</h2>
          <p className="mt-2 text-sm text-slate-400">Initialize your session to continue.</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Identity (Email)</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#9B72CB]"
              placeholder="you@company.com"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Access Key</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#9B72CB]"
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
            className="w-full rounded-xl bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Authenticating…' : 'Authenticate'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <span>Need access?</span>{' '}
          <Link to="/register" className="text-[#4285F4] font-bold hover:underline">
            Register Mission Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
