import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { days = 3, preferences = "", restrictions = [] } = await req.json();

    const res = await fetch(`${process.env.FASTAPI_URL}/api/meal-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days, preferences, restrictions }),
    });

    if (!res.ok) {
      throw new Error(`FastAPI error: ${res.status}`);
    }

    const parsed = await res.json();

    await prisma.mealPlan.create({
      data: {
        days,
        prefs: preferences || null,
        plan: parsed,
      },
    });

    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[meal-plan] Erreur :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}