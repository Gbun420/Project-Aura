import { useState } from 'react';
import { User, Mail, Shield, ShieldCheck, Key, Globe, Camera } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import SEO from '../../components/SEO';

export default function Profile() {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <SEO title="Identity Manifest" noindex />
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <User className="text-purple-400" size={32} />
          Identity Manifest
        </h1>
        <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
          Manage your sovereign digital presence
        </p>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-10">
        {/* Sidebar / Avatar */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-500 p-1">
                <div className="w-full h-full rounded-[1.25rem] bg-slate-950 flex items-center justify-center text-white text-3xl font-black">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
              <button 
                title="Change Avatar"
                aria-label="Change avatar"
                className="absolute -bottom-2 -right-2 p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-900/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={14} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">{profile?.full_name || 'Aura_User'}</h3>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em] mt-1">{profile?.role || 'SYETEM_ADMIN'}</p>
            
            <div className="mt-8 pt-8 border-t border-white/5 w-full space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">TRUST_SCORE</span>
                <span className="text-emerald-400 font-mono">98.2%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[98%] h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Account_Parameters</h2>
              <button 
                title={isEditing ? 'Revert changes' : 'Modify manifest'}
                aria-label={isEditing ? 'Revert changes' : 'Modify manifest'}
                onClick={() => setIsEditing(!isEditing)}
                className="text-purple-400 text-[10px] font-black uppercase tracking-widest hover:text-purple-300 transition-colors"
              >
                {isEditing ? 'REVERT_CHANGES' : 'MODIFY_MANIFEST'}
              </button>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <label htmlFor="identity_email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">IDENTITY_EMAIL</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-400 transition-colors" size={16} />
                  <input 
                    id="identity_email"
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    title="Identity Email (Immutable)"
                    placeholder="identity@aura.network"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-400 font-mono focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="full_legal_name" className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">FULL_LEGAL_NAME</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-400 transition-colors" size={16} />
                  <input 
                    id="full_legal_name"
                    type="text" 
                    defaultValue={profile?.full_name || ''} 
                    disabled={!isEditing}
                    title="Full Legal Name"
                    placeholder="Enter full legal name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white font-mono focus:outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="sovereign_role" className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">SOVEREIGN_ROLE</label>
                  <div className="relative group">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors" size={16} />
                    <input 
                      id="sovereign_role"
                      type="text" 
                      value={profile?.role || ''} 
                      disabled 
                      title="Sovereign Role (System Managed)"
                      placeholder="Access Tier"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-400 font-mono focus:outline-none cursor-not-allowed uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="system_access_key" className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">SYSTEM_ACCESS_KEY</label>
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors" size={16} />
                    <input 
                      id="system_access_key"
                      type="password" 
                      value="********" 
                      disabled 
                      title="System Access Key (Encrypted)"
                      placeholder="Security Token"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-400 font-mono focus:outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <button 
                title="Commit Identity Sync"
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20"
              >
                COMMIT_IDENTITY_SYNC
              </button>
            )}
          </div>

          <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold uppercase tracking-tight text-sm">Identità_Verified</h4>
                <p className="text-emerald-400/60 text-[10px] uppercase font-bold tracking-[0.1em]">Your account is compliant with Maltese iGaming standards.</p>
              </div>
            </div>
            <Globe className="text-emerald-500/20" size={32} />
          </div>
        </div>
      </div>
    </div>
  );
}
