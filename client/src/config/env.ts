/**
 * Validated Environment Variables
 * This file serves as the single source of truth for all environment configuration.
 * It performs runtime validation to ensure required variables are present.
 */

const getEnvVar = (name: string, isRequired = true): string => {
  const value = import.meta.env[name];
  if (!value && isRequired) {
    throw new Error(`CRITICAL: Environment variable ${name} is missing.`);
  }
  return value as string;
};

export const env = {
  // Legacy Supabase (to be removed after migration)
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  
  // Firebase Configuration
  firebase: {
    apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  },

  // Other Services
  hfToken: import.meta.env.VITE_HF_TOKEN as string | undefined,
  stripePriceIdPulsePro: import.meta.env.VITE_STRIPE_PRICE_ID_PULSE_PRO as string | undefined,
  apiUrl: getEnvVar('VITE_API_URL', false) || 'http://localhost:3001',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};

// Initial Validation
if (!env.firebase.apiKey || !env.firebase.projectId) {
  throw new Error("CRITICAL: Firebase configuration is incomplete.");
}
