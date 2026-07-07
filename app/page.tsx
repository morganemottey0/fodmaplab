import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div>
      {/* Header */}
      <div style={{ background: "#185FA5", padding: "52px 24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <p style={{ fontSize: "13px", color: "#85B7EB", margin: "0 0 6px", letterSpacing: "0.04em" }}>
              Bonjour {session?.user?.name?.split(" ")[0] ?? ""}
            </p>
            <h1 style={{ fontSize: "26px", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.03em", lineHeight: 1.2 }}>
              Que mangez-vous<br />aujourd'hui ?
            </h1>
          </div>
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <button
              type="submit"
              style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", color: "#fff", cursor: "pointer" }}
            >
              Déconnexion
            </button>
          </form>
        </div>

        <Link href="/scanner" style={{ display: "flex", alignItems: "center", gap: "10px", background: "#0C447C", borderRadius: "14px", padding: "13px 16px", textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#85B7EB" strokeWidth="1.8"/>
            <path d="M16.5 16.5L21 21" stroke="#85B7EB" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: "14px", color: "#B5D4F4" }}>Rechercher un aliment...</span>
        </Link>
      </div>

      <div style={{ padding: "24px 20px 0" }}>
        <p style={{ fontSize: "11px", color: "#85B7EB", letterSpacing: "0.1em", marginBottom: "12px" }}>ACCÈS RAPIDE</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
          {[
            { href: "/scanner", label: "Analyser", sub: "un aliment", color: "#E6F1FB", border: "#B5D4F4", dot: "#185FA5" },
            { href: "/meal-plan", label: "Mes repas", sub: "cette semaine", color: "#E6F1FB", border: "#B5D4F4", dot: "#378ADD" },
            { href: "/journal", label: "Journal", sub: "alimentaire", color: "#E6F1FB", border: "#B5D4F4", dot: "#85B7EB" },
            { href: "/chat", label: "Diététicien", sub: "poser une question", color: "#185FA5", border: "#185FA5", dot: "#fff" },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{ background: item.color, border: `1px solid ${item.border}`, borderRadius: "18px", padding: "18px 16px", textDecoration: "none" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: item.dot, marginBottom: "12px" }} />
              <p style={{ fontSize: "14px", fontWeight: 500, color: item.href === "/chat" ? "#fff" : "#0C447C", margin: "0 0 2px" }}>{item.label}</p>
              <p style={{ fontSize: "11px", color: item.href === "/chat" ? "#85B7EB" : "#85B7EB", margin: 0 }}>{item.sub}</p>
            </Link>
          ))}
        </div>

        <p style={{ fontSize: "11px", color: "#85B7EB", letterSpacing: "0.1em", marginBottom: "12px" }}>NIVEAUX FODMAP</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "28px" }}>
          {[
            { label: "Low", bg: "#E8F5E9", border: "#C8E6C9", dot: "#4CAF50", text: "#1B5E20" },
            { label: "Modéré", bg: "#FFF8E1", border: "#FFE0B2", dot: "#FF9800", text: "#E65100" },
            { label: "High", bg: "#FFEBEE", border: "#FFCDD2", dot: "#F44336", text: "#B71C1C" },
          ].map((l) => (
            <div key={l.label} style={{ background: l.bg, border: `1px solid ${l.border}`, borderRadius: "14px", padding: "14px 10px", textAlign: "center" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: l.dot, margin: "0 auto 8px" }} />
              <p style={{ fontSize: "11px", fontWeight: 500, color: l.text, margin: 0 }}>{l.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}