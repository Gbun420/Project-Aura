import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, TrendingUp, Users, Wallet, Activity, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        const response = await fetch('/api/system/health', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setMetrics(data);
        }
      } catch (err) {
        console.error("Telemetry error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Syncing_Owner_Telemetry...</div>
      </div>
    );
  }

  const kpis = [
    { label: 'Gross_Ledger_Volume', value: `€${(metrics?.gross_ledger_volume || 0).toLocaleString()}`, icon: Wallet, color: 'text-aura-accent' },
    { label: 'Monthly_Recurring_Rev', value: `€${(metrics?.mrr || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Neural_Conversions', value: `${metrics?.pro_subscriptions || 0}`, icon: Activity, color: 'text-aura-pulse' },
    { label: 'Verified_Identities', value: metrics?.total_registrations || 0, icon: Users, color: 'text-white' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-aura-accent mb-2">Sovereign_Command_v1.1</p>
          <h2 className="text-4xl font-black text-white tracking-tight">System Overview</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Aura_Core_Stable</span>
          </div>
          <button className="px-6 py-2 bg-aura-accent text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all">
            Export_Audit_PDF
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
              <kpi.icon size={48} />
            </div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">{kpi.label}</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black tracking-tighter ${kpi.color}`}>{kpi.value}</span>
              <ArrowUpRight size={14} className="text-slate-600" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10">
        {/* Market Density Heatmap */}
        <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Market_Density_Heatmap</h3>
            <span className="text-[10px] font-mono text-aura-pulse animate-pulse uppercase tracking-widest">Neural_Sync_Active</span>
          </div>
          
          <div className="space-y-8">
            {(metrics?.sector_heatmap || []).map((item: any) => (
              <div key={item.sector} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-lg font-black text-white tracking-tight">{item.sector}</span>
                    <span className="ml-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg_Match: {item.avgMatch}%</span>
                  </div>
                  <span className="text-[10px] font-black font-mono text-aura-accent">{item.density}% Density</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gemini-gradient shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all duration-1000"
                    style={{ width: `${item.density}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 pt-12 mt-8 border-t border-white/5">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Employer_Density</p>
              <p className="text-xl font-black text-white">{((metrics?.employer_count / metrics?.total_registrations) * 100 || 0).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Neural_Accuracy</p>
              <p className="text-xl font-black text-aura-pulse">98.4%</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Active_Hubs</p>
              <p className="text-xl font-black text-emerald-400">4/4</p>
            </div>
          </div>
        </div>

        {/* Ledger Recent Events */}
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-aura-accent">Ledger_Success_Feed</h3>
          <div className="space-y-4">
            {[
              { event: 'Pioneer_Upgrade', detail: 'ID_7F8B', time: '2m ago', val: '+€29', color: 'text-emerald-400' },
              { event: 'Identity_Verified', detail: 'TCN_SYNC', time: '14m ago', val: 'PASS', color: 'text-aura-pulse' },
              { event: 'Mission_Commit', detail: 'LEAD_HIRE', time: '1h ago', val: 'HASHED', color: 'text-aura-accent' },
              { event: 'Pioneer_Upgrade', detail: 'ID_2C1D', time: '3h ago', val: '+€29', color: 'text-emerald-400' },
            ].map((ev, i) => (
              <div key={i} className="p-5 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">{ev.event}</p>
                  <p className="text-[9px] font-mono text-slate-500 mt-1">{ev.detail} • {ev.time}</p>
                </div>
                <span className={`text-[10px] font-black font-mono ${ev.color}`}>{ev.val}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-white/5 transition-all">
            View_Full_Ledger_History
          </button>
        </div>
      </div>
    </div>
  );
}
