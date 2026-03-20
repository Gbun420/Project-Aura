import { Lock, Cpu } from 'lucide-react';

export default function DesignSystem() {
  return (
    <div className="p-10 space-y-12 bg-nova-base min-h-screen text-white font-manrope">
      <section>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-nova-accent mb-8">01_Branding_Core</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="h-20 w-full rounded-2xl bg-nova-base border border-white/10" />
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Nova_Base (#030712)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-2xl bg-nova-accent" />
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Nova_Accent (#4F46E5)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-2xl bg-nova-pulse shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Nova_Pulse (#22D3EE)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-2xl bg-gemini-gradient" />
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Gemini_Core (Gradient)</p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-nova-accent">02_Glass_Architecture</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-nova-glass-gradient opacity-50" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">The Standard Glass Card</h3>
              <p className="text-sm text-slate-400">Used for all high-fidelity profile views and data points.</p>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-black/40 border border-white/5 backdrop-blur-md opacity-60">
            <div className="flex items-center gap-4 mb-4">
              <Lock size={20} className="text-slate-500" />
              <h3 className="text-lg font-bold text-slate-500 tracking-tight">Blurred_Identity_State</h3>
            </div>
            <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse mb-2" />
            <div className="h-4 w-1/2 rounded bg-white/5 animate-pulse" />
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-nova-accent">03_Neural_Elements</h2>
        <div className="flex flex-wrap gap-6 items-center">
          {/* Neural Badge */}
          <div className="px-4 py-2 bg-nova-pulse/10 border border-nova-pulse/30 rounded-full flex items-center gap-2 animate-pulse">
            <div className="h-1.5 w-1.5 rounded-full bg-nova-pulse shadow-[0_0_8px_#22D3EE]" />
            <span className="text-[10px] font-black font-mono text-nova-pulse uppercase tracking-widest">Compliance_Verified_2026</span>
          </div>

          {/* Match Score */}
          <div className="flex items-center gap-4">
            <span className="text-5xl font-black bg-gemini-gradient bg-clip-text text-transparent font-mono tracking-tighter">98.4%</span>
            <div className="h-px w-12 bg-white/10" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Neural_Match</span>
          </div>

          {/* Action Button */}
          <button className="px-8 py-4 rounded-2xl bg-gemini-gradient text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-nova-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            <Cpu size={14} />
            Commit_To_Ledger
          </button>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-nova-accent">04_Monospace_Data</h2>
        <div className="p-6 rounded-2xl bg-nova-surface border border-white/10 font-mono text-[11px] leading-relaxed text-slate-400">
          <p className="text-nova-pulse mb-2">// SHA-256 SUCCESS_CERTIFICATE</p>
          <p className="break-all text-white/80">NOVA_7F8B2C1D_9E0A_4B3F_8C7D_6E5F4G3H2I1J_K9L0M1N2O3P</p>
          <div className="mt-4 flex justify-between border-t border-white/5 pt-4">
            <span>TIMESTAMP: 2026-03-12T21:15:00Z</span>
            <span className="text-emerald-400 font-black">STABLE</span>
          </div>
        </div>
      </section>
    </div>
  );
}
