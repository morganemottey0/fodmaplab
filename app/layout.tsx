import type { Metadata, Viewport } from "next";
import NavigationWrapper from "@/components/NavigationWrapper";
import SessionProvider from "@/components/SessionProvider";
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
  themeColor: "#185FA5",
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
      <body style={{
        maxWidth: "430px",
        margin: "0 auto",
        minHeight: "100dvh",
        background: "#F8FBFF",
      }}>
        <SessionProvider>
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}