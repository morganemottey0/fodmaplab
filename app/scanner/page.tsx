"use client";

import { useState } from "react";
import { FodmapAnalysis } from "@/types/fodmap";

const PORTIONS = [50, 100, 150, 200];

const LEVEL_CONFIG = {
  low:    { bg: "#E8F5E9", border: "#C8E6C9", dot: "#4CAF50", text: "#1B5E20", label: "Low FODMAP" },
  medium: { bg: "#FFF8E1", border: "#FFE0B2", dot: "#FF9800", text: "#E65100", label: "Modéré" },
  high:   { bg: "#FFEBEE", border: "#FFCDD2", dot: "#F44336", text: "#B71C1C", label: "High FODMAP" },
};

export default function ScannerPage() {
  const [food, setFood] = useState("");
  const [portion, setPortion] = useState(100);
  const [result, setResult] = useState<FodmapAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const toggleFavorite = async () => {
    if (!result?.id || favLoading) return;
    setFavLoading(true);
    try {
      const method = isFavorite ? "DELETE" : "POST";
      const res = await fetch("/api/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: result.id }),
      });
      if (res.ok) setIsFavorite(!isFavorite);
    } catch { /* ignore */ }
    finally { setFavLoading(false); }
  };

  const analyze = async () => {
    if (!food.trim()) return;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    setLoading(true);
    setError(null);
    setResult(null);
    setIsFavorite(false);
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
    <div className="bg-app min-h-screen">

      {/* Header */}
      <div className="gradient-primary page-header">
        <div className="decoration-circle-lg" />
        <div className="decoration-circle-sm" />
        <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Analyser</p>
        <h1 className="text-white text-2xl font-semibold tracking-tight">Un aliment</h1>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-4">

        {/* Aliment */}
        <div>
          <label className="label">Aliment</label>
          <input
            type="text"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="Ex : mangue, ail, brocoli..."
            className="input"
          />
        </div>

        {/* Portion */}
        <div>
          <label className="label">Portion — {portion}g</label>
          <div className="flex gap-2">
            {PORTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setPortion(p)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  portion === p
                    ? "bg-primary-light border-primary text-primary"
                    : "bg-surface border-primary text-muted"
                }`}
              >
                {p}g
              </button>
            ))}
          </div>
        </div>

        {/* Bouton */}
        <button
          onClick={analyze}
          disabled={loading || !food.trim()}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? "Analyse en cours..." : "Analyser"}
        </button>

        {/* Erreur */}
        {error && (
          <div className="rounded-2xl px-4 py-3" style={{ background: "#FFEBEE", border: "1px solid #FFCDD2" }}>
            <p className="text-sm m-0" style={{ color: "#C62828" }}>{error}</p>
          </div>
        )}

        {/* Résultat */}
        {result && (() => {
          const cfg = LEVEL_CONFIG[result.level];
          return (
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl p-4 flex justify-between items-center" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                <div>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: cfg.text }}>Niveau FODMAP</p>
                  <p className="text-2xl font-semibold m-0" style={{ color: cfg.text }}>{cfg.label}</p>
                </div>
                <div className="flex items-center gap-3">
                  {result.id && (
                    <button
                      onClick={toggleFavorite}
                      disabled={favLoading}
                      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                      style={{ background: "rgba(255,255,255,0.6)" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? cfg.dot : "none"} stroke={cfg.dot} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  )}
                  <div className="w-12 h-12 rounded-full" style={{ background: cfg.dot }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="card">
                  <p className="label">Portion analysée</p>
                  <p className="text-xl font-semibold text-primary m-0">{result.portion}g</p>
                </div>
                <div className="card">
                  <p className="label">Portion sûre</p>
                  <p className="text-xl font-semibold text-primary m-0">
                    {result.safe_portion === 0 ? "—" : `${result.safe_portion}g`}
                  </p>
                </div>
              </div>

              {result.fodmaps.length > 0 && (
                <div className="card">
                  <p className="label">FODMAP présents</p>
                  <div className="flex flex-wrap gap-2">
                    {result.fodmaps.map((f) => (
                      <span key={f} className="chip">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="card" style={{ borderLeft: "3px solid var(--primary)" }}>
                <p className="label">Conseil</p>
                <p className="text-sm text-primary m-0" style={{ lineHeight: 1.6 }}>{result.tips}</p>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}