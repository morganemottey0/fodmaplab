import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function checkDietitian() {
  const session = await auth();
  if (!session?.user) return null;
  const role = (session.user as { role?: string }).role;
  if (role !== "DIETITIAN" && role !== "ADMIN") return null;
  return session;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await checkDietitian();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const weights = await prisma.patientWeight.findMany({
    where: { userId: id },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(weights);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await checkDietitian();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { weight, note, date } = await req.json();

  if (!weight || typeof weight !== "number") {
    return NextResponse.json({ error: "Poids invalide" }, { status: 400 });
  }

  const entry = await prisma.patientWeight.create({
    data: {
      userId: id,
      weight,
      note: note ?? null,
      date: date ? new Date(date) : new Date(),
    },
  });

  return NextResponse.json(entry, { status: 201 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await checkDietitian();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { weightId } = await req.json();
  if (!weightId) return NextResponse.json({ error: "weightId requis" }, { status: 400 });

  await prisma.patientWeight.delete({ where: { id: weightId } });
  return NextResponse.json({ ok: true });
}
