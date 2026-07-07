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
    <div
      style={{
        minHeight: "100dvh",
        background: "#F8FBFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <div style={{
          width: "64px",
          height: "64px",
          borderRadius: "20px",
          background: "#185FA5",
          margin: "0 auto 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#fff" }} />
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 500, color: "#0C447C", margin: "0 0 6px", letterSpacing: "-0.03em" }}>
          FODMAP AI
        </h1>
        <p style={{ fontSize: "13px", color: "#85B7EB", margin: 0 }}>
          Votre guide intelligent low-FODMAP
        </p>
      </div>

      <div style={{
        width: "100%",
        maxWidth: "340px",
        background: "#fff",
        border: "1px solid #DAEAF8",
        borderRadius: "24px",
        padding: "28px 24px",
      }}>
        <p style={{ fontSize: "18px", fontWeight: 500, color: "#0C447C", margin: "0 0 6px" }}>
          Connexion
        </p>
        <p style={{ fontSize: "13px", color: "#85B7EB", margin: "0 0 24px" }}>