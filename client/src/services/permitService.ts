import { useNotificationStore } from '../store/useNotificationStore';
import { AURA_CONFIG } from '../config/auraConfig';
import type { PermitData } from '../types/aura.js';

// AURA PERMIT SERVICE v1.1
// Simulated Identità Automated Approval via AURA_CONFIG

export const finalizePermitGrant = async (trackingId: string, setPermitStatus: (status: string, data: PermitData) => void) => {
  const { addPing } = useNotificationStore.getState();

  try {
    const response = await fetch('/api/compliance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'VERIFY_LICENSE', payload: { trackingId } })
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'VALID' || data.status === 'GRANTED') {
      const permitData = {
        permitId: data.licenseNumber || `MT-RES-${Math.random().toString(36).toUpperCase().substring(2, 8)}`,
        expiry: data.expiry || '2027-03-11',
        conditions: `Authorized under ${AURA_CONFIG.MGA_SYNC_VERSION}`,
        issuedDate: new Date().toLocaleDateString()
      };

      setPermitStatus('GRANTED', permitData);
      
      addPing({
        type: 'PERMIT_MOVE',
        message: `Identità has officially GRANTED your Digital Residency permit. Tracking: ${trackingId}`,
        severity: 'CRITICAL'
      });
    } else {
      throw new Error('Permit validation failed logic');
    }
  } catch (error) {
    console.error("Permit grant process failed:", error);
    addPing({
      type: 'PERMIT_MOVE',
      message: `Identità permit processing failed or encountered an error. Tracking: ${trackingId}`,
      severity: 'HIGH'
    });
  }
};
