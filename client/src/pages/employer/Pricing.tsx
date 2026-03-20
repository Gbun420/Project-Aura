import { ShieldCheck, Zap, Lock, Sparkles, Check, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useState } from 'react';

export default function Pricing() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        alert("Please sign in to proceed with the upgrade.");
        setIsLoading(false);
        return;
      }

      // Robust API URL handling
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/billing/create-checkout-session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          priceId: import.meta.env.VITE_STRIPE_PRICE_ID_PULSE_PRO,
          successUrl: window.location.origin + '/portal/employer/applicants?session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: window.location.origin + '/portal/employer/pricing'
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create checkout session");
      }
    } catch (err) {
      const error = err as Error;
      console.error("Upgrade error:", error);
      alert("An error occurred while processing your upgrade: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1114] text-white p-6 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(66,133,244,0.15),transparent_50%)]" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-6">
            Employer Plans
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white">
            Hire the best talent in Malta.
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Get unlimited access to top local talent and verified applicants.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 flex flex-col opacity-60">
            <h3 className="text-xl font-bold mb-2">Basic Profile</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black">€0</span>
              <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">/mo</span>
            </div>
            
            <ul className="space-y-4 mb-12 flex-1">
              {[
                "Search Candidate Database",
                "Basic Company Profile",
                "Receive 5 applications per month",
                "Standard Pipeline Tracking"
              ].map(feat => (
                <li key={feat} className="flex items-center gap-3 text-sm text-slate-300">
                  <Check size={16} className="text-slate-500" />
                  {feat}
                </li>
              ))}
            </ul>
            
            <button disabled className="w-full py-4 rounded-2xl bg-white/10 text-slate-500 font-bold uppercase tracking-widest text-xs cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Pioneer Pro Tier */}
          <div className="rounded-[2.5rem] border-2 border-gemini-purple/50 bg-gemini-purple/5 p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6">
              <Sparkles size={24} className="text-gemini-purple animate-pulse" />
            </div>
            
            <div className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4 w-fit">
              Unlimited Applications
            </div>
            
            <h3 className="text-xl font-bold mb-2">Careers Pro</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black">€49</span>
              <span className="text-blue-400 text-sm font-bold">/mo</span>
            </div>
            
            <ul className="space-y-4 mb-12 flex-1">
              {[
                "Unlimited Applications",
                "Full Applicant Contact Details",
                "Featured Job Posts",
                "Priority Support",
                "Advanced Screening Tools"
              ].map(feat => (
                <li key={feat} className="flex items-center gap-3 text-sm text-white">
                  <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Check size={14} className="text-blue-400" />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>
            
            <button 
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Upgrade to Pro"
              )}
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-4 font-bold uppercase tracking-widest">
              Cancel anytime. Secure payment via Stripe.
            </p>
          </div>
        </div>

        <div className="mt-20 grid sm:grid-cols-3 gap-8 border-t border-white/5 pt-12">
          {[
            { icon: ShieldCheck, title: "Verified Candidates", text: "Reach highly qualified, verified applicants looking for opportunities in Malta." },
            { icon: Lock, title: "Data Privacy", text: "Applicant and employer data is kept fully secure following GDPR guidelines." },
            { icon: Zap, title: "Fast Hiring", text: "Easily manage your hiring process on an efficient platform designed for speed." }
          ].map(item => (
            <div key={item.title} className="text-center sm:text-left">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <item.icon size={20} className="text-blue-500" />
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