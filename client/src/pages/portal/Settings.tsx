import { useState } from 'react';
import { Settings as SettingsIcon, LogOut, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export default function Settings() {
  const { user, profile, role } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const displayRole = role === 'platform_owner' ? 'Admin' : (role || 'Candidate');

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
           <SettingsIcon className="text-blue-400" size={32} />
          Settings
        </h1>
        <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
          Manage your account configuration
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Account Overview */}
        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-8">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Shield size={20} />
             </div>
             <h2 className="text-sm font-black text-white uppercase tracking-widest">Account Status</h2>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email</p>
                   <p className="text-sm font-mono text-slate-300">{user?.email}</p>
                </div>
             </div>
             <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Role</p>
                   <p className="text-sm font-bold text-white uppercase">{displayRole}</p>
                </div>
             </div>
             <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Subscription</p>
                   <p className="text-sm font-bold text-blue-400 uppercase">{profile?.subscription_tier || 'Free Plan'}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col justify-center items-center text-center space-y-6">
           <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
              <LogOut size={24} />
           </div>
           
           <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">Sign Out</h3>
              <p className="text-xs text-slate-400 font-medium">
                 Securely end your current session. You will need to log back in to access the portal.
              </p>
           </div>

           <button 
             onClick={handleSignOut}
             disabled={signingOut}
             className="w-full mt-4 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
           >
             {signingOut ? (
               <>
                 <Loader2 size={16} className="animate-spin" />
                 Signing out...
               </>
             ) : (
               'Sign Out of Nova'
             )}
           </button>
        </div>
      </div>
    </div>
  );
}
