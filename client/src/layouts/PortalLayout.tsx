import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PortalHeader from '../components/PortalHeader';
import type { NovaRole } from '../types/nova';

const getRoleFromPath = (pathname: string): NovaRole => {
  const [, base, role] = pathname.split('/');
  if (base !== 'portal') return 'candidate';
  if (role === 'admin' || role === 'employer' || role === 'candidate' || role === 'platform_owner') return role as NovaRole;
  return 'candidate';
};

export default function PortalLayout() {
  const location = useLocation();
  const role = getRoleFromPath(location.pathname);

  return (
    <div className="min-h-screen bg-nova-base text-slate-200 font-manrope relative overflow-hidden flex selection:bg-nova-accent/30 selection:text-white">
      {/* Background Sovereign Ambience */}
      <div className="fixed inset-0 z-0 bg-nova-mesh opacity-30 pointer-events-none" />
      
      <Sidebar role={role} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <PortalHeader role={role} />
        <main className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-16 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
