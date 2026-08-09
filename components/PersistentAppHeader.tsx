import React, { useEffect, useState } from "react";


import { TechSubbiesLogo } from './TechSubbiesLogo';
import { clearDemoSession, getDemoSession, type DemoSession } from "../data/demoAccounts";
import { useAuth } from "../context/AuthContext";
import { Role } from "../types";
import { dashboardPathForRole } from "../utils/accountRoutes";

type NavLink = {
  label: string;
  href: string;
  protected?: boolean;
  allowedRoles?: Role[];
  requiresRealAccount?: boolean;
};

type NavGroup = {
  label: string;
  href: string;
  links: NavLink[];
};

const logoIconSrc = "/techsubbies-logo-transparent.png";
const logoFallbackSrc = "/techsubbies-logo.svg";

const navGroups: NavGroup[] = [
  {
    label: "Engineers",
    href: "/engineer/signup",
    links: [
      { label: "Engineer signup", href: "/engineer/signup" },
      { label: "Profile hub", href: "/engineer/profile", protected: true, allowedRoles: [Role.ENGINEER, Role.ADMIN] },
      { label: "Personal / business profile", href: "/engineer/personal-business-profile", protected: true, allowedRoles: [Role.ENGINEER, Role.ADMIN] },
      { label: "Role skills profile", href: "/engineer/skills-profile", protected: true, allowedRoles: [Role.ENGINEER, Role.ADMIN] },
      { label: "Availability", href: "/engineer/availability", protected: true, allowedRoles: [Role.ENGINEER, Role.ADMIN] },
    ],
  },
  {
    label: "Companies",
    href: "/company/signup",
    links: [
      { label: "Find Talent", href: "/company/signup" },
      { label: "Post a Project", href: "/opportunity-intake", protected: true, allowedRoles: [Role.COMPANY, Role.RESOURCING_COMPANY, Role.ADMIN] },
      { label: "Company dashboard", href: "/company/dashboard", protected: true, allowedRoles: [Role.COMPANY, Role.RESOURCING_COMPANY, Role.ADMIN] },
    ],
  },
  {
    label: "Resourcing Companies",
    href: "/resourcing/signup",
    links: [
      { label: "Resourcing company signup", href: "/resourcing/signup" },
      { label: "Engineer management", href: "/company/engineers", protected: true, allowedRoles: [Role.COMPANY, Role.RESOURCING_COMPANY, Role.ADMIN] },
      { label: "Opportunity matching", href: "/matching/intake", protected: true, allowedRoles: [Role.COMPANY, Role.RESOURCING_COMPANY, Role.ADMIN] },
    ],
  },
  {
    label: "About",
    href: "/how-it-works/faq",
    links: [
      { label: "Home", href: "/" },
      { label: "How it works", href: "/how-it-works/faq" },
      { label: "Engineer How it Works", href: "/how-it-works/faq#engineers" },
      { label: "Resourcing Company How it Works", href: "/how-it-works/faq#resourcing" },
      { label: "Client How it Works", href: "/how-it-works/faq#companies" },
      { label: "Engineer Demo", href: "/watch-demo#engineer" },
      { label: "Resourcing Company Demo", href: "/watch-demo#resourcing_company" },
      { label: "Client Demo", href: "/watch-demo#hiring_company" },
      { label: "Account security", href: "/account/security", protected: true, requiresRealAccount: true },
    ],
  },
];

export function isNavLinkVisible(
  link: NavLink,
  accountRole: string | undefined,
  isAuthenticated: boolean,
  hasRealAccount: boolean
) {
  if (!isAuthenticated) return true;
  if (link.requiresRealAccount && !hasRealAccount) return false;
  if (!link.allowedRoles) return true;
  return Boolean(accountRole && link.allowedRoles.includes(accountRole as Role));
}
function isActiveHref(href: string) {
  if (typeof window === "undefined") {
    return false;
  }

  if (href === "/") {
    return window.location.pathname === "/";
  }

  return window.location.pathname === href;
}

function groupIsActive(group: NavGroup) {
  return group.links.some((link) => isActiveHref(link.href));
}

function BrandLogo() {
  return (
    <a
      href="/"
      className="absolute left-0 top-1/2 z-30 flex w-[390px] -translate-y-1/2 items-center gap-4 pl-5 techsubbies-brand-lockup techsubbies-brand-link-v2"
    >
          <TechSubbiesLogo />
        </a>
  );
}

export default function PersistentAppHeader() {
  const { user, logout: logoutRealAccount } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [session, setSession] = useState<DemoSession | null>(() => getDemoSession());

  useEffect(() => {
    function refresh() {
      setSession(getDemoSession());
    }

    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const currentPath = typeof window === "undefined" ? "/" : window.location.pathname;
  const identity = user
    ? {
        name: user.profile.name || "Signed in",
        role: user.role,
        email: user.profile.contact?.email || "",
      }
    : session;
  const isAuthenticated = Boolean(identity);
  const visibleLinks = (group: NavGroup) =>
    group.links.filter((link) => isNavLinkVisible(link, identity?.role, isAuthenticated, Boolean(user)));

  function logout() {
    if (user) {
      logoutRealAccount();
    } else {
      clearDemoSession();
    }
    setSession(null);
    window.location.href = "/";
  }

  function toggleGroup(label: string) {
    if (openGroup === label) {
      setOpenGroup(null);
      return;
    }

    setOpenGroup(label);
  }

  function handleHeaderMouseLeave() {
    setOpenGroup(null);
  }

  return (
    <header onMouseLeave={handleHeaderMouseLeave} className="sticky top-0 z-[120] border-b border-white/10 bg-slate-950/95 text-white shadow-2xl backdrop-blur techsubbies-sticky-header">
      <div className="relative min-h-[92px] w-full">
        <BrandLogo />

        <div className="flex min-h-[92px] items-center justify-between pr-5 pl-[420px]">
          <nav className="hidden items-center gap-3 xl:flex">
            {navGroups.map((group) => {
              const active = groupIsActive(group) || isActiveHref(group.href);
              const expanded = openGroup === group.label;

              return (
                <div key={group.label} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.label)}
                    aria-expanded={expanded}
                    className={[
                      "rounded-xl px-4 py-2 text-sm font-black transition",
                      active || expanded
                        ? "bg-cyan-300 text-slate-950"
                        : "text-slate-300 hover:bg-white/10 hover:text-cyan-200",
                    ].join(" ")}
                  >
                    {group.label}
                  </button>

                  {expanded && (
                    <div className="absolute left-0 top-[calc(100%+14px)] z-[200] w-80 rounded-2xl border border-cyan-300/20 bg-slate-950 p-3 shadow-2xl shadow-black/50">
                      <div className="px-3 pb-2 text-[13px] font-bold uppercase tracking-[0.30em] text-cyan-300">
                        {group.label}
                      </div>

                      <div className="space-y-1">
                        {visibleLinks(group).map((link) => {
                          const linkPath = link.href.split("#")[0];
                          const activeLink = currentPath === linkPath;

                          return (
                            <a
                              key={link.href}
                              href={link.href}
                              onClick={() => setOpenGroup(null)}
                              className={[
                                "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition",
                                activeLink
                                  ? "bg-cyan-300 text-slate-950"
                                  : "text-slate-300 hover:bg-white/10 hover:text-cyan-200",
                              ].join(" ")}
                            >
                              <span>{link.label}</span>

                              {link.protected && !isAuthenticated && (
                                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[13px] uppercase tracking-wide opacity-70">
                                  login
                                </span>
                              )}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-3 xl:flex">
            {identity ? (
              <>
                <a
                  href={dashboardPathForRole(identity.role)}
                  aria-label="Open dashboard"
                  className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 hover:border-cyan-300/50"
                >
                  <div className="text-[13px] font-bold text-cyan-200">
                    {identity.name || "Signed in"}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {identity.role || "User"}
                  </div>
                </a>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:border-cyan-300/60 hover:text-cyan-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-200"
              >
                Login
              </a>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10"
            >
              Menu
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2 xl:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10"
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950">
          <div className="grid gap-4 px-4 py-5 md:grid-cols-2 lg:grid-cols-4 lg:px-5">
            {navGroups.map((group) => (
              <section key={group.label} className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                <h2 className="text-sm font-bold text-cyan-300">{group.label}</h2>

                <div className="mt-3 space-y-2">
                  {visibleLinks(group).map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={[
                        "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition",
                        currentPath === link.href
                          ? "bg-cyan-300 text-slate-950"
                          : "text-slate-300 hover:bg-white/10 hover:text-cyan-200",
                      ].join(" ")}
                    >
                      <span>{link.label}</span>

                      {link.protected && !isAuthenticated && (
                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[13px] uppercase tracking-wide opacity-70">
                          login
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </section>
            ))}

            {identity && (
              <section className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 md:col-span-2 lg:col-span-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-bold text-cyan-200">{identity.name || "Signed in"}</div>
                    <div className="text-[13px] text-slate-400">
                      {identity.role || "User"}{identity.email ? ` · ${identity.email}` : ""}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a href={dashboardPathForRole(identity.role)} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100">
                      Dashboard
                    </a>
                    <button
                      type="button"
                      onClick={logout}
                      className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:border-cyan-300/60 hover:text-cyan-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </header>
  );
}














