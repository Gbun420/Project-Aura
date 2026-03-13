// AURA_CONFIG v1.0
// Centralized environment control for the 2026 Sovereign Ecosystem

export const AURA_CONFIG = {
  IS_PROD: import.meta.env.PROD,
  API_GATEWAY: (import.meta.env.VITE_AURA_API as string) || 'https://relay.aura.mt',
  MGA_SYNC_VERSION: '2026.1-RELEASE',
  IDENTITA_PDC_GATE: true,
  NEURAL_SYNC_LATENCY: 2.5,
  MAX_BUNDLE_SIZE_KB: 250
};
