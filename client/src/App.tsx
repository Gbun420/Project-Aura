import { BrowserRouter, Routes, Route, lazy, Suspense } from 'react-router-dom';
import PublicLanding from './pages/public/Landing';
import Compliance from './pages/public/Compliance';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import PortalLayout from './layouts/PortalLayout';
import PortalIndexRedirect from './pages/PortalIndexRedirect';
import { ProtectedRoute } from './components/ProtectedRoute';
import SEO from './components/SEO';

// New Unified Pages - Lazy Loaded
const NeuralDashboard = lazy(() => import('./pages/portal/NeuralDashboard'));
const ComplianceCenter = lazy(() => import('./pages/portal/ComplianceCenter'));
const Jobs = lazy(() => import('./pages/portal/Jobs'));
const Profile = lazy(() => import('./pages/portal/Profile'));
const Settings = lazy(() => import('./pages/portal/Settings'));
const Notifications = lazy(() => import('./pages/portal/Notifications'));

// Existing Pages (Legacy/Specific) - Lazy Loaded
const CandidateVault = lazy(() => import('./pages/candidate/Vault'));
const CandidateInsights = lazy(() => import('./pages/candidate/Insights'));
const EmployerApplicants = lazy(() => import('./pages/employer/Applicants'));
const EmployerHistory = lazy(() => import('./pages/employer/History'));
const EmployerPricing = lazy(() => import('./pages/employer/Pricing'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminAudit = lazy(() => import('./pages/admin/Audit'));
const DesignSystem = lazy(() => import('./pages/admin/DesignSystem'));

const NotFound = lazy(() => import('./pages/NotFound'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));

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
            <Suspense fallback={<div>Loading jobs...</div>}>
              <Jobs />
            </Suspense>
          </>
        } />
        <Route path="/portal" element={<ProtectedRoute />}>
          <Route element={<PortalLayout />}>
            <Route index element={<PortalIndexRedirect />} />
            
            <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
              <Route path="candidate" element={
                <>
                  <SEO title="Candidate Dashboard" noindex />
                  <Suspense fallback={<div>Loading dashboard...</div>}>
                    <NeuralDashboard />
                  </Suspense>
                </>
              } />
              <Route path="candidate/compliance" element={<><SEO title="Candidate Compliance" noindex /><Suspense fallback={<div>Loading compliance...</div>}><ComplianceCenter /></Suspense></>} />
              <Route path="candidate/vault" element={<><SEO title="Candidate Vault" noindex /><Suspense fallback={<div>Loading vault...</div>}><ComplianceCenter /></Suspense></>} />
              <Route path="candidate/insights" element={<><SEO title="Candidate Insights" noindex /><Suspense fallback={<div>Loading insights...</div>}><CandidateInsights /></Suspense></>} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
              <Route path="employer" element={
                <>
                  <SEO title="Employer Console" noindex />
                  <Suspense fallback={<div>Loading dashboard...</div>}>
                    <NeuralDashboard />
                  </Suspense>
                </>
              } />
              <Route path="employer/compliance" element={<><SEO title="Employer Compliance" noindex /><Suspense fallback={<div>Loading compliance...</div>}><ComplianceCenter /></Suspense></>} />
              <Route path="employer/applicants" element={<><SEO title="Employer Applicants" noindex /><Suspense fallback={<div>Loading applicants...</div>}><EmployerApplicants /></Suspense></>} />
              <Route path="employer/history" element={<><SEO title="Employer History" noindex /><Suspense fallback={<div>Loading history...</div>}><EmployerHistory /></Suspense></>} />
              <Route path="employer/pricing" element={<><SEO title="Employer Pricing" noindex /><Suspense fallback={<div>Loading pricing...</div>}><EmployerPricing /></Suspense></>} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['admin', 'platform_owner']} />}>
              <Route path="admin" element={
                <>
                  <SEO title="Network Admin" noindex />
                  <Suspense fallback={<div>Loading dashboard...</div>}>
                    <NeuralDashboard />
                  </Suspense>
                </>
              } />
              <Route path="admin/compliance" element={<><SEO title="Admin Compliance" noindex /><Suspense fallback={<div>Loading compliance...</div>}><ComplianceCenter /></Suspense></>} />
              <Route path="admin/users" element={<><SEO title="Admin Users" noindex /><Suspense fallback={<div>Loading users...</div>}><AdminUsers /></Suspense></>} />
              <Route path="admin/audit" element={<><SEO title="Admin Audit" noindex /><Suspense fallback={<div>Loading audit...</div>}><AdminAudit /></Suspense></>} />
              <Route path="admin/design" element={<><SEO title="Design System" noindex /><Suspense fallback={<div>Loading design system...</div>}><DesignSystem /></Suspense></>} />
            </Route>

            {/* Common Portal Routes */}
            <Route path=":role/notifications" element={
              <>
                <SEO title="Alert Stream" noindex />
                <Suspense fallback={<div>Loading notifications...</div>}>
                  <Notifications />
                </Suspense>
              </>
            } />
            <Route path=":role/profile" element={
              <>
                <SEO title="Identity Manifest" noindex />
                <Suspense fallback={<div>Loading profile...</div>}>
                  <Profile />
                </Suspense>
              </>
            } />
            <Route path=":role/settings" element={
              <>
                <SEO title="System Parameters" noindex />
                <Suspense fallback={<div>Loading settings...</div>}>
                  <Settings />
                </Suspense>
              </>
            } />
            <Route path=":role/jobs" element={
              <>
                <SEO title="Job Vacancies" noindex />
                <Suspense fallback={<div>Loading jobs...</div>}>
                  <Jobs />
                </Suspense>
              </>
            } />
          </Route>
        </Route>
        <Route path="*" element={
          <Suspense fallback={<div>Loading page...</div>}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
      <Suspense fallback={<div>Loading consent...</div>}>
        <CookieConsent />
      </Suspense>
    </BrowserRouter>
  );
}