"use client";

import { useState } from "react";
import { DayPlan, MealPlan } from "@/types/fodmap";

const DAYS_OPTIONS = [1, 2, 3, 5, 7];
const MEAL_LABELS = [
  { key: "breakfast", label: "Petit-déjeuner" },
  { key: "lunch", label: "Déjeuner" },
  { key: "dinner", label: "Dîner" },
] as const;

export default function MealPlanPage() {
  const [days, setDays] = useState(3);
  const [preferences, setPreferences] = useState("");
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setMealPlan(null);
    try {
      const res = await fetch("/api/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, preferences }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erreur."); return; }
      setMealPlan(data);
    } catch { setError("Impossible de générer le plan."); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-app min-h-screen">

      {/* Header */}
      <div className="gradient-primary page-header">
        <div className="decoration-circle-lg" />
        <div className="decoration-circle-sm" />
        <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Générer</p>
        <h1 className="text-white text-2xl font-semibold tracking-tight">Mon plan de repas</h1>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-4">

        {/* Jours */}
        <div>
          <label className="label">Nombre de jours</label>
          <div className="flex gap-2">
            {DAYS_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${
                  days === d
                    ? "bg-primary-light border-primary text-primary"
                    : "bg-surface border-primary text-muted"
                }`}
              >
                {d}j
              </button>
            ))}
          </div>
        </div>

        {/* Préférences */}
        <div>
          <label className="label">Préférences</label>
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Végétarien, sans gluten..."
            className="input"
          />
        </div>

        {/* Bouton */}
        <button
          onClick={generate}
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? "Génération en cours..." : "Générer mon plan"}
        </button>

        {/* Erreur */}
        {error && (
          <div className="rounded-2xl px-4 py-3" style={{ background: "#FFEBEE", border: "1px solid #FFCDD2" }}>
            <p className="text-sm m-0" style={{ color: "#C62828" }}>{error}</p>
          </div>
        )}

        {/* Résultat */}
        {mealPlan && (
          <div className="flex flex-col gap-5 pb-6">
            {mealPlan.days.map((day: DayPlan) => (
              <div key={day.day}>
                <p className="section-label">{day.day}</p>
                <div className="flex flex-col gap-2">
                  {MEAL_LABELS.map(({ key, label }) => (
                    <div key={key} className="card">
                      <div className="flex justify-between items-center mb-2">
                        <p className="label m-0">{label}</p>
                        <div className="w-2 h-2 rounded-full" style={{ background: "#4CAF50" }} />
                      </div>
                      <p className="text-sm font-semibold text-primary mb-1">{day[key].name}</p>
                      <p className="text-xs text-muted mb-2">{day[key].ingredients.join(" · ")}</p>
                      <div className="rounded-xl px-3 py-2 bg-primary-light">
                        <p className="text-xs m-0" style={{ color: "var(--primary)", lineHeight: 1.5 }}>
                          {day[key].tips}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}