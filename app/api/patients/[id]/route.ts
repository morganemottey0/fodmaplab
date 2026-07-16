import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as { role?: string }).role;
  if (role !== "DIETITIAN" && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
        take: 10,
        select: { id: true, date: true, meal: true, foods: true, notes: true, feeling: true },
      },
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, food: true, level: true, createdAt: true },
      },
    },
  });

  if (!patient) return NextResponse.json({ error: "Patient introuvable" }, { status: 404 });

  return NextResponse.json(patient);
}
