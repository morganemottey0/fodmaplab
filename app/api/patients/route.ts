import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as { role?: string }).role;
  if (role !== "DIETITIAN" && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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

  return NextResponse.json(patients);
}
