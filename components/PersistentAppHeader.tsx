import React, { useEffect, useState } from "react";


import { TechSubbiesLogo } from './TechSubbiesLogo';
type DemoSession = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  signedInAt?: string;
};

type NavLink = {
  label: string;
  href: string;
  protected?: boolean;
};

type NavGroup = {
  label: string;
  links: NavLink[];
};

const demoSessionKey = "techsubbies_demo_session";
const logoIconSrc = "/techsubbies-logo-transparent.png";
const logoFallbackSrc = "/techsubbies-logo.svg";

const navGroups: NavGroup[] = [
  {
    label: "About",
    links: [
      { label: "Home", href: "/" },
      { label: "How it works", href: "/how-it-works/faq" },
{ label: "Engineer How it Works", href: "/how-it-works/faq#engineers" },
{ label: "Resourcing Company How it Works", href: "/how-it-works/faq#resourcing" },
{ label: "Client How it Works", href: "/how-it-works/faq#companies" },
      { label: "Engineer Demo", href: "/watch-demo#engineer" },
      { label: "Resourcing Company Demo", href: "/watch-demo#resourcing_company" },
      { label: "Client Demo", href: "/watch-demo#hiring_company" },
],
  },
  {
    label: "Engineers",
    links: [
      { label: "Subcontractor sign up", href: "/engineer/signup" },
      { label: "Profile hub", href: "/engineer/profile", protected: true },
      { label: "Personal / business profile", href: "/engineer/personal-business-profile", protected: true },
      { label: "Role skills profile", href: "/engineer/skills-profile", protected: true },
      { label: "Availability", href: "/engineer/availability", protected: true },
    ],
  },
  {
    label: "Companies",
    links: [
      { label: "Client company sign up", href: "/company/signup" },
      { label: "Post a Project", href: "/opportunity-intake", protected: true },
],
  },
  {
    label: "Resourcing Companies",
    links: [
      { label: "Resourcing company sign up", href: "/resourcing/signup" },
      
      { label: "Engineer management", href: "/company/engineers", protected: true },{ label: "Opportunity matching", href: "/matching/intake", protected: true },
    ],
  },
];

function readDemoSession(): DemoSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(demoSessionKey);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DemoSession;
  } catch {
    window.localStorage.removeItem(demoSessionKey);
    return null;
  }
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
  const [isOpen, setIsOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [session, setSession] = useState<DemoSession | null>(() => readDemoSession());

  useEffect(() => {
    function refresh() {
      setSession(readDemoSession());
    }

    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const currentPath = typeof window === "undefined" ? "/" : window.location.pathname;

  function logout() {
    window.localStorage.removeItem(demoSessionKey);
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

  return (
    <header className="sticky top-0 z-[120] border-b border-white/10 bg-slate-950/95 text-white shadow-2xl backdrop-blur techsubbies-sticky-header">
      <div className="relative min-h-[92px] w-full">
        <BrandLogo />

        <div className="flex min-h-[92px] items-center justify-between pr-5 pl-[420px]">
          <nav className="hidden items-center gap-3 xl:flex">
            {navGroups.map((group) => {
              const active = groupIsActive(group);
              const expanded = openGroup === group.label;

              return (
                <div key={group.label} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.label)}
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
                    <div className="absolute left-0 top-[calc(100%+14px)] w-72 rounded-2xl border border-cyan-300/20 bg-slate-950 p-3 shadow-2xl shadow-black/50">
                      <div className="px-3 pb-2 text-[13px] font-bold uppercase tracking-[0.30em] text-cyan-300">
                        {group.label}
                      </div>

                      <div className="space-y-1">
                        {group.links.map((link) => (
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

                            {link.protected && (
                              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[13px] uppercase tracking-wide opacity-70">
                                login
                              </span>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-3 xl:flex">
            {session ? (
              <>
                <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2">
                  <div className="text-[13px] font-bold text-cyan-200">
                    {session.name || "Signed in"}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {session.role || "User"}
                  </div>
                </div>

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
                  {group.links.map((link) => (
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

                      {link.protected && (
                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[13px] uppercase tracking-wide opacity-70">
                          login
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </section>
            ))}

            {session && (
              <section className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 md:col-span-2 lg:col-span-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-bold text-cyan-200">{session.name || "Signed in"}</div>
                    <div className="text-[13px] text-slate-400">{session.role || "User"} · {session.email}</div>
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:border-cyan-300/60 hover:text-cyan-200"
                  >
                    Logout
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </header>
  );
}












