"use client";

import { useState } from "react";
import { DayPlan, MealPlan } from "@/types/fodmap";
import { tapProps } from "@/lib/tap";

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
    <div>
      {/* Header */}
      <div style={{ background: "#185FA5", padding: "52px 24px 24px" }}>
        <p style={{ fontSize: "13px", color: "#85B7EB", margin: "0 0 4px" }}>Générer</p>
        <h1 style={{ fontSize: "24px", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
          Mon plan de repas
        </h1>
      </div>

      <div style={{ padding: "24px 20px" }}>

        {/* Nombre de jours */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "12px", color: "#85B7EB", letterSpacing: "0.06em", marginBottom: "10px" }}>
            NOMBRE DE JOURS
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            {[1, 2, 3, 5, 7].map((d) => (
              <button
                key={d}
                {...tapProps(() => setDays(d))}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: "12px",
                  border: `1px solid ${days === d ? "#185FA5" : "#DAEAF8"}`,
                  background: days === d ? "#E6F1FB" : "#fff",
                  color: days === d ? "#185FA5" : "#85B7EB",
                  fontSize: "13px",
                  fontWeight: days === d ? 500 : 400,
                  cursor: "pointer",
                }}
              >
                {d}j
              </button>
            ))}
          </div>
        </div>

        {/* Préférences */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "12px", color: "#85B7EB", letterSpacing: "0.06em", marginBottom: "10px" }}>
            PRÉFÉRENCES
          </p>
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Végétarien, sans gluten..."
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

        {/* Bouton */}
        <button
          {...tapProps(() => generate())}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "none",
            background: loading ? "#B5D4F4" : "#185FA5",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "24px",
          }}
        >
          {loading ? "Génération en cours..." : "Générer mon plan"}
        </button>

        {/* Erreur */}
        {error && (
          <div style={{ background: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "14px", padding: "14px 16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "13px", color: "#C62828", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Résultat */}
        {mealPlan && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {mealPlan.days.map((day: DayPlan) => (
              <div key={day.day}>
                <p style={{ fontSize: "11px", color: "#85B7EB", letterSpacing: "0.1em", marginBottom: "10px" }}>
                  {day.day.toUpperCase()}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { label: "Petit-déjeuner", meal: day.breakfast },
                    { label: "Déjeuner", meal: day.lunch },
                    { label: "Dîner", meal: day.dinner },
                  ].map(({ label, meal }) => (
                    <div key={label} style={{
                      background: "#fff",
                      border: "1px solid #DAEAF8",
                      borderRadius: "16px",
                      padding: "16px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <p style={{ fontSize: "11px", color: "#85B7EB", letterSpacing: "0.06em", margin: 0 }}>
                          {label.toUpperCase()}
                        </p>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4CAF50" }} />
                      </div>
                      <p style={{ fontSize: "15px", fontWeight: 500, color: "#0C447C", margin: "0 0 6px" }}>
                        {meal.name}
                      </p>
                      <p style={{ fontSize: "12px", color: "#85B7EB", margin: "0 0 8px", lineHeight: 1.5 }}>
                        {meal.ingredients.join(" · ")}
                      </p>
                      <div style={{
                        background: "#E6F1FB",
                        borderRadius: "10px",
                        padding: "8px 12px",
                      }}>
                        <p style={{ fontSize: "12px", color: "#185FA5", margin: 0, lineHeight: 1.5 }}>
                          {meal.tips}
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