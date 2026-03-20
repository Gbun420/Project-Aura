import { env } from './env';

export const NOVA_CONFIG = {
  VERSION: '1.0.RC1',
  MGA_SYNC_VERSION: '2026.1-RELEASE',
  PRODUCTION: import.meta.env.PROD,
  
  ENDPOINTS: {
    RELAY: env.novaApi,
    IDENTITA_PORTAL: 'https://eforms.identita.gov.mt/',
    MGA_VERIFICATION: 'https://api.mga.org.mt/v2/verify',
    SOCKET_SERVER: env.novaSocket,
  },
  
  DYNAMICS: {
    SYNC_LATENCY_MS: 2500,
    PDC_GATE_ENABLED: true,
    GHOST_MODE_DEFAULT: false,
  },
  
  STORAGE_KEYS: {
    SOVEREIGN_CORE: 'nova_sovereign_core_v1.7',
    NOTIFICATION_LOG: 'nova_neural_pings',
  }
};
