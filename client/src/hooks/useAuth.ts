import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type AuraRole = 'admin' | 'employer' | 'candidate' | 'platform_owner';

const normalizeRole = (value: unknown): AuraRole => {
  if (value === 'admin' || value === 'employer' || value === 'candidate' || value === 'platform_owner') return value;
  return 'candidate';
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AuraRole>('candidate');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const syncSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const session = data.session;
      setUser(session?.user ?? null);
      setRole(normalizeRole(session?.user?.app_metadata?.role));
      setLoading(false);
    };

    syncSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setRole(normalizeRole(session?.user?.app_metadata?.role));
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user, role, loading };
};
