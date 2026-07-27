import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import PersistentAppHeader from "./components/PersistentAppHeader";
import EmailVerificationBanner from "./components/EmailVerificationBanner";
import RoleAccessGate from "./components/RoleAccessGate";
import RealAccountGate from "./components/RealAccountGate";
import { clearDemoSession, getDemoSession, type DemoSession } from "./data/demoAccounts";
import { useNavigation } from './context/NavigationContext';
import { useAuth } from './context/AuthContext';
import { Page, Role } from './types';
import { dashboardPathForRole } from "./utils/accountRoutes";

// Common Components (small, always needed - kept in the main bundle)
import { Footer } from './components/Footer';
import { HowItWorksModal } from './components/HowItWorksModal';
import { AIAssistant } from './components/AIAssistant';

// Page Components - each is loaded on demand (its own chunk) instead of
// all being bundled into the app's initial download. This replaces the
// old approach of importing every page eagerly at the top of this file.
const DemoLoginPage = lazy(() => import("./views/DemoLoginPage"));
const LiveOpportunityIntakePage = lazy(() => import("./views/LiveOpportunityIntakePage"));
const OpportunityMatchingDemoPage = lazy(() => import("./views/OpportunityMatchingDemoPage"));
const ProductAwarenessExperiencePage = lazy(() => import("./views/ProductAwarenessExperiencePage"));
const ResourcingCompanySignUpWizard = lazy(() =>
  import("./views/ResourcingCompanySignUpWizard").then((m) => ({ default: m.ResourcingCompanySignUpWizard }))
);
const EngineerSignUpWizard = lazy(() =>
  import("./views/EngineerSignUpWizard").then((m) => ({ default: m.EngineerSignUpWizard }))
);
const CompanySignUpWizard = lazy(() =>
  import("./views/CompanySignUpWizard").then((m) => ({ default: m.CompanySignUpWizard }))
);
const EngineerAvailabilityPage = lazy(() => import("./views/EngineerAvailabilityPage"));
const EngineerProfileHubPage = lazy(() => import("./views/EngineerProfileHubPage"));
const EngineerTeamCompanyPage = lazy(() => import("./views/EngineerTeamCompanyPage"));
const HowItWorksFaqPage = lazy(() => import("./views/HowItWorksFaqPage"));

const LandingPage = lazy(() => import('./views/LandingPage').then((m) => ({ default: m.LandingPage })));
const EngineerDashboard = lazy(() => import('./views/EngineerDashboard').then((m) => ({ default: m.EngineerDashboard })));
const CompanyDashboard = lazy(() => import('./views/CompanyDashboard').then((m) => ({ default: m.CompanyDashboard })));
const ResourcingDashboard = lazy(() => import('./views/ResourcingDashboard').then((m) => ({ default: m.ResourcingDashboard })));
const AdminDashboard = lazy(() => import('./views/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const ForEngineersPage = lazy(() => import('./views/ForEngineersPage').then((m) => ({ default: m.ForEngineersPage })));
const ForCompaniesPage = lazy(() => import('./views/ForCompaniesPage').then((m) => ({ default: m.ForCompaniesPage })));
const ForResourcingCompaniesPage = lazy(() =>
  import('./views/ForResourcingCompaniesPage').then((m) => ({ default: m.ForResourcingCompaniesPage }))
);
const AboutUsPage = lazy(() => import('./views/AboutUsPage').then((m) => ({ default: m.AboutUsPage })));
const InvestorPage = lazy(() => import('./views/InvestorPage').then((m) => ({ default: m.InvestorPage })));
const PricingPage = lazy(() => import('./views/PricingPage').then((m) => ({ default: m.PricingPage })));
const LegalPage = lazy(() => import('./views/LegalPage').then((m) => ({ default: m.LegalPage })));
const AccessibilityPage = lazy(() => import('./views/AccessibilityPage').then((m) => ({ default: m.AccessibilityPage })));
const HowItWorksPage = lazy(() => import('./views/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage })));
const UserGuidePage = lazy(() => import('./views/UserGuidePage').then((m) => ({ default: m.UserGuidePage })));
const TutorialsPage = lazy(() => import('./views/TutorialsPage').then((m) => ({ default: m.TutorialsPage })));

const CompanyEngineerDashboardPage = lazy(() => import("./views/CompanyEngineerDashboardPage"));
const WatchDemoPage = lazy(() => import("./views/WatchDemoPage"));
const RoleSkillBuilderPage = lazy(() => import("./views/RoleSkillBuilderPage"));
const EngineerProfileSetupPage = lazy(() => import("./views/EngineerProfileSetupPage"));
const EngineerPersonalBusinessProfilePage = lazy(() => import("./views/EngineerPersonalBusinessProfilePage"));
const ForgotPasswordPage = lazy(() => import("./views/AccountAccessPages").then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import("./views/AccountAccessPages").then((m) => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import("./views/AccountAccessPages").then((m) => ({ default: m.VerifyEmailPage })));
const AccountSecurityPage = lazy(() => import("./views/AccountAccessPages").then((m) => ({ default: m.AccountSecurityPage })));

function PageLoadingFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="text-sm font-semibold text-slate-400">Loading...</div>
    </div>
  );
}

function TechSubbiesHowItWorksFaqHashRoute(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.location.hash === "#/how-it-works/faq" ||
    window.location.hash === "#how-it-works-faq"
  );
}

const publicDirectPaths = new Set([
  "/",
  "/login",
  "/signin",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/company/signup",
  "/engineer/signup",
  "/resourcing/signup",
  "/watch-demo",
  "/matching-demo",
  "/how-it-works/matching-demo",
  "/how-it-works/faq",
]);

function normalisePathname(): string {
  if (typeof window === "undefined") {
    return "/";
  }

  return window.location.pathname || "/";
}

function isPublicDirectPath(pathname: string): boolean {
  if (publicDirectPaths.has(pathname)) {
    return true;
  }

  if (pathname.startsWith("/public")) {
    return true;
  }

  if (pathname.startsWith("/how-it-works")) {
    return true;
  }

  return false;
}

function LoginRequiredPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-amber-300/20 bg-slate-900 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200">
          Login required
        </p>
        <h1 className="mt-4 text-3xl font-bold text-white">
          This area is protected
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Public pages are open, but project intake, engineer profiles, matching tools, dashboards and admin areas require a signed-in account.
        </p>
        <a
          href="/login"
          className="mt-6 inline-flex rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200"
        >
          Sign in
        </a>
      </div>
    </div>
  );
}

function DemoSessionBar({
  session,
  onLogout,
}: {
  session: DemoSession;
  onLogout: () => void;
}) {
  return (
    <div className="fixed bottom-4 left-4 z-50 rounded-2xl border border-cyan-300/20 bg-slate-950/95 p-3 text-xs text-white shadow-2xl backdrop-blur">
      <div className="font-bold text-cyan-200">{session.name}</div>
      <div className="mt-1 text-slate-400">{session.role} · {session.email}</div>
      <button
        type="button"
        onClick={onLogout}
        className="mt-2 rounded-lg border border-white/10 px-3 py-1 font-bold text-slate-300 hover:border-cyan-300/60 hover:text-cyan-200"
      >
        Logout
      </button>
    </div>
  );
}
const App = () => {
const { page, setPage } = useNavigation();
  const { user, isAuthLoading } = useAuth();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const renderPersistentShell = (content: React.ReactNode, showFooter = false) => (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <PersistentAppHeader />
      <EmailVerificationBanner />
      <main className="flex-grow">
        <Suspense fallback={<PageLoadingFallback />}>{content}</Suspense>
      </main>
      {showFooter && <Footer onNavigate={setPage} />}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onNavigate={setPage}
      />
      {user && <AIAssistant />}
    </div>
  );

  const [demoSession, setDemoSessionState] = useState<DemoSession | null>(() => getDemoSession());

  useEffect(() => {
    function refreshDemoSession() {
      setDemoSessionState(getDemoSession());
    }

    window.addEventListener("storage", refreshDemoSession);
    window.addEventListener("focus", refreshDemoSession);

    return () => {
      window.removeEventListener("storage", refreshDemoSession);
      window.removeEventListener("focus", refreshDemoSession);
    };
  }, []);

  const pathname = normalisePathname();
  const isPublicPath = isPublicDirectPath(pathname) || TechSubbiesHowItWorksFaqHashRoute();
  const isSignedIn = Boolean(user || demoSession);
  const currentRole = user?.role || demoSession?.role;
  const roleGate = (content: React.ReactNode, allowedRoles: Role[]) => (
    <RoleAccessGate currentRole={currentRole} allowedRoles={allowedRoles}>{content}</RoleAccessGate>
  );

  function handleDemoSignedIn(session: DemoSession) {
    setDemoSessionState(session);
  }

  function handleDemoLogout() {
    clearDemoSession();
    setDemoSessionState(null);
    window.location.href = "/";
  }

  if (!isPublicPath && isAuthLoading && !demoSession) {
    return renderPersistentShell(<PageLoadingFallback />);
  }

  if (!isPublicPath && !isSignedIn) {
    return renderPersistentShell(<LoginRequiredPage />);
  }

  // The FAQ page also has a hash-based entry point (e.g. #/how-it-works/faq)
  // alongside its real path, which React Router's path matching can't
  // express directly - handled here rather than as a <Route>.
  if (TechSubbiesHowItWorksFaqHashRoute()) {
    return renderPersistentShell(<HowItWorksFaqPage />, true);
  }

  function renderLegacyPage() {
    const renderPage = () => {
        // Automatically route logged-in users to their dashboard if they land on a public page
        if (user && (page === Page.LANDING || page === Page.LOGIN)) {
            switch (user.role) {
                case 'Engineer': setPage(Page.ENGINEER_DASHBOARD); break;
                case 'Company':
                    setPage(Page.COMPANY_DASHBOARD); break;
                case 'Resourcing Company':
                    return <ResourcingDashboard />;
                case 'Admin':
                    return <AdminDashboard />;
            }
        }
        
        switch (page) {
            case Page.LANDING: return <LandingPage onNavigate={setPage} />;
            case Page.LOGIN: return renderPersistentShell(<DemoLoginPage onSignedIn={handleDemoSignedIn} />);
            case Page.ENGINEER_SIGNUP: return <EngineerSignUpWizard onCancel={() => setPage(Page.LOGIN)} />;
            case Page.COMPANY_SIGNUP: return <CompanySignUpWizard onCancel={() => setPage(Page.LOGIN)} />;
            case Page.RESOURCING_SIGNUP: return <ResourcingCompanySignUpWizard onCancel={() => setPage(Page.LOGIN)} />;
            
            // Dashboards (protected by user role check inside the component)
            case Page.ENGINEER_DASHBOARD: return <EngineerDashboard />;
            case Page.COMPANY_DASHBOARD: return <CompanyDashboard />;
            
            // Content Pages
            case Page.FOR_ENGINEERS: return <ForEngineersPage onNavigate={setPage} />;
            case Page.FOR_COMPANIES: return <ForCompaniesPage onNavigate={setPage} />;
            case Page.FOR_RESOURCING: return <ForResourcingCompaniesPage onNavigate={setPage} />;
            case Page.ABOUT_US: return <AboutUsPage onNavigate={setPage} />;
            case Page.INVESTORS: return <InvestorPage onNavigate={setPage} />;
            case Page.PRICING: return <PricingPage onNavigate={setPage} />;
            case Page.LEGAL: return <LegalPage page="terms" onNavigate={setPage} />;
            case Page.ACCESSIBILITY: return <AccessibilityPage />;
            case Page.HELP: return <UserGuidePage onNavigate={setPage} />;
            case Page.TUTORIALS: return <TutorialsPage onNavigate={setPage} />;
            
            default:
                // Handle complex pages or redirect
                // FIX: Safely cast page to string to avoid potential 'never' type errors.
                if (String(page).startsWith('how-it-works')) return <HowItWorksPage onNavigate={setPage} />;
                if (user?.role === 'Resourcing Company') return <ResourcingDashboard />;
                if (user?.role === 'Admin') return <AdminDashboard />;
                return <LandingPage onNavigate={setPage} />;
        }
    };
    
    // FIX: Safely cast page to string to avoid potential 'never' type errors.
    const isDashboard = String(page).toLowerCase().includes('dashboard') || 
                        (user?.role === 'Resourcing Company' && page === Page.COMPANY_DASHBOARD) ||
                        (user?.role === 'Admin' && page === Page.COMPANY_DASHBOARD);


    return (
        <div className="flex flex-col min-h-screen">
            <PersistentAppHeader />
            <EmailVerificationBanner />
            <main className="flex-grow">
                <Suspense fallback={<PageLoadingFallback />}>{renderPage()}</Suspense>
            </main>
            {!isDashboard && <Footer onNavigate={setPage} />}

            <HowItWorksModal
                isOpen={isHowItWorksOpen}
                onClose={() => setIsHowItWorksOpen(false)}
                onNavigate={setPage}
            />
            {(user || demoSession) && <AIAssistant />}
        </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isSignedIn
            ? <Navigate to={dashboardPathForRole(currentRole)} replace />
            : renderLegacyPage()
        }
      />
      <Route path="/opportunity-intake" element={renderPersistentShell(roleGate(<LiveOpportunityIntakePage />, [Role.COMPANY, Role.RESOURCING_COMPANY]))} />
      <Route path="/matching/intake" element={renderPersistentShell(roleGate(<LiveOpportunityIntakePage />, [Role.COMPANY, Role.RESOURCING_COMPANY]))} />
      <Route path="/matching-demo" element={renderPersistentShell(<OpportunityMatchingDemoPage />)} />
      <Route path="/how-it-works/matching-demo" element={renderPersistentShell(<OpportunityMatchingDemoPage />)} />
      <Route path="/engineer/product-awareness" element={renderPersistentShell(roleGate(<ProductAwarenessExperiencePage />, [Role.ENGINEER]))} />
      <Route path="/login" element={renderPersistentShell(<DemoLoginPage onSignedIn={handleDemoSignedIn} />)} />
      <Route path="/signin" element={renderPersistentShell(<DemoLoginPage onSignedIn={handleDemoSignedIn} />)} />
      <Route path="/forgot-password" element={renderPersistentShell(<ForgotPasswordPage />)} />
      <Route path="/reset-password" element={renderPersistentShell(<ResetPasswordPage />)} />
      <Route path="/verify-email" element={renderPersistentShell(<VerifyEmailPage />)} />
      <Route
        path="/account/security"
        element={renderPersistentShell(
          <RealAccountGate hasRealAccount={Boolean(user)}><AccountSecurityPage /></RealAccountGate>
        )}
      />
      <Route path="/engineer/dashboard" element={renderPersistentShell(roleGate(<EngineerDashboard />, [Role.ENGINEER]))} />
      <Route path="/company/dashboard" element={renderPersistentShell(roleGate(<CompanyDashboard />, [Role.COMPANY]))} />
      <Route path="/resourcing/dashboard" element={renderPersistentShell(roleGate(<ResourcingDashboard />, [Role.RESOURCING_COMPANY]))} />
      <Route path="/admin/dashboard" element={renderPersistentShell(roleGate(<AdminDashboard />, [Role.ADMIN]))} />
      <Route path="/company/signup" element={<CompanySignUpWizard onCancel={() => setPage(Page.LOGIN)} />} />
      <Route path="/engineer/signup" element={<EngineerSignUpWizard onCancel={() => setPage(Page.LOGIN)} />} />
      <Route path="/resourcing/signup" element={<ResourcingCompanySignUpWizard onCancel={() => setPage(Page.LOGIN)} />} />
      <Route path="/how-it-works/faq" element={renderPersistentShell(<HowItWorksFaqPage />, true)} />
      <Route path="/engineer/profile" element={renderPersistentShell(roleGate(<EngineerProfileHubPage />, [Role.ENGINEER]))} />
      <Route path="/engineer/team-company" element={renderPersistentShell(roleGate(<EngineerTeamCompanyPage />, [Role.ENGINEER]))} />
      <Route path="/engineer/availability" element={renderPersistentShell(roleGate(<EngineerAvailabilityPage />, [Role.ENGINEER]))} />
      <Route path="/watch-demo" element={renderPersistentShell(<WatchDemoPage />, true)} />
      <Route path="/engineer/profile-setup" element={renderPersistentShell(roleGate(<EngineerProfileSetupPage />, [Role.ENGINEER]))} />
      <Route path="/engineer/personal-business-profile" element={renderPersistentShell(roleGate(<EngineerPersonalBusinessProfilePage />, [Role.ENGINEER]))} />
      <Route path="/engineer/skills-profile" element={renderPersistentShell(roleGate(<RoleSkillBuilderPage />, [Role.ENGINEER]))} />
      <Route path="/role-skills" element={renderPersistentShell(roleGate(<RoleSkillBuilderPage />, [Role.ENGINEER]))} />
      <Route path="/company/engineers" element={renderPersistentShell(roleGate(<CompanyEngineerDashboardPage />, [Role.COMPANY, Role.RESOURCING_COMPANY]))} />
      <Route path="/resourcing/engineers" element={renderPersistentShell(roleGate(<CompanyEngineerDashboardPage />, [Role.RESOURCING_COMPANY]))} />
      <Route path="*" element={renderLegacyPage()} />
    </Routes>
  );
};

export default App;
