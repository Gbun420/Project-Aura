import { useAuth as useFirebaseAuth, type NovaRole, type Profile } from '../contexts/AuthContext';

export type { NovaRole, Profile };

export const useAuth = () => {
  const { user, role, profile, loading, logout } = useFirebaseAuth();

  return {
    user,
    role,
    profile,
    loading,
    error: null, // Basic AuthContext doesn't track global errors currently
    isAuthenticated: !!user,
    isAdmin: role === 'admin' || role === 'platform_owner',
    isEmployer: role === 'employer',
    isCandidate: role === 'candidate',
    logout
  };
};
