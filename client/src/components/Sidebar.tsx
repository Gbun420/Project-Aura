import { Link, useLocation } from 'react-router-dom';
import { Brain, Shield, Bell, User, Briefcase, Settings, Target, Book, Users, Clock, CreditCard } from 'lucide-react';
import type { NovaRole } from '../types/nova.js';
import { Logo } from './Logo';

interface NavItemProps {
  icon: typeof Brain;
  label: string;
  path: string;
  badge?: string;
  active?: boolean;
}

const NavItem = ({ icon: Icon, label, path, badge, active }: NavItemProps) => (
  <Link
    to={path}
    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all group ${
      active
        ? 'bg-blue-500/10 text-white shadow-[0_0_20px_rgba(79,70,229,0.1)] border border-blue-500/20'
        : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
    }`}
  >
    <Icon size={18} className={active ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400 transition-colors'} />
    <span className="flex-1 uppercase tracking-widest text-[10px]">{label}</span>
    {badge && (
      <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[9px] font-mono border border-blue-500/30">
        {badge}
      </span>
    )}
  </Link>
);

export default function Sidebar({ role }: { role: NovaRole }) {
  const location = useLocation();
  const base = `/portal/${role}`;

  // Common items
  const navItems: NavItemProps[] = [
    { label: 'Dashboard', icon: Brain, path: base },
    { label: 'Notifications', icon: Bell, path: `${base}/notifications` },
  ];

  // Role-specific items
  if (role === 'candidate') {
    navItems.push(
      { label: 'Jobs', icon: Briefcase, path: `${base}/jobs` },
      { label: 'Insights', icon: Target, path: `${base}/insights` },
      { label: 'Vault', icon: Book, path: `${base}/vault` }
    );
  } else if (role === 'employer') {
    navItems.push(
      { label: 'Applicants', icon: Users, path: `${base}/applicants` },
      { label: 'Jobs', icon: Briefcase, path: `${base}/jobs` },
      { label: 'Tracking', icon: Clock, path: `${base}/history` },
      { label: 'Pricing', icon: CreditCard, path: `${base}/pricing` },
      { label: 'Compliance center', icon: Shield, path: `${base}/compliance` }
    );
  } else if (role === 'admin' || role === 'platform_owner') {
    navItems.push(
      { label: 'Users', icon: Users, path: `${base}/users` },
      { label: 'Jobs', icon: Briefcase, path: `${base}/jobs` },
      { label: 'Audit Log', icon: Shield, path: `${base}/audit` }
    );
  }

  // Settings and Profile go last
  navItems.push(
    { label: 'Profile', icon: User, path: `${base}/profile` },
    { label: 'Settings', icon: Settings, path: `${base}/settings` }
  );

  const portals = {
    candidate: { color: 'blue', label: 'Candidate Portal' },
    employer: { color: 'purple', label: 'Employer Portal' },
    admin: { color: 'red', label: 'Admin Command' },
    platform_owner: { color: 'red', label: 'Owner Command' }
  };

  const currentPortal = portals[role as keyof typeof portals] || portals.candidate;

  return (
    <aside className="w-64 shrink-0 border-r border-white/5 bg-[#050505] flex flex-col h-screen">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Logo size={42} className="relative z-10 drop-shadow-[0_0_10px_rgba(79,70,229,0.5)] text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Nova</p>
            <p className="text-xs font-black text-white uppercase tracking-widest">{currentPortal.label}</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2 flex-1 mt-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            path={item.path}
            badge={item.badge}
            active={location.pathname === item.path || location.pathname === `${item.path}/`}
          />
        ))}
      </nav>

      {/* System Status */}
      <div className="p-6 mt-auto border-t border-white/5">
        <div className="p-5 bg-gradient-to-br from-blue-500/5 to-blue-400/5 rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-black text-white uppercase tracking-widest">System Status</span>
            <span className="ml-auto text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
              ONLINE
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 leading-relaxed font-mono uppercase tracking-tighter">
            Platform operational
          </p>
        </div>
      </div>
    </aside>
  );
}
