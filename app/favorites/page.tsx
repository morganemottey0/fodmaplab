"use client";

import { useState, useEffect } from "react";
import { FodmapLevel } from "@/types/fodmap";

interface FavoriteEntry {
  id: string;
  createdAt: string;
  analysis: {
    id: string;
    food: string;
    portion: number;
    level: FodmapLevel;
    fodmaps: string[];
    safePortion: number;
    tips: string;
    createdAt: string;
  };
}

const LEVEL_CONFIG = {
  low:    { bg: "#E8F5E9", border: "#C8E6C9", dot: "#4CAF50", text: "#1B5E20", label: "Low FODMAP" },
  medium: { bg: "#FFF8E1", border: "#FFE0B2", dot: "#FF9800", text: "#E65100", label: "Modéré" },
  high:   { bg: "#FFEBEE", border: "#FFCDD2", dot: "#F44336", text: "#B71C1C", label: "High FODMAP" },
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => { fetchFavorites(); }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) setFavorites(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const remove = async (analysisId: string) => {
    setRemoving(analysisId);
    try {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId }),
      });
      if (res.ok) setFavorites((prev) => prev.filter((f) => f.analysis.id !== analysisId));
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="bg-app min-h-screen">

      {/* Header */}
      <div className="gradient-primary page-header">
        <div className="decoration-circle-lg" />
        <div className="decoration-circle-sm" />
        <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Mes</p>
        <h1 className="text-white text-2xl font-semibold tracking-tight m-0">Favoris</h1>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-3 pb-6">

        {loading && (
          <div className="text-center py-10">
            <p className="text-sm text-muted">Chargement...</p>
          </div>
        )}

        {!loading && favorites.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-muted">Aucun favori sauvegardé.</p>
            <p className="text-xs text-muted mt-1">Analysez un aliment et ajoutez-le aux favoris.</p>
          </div>
        )}

        {favorites.map((fav) => {
          const cfg = LEVEL_CONFIG[fav.analysis.level];
          return (
            <div key={fav.id} className="card flex flex-col gap-3">

              {/* Top row: food name + date + remove */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-base font-semibold text-primary m-0 capitalize">{fav.analysis.food}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(fav.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <button
                  onClick={() => remove(fav.analysis.id)}
                  disabled={removing === fav.analysis.id}
                  aria-label="Retirer des favoris"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                  style={{ background: "var(--surface)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFB300" stroke="#FFB300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              </div>

              {/* Level badge */}
              <div className="rounded-xl px-3 py-2 flex items-center gap-2" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
                <p className="text-sm font-medium m-0" style={{ color: cfg.text }}>{cfg.label}</p>
                <p className="text-xs m-0 ml-auto" style={{ color: cfg.text }}>{fav.analysis.portion}g analysés · {fav.analysis.safePortion > 0 ? `${fav.analysis.safePortion}g sûrs` : "éviter"}</p>
              </div>

              {/* FODMAPs chips */}
              {fav.analysis.fodmaps.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {fav.analysis.fodmaps.map((f) => (
                    <span key={f} className="chip">{f}</span>
                  ))}
                </div>
              )}

              {/* Tips */}
              <p className="text-xs text-muted m-0" style={{ lineHeight: 1.6 }}>{fav.analysis.tips}</p>

            </div>
          );
        })}

      </div>
    </div>
  );
}
