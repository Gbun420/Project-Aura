import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLanding from './pages/public/Landing';
import Compliance from './pages/public/Compliance';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import PortalLayout from './layouts/PortalLayout';
import PortalIndexRedirect from './pages/PortalIndexRedirect';
import { ProtectedRoute } from './components/ProtectedRoute';

// New Unified Pages
import NeuralDashboard from './pages/portal/NeuralDashboard';
import ComplianceCenter from './pages/portal/ComplianceCenter';

// Existing Pages (Legacy/Specific)
import CandidateVault from './pages/candidate/Vault';
import CandidateInsights from './pages/candidate/Insights';
import EmployerApplicants from './pages/employer/Applicants';
import EmployerHistory from './pages/employer/History';
import EmployerPricing from './pages/employer/Pricing';
import AdminUsers from './pages/admin/Users';
import AdminAudit from './pages/admin/Audit';
import DesignSystem from './pages/admin/DesignSystem';

import NotFound from './pages/NotFound';
import CookieConsent from './components/CookieConsent';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLanding />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/portal" element={<ProtectedRoute />}>
          <Route element={<PortalLayout />}>
            <Route index element={<PortalIndexRedirect />} />
            
            <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
              <Route path="candidate" element={<NeuralDashboard />} />
              <Route path="candidate/compliance" element={<ComplianceCenter />} />
              <Route path="candidate/vault" element={<CandidateVault />} />
              <Route path="candidate/insights" element={<CandidateInsights />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
              <Route path="employer" element={<NeuralDashboard />} />
              <Route path="employer/compliance" element={<ComplianceCenter />} />
              <Route path="employer/applicants" element={<EmployerApplicants />} />
              <Route path="employer/history" element={<EmployerHistory />} />
              <Route path="employer/pricing" element={<EmployerPricing />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['admin', 'platform_owner']} />}>
              <Route path="admin" element={<NeuralDashboard />} />
              <Route path="admin/compliance" element={<ComplianceCenter />} />
              <Route path="admin/users" element={<AdminUsers />} />
              <Route path="admin/audit" element={<AdminAudit />} />
              <Route path="admin/design" element={<DesignSystem />} />
            </Route>

            {/* Placeholder Common Routes */}
            <Route path=":role/notifications" element={<div className="text-white p-10 font-mono">NEURAL_NOTIFICATION_STREAM_OFFLINE</div>} />
            <Route path=":role/profile" element={<div className="text-white p-10 font-mono">IDENTITY_MANIFEST_READONLY</div>} />
            <Route path=":role/settings" element={<div className="text-white p-10 font-mono">SYSTEM_PREFERENCES_LOCKED</div>} />
            <Route path=":role/jobs" element={<div className="text-white p-10 font-mono">BATCH_VACANCY_FETCH_PENDING</div>} />

          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsent />
    </BrowserRouter>
  );
}
