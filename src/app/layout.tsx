import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AppShell from "@/components/app-shell";
import TopBanner from "@/components/top-banner";
import FloatingButtons from "@/components/floating-buttons";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-montserrat",
});


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
    <html lang="en" className={`${montserrat.variable}`}>
      <body
        className={`antialiased ${montserrat.className}`}
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
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
