import { Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { NovaRole } from '../types/nova.js';

const ROLE_LABEL: Record<NovaRole, string> = {
  admin: 'Nova Admin',
  employer: 'Nova Employer',
  candidate: 'Candidate Profile',
  platform_owner: 'Nova Owner',
};

export default function PortalHeader({ role }: { role: NovaRole }) {
  const { user, profile } = useAuth();

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-transparent backdrop-blur-md">
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-2 text-sm text-slate-300 w-80 focus-within:border-blue-500/30 transition-all group">
          <Search size={14} className="text-slate-500 group-focus-within:text-blue-400" />
          <input
            placeholder="Search platform..."
            aria-label="Search platform"
            className="bg-transparent outline-none placeholder:text-slate-600 text-xs font-mono uppercase tracking-widest w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          title="View notifications"
          aria-label="View notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <Bell size={18} />
          <span className="sr-only">View notifications</span>
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full border-2 border-[#050505] animate-pulse" />
        </button>
        
        <div className="h-8 w-px bg-white/5" />

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-white uppercase tracking-widest">
              {profile?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
              {ROLE_LABEL[role]}
            </p>
          </div>
          
          <div className="group relative">
            <button 
              title="User profile menu"
              aria-label="User profile menu"
              className="h-10 w-10 rounded-2xl border border-white/10 bg-blue-500 p-[1px] hover:scale-110 transition-transform"
            >
              <div className="h-full w-full rounded-2xl bg-[#050505] flex items-center justify-center">
                <User size={18} className="text-white" />
                <span className="sr-only">User profile menu</span>
              </div>
            </button>
            
            {/* Simple Hover Menu Placeholder */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#0B0D11] border border-white/5 rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-50">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <User size={14} /> Profile Settings
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl transition-all">
                <LogOut size={14} /> Terminate Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
