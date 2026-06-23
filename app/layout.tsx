import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PosCartProvider } from "@/lib/cart/PosCartContext";
import { VendedorProvider } from "@/lib/vendedor/VendedorContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tablet Bazzar - Sistema POS",
  description: "Sistema punto de venta para vendedores de tiendas Bazzar",
  applicationName: "Tablet Bazzar",
  authors: [{ name: "RIMEC Holding" }],
  generator: "Next.js",
  keywords: ["POS", "Tablet", "Bazzar", "Ventas", "Inventario"],

  // PWA
  manifest: "/manifest.webmanifest",

  // Viewport (Apple + Android standards)
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover", // iPhone X+ notch
  },

  // Theme colors
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#002B4E" },
    { media: "(prefers-color-scheme: dark)", color: "#002B4E" },
  ],

  // Apple specific
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tablet Bazzar",
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "es_PY",
    title: "Tablet Bazzar",
    description: "Sistema POS para vendedores",
    siteName: "Tablet Bazzar",
  },

  // Mobile web app
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        {/* Apple splash screens */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Prevenir zoom en inputs */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="min-h-full flex flex-col touch-manipulation overscroll-none">
        <PosCartProvider>
          <VendedorProvider>{children}</VendedorProvider>
        </PosCartProvider>
      </body>
    </html>
  );
}
