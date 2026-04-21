import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/:path*.mp4",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*.webm",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
      // Redirect non-www to www (fixes duplicate canonical issue)
      {
        source: "/:path*",
        has: [{ type: "host", value: "lkbjewellers.com" }],
        destination: "https://www.lkbjewellers.com/:path*",
        permanent: true,
      },
      // Redirect old brand query param URLs to new clean brand paths
      { source: "/shop", has: [{ type: "query", key: "brand", value: "rolex" }], destination: "/shop/rolex", permanent: true },
      { source: "/shop", has: [{ type: "query", key: "brand", value: "audemars-piguet" }], destination: "/shop/audemars-piguet", permanent: true },
      { source: "/shop", has: [{ type: "query", key: "brand", value: "cartier" }], destination: "/shop/cartier", permanent: true },
      { source: "/shop", has: [{ type: "query", key: "brand", value: "patek-philippe" }], destination: "/shop/patek-philippe", permanent: true },
      { source: "/shop", has: [{ type: "query", key: "brand", value: "richard-mille" }], destination: "/shop/richard-mille", permanent: true },
      // Redirect old /product/:id to /product/:brand/:id (handled client-side via 307 to avoid missing brand info)
      // Strip WordPress legacy query params (add_to_wishlist, _wpnonce)
      {
        source: "/product/:slug",
        has: [{ type: "query", key: "add_to_wishlist" }],
        destination: "/product/:slug",
        permanent: true,
      },
      {
        source: "/product/:slug",
        has: [{ type: "query", key: "_wpnonce" }],
        destination: "/product/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    minimumCacheTTL: 31536000, // 1 year — engagement ring images rarely change
    formats: ['image/avif', 'image/webp'], // serve smallest format supported by browser
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "videos.files.wordpress.com",
      },
      {
        protocol: "https",
        hostname: "lkbjewellers.com",
      },
      {
        protocol: "https",
        hostname: "www.lkbjewellers.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ttiwmcrfahbczzehmyds.supabase.co",
      },
      {
        protocol: "https",
        hostname: "media.cullenjewellery.com",
      },
    ],
  },
};

export default nextConfig;
