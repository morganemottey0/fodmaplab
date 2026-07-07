import { NextRequest } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { prisma } from "@/lib/prisma";

const SYSTEM_PROMPT = `Tu es un diététicien expert en régime low-FODMAP.
Tu génères des plans de repas stricts low-FODMAP, équilibrés et savoureux.
Tu réponds UNIQUEMENT en JSON valide, sans texte avant ni après, sans balises markdown.
Structure exacte attendue :
{
  "days": [
    {
      "day": "Lundi",
      "breakfast": {
        "name": "nom du repas",
        "ingredients": ["ingrédient 1", "ingrédient 2"],
        "tips": "conseil de préparation"
      },
      "lunch": { "name": "...", "ingredients": [...], "tips": "..." },
      "dinner": { "name": "...", "ingredients": [...], "tips": "..." }
    }
  ]
}
Règles :
- Tous les aliments doivent être low-FODMAP selon Monash University
- Repas variés, pas de répétition sur la semaine
- Ingrédients simples et accessibles en France
- Tips courts et actionnables`;

export async function POST(req: NextRequest) {
  try {
    const { days = 3, preferences = "", restrictions = [] } = await req.json();

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Génère un plan de repas low-FODMAP pour ${days} jours.
          Préférences : ${preferences || "aucune"}.
          Restrictions supplémentaires : ${restrictions.length > 0 ? restrictions.join(", ") : "aucune"}.`,
        },
      ],
    });

    const finalMessage = await stream.finalMessage();
    const rawText = finalMessage.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    const clean = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(clean);

    // Sauvegarder en base
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