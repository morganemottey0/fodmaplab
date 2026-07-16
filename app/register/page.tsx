"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const USER_TYPES = [
  { value: "USER", label: "Utilisateur standard", desc: "Accès aux fonctionnalités de base" },
  { value: "PREMIUM", label: "Premium", desc: "Toutes les fonctionnalités avancées" },
  { value: "DIETITIAN", label: "Diététicien", desc: "Profil professionnel de santé" },
  { value: "ADMIN", label: "Administrateur", desc: "Accès complet à la plateforme" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur lors de la création du compte");
      setLoading(false);
      return;
    }

    // Auto sign in after register
    const signInResult = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (signInResult?.ok) {
      router.push("/");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="login-shell">

      {/* Left — branding */}
      <div className="login-left">
        <div className="decoration-circle-lg" />
        <div className="decoration-circle-sm" />

        <div className="login-brand">
          <div className="login-brand-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 4V20M4 12H20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="login-brand-title">FODMAP AI</h1>
          <p className="login-brand-subtitle">
            Créez votre compte et commencez<br />votre parcours low-FODMAP
          </p>
        </div>

        <div className="login-features">
          {USER_TYPES.map((t) => (
            <div key={t.value} className="login-feature-item">
              <span className="login-feature-icon">
                {t.value === "USER" ? "👤" : t.value === "PREMIUM" ? "⭐" : t.value === "DIETITIAN" ? "🩺" : "🔑"}
              </span>
              <span className="login-feature-text">
                <strong>{t.label}</strong> — {t.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="login-form-header">
            <div className="login-form-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4V20M4 12H20" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="login-form-title">Créer un compte</h2>
            <p className="login-form-subtitle">
              Choisissez un type d'utilisateur pour tester les différentes expériences.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* User type selector */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "4px" }}>
              {USER_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: t.value }))}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: form.role === t.value
                      ? "2px solid var(--primary)"
                      : "2px solid var(--border)",
                    background: form.role === t.value ? "var(--primary-light, rgba(99,102,241,0.08))" : "var(--surface)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: "18px", marginBottom: "2px" }}>
                    {t.value === "USER" ? "👤" : t.value === "PREMIUM" ? "⭐" : t.value === "DIETITIAN" ? "🩺" : "🔑"}
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>{t.label}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px", lineHeight: 1.3 }}>{t.desc}</div>
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Nom complet"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            <input
              type="email"
              placeholder="Email *"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            <input
              type="password"
              placeholder="Mot de passe *"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />

            {error && (
              <p style={{ color: "#ef4444", fontSize: "13px", margin: 0 }}>{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: "4px" }}>
              {loading ? "Création..." : "Créer le compte"}
            </button>
          </form>

          <p className="login-form-legal" style={{ marginTop: "16px" }}>
            Déjà un compte ?{" "}
            <Link href="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 500 }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Mobile */}
      <div className="login-mobile">
        <div className="decoration-circle-lg" />
        <div className="decoration-circle-sm" />

        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-10">
          <div className="login-brand-icon mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 4V20M4 12H20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-white text-4xl font-bold tracking-tight text-center mb-2">FODMAP AI</h1>
          <p className="text-center text-sm mb-8" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
            Créez votre compte de test
          </p>
        </div>

        <div className="bg-surface px-6 pt-8 pb-12" style={{ borderRadius: "32px 32px 0 0" }}>
          <h2 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>
            Créer un compte
          </h2>
          <p className="text-sm mb-5" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            Choisissez un type d'utilisateur.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "4px" }}>
              {USER_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: t.value }))}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "10px",
                    border: form.role === t.value ? "2px solid var(--primary)" : "2px solid var(--border)",
                    background: form.role === t.value ? "var(--primary-light, rgba(99,102,241,0.08))" : "var(--surface)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: "16px" }}>
                    {t.value === "USER" ? "👤" : t.value === "PREMIUM" ? "⭐" : t.value === "DIETITIAN" ? "🩺" : "🔑"}
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-primary)" }}>{t.label}</div>
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Nom complet"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              style={{ padding: "12px 14px", borderRadius: "12px", border: "1.5px solid var(--border)", background: "var(--surface-muted, var(--surface))", color: "var(--text-primary)", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" }}
            />
            <input
              type="email"
              placeholder="Email *"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              style={{ padding: "12px 14px", borderRadius: "12px", border: "1.5px solid var(--border)", background: "var(--surface-muted, var(--surface))", color: "var(--text-primary)", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" }}
            />
            <input
              type="password"
              placeholder="Mot de passe *"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              style={{ padding: "12px 14px", borderRadius: "12px", border: "1.5px solid var(--border)", background: "var(--surface-muted, var(--surface))", color: "var(--text-primary)", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" }}
            />

            {error && <p style={{ color: "#ef4444", fontSize: "13px", margin: 0 }}>{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Création..." : "Créer le compte"}
            </button>
          </form>

          <p className="text-xs text-center mt-5" style={{ color: "var(--text-muted)" }}>
            Déjà un compte ?{" "}
            <Link href="/login" style={{ color: "var(--primary)", textDecoration: "none" }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
