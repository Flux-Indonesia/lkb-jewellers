import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AppShell from "@/components/app-shell";
import TopBanner from "@/components/top-banner";
import FloatingButtons from "@/components/floating-buttons";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

export const metadata: Metadata = {
  title:
    "LKB Jewellers - Luxury Jewelry & Watches | Hatton Garden London | Premium Timepieces",
  description:
    "Discover luxury watches, bespoke jewelry & diamond pieces at LKB Jewellers, Hatton Garden London's premier specialists. Exclusive timepieces & custom jewelry. Rolex, Patek Philippe, Richard Mille dealer.",
  keywords:
    "LKB Jewellers, Local Kettle Brothers UK, Hatton Garden jewellers, luxury watches London, bespoke jewelry London",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
          @font-face {
            font-family: 'Montserrat';
            src: url('/fonts/montserrat-300.woff2') format('woff2');
            font-weight: 300;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Montserrat';
            src: url('/fonts/montserrat-400.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Montserrat';
            src: url('/fonts/montserrat-500.woff2') format('woff2');
            font-weight: 500;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Montserrat';
            src: url('/fonts/montserrat-600.woff2') format('woff2');
            font-weight: 600;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Montserrat';
            src: url('/fonts/montserrat-700.woff2') format('woff2');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Montserrat';
            src: url('/fonts/montserrat-800.woff2') format('woff2');
            font-weight: 800;
            font-style: normal;
            font-display: swap;
          }
          :root {
            --font-montserrat: 'Montserrat', sans-serif;
          }
        `}</style>
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            <AppShell>
              <TopBanner />
              <Navbar />
              <main className="pt-24">{children}</main>
              <Footer />
            </AppShell>
            <FloatingButtons />
            <Toaster />
          </CartProvider>
        </AuthProvider>
        <Script
          src="https://widgets.leadconnectorhq.com/loader.js"
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="69a85d5705ceca41dc19bf48"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
