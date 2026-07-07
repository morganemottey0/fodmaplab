import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const res = await fetch(`${process.env.FASTAPI_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      throw new Error(`FastAPI error: ${res.status}`);
    }

    const data = await res.json();

    return new Response(data.response, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error) {
    console.error("[chat] Erreur :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}