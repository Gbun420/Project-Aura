import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck as PricingShieldCheck, Zap as PricingZap, Lock as PricingLock, Sparkles as PricingSparkles, Check as PricingCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Pricing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleUpgrade = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      // Call the unified Hub action
      const response = await fetch('/api/hiring/hub', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          action: 'UPGRADE_SUBSCRIPTION',
          tier: 'pulse_pro',
          metadata: {
            source: searchParams.get('source') || 'direct',
            campaignId: searchParams.get('campaign') || null
          }
        })
      });

      if (response.ok) {
        alert("AURA_PRO: Pioneer Subscription Activated. Identities Unlocked.");
        navigate('/portal/employer/applicants');
      } else {
        const data = await response.json();
        alert(data.error || "Upgrade failed");
      }
    } catch (err) {
      console.error("Upgrade error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1114] text-white p-6 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(66,133,244,0.15),transparent_50%)]" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-gemini-blue/20 text-gemini-blue text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
            Monetization_Phase_v1.1
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            Unlock the <span className="bg-gemini-gradient bg-clip-text text-transparent">Neural Edge</span>.
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Secure your access to verified Identità identities and 2026 TCN compliance history.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 flex flex-col opacity-60">
            <h3 className="text-xl font-bold mb-2">Aura_Basic</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black">€0</span>
              <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">/mo</span>
            </div>
            
            <ul className="space-y-4 mb-12 flex-1">
              {[
                "Neural Match Scoring",
                "Blurred Candidate Profiles",
                "TCN Compliance Visibility",
                "Basic Pipeline Tracking"
              ].map(feat => (
                <li key={feat} className="flex items-center gap-3 text-sm text-slate-300">
                  <Check size={16} className="text-slate-500" />
                  {feat}
                </li>
              ))}
            </ul>
            
            <button disabled className="w-full py-4 rounded-2xl bg-white/10 text-slate-500 font-bold uppercase tracking-widest text-xs cursor-not-allowed">
              Current_Tier
            </button>
          </div>

          {/* Pioneer Pro Tier */}
          <div className="rounded-[2.5rem] border-2 border-gemini-purple/50 bg-gemini-purple/5 p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6">
              <Sparkles size={24} className="text-gemini-purple animate-pulse" />
            </div>
            
            <div className="inline-block px-3 py-1 bg-gemini-purple text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4 w-fit">
              Pioneer_Offer (1/50)
            </div>
            
            <h3 className="text-xl font-bold mb-2">Pulse_Pro</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black">€29</span>
              <span className="text-slate-500 text-sm font-bold line-through">€49</span>
              <span className="text-gemini-purple text-xs font-black uppercase tracking-widest">Limited_Discount</span>
            </div>
            
            <ul className="space-y-4 mb-12 flex-1">
              {[
                "Unrestricted Identity Reveal",
                "Full 2026 TCN Compliance Docs",
                "Priority Neural Processing",
                "Aura Assistant: Expert Consult",
                "Fee Protection Ledger Access"
              ].map(feat => (
                <li key={feat} className="flex items-center gap-3 text-sm text-white">
                  <div className="h-5 w-5 rounded-full bg-gemini-purple/20 flex items-center justify-center">
                    <Check size={14} className="text-gemini-purple" />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>
            
            <button 
              onClick={handleUpgrade}
              className="w-full py-5 rounded-2xl bg-gemini-gradient text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-gemini-purple/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Unlock_Pioneer_Special
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-4 font-bold uppercase tracking-widest">
              Cancel anytime. Identità Malta 2026 Compliance Ready.
            </p>
          </div>
        </div>

        <div className="mt-20 grid sm:grid-cols-3 gap-8 border-t border-white/5 pt-12">
          {[
            { icon: ShieldCheck, title: "Compliance Shield", text: "Verified 2026 TCN status check on all Pro unlocks." },
            { icon: Lock, title: "Identity Vault", text: "Cryptographically secured candidate data and audit trails." },
            { icon: Zap, title: "Instant Sync", text: "Real-time state transitions reflected on candidate pulses." }
          ].map(item => (
            <div key={item.title} className="text-center sm:text-left">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <item.icon size={20} className="text-gemini-blue" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-2">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
