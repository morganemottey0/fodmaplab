"use client";

import { useState, useEffect } from "react";

interface JournalEntry {
  id: string;
  date: string;
  meal: string;
  foods: string[];
  notes: string | null;
  feeling: number | null;
}

const MEALS = ["Petit-déjeuner", "Déjeuner", "Dîner", "Collation"];
const FEELINGS = [
  { value: 1, label: "😣", desc: "Très mal" },
  { value: 2, label: "😕", desc: "Mal" },
  { value: 3, label: "😐", desc: "Neutre" },
  { value: 4, label: "🙂", desc: "Bien" },
  { value: 5, label: "😊", desc: "Très bien" },
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [meal, setMeal] = useState("Déjeuner");
  const [foods, setFoods] = useState("");
  const [notes, setNotes] = useState("");
  const [feeling, setFeeling] = useState(3);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchEntries(); }, []);

  const fetchEntries = async () => {
    const res = await fetch("/api/journal");
    if (res.ok) setEntries(await res.json());
  };

  const save = async () => {
    if (!foods.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal,
          foods: foods.split(",").map((f) => f.trim()).filter(Boolean),
          notes: notes || null,
          feeling,
        }),
      });
      setFoods("");
      setNotes("");
      setFeeling(3);
      setShowForm(false);
      fetchEntries();
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-app min-h-screen">

      {/* Header */}
      <div className="gradient-primary page-header">
        <div className="decoration-circle-lg" />
        <div className="decoration-circle-sm" />
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Mon</p>
            <h1 className="text-white text-2xl font-semibold tracking-tight m-0">
              Journal alimentaire
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-ghost"
          >
            + Ajouter
          </button>
        </div>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-4">

        {/* Formulaire */}
        {showForm && (
          <div className="card flex flex-col gap-4">

            <div>
              <label className="label">Type de repas</label>
              <div className="flex flex-wrap gap-2">
                {MEALS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMeal(m)}
                    className={`px-3 py-2 rounded-full text-xs font-medium border ${
                      meal === m
                        ? "bg-primary-light border-primary text-primary"
                        : "bg-surface border-primary text-muted"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Aliments consommés</label>
              <input
                type="text"
                value={foods}
                onChange={(e) => setFoods(e.target.value)}
                placeholder="riz, poulet, carotte... (séparés par virgules)"
                className="input"
              />
            </div>

            <div>
              <label className="label">Ressenti digestif</label>
              <div className="flex gap-2 justify-between">
                {FEELINGS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFeeling(f.value)}
                    className={`flex-1 py-2 rounded-xl border flex flex-col items-center gap-1 ${
                      feeling === f.value
                        ? "bg-primary-light border-primary"
                        : "bg-surface border-primary"
                    }`}
                  >
                    <span className="text-xl">{f.label}</span>
                    <span className={`text-xs ${feeling === f.value ? "text-primary" : "text-muted"}`}>
                      {f.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Symptômes, observations..."
                rows={2}
                className="input resize-none"
              />
            </div>

            <button
              onClick={save}
              disabled={loading || !foods.trim()}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        )}

        {/* Liste */}
        {entries.length === 0 && !showForm && (
          <div className="text-center py-10">
            <p className="text-sm text-muted">Aucune entrée pour le moment.</p>
            <p className="text-xs text-muted mt-1">Commencez par ajouter un repas.</p>
          </div>
        )}

        <div className="flex flex-col gap-3 pb-6">
          {entries.map((entry) => (
            <div key={entry.id} className="card">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="label m-0">{entry.meal}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(entry.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                  </p>
                </div>
                {entry.feeling && (
                  <span className="text-2xl">
                    {FEELINGS.find((f) => f.value === entry.feeling)?.label}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {entry.foods.map((food, i) => (
                  <span key={i} className="chip">{food}</span>
                ))}
              </div>
              {entry.notes && (
                <p className="text-xs text-muted italic m-0">{entry.notes}</p>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}