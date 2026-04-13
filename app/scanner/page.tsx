"use client";

import { tapProps } from "@/lib/tap";
import { useState } from "react";
import { FodmapAnalysis } from "@/types/fodmap";
import FodmapResult from "@/components/FodmapResult";

export default function ScannerPage() {
  const [food, setFood] = useState("");
  const [portion, setPortion] = useState(100);
  const [result, setResult] = useState<FodmapAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!food.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ food, portion }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erreur."); return; }
      setResult(data);
    } catch { setError("Impossible de contacter le serveur."); }
    finally { setLoading(false); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ background: "#185FA5", padding: "52px 24px 24px" }}>
        <p style={{ fontSize: "13px", color: "#85B7EB", margin: "0 0 4px" }}>Analyser</p>
        <h1 style={{ fontSize: "24px", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
          Un aliment
        </h1>
      </div>

      <div style={{ padding: "24px 20px" }}>
        {/* Champ aliment */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "12px", color: "#85B7EB", letterSpacing: "0.06em", display: "block", marginBottom: "8px" }}>
            ALIMENT
          </label>
          <input
            type="text"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="Ex : mangue, ail, brocoli..."
            style={{
              width: "100%",
              background: "#fff",
              border: "1px solid #DAEAF8",
              borderRadius: "14px",
              padding: "14px 16px",
              fontSize: "15px",
              color: "#0C447C",
              outline: "none",
            }}
          />
        </div>

        {/* Portion */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", color: "#85B7EB", letterSpacing: "0.06em", display: "block", marginBottom: "8px" }}>
            PORTION — {portion}g
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[50, 100, 150, 200].map((p) => (
              <button
                key={p}
                {...tapProps(() => setPortion(p))}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: "12px",
                  border: `1px solid ${portion === p ? "#185FA5" : "#DAEAF8"}`,
                  background: portion === p ? "#E6F1FB" : "#fff",
                  color: portion === p ? "#185FA5" : "#85B7EB",
                  fontSize: "13px",
                  fontWeight: portion === p ? 500 : 400,
                  cursor: "pointer",
                }}
              >
                {p}g
              </button>
            ))}
          </div>
        </div>

        {/* Bouton */}
        <button
          {...tapProps(() => analyze())}
          disabled={loading || !food.trim()}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "none",
            background: loading || !food.trim() ? "#B5D4F4" : "#185FA5",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 500,
            cursor: loading || !food.trim() ? "not-allowed" : "pointer",
            marginBottom: "24px",
          }}
        >
          {loading ? "Analyse en cours..." : "Analyser"}
        </button>

        {error && (
          <div style={{ background: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "14px", padding: "14px 16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "13px", color: "#C62828", margin: 0 }}>{error}</p>
          </div>
        )}

        {result && <FodmapResult data={result} />}
      </div>
    </div>
  );
}