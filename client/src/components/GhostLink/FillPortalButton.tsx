import React from 'react';
import { AURA_CONFIG } from '../../config/auraConfig';

/**
 * AURA_OS: GHOST-LINK TRIGGER v1.0
 * Communicates directly with the Browser Extension for DOM injection.
 */

export const FillPortalButton = ({ manifest }: { manifest: any }) => {
  const handleInjection = () => {
    // Neural Link with the Chrome/Brave Extension via window messaging
    window.postMessage({
      type: 'AURA_TRIGGER_SYNC', // Updated to match aura-injector.js listener
      payload: manifest
    }, AURA_CONFIG.ENDPOINTS.IDENTITA_PORTAL);

    alert("AURA_OS: Initiating Ghost-Link Handshake with Identità Portal...");
  };
  return (
    <button 
      onClick={handleInjection}
      className="bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-black py-3 px-8 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-all uppercase tracking-widest text-[10px]"
    >
      EXECUTE GHOST-LINK AUTO-FILL
    </button>
  );
};
