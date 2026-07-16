"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { colors } from "@/styles/tokens";

const CLIENT_LINKS = [
  {
    href: "/",
    label: "Accueil",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke={active ? colors.primary : colors.textMuted} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/scanner",
    label: "Analyser",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke={active ? colors.primary : colors.textMuted} strokeWidth="1.8"/>
        <path d="M16.5 16.5L21 21" stroke={active ? colors.primary : colors.textMuted} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/meal-plan",
    label: "Repas",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="3" stroke={active ? colors.primary : colors.textMuted} strokeWidth="1.8"/>
        <path d="M8 2V6M16 2V6M3 10H21" stroke={active ? colors.primary : colors.textMuted} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/journal",
    label: "Journal",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 4H20V20H4V4Z" stroke={active ? colors.primary : colors.textMuted} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M8 9H16M8 13H13" stroke={active ? colors.primary : colors.textMuted} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Assistant",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 15C21 16.1 20.1 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z" stroke={active ? colors.primary : colors.textMuted} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/favorites",
    label: "Favoris",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? colors.primary : "none"} stroke={active ? colors.primary : colors.textMuted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

const DIETITIAN_LINKS = [
  {
    href: "/patients",
    label: "Patients",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="4" stroke={active ? colors.primary : colors.textMuted} strokeWidth="1.8"/>
        <path d="M2 21C2 17.134 5.134 14 9 14H15C18.866 14 22 17.134 22 21" stroke={active ? colors.primary : colors.textMuted} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M19 8V14M16 11H22" stroke={active ? colors.primary : colors.textMuted} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/scanner",
    label: "Analyser",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke={active ? colors.primary : colors.textMuted} strokeWidth="1.8"/>
        <path d="M16.5 16.5L21 21" stroke={active ? colors.primary : colors.textMuted} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isDietAdmin = role === "DIETITIAN" || role === "ADMIN";
  const links = isDietAdmin ? DIETITIAN_LINKS : CLIENT_LINKS;

  return (
    <nav className="bottom-nav" style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: "430px",
      background: "#fff",
      borderTop: `1px solid var(--primary-border)`,
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      paddingBottom: "env(safe-area-inset-bottom)",
      paddingTop: "10px",
      zIndex: 100,
    }}>
      {links.map((link) => {
        const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link key={link.href} href={link.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "4px 16px", textDecoration: "none" }}>
            {link.icon(active)}
            <span style={{ fontSize: "10px", color: active ? colors.primary : colors.textMuted, fontWeight: active ? 500 : 400 }}>
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
