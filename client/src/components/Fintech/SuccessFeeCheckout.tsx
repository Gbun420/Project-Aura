import React, { useState } from 'react';
import { AURA_CONFIG } from '../../config/auraConfig';

/**
 * AURA_FINTECH: SUCCESS FEE CHECKOUT v1.0
 * High-integrity payment gate simulation for Golden Manifest release.
 */

interface SuccessFeeCheckoutProps {
  amount: number;
  candidateId: string;
  employerId: string;
  onPaymentComplete: (manifest: any) => void;
}

export const SuccessFeeCheckout = ({ amount, candidateId, employerId, onPaymentComplete }: SuccessFeeCheckoutProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // 1. Call production release endpoint
      const response = await fetch(`${AURA_CONFIG.ENDPOINTS.RELAY}/api/billing/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, employerId })
      });

      const result = await response.json();

      if (result.success) {
        // 2. Trigger Manifest release to Ghost-Link
        onPaymentComplete(result.manifest);
      }
    } catch (error) {
      console.error("[AURA_FINTECH] PAYMENT_FAILED:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-black/60 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-amber-500/30 max-w-md mx-auto shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden relative">
      {/* Visual Identity Layer */}
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Finalize Introduction</h3>
        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mb-10">Neural Handshake Secure // MT-LN-270-2023</p>
        
        <div className="space-y-4 mb-10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Success Fee (2026 Std)</span>
            <span className="text-white font-mono font-bold">€{amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Compliance Audit</span>
            <span className="text-green-400 font-mono font-bold">INCLUDED</span>
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-white font-bold">Total Release Cost</span>
            <span className="text-amber-400 text-xl font-mono font-black">€{amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="text-[9px] text-gray-600 font-mono leading-relaxed mb-8">
          Ref: {candidateId.substring(0, 12)}... | Secured by Bounty Guardian SHA-256 HMAC. Unlocking releases PII data to Ghost-Link.
        </div>

        <button 
          onClick={handlePayment}
          disabled={isProcessing}
          className={`w-full py-5 rounded-2xl font-black tracking-[0.2em] uppercase text-xs transition-all relative overflow-hidden ${
            isProcessing ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black hover:scale-[1.02] shadow-[0_0_30px_rgba(245,158,11,0.4)]'
          }`}
        >
          {isProcessing ? 'Verifying Neural Payment...' : 'PAY & UNLOCK GOLDEN MANIFEST'}
          {isProcessing && (
            <div className="absolute inset-0 bg-white/10 animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
};
