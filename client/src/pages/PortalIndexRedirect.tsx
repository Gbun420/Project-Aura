import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function PortalIndexRedirect() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1114] text-white flex items-center justify-center">
        <div className="text-sm tracking-[0.3em] uppercase text-slate-400">Calibrating Portal...</div>
      </div>
    );
  }

  const target = role === 'platform_owner' ? 'admin' : role;
  return <Navigate to={target} replace />;
}
