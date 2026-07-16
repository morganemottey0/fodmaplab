import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import PatientWeightSection from "./PatientWeightSection";

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user) redirect("/login");
  if (role !== "DIETITIAN" && role !== "ADMIN") redirect("/");

  const { id } = await params;

  const patient = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      weights: {
        orderBy: { date: "desc" },
        select: { id: true, weight: true, date: true, note: true },
      },
      journal: {
        orderBy: { date: "desc" },
        take: 8,
        select: { id: true, date: true, meal: true, foods: true, notes: true, feeling: true },
      },
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 6,
        select: { id: true, food: true, level: true, createdAt: true },
      },
    },
  });

  if (!patient) redirect("/patients");

  const FEELING_LABELS: Record<number, string> = {
    1: "Très mal", 2: "Mal", 3: "Moyen", 4: "Bien", 5: "Très bien",
  };
  const LEVEL_COLORS: Record<string, string> = {
    low: "#4CAF50", moderate: "#FF9800", high: "#F44336",
  };

  return (
    <div className="bg-app min-h-screen">
      <div className="gradient-primary page-header" style={{ position: "relative" }}>
        <div className="decoration-circle-lg" />
        <div className="decoration-circle-sm" />
        <div className="flex items-center gap-3 mb-3">
          <Link
            href="/patients"
            style={{
              color: "rgba(255,255,255,0.8)",
              textDecoration: "none",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ← Patients
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {(patient.name ?? patient.email)[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-white text-xl font-semibold m-0">{patient.name ?? "Patient"}</h1>
            <p className="text-sm m-0" style={{ color: "rgba(255,255,255,0.65)" }}>{patient.email}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 pb-8 flex flex-col gap-6">

        {/* Weight section — interactive client component */}
        <PatientWeightSection
          patientId={patient.id}
          initialWeights={patient.weights.map((w) => ({
            ...w,
            date: w.date.toISOString(),
          }))}
        />

        {/* Journal */}
        <div>
          <p className="section-label">Journal alimentaire</p>
          {patient.journal.length === 0 ? (
            <div className="card text-center py-6">
              <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>Aucune entrée journal</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {patient.journal.map((entry) => (
                <div key={entry.id} className="card">
                  <div className="flex justify-between items-center mb-1">
                    <p className="label m-0">{entry.meal}</p>
                    <div className="flex items-center gap-2">
                      {entry.feeling && (
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {FEELING_LABELS[entry.feeling] ?? ""}
                        </span>
                      )}
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {new Date(entry.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm m-0" style={{ color: "var(--text-primary)" }}>
                    {entry.foods.join(" · ")}
                  </p>
                  {entry.notes && (
                    <p className="text-xs mt-1 m-0" style={{ color: "var(--text-muted)" }}>{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent analyses */}
        <div>
          <p className="section-label">Analyses récentes</p>
          {patient.analyses.length === 0 ? (
            <div className="card text-center py-6">
              <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>Aucune analyse</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {patient.analyses.map((a) => (
                <div key={a.id} className="card">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold m-0" style={{ color: "var(--text-primary)", fontSize: "14px" }}>
                      {a.food}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: LEVEL_COLORS[a.level] ?? "var(--text-muted)",
                        }}
                      />
                      <span className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{a.level}</span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {new Date(a.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
