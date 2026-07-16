"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const CLIENT_LINKS = [
  {
    href: "/",
    label: "Accueil",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke={active ? "var(--primary)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/scanner",
    label: "Analyser",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke={active ? "var(--primary)" : "var(--text-muted)"} strokeWidth="1.8"/>
        <path d="M16.5 16.5L21 21" stroke={active ? "var(--primary)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/meal-plan",
    label: "Plan de repas",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="3" stroke={active ? "var(--primary)" : "var(--text-muted)"} strokeWidth="1.8"/>
        <path d="M8 2V6M16 2V6M3 10H21" stroke={active ? "var(--primary)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/journal",
    label: "Journal",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 4H20V20H4V4Z" stroke={active ? "var(--primary)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M8 9H16M8 13H13" stroke={active ? "var(--primary)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Diététicien",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 15C21 16.1 20.1 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z" stroke={active ? "var(--primary)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/favorites",
    label: "Favoris",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "var(--primary)" : "none"} stroke={active ? "var(--primary)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

const DIETITIAN_LINKS = [
  {
    href: "/patients",
    label: "Mes patients",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="4" stroke={active ? "var(--primary)" : "var(--text-muted)"} strokeWidth="1.8"/>
        <path d="M2 21C2 17.134 5.134 14 9 14H15C18.866 14 22 17.134 22 21" stroke={active ? "var(--primary)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M19 8V14M16 11H22" stroke={active ? "var(--primary)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/scanner",
    label: "Analyser",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke={active ? "var(--primary)" : "var(--text-muted)"} strokeWidth="1.8"/>
        <path d="M16.5 16.5L21 21" stroke={active ? "var(--primary)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (pathname === "/login" || pathname === "/register") return null;

  const isDietAdmin = role === "DIETITIAN" || role === "ADMIN";
  const links = isDietAdmin ? DIETITIAN_LINKS : CLIENT_LINKS;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 4V20M4 12H20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="sidebar-logo-text">FODMAP AI</span>
      </div>

      {isDietAdmin && (
        <div style={{
          margin: "0 12px 8px",
          padding: "6px 10px",
          borderRadius: "10px",
          background: "var(--primary-light)",
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--primary)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}>
          {role === "ADMIN" ? "Administrateur" : "Diététicien"}
        </div>
      )}

      <nav className="sidebar-nav">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
            >
              {link.icon(active)}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <p className="text-xs text-muted">FODMAP AI © 2026</p>
      </div>
    </aside>
  );
}
