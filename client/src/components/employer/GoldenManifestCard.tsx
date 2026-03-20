import { useState } from 'react';
import { Shield, CheckCircle2, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { triggerGoldenManifest } from '../../services/novaRelay';
import { IDENTITA_SELECTOR_MAP } from '../../services/integration/selectorMap';

interface GoldenManifestCardProps {
  applicationId: string;
  candidateName: string;
  matchScore: number;
  onClose: () => void;
}

export default function GoldenManifestCard({ applicationId, candidateName, matchScore, onClose }: GoldenManifestCardProps) {
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>('idle');
  const [manifestData, setManifestData] = useState<{
    manifestId: string;
    trackingId: string;
    identitaReference: string;
  } | null>(null);

  const handleGenerate = async () => {
    setStatus('generating');
    try {
      const result = await triggerGoldenManifest(applicationId, 'IDENTITA_MALTA', {
        userId: applicationId,
        novaScore: matchScore,
        sector: 'Fintech', // Valid Sector from types/nova.ts
        pdcStatus: true
      });
      setManifestData(result);
      setStatus('ready');
    } catch (err) {
      console.error("Manifest generation failed:", err);
      setStatus('error');
    }
  };

  const handleSync = () => {
    // Open Identità Portal
    window.open(IDENTITA_SELECTOR_MAP.metadata.portalUrl, '_blank');
    
    // In a real implementation, we would inject a script or use a browser extension
    // to perform the sync. For this prototype, we'll log the intention.
    console.log("SYNC_ACTION: Preparing payload for Identità using selectorMap", {
      manifestId: manifestData?.manifestId,
      mapping: IDENTITA_SELECTOR_MAP.mapping
    });
    
    alert(`AUTOMATION_SYNC: Data for ${candidateName} has been prepared for the Identità portal. Please use the Nova browser extension to autofill.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-lg bg-nova-base border border-white/10 rounded-[3rem] p-10 shadow-2xl shadow-nova-accent/20 animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="h-20 w-20 rounded-3xl bg-gemini-gradient p-0.5 shadow-xl shadow-nova-accent/20">
            <div className="h-full w-full rounded-[inherit] bg-nova-base flex items-center justify-center text-nova-accent">
              {status === 'generating' ? (
                <Loader2 className="animate-spin" size={32} />
              ) : (
                <Shield size={32} />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
              {status === 'ready' ? 'Sovereign_Ready' : 'Golden_Manifest'}
            </h2>
            <p className="text-sm text-slate-400 font-medium px-4">
              Finalize the residency permit workflow for <span className="text-white font-bold">{candidateName}</span> via the Identità integration gateway.
            </p>
          </div>

          {status === 'idle' && (
            <button 
              onClick={handleGenerate}
              className="w-full py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              <Sparkles size={16} />
              Trigger_Golden_Handshake
            </button>
          )}

          {status === 'generating' && (
            <div className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-nova-accent uppercase tracking-widest animate-pulse">
                Encrypting_Manifest_Data...
              </span>
            </div>
          )}

          {status === 'ready' && manifestData && (
            <div className="w-full space-y-6 animate-in slide-in-from-top-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Manifest_ID</p>
                  <p className="text-[10px] font-mono text-white font-bold">{manifestData.manifestId}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Tracking_Ref</p>
                  <p className="text-[10px] font-mono text-white font-bold">{manifestData.trackingId}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleSync}
                  className="flex-1 py-5 bg-nova-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-nova-accent/90 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Sync_To_Identità
                </button>
                <button 
                  onClick={() => window.open('https://singlepermit.identita.gov.mt/', '_blank')}
                  title="Open Identità Portal"
                  className="px-6 py-5 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all"
                >
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="w-full p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl text-[10px] font-black uppercase text-center tracking-widest">
              Gwy_Handshake_Failed: Neural_Outage
            </div>
          )}

          <button 
            onClick={onClose}
            className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
          >
            Decline_Integration_For_Now
          </button>
        </div>
      </div>
    </div>
  );
}
