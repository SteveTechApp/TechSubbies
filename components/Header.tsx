import React from "react";

type HeaderProps = {
  onHowItWorksClick?: () => void;
};

const headerStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 14,
  minHeight: 62,
  padding: "0 18px",
  background: "rgba(255,255,255,0.97)",
  borderBottom: "1px solid rgba(15,23,42,0.1)",
  boxShadow: "0 8px 22px rgba(15,23,42,0.08)",
  backdropFilter: "blur(12px)"
};

const brandStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "none",
  flex: "0 0 auto",
  minWidth: 255
};

const brandLogoStyle: React.CSSProperties = {
  display: "block",
  height: 46,
  width: "auto",
  maxWidth: 275,
  objectFit: "contain"
};

const navStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 12,
  flexWrap: "nowrap",
  color: "#111827",
  fontSize: 13,
  fontWeight: 800,
  whiteSpace: "nowrap"
};

const detailsStyle: React.CSSProperties = {
  position: "relative"
};

const summaryStyle: React.CSSProperties = {
  cursor: "pointer",
  listStyle: "none",
  color: "#111827",
  fontSize: 13,
  fontWeight: 850,
  whiteSpace: "nowrap",
  padding: "8px 0"
};

const menuStyle: React.CSSProperties = {
  position: "absolute",
  right: 0,
  top: "calc(100% + 8px)",
  minWidth: 300,
  border: "1px solid rgba(15,23,42,0.12)",
  background: "#ffffff",
  borderRadius: 16,
  padding: 8,
  boxShadow: "0 24px 70px rgba(15,23,42,0.22)"
};

const linkStyle: React.CSSProperties = {
  display: "block",
  color: "#111827",
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 800,
  whiteSpace: "nowrap"
};

const topLinkStyle: React.CSSProperties = {
  color: "#111827",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
  whiteSpace: "nowrap"
};

const primaryLinkStyle: React.CSSProperties = {
  color: "#ffffff",
  background: "#2563eb",
  textDecoration: "none",
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 13,
  fontWeight: 900,
  whiteSpace: "nowrap"
};

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={linkStyle}>
      {children}
    </a>
  );
}

function HeaderMenu({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <details style={detailsStyle}>
      <summary style={summaryStyle}>{label}⌄</summary>
      <div style={menuStyle}>{children}</div>
    </details>
  );
}

export function Header(_props: HeaderProps) {
  return (
    <header className="techsubbies-sticky-header" style={headerStyle}>
      <a href="/" style={brandStyle} aria-label="TechSubbies home">
        <img src="/techsubbies-logo-transparent.png" alt="TechSubbies" style={brandLogoStyle} />
      </a>

      <nav style={navStyle} aria-label="Main navigation">
        <HeaderMenu label="For Engineers">
          <MenuLink href="/engineer/profile">Engineer Profile Hub</MenuLink>
          <MenuLink href="/engineer/profile-setup">Engineer Profile Setup</MenuLink>
          <MenuLink href="/engineer/personal-business-profile">Personal & Insurance Profile</MenuLink>
          <MenuLink href="/engineer/skills-profile">Skills Builder</MenuLink>
          <MenuLink href="/engineer/availability">Availability & Working Area</MenuLink>
          <MenuLink href="/engineer/product-awareness">Product Awareness / Experience</MenuLink>
          <MenuLink href="/#engineers">How engineers use TechSubbies</MenuLink>
        </HeaderMenu>

        <HeaderMenu label="For Companies">
          <MenuLink href="/#companies">Find Talent</MenuLink>
          <MenuLink href="/#post-opportunity">Post an Opportunity</MenuLink>
          <MenuLink href="/#company-benefits">Company Benefits</MenuLink>
        </HeaderMenu>

        <HeaderMenu label="For Resourcing">
          <MenuLink href="/#resourcing">Resourcing Overview</MenuLink>
          <MenuLink href="/company/engineers">Company Engineer Dashboard</MenuLink>
          <MenuLink href="/#team-management">Team Management</MenuLink>
        </HeaderMenu>

        <HeaderMenu label="How It Works">
          <MenuLink href="/watch-demo">Demo Mode</MenuLink>
          <MenuLink href="/how-it-works/faq">FAQ</MenuLink>
          <MenuLink href="/#how-it-works">How TechSubbies Works</MenuLink>
          <MenuLink href="/#service-boundary">Matching Service Boundary</MenuLink>
        </HeaderMenu>

        <a href="/#pricing" style={topLinkStyle}>Pricing</a>
        <a href="/#investors" style={topLinkStyle}>Investors</a>
        <a href="/#about" style={topLinkStyle}>About Us</a>
        <a href="/login" style={primaryLinkStyle}>Sign In</a>
      </nav>
    </header>
  );
}

export default Header;



