import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: { analysis: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("[favorites] GET error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { analysisId } = await req.json();

  if (!analysisId) {
    return NextResponse.json({ error: "analysisId requis." }, { status: 400 });
  }

  try {
    await prisma.favorite.deleteMany({
      where: {
        userId: session.user.id,
        analysisId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[favorites] DELETE error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { analysisId } = await req.json();

  if (!analysisId) {
    return NextResponse.json({ error: "analysisId requis." }, { status: 400 });
  }

  try {
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        analysisId,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ce favori existe déjà." },
        { status: 409 }
      );
    }
    console.error("[favorites] POST error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
