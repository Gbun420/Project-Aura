import { useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  type User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

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
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<NovaRole>('candidate');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;
      
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Start listening to profile changes in Firestore
        const profileRef = doc(db, 'profiles', firebaseUser.uid);
        
        unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
          if (!mounted) return;
          
          if (docSnap.exists()) {
            const data = docSnap.data() as Profile;
            setProfile({ ...data, id: firebaseUser.uid });
            if (data.role) setRole(normalizeRole(data.role));
          } else {
            // Profile doesn't exist – might be a new user
            setProfile(null);
            setRole('candidate');
          }
          setLoading(false);
        }, (err) => {
          console.error("Profile snapshot error:", err);
          if (mounted) setError(err.message);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setRole('candidate');
        setLoading(false);
      }
    });

    // Safety timeout
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth initialization timed out after 8s');
        setLoading(false);
      }
    }, 8000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [loading]);

  return { 
    user, 
    role, 
    profile, 
    loading, 
    error,
    isAuthenticated: !!user,
    isAdmin: role === 'admin' || role === 'platform_owner',
    isEmployer: role === 'employer',
    isCandidate: role === 'candidate'
  };
};
