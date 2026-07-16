"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Redirects DIETITIAN/ADMIN to /patients. Returns true while checking. */
export function useClientGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (role === "DIETITIAN" || role === "ADMIN") {
      router.replace("/patients");
    }
  }, [session, status, router]);

  if (status === "loading") return true;
  const role = (session?.user as { role?: string } | undefined)?.role;
  return role === "DIETITIAN" || role === "ADMIN";
}
