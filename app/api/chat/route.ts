import { NextRequest } from "next/server";
import { anthropic } from "@/lib/anthropic";

export const maxDuration = 60;
export const dynamic = "force-dynamic";


const SYSTEM_PROMPT = `Tu es un diététicien bienveillant et expert en régime low-FODMAP.
Tu aides les personnes souffrant du syndrome de l'intestin irritable (SII) à mieux gérer leur alimentation.

Tes domaines d'expertise :
- Identifier les aliments high/low FODMAP et leurs portions sûres
- Proposer des substitutions d'ingrédients adaptées
- Expliquer les mécanismes digestifs de façon accessible
- Créer des recettes et menus low-FODMAP
- Analyser des listes d'ingrédients ou étiquettes alimentaires

Règles de conduite :
- Toujours rappeler que tu ne remplaces pas un avis médical professionnel
- Répondre en français, de façon claire et concise
- Être encourageant et positif face aux difficultés du régime
- Si une question dépasse ton domaine, le dire honnêtement`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages invalides." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    // Stream progressif vers le client
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(event.delta.text)
            );
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });

  } catch (error) {
    console.error("[chat] Erreur :", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}