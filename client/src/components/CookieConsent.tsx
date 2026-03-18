import React, { useState } from 'react';
import { Cookie, Check } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('aura_cookie_consent');
    }
    return false;
  });
  const [showDetails, setShowDetails] = useState(false);

  const handleAccept = () => {
    localStorage.setItem('aura_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('aura_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 text-white shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Cookie className="text-[#F59E0B]" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest">Privacy & Data Control</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            We use strictly necessary cookies to ensure the security of the <span className="font-semibold text-white">Sovereign Handshake</span> protocol. 
            Optional analytics help us optimize the 2026 recruitment neural engine. 
            All data is processed under Maltese Data Protection Act standards.
          </p>
          {showDetails && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400 bg-black/20 p-4 rounded-xl border border-white/5">
              <div>
                <strong className="block text-white mb-1">Essential</strong>
                Required for authentication, session security (CSRF), and success fee cryptographic signatures.
              </div>
              <div>
                <strong className="block text-white mb-1">Analytics</strong>
                Anonymous usage data to improve job matching velocity and compliance monitoring.
              </div>
              <div>
                <strong className="block text-white mb-1">Preferences</strong>
                Stores your language, theme, and dashboard layout settings.
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-slate-400 underline hover:text-white transition"
          >
            {showDetails ? 'Hide Details' : 'View Data Usage'}
          </button>
          <button 
            onClick={handleDecline}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition"
          >
            Decline Optional
          </button>
          <button 
            onClick={handleAccept}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50"
          >
            <Check size={14} />
            Accept Secure Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
