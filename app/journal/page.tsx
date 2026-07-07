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
  const [feeling, setFeeling] = useState<number>(3);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const res = await fetch("/api/journal");
    if (res.ok) {
      const data = await res.json();
      setEntries(data);
    }
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ background: "#185FA5", padding: "52px 24px 24px" }}>
        <p style={{ fontSize: "13px", color: "#85B7EB", margin: "0 0 4px" }}>Mon</p>
        <h1 style={{ fontSize: "24px", fontWeight: 500, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.03em" }}>
          Journal alimentaire
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: "#fff", border: "none", borderRadius: "14px", padding: "12px 20px", fontSize: "14px", fontWeight: 500, color: "#185FA5", cursor: "pointer" }}
        >
          + Ajouter un repas
        </button>
      </div>

      <div style={{ padding: "20px" }}>

        {/* Formulaire */}
        {showForm && (
          <div style={{ background: "#fff", border: "1px solid #DAEAF8", borderRadius: "20px", padding: "20px", marginBottom: "20px" }}>

            {/* Type de repas */}
            <p style={{ fontSize: "11px", color: "#85B7EB", letterSpacing: "0.08em", margin: "0 0 10px" }}>REPAS</p>
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
              {MEALS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMeal(m)}
                  style={{ padding: "8px 14px", borderRadius: "20px", border: `1px solid ${meal === m ? "#185FA5" : "#DAEAF8"}`, background: meal === m ? "#E6F1FB" : "#fff", color: meal === m ? "#185FA5" : "#85B7EB", fontSize: "12px", fontWeight: meal === m ? 500 : 400, cursor: "pointer" }}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Aliments */}
            <p style={{ fontSize: "11px", color: "#85B7EB", letterSpacing: "0.08em", margin: "0 0 8px" }}>ALIMENTS CONSOMMÉS</p>
            <input
              type="text"
              value={foods}
              onChange={(e) => setFoods(e.target.value)}
              placeholder="riz, poulet, carotte... (séparés par des virgules)"
              style={{ width: "100%", background: "#F8FBFF", border: "1px solid #DAEAF8", borderRadius: "12px", padding: "12px 14px", fontSize: "14px", color: "#0C447C", outline: "none", marginBottom: "16px", boxSizing: "border-box" }}
            />

            {/* Ressenti */}
            <p style={{ fontSize: "11px", color: "#85B7EB", letterSpacing: "0.08em", margin: "0 0 10px" }}>RESSENTI DIGESTIF</p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", justifyContent: "space-between" }}>
              {FEELINGS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFeeling(f.value)}
                  style={{ flex: 1, padding: "10px 4px", borderRadius: "12px", border: `1px solid ${feeling === f.value ? "#185FA5" : "#DAEAF8"}`, background: feeling === f.value ? "#E6F1FB" : "#fff", cursor: "pointer", fontSize: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}
                >
                  {f.label}
                  <span style={{ fontSize: "9px", color: feeling === f.value ? "#185FA5" : "#85B7EB" }}>{f.desc}</span>
                </button>
              ))}
            </div>

            {/* Notes */}
            <p style={{ fontSize: "11px", color: "#85B7EB", letterSpacing: "0.08em", margin: "0 0 8px" }}>NOTES</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Symptômes, observations..."
              rows={2}
              style={{ width: "100%", background: "#F8FBFF", border: "1px solid #DAEAF8", borderRadius: "12px", padding: "12px 14px", fontSize: "14px", color: "#0C447C", outline: "none", resize: "none", fontFamily: "inherit", marginBottom: "16px", boxSizing: "border-box" }}
            />

            <button
              onClick={save}
              disabled={loading || !foods.trim()}
              style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "none", background: loading || !foods.trim() ? "#B5D4F4" : "#185FA5", color: "#fff", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
            >
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        )}

        {/* Liste des entrées */}
        {entries.length === 0 && !showForm && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontSize: "13px", color: "#85B7EB" }}>Aucune entrée pour le moment.</p>
            <p style={{ fontSize: "12px", color: "#B5D4F4" }}>Commencez par ajouter un repas.</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {entries.map((entry) => (
            <div key={entry.id} style={{ background: "#fff", border: "1px solid #DAEAF8", borderRadius: "16px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "#85B7EB", letterSpacing: "0.06em", margin: "0 0 2px" }}>
                    {entry.meal.toUpperCase()}
                  </p>
                  <p style={{ fontSize: "12px", color: "#B5D4F4", margin: 0 }}>
                    {new Date(entry.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                  </p>
                </div>
                {entry.feeling && (
                  <span style={{ fontSize: "24px" }}>
                    {FEELINGS.find((f) => f.value === entry.feeling)?.label}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: entry.notes ? "10px" : "0" }}>
                {entry.foods.map((food, i) => (
                  <span key={i} style={{ background: "#E6F1FB", color: "#185FA5", border: "1px solid #B5D4F4", fontSize: "11px", padding: "4px 10px", borderRadius: "20px" }}>
                    {food}
                  </span>
                ))}
              </div>
              {entry.notes && (
                <p style={{ fontSize: "12px", color: "#85B7EB", margin: 0, fontStyle: "italic" }}>{entry.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}