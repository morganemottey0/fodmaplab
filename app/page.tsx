import Link from "next/link";
import { auth, signOut } from "@/auth";

const FEATURES = [
  { href: "/scanner", icon: "🔍", label: "Analyser", sub: "un aliment", primary: true },
  { href: "/meal-plan", icon: "📅", label: "Mes repas", sub: "cette semaine", primary: false },
  { href: "/journal", icon: "📓", label: "Journal", sub: "alimentaire", primary: false },
  { href: "/chat", icon: "💬", label: "Diététicien", sub: "AI assistant", primary: false },
];

const LEVELS = [
  { label: "Low", bg: "#E8F5E9", border: "#C8E6C9", dot: "#4CAF50", text: "#1B5E20" },
  { label: "Modéré", bg: "#FFF8E1", border: "#FFE0B2", dot: "#FF9800", text: "#E65100" },
  { label: "High", bg: "#FFEBEE", border: "#FFCDD2", dot: "#F44336", text: "#B71C1C" },
];

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="bg-app min-h-screen">

      {/* Header */}
      <div className="gradient-primary page-header">
        <div className="decoration-circle-lg" />
        <div className="decoration-circle-sm" />

        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              Bonjour {session?.user?.name?.split(" ")[0] ?? ""} 👋
            </p>
            <h1 className="text-white text-2xl font-semibold tracking-tight leading-tight">
              Que mangez-vous<br />aujourd'hui ?
            </h1>
          </div>
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <button type="submit" className="btn-ghost">
              Déconnexion
            </button>
          </form>
        </div>

        <Link href="/scanner" className="search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8"/>
            <path d="M16.5 16.5L21 21" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
            Rechercher un aliment...
          </span>
        </Link>
      </div>

      <div className="px-5 pt-6">

        {/* Accès rapide */}
        <p className="section-label">Accès rapide</p>
        <div className="grid grid-cols-2 gap-3 mb-7">
          {FEATURES.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="rounded-2xl p-5 block"
              style={{
                background: f.primary ? "var(--primary)" : "var(--primary-light)",
                textDecoration: "none",
              }}
            >
              <span className="text-3xl block mb-3">{f.icon}</span>
              <p style={{
                fontSize: "15px",
                fontWeight: 600,
                color: f.primary ? "#fff" : "var(--text-primary)",
                margin: "0 0 4px",
              }}>
                {f.label}
              </p>
              <p style={{
                fontSize: "12px",
                color: f.primary ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
                margin: 0,
              }}>
                {f.sub}
              </p>
            </Link>
          ))}
        </div>
        {/* Niveaux FODMAP */}
        <p className="section-label">Niveaux FODMAP</p>
        <div className="grid grid-cols-3 gap-2 mb-7">
          {LEVELS.map((l) => (
            <div
              key={l.label}
              className="rounded-2xl py-4 px-2 text-center"
              style={{ background: l.bg, border: `1px solid ${l.border}` }}
            >
              <div className="w-6 h-6 rounded-full mx-auto mb-2" style={{ background: l.dot }} />
              <p className="text-xs font-medium m-0" style={{ color: l.text }}>{l.label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}