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
import { LocalBusinessJsonLd } from "@/components/json-ld";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lkbjewellers.com"),
  title: {
    default: "LKB Jewellers - Luxury Jewelry & Watches | Hatton Garden London",
    template: "%s | LKB Jewellers",
  },
  description:
    "Discover luxury watches, bespoke jewelry & diamond pieces at LKB Jewellers, Hatton Garden London's premier specialists. Exclusive timepieces & custom jewelry. Rolex, Patek Philippe, Richard Mille dealer.",
  keywords:
    "LKB Jewellers, Local Kettle Brothers UK, Hatton Garden jewellers, luxury watches London, bespoke jewelry London",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.lkbjewellers.com",
    siteName: "LKB Jewellers",
    title: "LKB Jewellers - Luxury Jewelry & Watches | Hatton Garden London",
    description:
      "Discover luxury watches, bespoke jewelry & diamond pieces at LKB Jewellers, Hatton Garden London's premier specialists.",
    images: [
      {
        url: "/white-logo.png",
        width: 200,
        height: 200,
        alt: "LKB Jewellers Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LKB Jewellers - Luxury Jewelry & Watches | Hatton Garden London",
    description:
      "Discover luxury watches, bespoke jewelry & diamond pieces at LKB Jewellers, Hatton Garden London's premier specialists.",
    images: ["/white-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="nAVWrhRlM6tORH0OR3pC3AAvtjo9EL85tRRLC6UFQfg" />
        <LocalBusinessJsonLd />
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RLDND22WJM"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RLDND22WJM');`}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','2494810354017270');
          fbq('track','PageView');`}
        </Script>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <noscript><img height="1" width="1" alt="" style={{display:"none"}} src="https://www.facebook.com/tr?id=2494810354017270&ev=PageView&noscript=1" /></noscript>

      </body>
    </html>
  );
}
