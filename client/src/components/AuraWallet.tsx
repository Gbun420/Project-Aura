import React from 'react';
import { ShieldCheck, Wallet, Cpu, ChevronRight, Lock } from 'lucide-react';

type WalletProps = {
  tcnStatus: string;
  applicationsCount: number;
};

export default function AuraWallet({ tcnStatus, applicationsCount }: WalletProps) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl relative overflow-hidden group shadow-2xl shadow-aura-accent/10">
      <div className="absolute inset-0 bg-aura-glass-gradient opacity-30 pointer-events-none" />
      
      {/* Branding Header */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gemini-gradient flex items-center justify-center shadow-lg shadow-aura-accent/20">
            <Wallet size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Aura_Wallet</h3>
            <p className="text-[9px] font-mono text-aura-pulse uppercase tracking-widest">Bounty_Guardian_Active</p>
          </div>
        </div>
        <div className="h-2 w-2 rounded-full bg-aura-pulse animate-pulse shadow-[0_0_8px_#22D3EE]" />
      </div>

      {/* Main Metric */}
      <div className="mb-10 relative z-10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Protected_Success_Fees</p>
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-black bg-gemini-gradient bg-clip-text text-transparent tracking-tighter">€{(applicationsCount * 1250).toLocaleString()}</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Est._ROI</span>
        </div>
      </div>

      {/* Compliance Signal */}
      <div className="p-5 rounded-2xl bg-aura-accent/10 border border-aura-accent/30 mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`h-8 w-8 rounded-xl flex items-center justify-center 
            ${tcnStatus === 'verified_skills_pass' ? 'bg-aura-pulse/20 text-aura-pulse' : 'bg-white/5 text-slate-500'}`}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Regulatory_Shield</p>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
              {tcnStatus === 'verified_skills_pass' ? 'Verified_Identità_2026' : 'Awaiting_Verification'}
            </p>
          </div>
        </div>
      </div>

      {/* Ledger ID */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between group/item cursor-pointer">
          <div className="flex items-center gap-3">
            <Cpu size={14} className="text-slate-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">View_Ledger_History</span>
          </div>
          <ChevronRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
        </div>
        <div className="h-px w-full bg-white/5" />
        <div className="flex items-center justify-between group/item cursor-not-allowed opacity-40">
          <div className="flex items-center gap-3">
            <Lock size={14} className="text-slate-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Withdraw_Success_Credits</span>
          </div>
          <Lock size={14} className="text-slate-600" />
        </div>
      </div>

      {/* Background Neural Noise Overlay */}
      <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-aura-accent/10 rounded-full blur-3xl" />
    </div>
  );
}
