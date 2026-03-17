import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLanding from './pages/public/Landing';
import Compliance from './pages/public/Compliance';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import PortalLayout from './layouts/PortalLayout';
import PortalIndexRedirect from './pages/PortalIndexRedirect';
import { ProtectedRoute } from './components/ProtectedRoute';
import SEO from './components/SEO';

// New Unified Pages
import NeuralDashboard from './pages/portal/NeuralDashboard';
import ComplianceCenter from './pages/portal/ComplianceCenter';
import Jobs from './pages/portal/Jobs';
import Profile from './pages/portal/Profile';
import Settings from './pages/portal/Settings';
import Notifications from './pages/portal/Notifications';

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
        <Route path="/" element={
          <>
            <SEO 
              title="Home" 
              description="Aura is the intelligence layer for recruitment in Malta. Seamless hiring, automated compliance, and neural-backed talent matching for the 2026 labor market."
              jsonLd={{
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Aura Cloud",
                "url": "https://project-aura-one.vercel.app/",
                "description": "2026 High-performance recruitment platform for Malta. Neural Matching and Compliance Vault integrated.",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://project-aura-one.vercel.app/portal/candidate?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }}
            />
            <PublicLanding />
          </>
        } />
        <Route path="/compliance" element={
          <>
            <SEO 
              title="Compliance" 
              description="Aura Compliance Vault - Blockchain-backed verification for employment compliant with Maltese regulations and Identità standards."
              jsonLd={{
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://project-aura-one.vercel.app/"
                },{
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Compliance",
                  "item": "https://project-aura-one.vercel.app/compliance"
                }]
              }}
            />
            <Compliance />
          </>
        } />
        <Route path="/login" element={
          <>
            <SEO title="Login" description="Secure access to your Aura Cloud dashboard. Neural matching and compliance management." />
            <Login />
          </>
        } />
        <Route path="/register" element={
          <>
            <SEO title="Join Aura" description="Create your sovereign identity and join the future of work in Malta. 2026 talent infrastructure ready." />
            <Register />
          </>
        } />
        {/* Standalone jobs route for direct access */}
        <Route path="/jobs" element={
          <>
            <SEO title="Job Vacancies" noindex />
            <Jobs />
          </>
        } />
        <Route path="/portal" element={<ProtectedRoute />}>
          <Route element={<PortalLayout />}>
            <Route index element={<PortalIndexRedirect />} />
            
            <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
              <Route path="candidate" element={
                <>
                  <SEO title="Candidate Dashboard" noindex />
                  <NeuralDashboard />
                </>
              } />
              <Route path="candidate/compliance" element={<><SEO title="Candidate Compliance" noindex /><ComplianceCenter /></>} />
              <Route path="candidate/vault" element={<><SEO title="Candidate Vault" noindex /><ComplianceCenter /></>} />
              <Route path="candidate/insights" element={<><SEO title="Candidate Insights" noindex /><CandidateInsights /></>} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
              <Route path="employer" element={
                <>
                  <SEO title="Employer Console" noindex />
                  <NeuralDashboard />
                </>
              } />
              <Route path="employer/compliance" element={<><SEO title="Employer Compliance" noindex /><ComplianceCenter /></>} />
              <Route path="employer/applicants" element={<><SEO title="Employer Applicants" noindex /><EmployerApplicants /></>} />
              <Route path="employer/history" element={<><SEO title="Employer History" noindex /><EmployerHistory /></>} />
              <Route path="employer/pricing" element={<><SEO title="Employer Pricing" noindex /><EmployerPricing /></>} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['admin', 'platform_owner']} />}>
              <Route path="admin" element={
                <>
                  <SEO title="Network Admin" noindex />
                  <NeuralDashboard />
                </>
              } />
              <Route path="admin/compliance" element={<><SEO title="Admin Compliance" noindex /><ComplianceCenter /></>} />
              <Route path="admin/users" element={<><SEO title="Admin Users" noindex /><AdminUsers /></>} />
              <Route path="admin/audit" element={<><SEO title="Admin Audit" noindex /><AdminAudit /></>} />
              <Route path="admin/design" element={<><SEO title="Design System" noindex /><DesignSystem /></>} />
            </Route>

            {/* Common Portal Routes */}
            <Route path=":role/notifications" element={
              <>
                <SEO title="Alert Stream" noindex />
                <Notifications />
              </>
            } />
            <Route path=":role/profile" element={
              <>
                <SEO title="Identity Manifest" noindex />
                <Profile />
              </>
            } />
            <Route path=":role/settings" element={
              <>
                <SEO title="System Parameters" noindex />
                <Settings />
              </>
            } />
            <Route path=":role/jobs" element={
              <>
                <SEO title="Job Vacancies" noindex />
                <Jobs />
              </>
            } />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsent />
    </BrowserRouter>
  );
}