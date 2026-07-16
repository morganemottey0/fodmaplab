import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { anthropic } from "@/lib/anthropic";
import { findFoodLocally } from "@/lib/fodmap-data";
import { FodmapAnalysis } from "@/types/fodmap";
import { prisma } from "@/lib/prisma";

const FodmapResponseSchema = z.object({
  food: z.string(),
  portion: z.number(),
  level: z.enum(["low", "medium", "high"]),
  fodmaps: z.array(
    z.enum(["fructose", "lactose", "fructans", "GOS", "polyols"])
  ),
  safe_portion: z.number(),
  tips: z.string(),
});

const SYSTEM_PROMPT = `Tu es un expert en nutrition spécialisé dans le régime low-FODMAP.
Ton rôle est d'analyser des aliments et de fournir une évaluation précise de leur teneur en FODMAP.
Tu réponds UNIQUEMENT en JSON valide, sans texte avant ni après, sans balises markdown.
Le JSON doit respecter exactement cette structure :
{
  "food": "nom de l'aliment",
  "portion": nombre en grammes analysé,
  "level": "low" | "medium" | "high",
  "fodmaps": ["fructose" | "lactose" | "fructans" | "GOS" | "polyols"],
  "safe_portion": nombre en grammes (0 si à éviter complètement),
  "tips": "conseil pratique court pour cuisiner ou substituer cet aliment"
}
Règles :
- "level" est basé sur les recommandations de Monash University
- "fodmaps" liste uniquement les FODMAP effectivement présents
- "safe_portion" est la portion maximale tolérée par la plupart des personnes sensibles
- "tips" est en français, concis et actionnable`;

export async function POST(req: NextRequest) {
  try {
    const { food, portion = 100 } = await req.json();

    if (!food || typeof food !== "string") {
      return NextResponse.json(
        { error: "Le champ 'food' est requis." },
        { status: 400 }
      );
    }

    // Étape 1 — Chercher dans la base locale
    const localResult = findFoodLocally(food);
    if (localResult) {
      // Sauvegarder en base
      const saved = await prisma.analysis.create({
        data: {
          food,
          portion,
          level: localResult.level,
          fodmaps: localResult.fodmaps,
          safePortion: localResult.safe_portion,
          tips: localResult.tips,
          source: "local",
        },
      });

      return NextResponse.json({
        ...localResult,
        id: saved.id,
        food,
        portion,
        source: "local",
      });
    }

    // Étape 2 — Fallback Claude
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyse cet aliment : "${food}" pour une portion de ${portion}g.`,
        },
      ],
    });

    const rawText = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    const cleanText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanText);
    const validated = FodmapResponseSchema.parse(parsed);

    // Sauvegarder en base
    const saved = await prisma.analysis.create({
      data: {
        food: validated.food,
        portion: validated.portion,
        level: validated.level,
        fodmaps: validated.fodmaps,
        safePortion: validated.safe_portion,
        tips: validated.tips,
        source: "claude",
      },
    });

    return NextResponse.json({
      ...validated,
      id: saved.id,
      source: "claude",
    } satisfies FodmapAnalysis & { id: string; source: string });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Réponse Claude invalide.", details: error.issues },
        { status: 502 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Impossible de parser la réponse Claude." },
        { status: 502 }
      );
    }

    console.error("[analyze] Erreur inattendue :", error);
    return NextResponse.json(
      { error: "Erreur serveur inattendue." },
      { status: 500 }
    );
  }
}