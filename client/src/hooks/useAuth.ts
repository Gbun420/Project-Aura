import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type NovaRole = 'admin' | 'employer' | 'candidate' | 'platform_owner';

const normalizeRole = (value: unknown): NovaRole => {
  if (value === 'admin' || value === 'employer' || value === 'candidate' || value === 'platform_owner') return value;
  return 'candidate';
};

export interface Profile {
  id: string;
  full_name: string | null;
  role: NovaRole;
  avatar_url: string | null;
  subscription_tier?: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<NovaRole>('candidate');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      console.error('Auth disabled: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
      setError('AUTH_NOT_CONFIGURED');
      setLoading(false);
      return;
    }

    const fetchProfile = async (userId: string) => {
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (mounted && !fetchError && data) {
          setProfile(data);
          if (data.role) setRole(normalizeRole(data.role));
        } else if (fetchError && mounted) {
          console.warn("fetchProfile error:", fetchError.message);
          // Profile might not exist yet (new user) — not fatal
        }
      } catch (err) {
        if (mounted) console.warn("fetchProfile exception:", err);
      }
    };

    const syncSession = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (!mounted) return;
        
        if (sessionError) {
          console.error("getSession error:", sessionError.message);
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        const session = data.session;
        setUser(session?.user ?? null);
        if (session?.user) {
          setRole(normalizeRole(session.user.user_metadata?.role));
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        if (mounted) {
          console.error("syncSession exception:", err);
          setError('SESSION_SYNC_FAILED');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Add a safety timeout — if auth takes more than 8 seconds, stop loading
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth initialization timed out after 8s');
        setLoading(false);
      }
    }, 8000);

    syncSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setLoading(true);
      try {
        setUser(session?.user ?? null);
        if (session?.user) {
          setRole(normalizeRole(session.user.user_metadata?.role));
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setRole('candidate');
        }
      } catch (err) {
        if (mounted) console.error("onAuthStateChange error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.subscription.unsubscribe();
    };
  }, [user?.id, loading]);

  return { user, role, profile, loading, error };
};
