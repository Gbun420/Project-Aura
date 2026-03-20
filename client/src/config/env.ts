// NOVA_CONFIG v1.0
// Centralized environment control for the 2026 Sovereign Ecosystem

export const NOVA_CONFIG = {
  IS_PROD: import.meta.env.PROD,
  API_GATEWAY: (import.meta.env.VITE_NOVA_API as string) || 'https://relay.nova.mt',
  MGA_SYNC_VERSION: '2026.1-RELEASE',
  IDENTITA_PDC_GATE: true,
  NEURAL_SYNC_LATENCY: 2.5,
  MAX_BUNDLE_SIZE_KB: 250
};

export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  apiUrl: import.meta.env.VITE_API_URL as string | undefined,
  stripePriceIdPro: import.meta.env.VITE_STRIPE_PRICE_ID_PULSE_PRO as string | undefined,
  novaApi: (import.meta.env.VITE_NOVA_API as string) || 'https://relay.nova.mt',
  novaSocket: (import.meta.env.VITE_NOVA_SOCKET as string) || 'https://nova-cloud-2026.vercel.app',
};

if (!env.supabaseUrl) {
  throw new Error("CRITICAL: VITE_SUPABASE_URL environment variable is missing.");
}

if (!env.supabaseAnonKey) {
  throw new Error("CRITICAL: VITE_SUPABASE_ANON_KEY environment variable is missing.");
}

// Ensure API URL is defined, providing a fallback for local dev if absolutely necessary, 
// but strictly throwing if omitted when clearly needed.
if (import.meta.env.PROD && !env.apiUrl) {
  throw new Error("CRITICAL: VITE_API_URL environment variable is missing.");
}
