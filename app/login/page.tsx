"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#F8FBFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "#185FA5", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#fff" }} />
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 500, color: "#0C447C", margin: "0 0 6px" }}>FODMAP AI</h1>
        <p style={{ fontSize: "13px", color: "#85B7EB", margin: 0 }}>Votre guide intelligent low-FODMAP</p>
      </div>

      <div style={{ width: "100%", maxWidth: "340px", background: "#fff", border: "1px solid #DAEAF8", borderRadius: "24px", padding: "28px 24px" }}>
        <p style={{ fontSize: "18px", fontWeight: 500, color: "#0C447C", margin: "0 0 6px" }}>Connexion</p>
        <p style={{ fontSize: "13px", color: "#85B7EB", margin: "0 0 24px" }}>Connectez-vous pour accéder à votre espace personnel</p>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #DAEAF8", background: loading ? "#F8FBFF" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", cursor: loading ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: 500, color: "#0C447C" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? "Connexion..." : "Continuer avec Google"}
        </button>

        <p style={{ fontSize: "11px", color: "#B5D4F4", textAlign: "center", margin: "20px 0 0", lineHeight: 1.6 }}>
          En vous connectant, vous acceptez nos conditions d'utilisation.
        </p>
      </div>
    </div>
  );
}