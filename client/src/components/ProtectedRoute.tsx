import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, type AuraRole } from '../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: AuraRole[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1114] text-white flex items-center justify-center">
        <div className="text-sm tracking-[0.3em] uppercase text-slate-400">Initializing Neural Link...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/portal/${role}`} replace />;
  }

  return <Outlet />;
};
