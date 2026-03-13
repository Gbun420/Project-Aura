import React from 'react';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-manrope selection:bg-aura-accent/30">
      {/* 12-Column Sovereign Grid */}
      <div className="grid grid-cols-12 min-h-screen gap-0">
        
        {/* Sidebar: Fixed 2-column span */}
        <aside className="col-span-2 bg-[#0a0f1a] border-r border-white/5 p-8 hidden lg:block">
          <div className="text-xl font-black tracking-tighter text-white mb-12 uppercase italic">Aura_v1.3</div>
          <nav className="space-y-6">
            <div className="p-4 rounded-2xl bg-aura-accent/10 text-aura-pulse border border-aura-accent/30 text-[10px] font-black uppercase tracking-widest cursor-pointer">Neural_Overview</div>
            <div className="p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer text-slate-500 text-[10px] font-black uppercase tracking-widest">Ledger_History</div>
            <div className="p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer text-slate-500 text-[10px] font-black uppercase tracking-widest">Compliance_Vault</div>
            <div className="p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer text-slate-500 text-[10px] font-black uppercase tracking-widest">Settings_Sync</div>
          </nav>
        </aside>

        {/* Main Content: 10-column span */}
        <main className="col-span-12 lg:col-span-10 p-10 overflow-y-auto">
          <header className="flex justify-between items-center mb-16 border-b border-white/5 pb-8">
            <h1 className="text-4xl font-black tracking-tight uppercase">System_<span className="text-aura-accent">Command</span></h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">HEARTBEAT_STABLE</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-aura-glass border border-white/10" />
            </div>
          </header>
          
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
