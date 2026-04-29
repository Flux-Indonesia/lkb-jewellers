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
      // Strip add_to_wishlist from any page
      {
        source: "/:path*",
        has: [{ type: "query", key: "add_to_wishlist" }],
        destination: "/:path*",
        permanent: true,
      },

      // WordPress product URLs (trailing slash) → shop
      { source: "/product/:slug/", destination: "/shop", permanent: true },

      // WordPress product-category URLs → shop
      { source: "/product-category/:path*", destination: "/shop", permanent: true },

      // WordPress blog/pagination → blog
      { source: "/blog/page/:page", destination: "/blog", permanent: true },

      // WordPress author pages → home
      { source: "/author/:slug", destination: "/", permanent: true },

      // WordPress category/tag pages → home
      { source: "/category/:slug", destination: "/", permanent: true },
      { source: "/tag/:slug", destination: "/", permanent: true },

      // WordPress about/delivery/contact pages → new equivalents
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/about-us/", destination: "/about", permanent: true },
      { source: "/delivery-information", destination: "/", permanent: true },
      { source: "/delivery-information/", destination: "/", permanent: true },
      { source: "/lkb-contact-form", destination: "/contact", permanent: true },
      { source: "/lkb-contact-form/", destination: "/contact", permanent: true },
      { source: "/clients", destination: "/about", permanent: true },
      { source: "/clients/", destination: "/about", permanent: true },

      // WordPress back-office/admin → home
      { source: "/back-office/:path*", destination: "/", permanent: true },

      // WordPress old blog posts → blog
      { source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug", destination: "/blog", permanent: true },

      // WordPress misc pages → home
      { source: "/sample-page", destination: "/", permanent: true },
      { source: "/sample-page/", destination: "/", permanent: true },
      { source: "/hello-world", destination: "/", permanent: true },
      { source: "/hello-world/", destination: "/", permanent: true },
      { source: "/new-logo", destination: "/", permanent: true },
      { source: "/new-logo/", destination: "/", permanent: true },
      { source: "/compressed", destination: "/", permanent: true },
      { source: "/compressed/", destination: "/", permanent: true },

      // WordPress old single post slugs (blog articles) → blog
      { source: "/introducing-our-first-lady-of-lkb-chantae-alisha", destination: "/blog", permanent: true },
      { source: "/introducing-our-first-lady-of-lkb-chantae-alisha/", destination: "/blog", permanent: true },
      { source: "/meet-britains-top-celebrity-jeweller-and-watch-dealer-local-kettle-brothers-uk", destination: "/blog", permanent: true },
      { source: "/meet-britains-top-celebrity-jeweller-and-watch-dealer-local-kettle-brothers-uk/", destination: "/blog", permanent: true },
      { source: "/burning-new-beginnings-celebrating-the-local-kettle-brothers-coffee-table-book", destination: "/blog", permanent: true },
      { source: "/burning-new-beginnings-celebrating-the-local-kettle-brothers-coffee-table-book/", destination: "/blog", permanent: true },
      { source: "/local-kettle-brothers-uk-jewellers-at-the-2023-ealing-half-marathon", destination: "/blog", permanent: true },
      { source: "/local-kettle-brothers-uk-jewellers-at-the-2023-ealing-half-marathon/", destination: "/blog", permanent: true },
      { source: "/local-kettle-brothers-foundation-x-brockley-football-club", destination: "/blog", permanent: true },
      { source: "/local-kettle-brothers-foundation-x-brockley-football-club/", destination: "/blog", permanent: true },
      { source: "/local-kettle-brothers-featured-on-grms-documentary-of-the-year-diamonds-from-the-dirt", destination: "/blog", permanent: true },
      { source: "/local-kettle-brothers-featured-on-grms-documentary-of-the-year-diamonds-from-the-dirt/", destination: "/blog", permanent: true },
      { source: "/sutmlight-international-mens-day-barbershop-talks-sponsored-by-lkbf", destination: "/blog", permanent: true },
      { source: "/sutmlight-international-mens-day-barbershop-talks-sponsored-by-lkbf/", destination: "/blog", permanent: true },
      { source: "/inform-educate-inspire-serve-the-four-pillars-of-local-kettle-brothers", destination: "/blog", permanent: true },
      { source: "/inform-educate-inspire-serve-the-four-pillars-of-local-kettle-brothers/", destination: "/blog", permanent: true },
      { source: "/big-fish-by-ethan-esketch", destination: "/blog", permanent: true },
      { source: "/big-fish-by-ethan-esketch/", destination: "/blog", permanent: true },
      { source: "/the-year-of-the-gentleman", destination: "/blog", permanent: true },
      { source: "/the-year-of-the-gentleman/", destination: "/blog", permanent: true },
      { source: "/trending-blue-dial-watches-we-love-at-local-kettle-brothers-sir-folliot-francis-quarm", destination: "/blog", permanent: true },
      { source: "/trending-blue-dial-watches-we-love-at-local-kettle-brothers-sir-folliot-francis-quarm/", destination: "/blog", permanent: true },
      { source: "/richard-mille-rm67-01-titanium-extra-flat-rm67-02-sebastian-ogier-extra-flat-carbon-tpt-by-the-local-kettle-brothers", destination: "/blog", permanent: true },
      { source: "/richard-mille-rm67-01-titanium-extra-flat-rm67-02-sebastian-ogier-extra-flat-carbon-tpt-by-the-local-kettle-brothers/", destination: "/blog", permanent: true },
      { source: "/breakdown-of-the-audemars-piguet-royal-oak-transforming-elegance-with-a-diamond-afterset-case", destination: "/blog", permanent: true },
      { source: "/breakdown-of-the-audemars-piguet-royal-oak-transforming-elegance-with-a-diamond-afterset-case/", destination: "/blog", permanent: true },
      { source: "/excellence-in-all-directions-audemars-piguet-royal-oak-41mm-steel-openworked-set-in-vs1-stones", destination: "/blog", permanent: true },
      { source: "/excellence-in-all-directions-audemars-piguet-royal-oak-41mm-steel-openworked-set-in-vs1-stones/", destination: "/blog", permanent: true },
      { source: "/patek-5711-crown", destination: "/blog", permanent: true },
      { source: "/patek-5711-crown/", destination: "/blog", permanent: true },
      { source: "/patek-philippe-5980-2", destination: "/blog", permanent: true },
      { source: "/patek-philippe-5980-2/", destination: "/blog", permanent: true },

      // WordPress PDF files → home
      { source: "/DeliveryInformation-LKB.pdf", destination: "/", permanent: true },
      { source: "/ReturnPolicy-LKB.pdf", destination: "/", permanent: true },
      { source: "/TermsAndConditions-LKB.pdf", destination: "/", permanent: true },
      { source: "/PrivacyPolicy-LKB.pdf", destination: "/", permanent: true },

      // WordPress media/video files → home
      { source: "/:slug*.mp4", destination: "/", permanent: true },
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
