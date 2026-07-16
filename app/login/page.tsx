"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.ok) {
      router.push("/");
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="login-shell">

      {/* Côté gauche — branding */}
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
            Votre guide intelligent pour<br />le régime low-FODMAP
          </p>
        </div>

        {/* Features */}
        <div className="login-features">
          {[
            { icon: "🔍", text: "Analysez vos aliments instantanément" },
            { icon: "📅", text: "Générez des plans de repas personnalisés" },
            { icon: "💬", text: "Consultez votre diététicien AI" },
            { icon: "📓", text: "Suivez votre journal alimentaire" },
          ].map((f, i) => (
            <div key={i} className="login-feature-item">
              <span className="login-feature-icon">{f.icon}</span>
              <span className="login-feature-text">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Côté droit — formulaire */}
      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="login-form-header">
            <div className="login-form-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4V20M4 12H20" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="login-form-title">Commencer</h2>
            <p className="login-form-subtitle">
              Connectez-vous pour accéder à votre espace personnel et suivre votre alimentation.
            </p>
          </div>

          <div className="login-form-actions">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="btn-secondary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? "Connexion..." : "Continuer avec Google"}
            </button>

            {!showCredentials ? (
              <button
                onClick={() => setShowCredentials(true)}
                className="btn-primary"
              >
                Se connecter avec un compte test
              </button>
            ) : (
              <form onSubmit={handleCredentials} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="email"
                  placeholder="Email"
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
                  placeholder="Mot de passe"
                  required
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
                {error && <p style={{ color: "#ef4444", fontSize: "13px", margin: 0 }}>{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? "Connexion..." : "Se connecter"}
                </button>
              </form>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", marginTop: "16px" }}>
            <Link
              href="/register"
              className="btn-secondary"
              style={{ textDecoration: "none", textAlign: "center", display: "block", width: "100%" }}
            >
              Créer un compte
            </Link>
            <p className="login-form-legal" style={{ margin: 0 }}>
              En créant un compte vous acceptez nos conditions d'utilisation.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile — version complète */}
      <div className="login-mobile">
        <div className="decoration-circle-lg" />
        <div className="decoration-circle-sm" />

        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-10">
          <div className="login-brand-icon mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 4V20M4 12H20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-white text-4xl font-bold tracking-tight text-center mb-2">
            FODMAP
          </h1>
          <p className="text-center text-sm mb-8" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
            Votre guide intelligent<br />pour le régime low-FODMAP
          </p>
        </div>

        <div className="bg-surface px-6 pt-8 pb-12" style={{ borderRadius: "32px 32px 0 0" }}>
          <h2 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>
            Commencer
          </h2>
          <p className="text-sm mb-7" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            Connectez-vous pour suivre votre alimentation.
          </p>
          <button onClick={handleGoogle} disabled={loading} className="btn-secondary mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Connexion..." : "Continuer avec Google"}
          </button>

          {!showCredentials ? (
            <button onClick={() => setShowCredentials(true)} className="btn-primary">
              Se connecter avec un compte test
            </button>
          ) : (
            <form onSubmit={handleCredentials} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                style={{ padding: "12px 14px", borderRadius: "12px", border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text-primary)", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" }}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                style={{ padding: "12px 14px", borderRadius: "12px", border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text-primary)", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" }}
              />
              {error && <p style={{ color: "#ef4444", fontSize: "13px", margin: 0 }}>{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          )}

          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
            <Link
              href="/register"
              className="btn-secondary"
              style={{ textDecoration: "none", textAlign: "center", display: "block", width: "100%" }}
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
