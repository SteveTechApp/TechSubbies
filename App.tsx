import React, { useState } from 'react';
import { useNavigation } from './context/NavigationContext';
import { useAuth } from './context/AuthContext';
import { Page } from './types';

// Page Components
import { LandingPage } from './views/LandingPage';
import { LoginSelector } from './views/LoginSelector';
import { EngineerSignUpWizard } from './views/EngineerSignUpWizard';
import { CompanySignUpWizard } from './views/CompanySignUpWizard';
import { ResourcingCompanySignUpWizard } from './views/ResourcingCompanySignUpWizard';
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
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HowItWorksModal } from './components/HowItWorksModal';
import { AIAssistant } from './components/AIAssistant';


import CompanyEngineerDashboardPage from "./views/CompanyEngineerDashboardPage";
import WatchDemoPage from "./views/WatchDemoPage";

import RoleSkillBuilderPage from "./views/RoleSkillBuilderPage";
import { EngineerCertificatesAwardsPage, EngineerFeedbackCaseStudiesPage, EngineerProfileHubPage } from "./views/EngineerProfileHubPage";



function installTechSubbiesTopNavLinks() {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof document === "undefined") {
    return;
  }

  function normaliseText(value) {
    return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function findClickableByText(text) {
    const target = normaliseText(text);
    const candidates = Array.from(document.querySelectorAll("a, button, [role='button'], nav span, header span, nav div, header div"));

    return candidates.find((item) => {
      const value = normaliseText(item.textContent);
      return value === target || value.indexOf(target) >= 0;
    });
  }

  function createTopNavLink(label, href) {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;

    link.onclick = (event) => {
      event.preventDefault();
      window.location.href = href;
    };

    link.style.color = "#1f2937";
    link.style.textDecoration = "none";
    link.style.fontSize = "14px";
    link.style.fontWeight = "600";
    link.style.display = "inline-flex";
    link.style.alignItems = "center";
    link.style.justifyContent = "center";
    link.style.padding = "8px 10px";
    link.style.borderRadius = "10px";
    link.style.whiteSpace = "nowrap";

    link.onmouseenter = () => {
      link.style.background = "rgba(37, 99, 235, 0.08)";
      link.style.color = "#2563eb";
    };

    link.onmouseleave = () => {
      link.style.background = "transparent";
      link.style.color = "#1f2937";
    };

    return link;
  }

  function createDropdownMenu() {
    const menu = document.createElement("div");
    menu.id = "techsubbies-engineer-profile-menu";
    menu.style.position = "absolute";
    menu.style.top = "calc(100% + 8px)";
    menu.style.left = "0";
    menu.style.minWidth = "280px";
    menu.style.padding = "10px";
    menu.style.borderRadius = "16px";
    menu.style.border = "1px solid rgba(15, 23, 42, 0.12)";
    menu.style.background = "#ffffff";
    menu.style.boxShadow = "0 18px 42px rgba(15, 23, 42, 0.18)";
    menu.style.zIndex = "9999";
    menu.style.display = "none";

    function addItem(title, detail, href) {
      const item = document.createElement("a");
      item.href = href;
      item.style.display = "block";
      item.style.padding = "10px";
      item.style.borderRadius = "12px";
      item.style.textDecoration = "none";
      item.style.marginBottom = "6px";
      item.style.border = "1px solid rgba(15, 23, 42, 0.08)";
      item.style.background = "#f8fafc";

      item.onclick = (event) => {
        event.preventDefault();
        window.location.href = href;
      };

      const titleEl = document.createElement("div");
      titleEl.textContent = title;
      titleEl.style.color = "#0f172a";
      titleEl.style.fontSize = "13px";
      titleEl.style.fontWeight = "800";
      titleEl.style.marginBottom = "3px";

      const detailEl = document.createElement("div");
      detailEl.textContent = detail;
      detailEl.style.color = "#475569";
      detailEl.style.fontSize = "12px";
      detailEl.style.lineHeight = "1.35";

      item.appendChild(titleEl);
      item.appendChild(detailEl);
      menu.appendChild(item);
    }

    addItem("Engineer profile hub", "Choose which profile section to complete next.", "/engineer/profile");
    addItem("Profile setup", "Choose which part of the engineer profile to complete.", "/engineer/profile-setup");
    addItem("Personal / business profile", "Identity, business, compliance, location and availability.", "/engineer/personal-business-profile");
    addItem("Skills builder", "Role-based AV, IT and hybrid skill ratings.", "/engineer/skills-profile");
    addItem("Certificates & awards", "Upload certificates, awards and professional qualifications.", "/engineer/certificates-awards");
    addItem("Feedback & case studies", "Add customer feedback, documents, photos and short videos.", "/engineer/feedback-case-studies");

    return menu;
  }

  function mount() {
    document.getElementById("techsubbies-watch-demo-link")?.remove();
    document.getElementById("techsubbies-role-skill-link")?.remove();
    document.getElementById("techsubbies-engineer-profile-dropdown")?.remove();

    const header = document.querySelector("header") || document.querySelector("nav") || document.body;

    if (!document.getElementById("techsubbies-how-demo-nav-link")) {
      const howItWorks = findClickableByText("How It Works");

      if (howItWorks && howItWorks.parentElement) {
        const demoLink = createTopNavLink("Watch demo", "/watch-demo");
        demoLink.id = "techsubbies-how-demo-nav-link";
        howItWorks.parentElement.insertBefore(demoLink, howItWorks.nextSibling);
      }
    }

    if (!document.getElementById("techsubbies-engineer-nav-wrapper")) {
      const engineers = findClickableByText("For Engineers");

      if (engineers && engineers.parentElement) {
        const wrapper = document.createElement("span");
        wrapper.id = "techsubbies-engineer-nav-wrapper";
        wrapper.style.position = "relative";
        wrapper.style.display = "inline-flex";
        wrapper.style.alignItems = "center";

        const menu = createDropdownMenu();

        engineers.parentElement.insertBefore(wrapper, engineers);
        wrapper.appendChild(engineers);
        wrapper.appendChild(menu);

        wrapper.addEventListener("mouseenter", () => {
          menu.style.display = "block";
        });

        wrapper.addEventListener("mouseleave", () => {
          menu.style.display = "none";
        });

        engineers.addEventListener("click", (event) => {
          event.preventDefault();
          menu.style.display = menu.style.display === "none" ? "block" : "none";
        });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  window.setTimeout(mount, 300);
  window.setTimeout(mount, 900);
}

installTechSubbiesTopNavLinks();

const App = () => {
  if (window.location.pathname === "/engineer/profile") {
    return <EngineerProfileHubPage />;
  }

  if (window.location.pathname === "/engineer/certificates-awards") {
    return <EngineerCertificatesAwardsPage />;
  }

  if (window.location.pathname === "/engineer/feedback-case-studies") {
    return <EngineerFeedbackCaseStudiesPage />;
  }

  if (window.location.pathname === "/role-skills") {
    return <RoleSkillBuilderPage />;
  }

  if (window.location.pathname === "/watch-demo") {
    return <WatchDemoPage />;
  }

  if (window.location.pathname === "/company/engineers") {
    return <CompanyEngineerDashboardPage />;
  }

    const { page, setPage } = useNavigation();
    const { user } = useAuth();
    const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

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
            case Page.LOGIN: return <LoginSelector onNavigate={setPage} />;
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
            {!isDashboard && <Header onNavigate={setPage} onHowItWorksClick={() => setIsHowItWorksOpen(true)} />}
            <main className={`flex-grow ${!isDashboard ? 'pt-16' : ''}`}>
                {renderPage()}
            </main>
            {!isDashboard && <Footer onNavigate={setPage} />}

            <HowItWorksModal
                isOpen={isHowItWorksOpen}
                onClose={() => setIsHowItWorksOpen(false)}
                onNavigate={setPage}
            />
            {user && <AIAssistant />}
        </div>
    );
};

export default App;