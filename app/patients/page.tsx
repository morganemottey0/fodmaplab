import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/auth";

export default async function PatientsPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user) redirect("/login");
  if (role !== "DIETITIAN" && role !== "ADMIN") redirect("/");

  const patients = await prisma.user.findMany({
    where: { role: { in: ["USER", "PREMIUM"] } },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      weights: {
        orderBy: { date: "desc" },
        take: 2,
        select: { weight: true, date: true },
      },
      _count: {
        select: { journal: true, analyses: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-app min-h-screen">
      <div className="gradient-primary page-header" style={{ position: "relative" }}>
        <div className="decoration-circle-lg" />
        <div className="decoration-circle-sm" />
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              {role === "ADMIN" ? "Administrateur" : "Diététicien"} — {session.user.name?.split(" ")[0]}
            </p>
            <h1 className="text-white text-2xl font-semibold tracking-tight">
              Mes patients
            </h1>
          </div>
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <button type="submit" className="btn-ghost">Déconnexion</button>
          </form>
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>
          {patients.length} patient{patients.length !== 1 ? "s" : ""} suivi{patients.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="px-5 pt-6 pb-8 flex flex-col gap-3">
        {patients.length === 0 && (
          <div className="card text-center py-10">
            <p className="text-4xl mb-3">👤</p>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Aucun patient pour l'instant</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Les patients apparaissent ici dès qu'ils créent un compte.
            </p>
          </div>
        )}

        {patients.map((p) => {
          const lastWeight = p.weights[0]?.weight;
          const prevWeight = p.weights[1]?.weight;
          const trend = lastWeight && prevWeight ? lastWeight - prevWeight : null;

          return (
            <Link
              key={p.id}
              href={`/patients/${p.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="card" style={{ cursor: "pointer", transition: "box-shadow 0.15s" }}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: "var(--primary-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "var(--primary)",
                        flexShrink: 0,
                      }}
                    >
                      {(p.name ?? p.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold m-0" style={{ color: "var(--text-primary)", fontSize: "15px" }}>
                        {p.name ?? "—"}
                      </p>
                      <p className="m-0" style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                        {p.email}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    {lastWeight ? (
                      <>
                        <p className="m-0 font-semibold" style={{ color: "var(--text-primary)", fontSize: "15px" }}>
                          {lastWeight} kg
                        </p>
                        {trend !== null && (
                          <p className="m-0 text-xs" style={{ color: trend <= 0 ? "#4CAF50" : "#F44336" }}>
                            {trend > 0 ? "+" : ""}{trend.toFixed(1)} kg
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="m-0 text-xs" style={{ color: "var(--text-muted)" }}>Pas de poids</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-3">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    📓 {p._count.journal} entrée{p._count.journal !== 1 ? "s" : ""} journal
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    🔍 {p._count.analyses} analyse{p._count.analyses !== 1 ? "s" : ""}
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      color: p.role === "PREMIUM" ? "var(--primary)" : "var(--text-muted)",
                      fontWeight: p.role === "PREMIUM" ? 600 : 400,
                    }}
                  >
                    {p.role === "PREMIUM" ? "Premium" : "Standard"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
