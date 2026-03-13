import { useNotificationStore } from '../store/useNotificationStore';
import { AURA_CONFIG } from '../config/auraConfig';

// AURA PERMIT SERVICE v1.1
// Simulated Identità Automated Approval via AURA_CONFIG

export const finalizePermitGrant = (trackingId: string, setPermitStatus: any) => {
  const { addPing } = useNotificationStore.getState();

  // Mocking the Identità Automated Approval API delay
  setTimeout(() => {
    const permitData = {
      permitId: `MT-RES-${Math.random().toString(36).toUpperCase().substr(2, 8)}`,
      expiry: '2027-03-11',
      conditions: `Authorized under ${AURA_CONFIG.MGA_SYNC_VERSION}`,
      issuedDate: new Date().toLocaleDateString()
    };

    setPermitStatus('GRANTED', permitData);
    
    addPing({
      type: 'PERMIT_MOVE',
      message: `Identità has officially GRANTED your Digital Residency permit. Tracking: ${trackingId}`,
      severity: 'CRITICAL'
    });
  }, 4000);
};
