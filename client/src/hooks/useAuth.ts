import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type AuraRole = 'admin' | 'employer' | 'candidate' | 'platform_owner';

const normalizeRole = (value: unknown): AuraRole => {
  if (value === 'admin' || value === 'employer' || value === 'candidate' || value === 'platform_owner') return value;
  return 'candidate';
};

export interface Profile {
  id: string;
  full_name: string | null;
  role: AuraRole;
  avatar_url: string | null;
  subscription_tier?: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AuraRole>('candidate');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (mounted && !error && data) {
          setProfile(data);
          if (data.role) setRole(normalizeRole(data.role));
        } else if (error && mounted) {
          console.error("fetchProfile error:", error.message);
        }
      } catch (err) {
        if (mounted) console.error("fetchProfile exception:", err);
      }
    };

    const syncSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        const session = data.session;
        setUser(session?.user ?? null);
        if (session?.user) {
          setRole(normalizeRole(session.user.user_metadata?.role));
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        if (mounted) console.error("syncSession error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

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
        }
      } catch (err) {
        if (mounted) console.error("onAuthStateChange error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user, role, profile, loading };
};
