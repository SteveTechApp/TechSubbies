import PersistentAppHeader from "./components/PersistentAppHeader";
import { clearDemoSession, getDemoSession, type DemoSession } from "./data/demoAccounts";
import DemoLoginPage from "./views/DemoLoginPage";
import LiveOpportunityIntakePage from "./views/LiveOpportunityIntakePage";
import OpportunityMatchingDemoPage from "./views/OpportunityMatchingDemoPage";
import ProductAwarenessExperiencePage from "./views/ProductAwarenessExperiencePage";
import { ResourcingCompanySignUpWizard } from "./views/ResourcingCompanySignUpWizard";
import { EngineerSignUpWizard } from "./views/EngineerSignUpWizard";
import { CompanySignUpWizard } from "./views/CompanySignUpWizard";
import { LoginSelector } from "./views/LoginSelector";
import EngineerAvailabilityPage from "./views/EngineerAvailabilityPage";
import EngineerProfileHubPage from "./views/EngineerProfileHubPage";
import HowItWorksFaqPage from "./views/HowItWorksFaqPage";
import React, { useEffect, useState } from 'react';
import { useNavigation } from './context/NavigationContext';
import { useAuth } from './context/AuthContext';
import { Page } from './types';

// Page Components
import { LandingPage } from './views/LandingPage';
import { EngineerDashboard } from './views/EngineerDashboard';
import { CompanyDashboard } from './views/CompanyDashboard';
import { ResourcingDashboard } from './views/ResourcingDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { ForEngineersPage } from './views/ForEngineersPage';
import { ForCompaniesPage } from './views/ForCompaniesPage';
import { ForResourcingCompaniesPage } from './views/ForResourcingCompaniesPage';
import { AboutUsPage } from './views/AboutUsPage';
import { InvestorPage } from './views/InvestorPage';
import { PricingPage } from './views/PricingPage';
import { LegalPage } from './views/LegalPage';
import { AccessibilityPage } from './views/AccessibilityPage';
import { HowItWorksPage } from './views/HowItWorksPage';
import { UserGuidePage } from './views/UserGuidePage';
import { TutorialsPage } from './views/TutorialsPage';

// Common Components
import { Footer } from './components/Footer';
import { HowItWorksModal } from './components/HowItWorksModal';
import { AIAssistant } from './components/AIAssistant';


import CompanyEngineerDashboardPage from "./views/CompanyEngineerDashboardPage";
import WatchDemoPage from "./views/WatchDemoPage";

import RoleSkillBuilderPage from "./views/RoleSkillBuilderPage";



import EngineerProfileSetupPage from "./views/EngineerProfileSetupPage";
import EngineerPersonalBusinessProfilePage from "./views/EngineerPersonalBusinessProfilePage";

function TechSubbiesHowItWorksFaqHashRoute(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.location.hash === "#/how-it-works/faq" ||
    window.location.hash === "#how-it-works-faq" ||
    window.location.pathname === "/how-it-works/faq"
  );
}



const publicDirectPaths = new Set([
  "/",
  "/login",
  "/signin",
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
  const { user } = useAuth();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const renderPersistentShell = (content: React.ReactNode, showFooter = false) => (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <PersistentAppHeader />
      <main className="flex-grow">
        {content}
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

  function handleDemoSignedIn(session: DemoSession) {
    setDemoSessionState(session);
  }

  function handleDemoLogout() {
    clearDemoSession();
    setDemoSessionState(null);
    window.location.href = "/";
  }

  if (!isPublicPath && !isSignedIn) {
    return renderPersistentShell(<LoginRequiredPage />);
  }

    if (window.location.pathname === "/opportunity-intake" || window.location.pathname === "/matching/intake") {
    return renderPersistentShell(<LiveOpportunityIntakePage />);
  }

if (window.location.pathname === "/matching-demo" || window.location.pathname === "/how-it-works/matching-demo") {
    return renderPersistentShell(<OpportunityMatchingDemoPage />);
  }


  if (window.location.pathname === "/engineer/product-awareness") {
    return renderPersistentShell(<ProductAwarenessExperiencePage />);
  }

  
  if (window.location.pathname === "/login" || window.location.pathname === "/signin") {
    return renderPersistentShell(<DemoLoginPage onSignedIn={handleDemoSignedIn} />);
  }

  if (window.location.pathname === "/company/signup") {
    return <CompanySignUpWizard onCancel={() => setPage(Page.LOGIN)} />;
  }

  if (window.location.pathname === "/engineer/signup") {
    return <EngineerSignUpWizard onCancel={() => setPage(Page.LOGIN)} />;
  }

  if (window.location.pathname === "/resourcing/signup") {
    return <ResourcingCompanySignUpWizard onCancel={() => setPage(Page.LOGIN)} />;
  }
if (TechSubbiesHowItWorksFaqHashRoute()) {
    return renderPersistentShell(<HowItWorksFaqPage />, true);
  }

  if (window.location.pathname === "/engineer/profile") {
    return renderPersistentShell(<EngineerProfileHubPage />);
  }

  if (window.location.pathname === "/engineer/availability") {
    return renderPersistentShell(<EngineerAvailabilityPage />);
  }
if (window.location.pathname === "/watch-demo") {
    return renderPersistentShell(<WatchDemoPage />, true);
  }

  if (window.location.pathname === "/engineer/profile-setup") {
    return renderPersistentShell(<EngineerProfileSetupPage />);
  }

  if (window.location.pathname === "/engineer/personal-business-profile") {
    return renderPersistentShell(<EngineerPersonalBusinessProfilePage />);
  }
  if (window.location.pathname === "/engineer/skills-profile" || window.location.pathname === "/role-skills") {
    return renderPersistentShell(<RoleSkillBuilderPage />);
  }
if (window.location.pathname === "/company/engineers" || window.location.pathname === "/resourcing/engineers") {
    return renderPersistentShell(<CompanyEngineerDashboardPage />);
  }
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
            <main className="flex-grow">
                {renderPage()}
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
};

export default App;








