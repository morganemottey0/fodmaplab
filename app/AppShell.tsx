"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/SideBar";
import NavigationWrapper from "@/components/NavigationWrapper";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <NavigationWrapper>
          {children}
        </NavigationWrapper>
      </div>
    </div>
  );
}