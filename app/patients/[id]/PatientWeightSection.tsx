"use client";

import { useState } from "react";

type WeightEntry = {
  id: string;
  weight: number;
  date: string;
  note: string | null;
};

export default function PatientWeightSection({
  patientId,
  initialWeights,
}: {
  patientId: string;
  initialWeights: WeightEntry[];
}) {
  const [weights, setWeights] = useState<WeightEntry[]>(initialWeights);
  const [form, setForm] = useState({ weight: "", date: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const w = parseFloat(form.weight);
    if (isNaN(w) || w <= 0) { setError("Poids invalide"); return; }

    setLoading(true);
    try {
      const res = await fetch(`/api/patients/${patientId}/weight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight: w, note: form.note || null, date: form.date || undefined }),
      });
      if (!res.ok) { setError("Erreur lors de l'ajout"); return; }
      const entry: WeightEntry = await res.json();
      setWeights([entry, ...weights]);
      setForm({ weight: "", date: "", note: "" });
      setShowForm(false);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (weightId: string) => {
    const res = await fetch(`/api/patients/${patientId}/weight`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weightId }),
    });
    if (res.ok) {
      setWeights(weights.filter((w) => w.id !== weightId));
    }
  };

  const lastWeight = weights[0]?.weight;
  const prevWeight = weights[1]?.weight;
  const trend = lastWeight && prevWeight ? lastWeight - prevWeight : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="section-label" style={{ margin: 0 }}>Suivi du poids</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
          style={{ padding: "6px 14px", fontSize: "13px" }}
        >
          {showForm ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {/* Summary */}
      {lastWeight && (
        <div className="card mb-3">
          <div className="flex gap-4 items-center">
            <div>
              <p className="label m-0">Dernier poids</p>
              <p className="font-semibold m-0" style={{ fontSize: "22px", color: "var(--text-primary)" }}>
                {lastWeight} <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--text-muted)" }}>kg</span>
              </p>
            </div>
            {trend !== null && (
              <div style={{
                marginLeft: "auto",
                padding: "6px 12px",
                borderRadius: "12px",
                background: trend <= 0 ? "#E8F5E9" : "#FFEBEE",
              }}>
                <p className="m-0 font-semibold" style={{ fontSize: "14px", color: trend <= 0 ? "#2E7D32" : "#C62828" }}>
                  {trend > 0 ? "+" : ""}{trend.toFixed(1)} kg
                </p>
                <p className="m-0 text-xs" style={{ color: trend <= 0 ? "#4CAF50" : "#F44336" }}>
                  vs mesure précédente
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card mb-3" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="flex gap-2">
            <div style={{ flex: 1 }}>
              <label className="label">Poids (kg) *</label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="300"
                required
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                className="input"
                placeholder="70.5"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="label">Note (optionnel)</label>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className="input"
              placeholder="Après repas, matin à jeun..."
            />
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: "13px", margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      )}

      {/* History */}
      {weights.length === 0 ? (
        <div className="card text-center py-6">
          <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>
            Aucune mesure pour l'instant
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {weights.map((w, i) => (
            <div key={w.id} className="card" style={{ padding: "12px 14px" }}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold m-0" style={{ color: "var(--text-primary)", fontSize: "15px" }}>
                    {w.weight} kg
                  </p>
                  {w.note && (
                    <p className="text-xs m-0" style={{ color: "var(--text-muted)", marginTop: "2px" }}>{w.note}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {i < weights.length - 1 && (
                    <span style={{
                      fontSize: "12px",
                      color: w.weight <= weights[i + 1].weight ? "#4CAF50" : "#F44336",
                    }}>
                      {w.weight > weights[i + 1].weight ? "+" : ""}{(w.weight - weights[i + 1].weight).toFixed(1)}
                    </span>
                  )}
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {new Date(w.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <button
                    onClick={() => handleDelete(w.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      padding: "2px 4px",
                      fontSize: "16px",
                      lineHeight: 1,
                    }}
                    title="Supprimer"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
