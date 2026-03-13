/**
 * PROJECT AURA: SYSTEM CONFIGURATION
 * Centralized Sovereign Endpoints
 */

export const AURA_CONFIG = {
  VERSION: '1.0.RC1',
  MGA_SYNC_VERSION: '2026.1-RELEASE',
  PRODUCTION: import.meta.env.PROD,
  
  ENDPOINTS: {
    RELAY: (import.meta.env.VITE_AURA_API as string) || 'https://aura-cloud-2026.vercel.app',
    IDENTITA_PORTAL: 'https://eforms.identita.gov.mt/',
    MGA_VERIFICATION: 'https://api.mga.org.mt/v2/verify',
    SOCKET_SERVER: (import.meta.env.VITE_AURA_SOCKET as string) || 'https://aura-cloud-2026.vercel.app',
  },
  
  DYNAMICS: {
    SYNC_LATENCY_MS: 2500,
    PDC_GATE_ENABLED: true,
    GHOST_MODE_DEFAULT: false,
  },
  
  STORAGE_KEYS: {
    SOVEREIGN_CORE: 'aura_sovereign_core_v1.7',
    NOTIFICATION_LOG: 'aura_neural_pings',
  }
};
