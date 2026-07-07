"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  {
    href: "/",
    label: "Accueil",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke={active ? "#185FA5" : "#85B7EB"} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  {
    href: "/scanner",
    label: "Analyser",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke={active ? "#185FA5" : "#85B7EB"} strokeWidth="1.8"/>
        <path d="M16.5 16.5L21 21" stroke={active ? "#185FA5" : "#85B7EB"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/meal-plan",
    label: "Repas",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="3" stroke={active ? "#185FA5" : "#85B7EB"} strokeWidth="1.8"/>
        <path d="M8 2V6M16 2V6M3 10H21" stroke={active ? "#185FA5" : "#85B7EB"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/journal",
    label: "Journal",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 4H20V20H4V4Z" stroke={active ? "#185FA5" : "#85B7EB"} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M8 9H16M8 13H13" stroke={active ? "#185FA5" : "#85B7EB"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Assistant",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 15C21 16.1 20.1 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z" stroke={active ? "#185FA5" : "#85B7EB"} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: "430px",
      background: "#fff",
      borderTop: "1px solid #DAEAF8",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      paddingBottom: "env(safe-area-inset-bottom)",
      paddingTop: "10px",
      zIndex: 100,
    }}>
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "4px 16px",
              textDecoration: "none",
            }}
          >
            {link.icon(active)}
            <span style={{
              fontSize: "10px",
              color: active ? "#185FA5" : "#85B7EB",
              fontWeight: active ? 500 : 400,
              letterSpacing: "0.02em",
            }}>
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}