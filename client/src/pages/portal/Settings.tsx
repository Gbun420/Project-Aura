import { Settings as SettingsIcon, Bell, Shield, Smartphone, Globe, CreditCard, ChevronRight } from '@/icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function Settings() {
  const { role, profile } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const sections = [
    {
      id: 'notifications',
      title: 'Neural_Alert_Protocol',
      description: 'System-wide notification and firing filters',
      icon: <Bell className="text-blue-400" size={20} />,
      status: 'OPTIMIZED'
    },
    {
      id: 'security',
      title: 'Vault_Lockdown_Logic',
      description: 'encryption keys and biometric sync status',
      icon: <Shield className="text-purple-400" size={20} />,
      status: 'MAX_SECURE'
    },
    {
      id: 'mobile',
      title: 'Peripheral_Device_Sync',
      description: 'Mobile identity and 2FA authentication links',
      icon: <Smartphone className="text-amber-400" size={20} />,
      status: 'LINKED'
    },
    {
      id: 'network',
      title: 'Global_Relay_Nodes',
      description: 'Preferred data centers and regional compliance',
      icon: <Globe className="text-emerald-400" size={20} />,
      status: 'EU_ZONE_1'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="text-slate-400" size={32} />
          System Parameters
        </h1>
        <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
          Configure your aura environment logic
        </p>
      </div>

      <div className="grid gap-6">
        {/* Billing Overview */}
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-400/30 shadow-xl shadow-blue-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <CreditCard size={120} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Active_Subscription</span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {profile?.subscription_tier === 'pro' ? 'Sovereign_Plus_v1.4' : 'Aura_Core_Standard'}
              </h2>
              <p className="text-blue-200/60 text-xs font-bold uppercase tracking-wider">
                {profile?.subscription_tier === 'pro' ? 'Next Renewal: April 12, 2026' : 'Free Tier / Enterprise Managed'}
              </p>
            </div>
            {role === 'employer' && (
              <button className="px-6 py-3 bg-white text-blue-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all">
                Manage_Billing_Portal
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="grid gap-4">
          {sections.map((section) => (
            <button 
              key={section.id}
              className="w-full flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all group group"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                  {section.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">{section.title}</h3>
                  <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider mt-0.5">{section.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">{section.status}</span>
                <ChevronRight size={18} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-center">
          <button 
            onClick={handleSignOut}
            className="text-red-400/60 hover:text-red-400 text-[10px] font-black uppercase tracking-[0.2em] transition-colors py-4"
          >
            Terminate_Aura_Session
          </button>
        </div>
      </div>
    </div>
  );
}
