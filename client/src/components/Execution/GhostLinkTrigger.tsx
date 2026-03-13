import React from 'react';
import { AURA_CONFIG } from '../../config/auraConfig';

/**
 * AURA_OS: GHOST-LINK EXECUTOR v1.0
 * Secure DOM orchestration for last-mile automation.
 */

interface DecryptedManifest {
  manifestId: string;
  payload: any;
}

export const executeGhostLink = (goldenManifest: DecryptedManifest) => {
  console.log("[AURA_OS] Initializing Ghost-Link Handshake...");
  
  // Securely passes the data out of the React DOM and into the Browser Extension
  window.postMessage({
    direction: 'FROM_AURA_WEB',
    command: 'INJECT_IDENTITA_PORTAL',
    payload: goldenManifest
  }, AURA_CONFIG.ENDPOINTS.IDENTITA_PORTAL); 
  
  alert("AURA_OS: Golden Manifest transmitted to Ghost-Link for portal injection.");
};

export const GhostLinkTrigger = ({ manifest, isEnabled }: { manifest: any, isEnabled: boolean }) => {
  return (
    <button 
      disabled={!isEnabled}
      onClick={() => executeGhostLink(manifest)}
      className={`px-8 py-4 rounded-full font-black tracking-[0.2em] transition-all uppercase text-[10px] shadow-[0_0_30px_rgba(0,240,255,0.2)] ${
        isEnabled 
          ? 'bg-cyan-400 text-black hover:scale-105 cursor-pointer' 
          : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed opacity-50'
      }`}
    >
      EXECUTE GHOST-LINK INJECTION
    </button>
  );
};
