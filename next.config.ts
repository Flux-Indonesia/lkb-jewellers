import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect non-www to www (fixes duplicate canonical issue)
      {
        source: "/:path*",
        has: [{ type: "host", value: "lkbjewellers.com" }],
        destination: "https://www.lkbjewellers.com/:path*",
        permanent: true,
      },
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
