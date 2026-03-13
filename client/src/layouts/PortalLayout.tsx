import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PortalHeader from '../components/PortalHeader';

const getRoleFromPath = (pathname: string) => {
  const [, base, role] = pathname.split('/');
  if (base !== 'portal') return 'candidate';
  if (role === 'admin' || role === 'employer' || role === 'candidate' || role === 'platform_owner') return role;
  return 'candidate';
};

export default function PortalLayout() {
  const location = useLocation();
  const rawRole = getRoleFromPath(location.pathname);
  const role = rawRole === 'platform_owner' ? 'admin' : rawRole;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-manrope relative overflow-hidden flex">
      {/* Background Sovereign Ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(79,70,229,0.08),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(34,211,238,0.05),transparent_35%)]" />
      
      <Sidebar role={role as any} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <PortalHeader role={role as any} />
        <main className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-16 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
