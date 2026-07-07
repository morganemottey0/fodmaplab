import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    const entries = await prisma.journal.findMany({
      where: session?.user?.id ? { userId: session.user.id } : {},
      orderBy: { date: "desc" },
      take: 50,
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("[journal] GET error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const { meal, foods, notes, feeling } = await req.json();

    const entry = await prisma.journal.create({
      data: {
        meal,
        foods,
        notes: notes || null,
        feeling: feeling || null,
        userId: session?.user?.id || null,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("[journal] POST error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}