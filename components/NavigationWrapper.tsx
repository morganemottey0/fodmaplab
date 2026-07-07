"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";

export default function NavigationWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNav = pathname === "/login";

  return (
    <>
      <div style={{ paddingBottom: hideNav ? "0" : "80px" }}>
        {children}
      </div>
      {!hideNav && <Navigation />}
    </>
  );
}