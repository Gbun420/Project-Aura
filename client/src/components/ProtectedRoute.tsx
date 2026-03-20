import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, type AuraRole } from '../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: AuraRole[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, role, loading, error } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1114] text-white flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-sm tracking-wide text-slate-400">Loading your workspace...</div>
      </div>
    );
  }

  // If auth is misconfigured or errored, redirect to login
  if (error || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/portal/${role}`} replace />;
  }

  return <Outlet />;
};
