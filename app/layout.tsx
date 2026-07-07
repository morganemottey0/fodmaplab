import type { Metadata, Viewport } from "next";
import NavigationWrapper from "@/components/NavigationWrapper";
import SessionProvider from "@/components/SessionProvider";
import SideBar from "@/components/SideBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "FODMAP AI",
  description: "Votre guide intelligent low-FODMAP",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FODMAP AI",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6C63D4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        <SessionProvider>
          <div className="app-shell">
            {/* Sidebar desktop uniquement */}
            <SideBar />
            {/* Contenu principal */}
            <div className="app-content">
              <NavigationWrapper>
                {children}
              </NavigationWrapper>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}