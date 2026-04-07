export interface ProductSeo {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  slug: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  h1Override: string;
  noindex: boolean;
  nofollow: boolean;
  imageAltText: string;
}

export interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  image: string;
  images: string[];
  description: string;
  tags: string;
  featured: boolean;
  stock: number;
  model: string;
  caseSize: string;
  caseMaterial: string;
  dialColor: string;
  yearOfProduction: number;
  // SEO fields
  seo?: ProductSeo;
}

export const navMenuData = {
  watches: {
    title: "WATCHES",
    defaultImage:
      "/images/static/nav-rolex.jpg",
    brands: [
      {
        name: "Rolex",
        desc: "The crown of watchmaking excellence",
        link: "/shop?brand=rolex",
        image:
          "/images/static/nav-rolex.jpg",
      },
      {
        name: "Audemars Piguet",
        desc: "Masters of haute horlogerie since 1875",
        link: "/shop?brand=audemars-piguet",
        image: "/DXZ09994.jpg",
      },
      {
        name: "Cartier",
        desc: "Timeless elegance and French savoir-faire",
        link: "/shop?brand=cartier",
        image: "/DXZ00043.jpg",
      },
      {
        name: "Patek Philippe",
        desc: "The ultimate symbol of prestige",
        link: "/shop?brand=patek-philippe",
        image: "/DXZ00023.jpg",
      },
      {
        name: "Richard Mille",
        desc: "Revolutionary ultra-lightweight timepieces",
        link: "/shop?brand=richard-mille",
        image: "/RM1103-Nisha-11.jpg",
      },
    ],
  },
  jewellery: {
    title: "JEWELLERY",
    defaultImage: "/images/static/nav-jewellery.jpg",
    categories: [
      {
        name: "Chains",
        desc: "Cuban links, rope chains & tennis necklaces",
        link: "/shop?category=chains",
        image: "/IMG_3595.JPG",
      },
      {
        name: "Bracelets",
        desc: "Diamond & gold statement pieces",
        link: "/shop?category=bracelets",
        image: "/_B8A6461.jpg",
      },
      {
        name: "Rings",
        desc: "Signet rings & diamond band masterpieces",
        link: "/shop?category=rings",
        image: "/shop-category/engagement-rings.jpg",
      },
      {
        name: "Pendants",
        desc: "Custom designs & classic motifs",
        link: "/shop?category=pendants",
        image: "/IMG_0711.JPG",
      },
    ],
  },
  rings: {
    title: "RINGS",
    defaultImage: "/images/static/IMG_0026.jpg",
    items: [
      {
        name: "Engagement Rings",
        desc: "Find your perfect engagement ring",
        link: "/engagement-rings",
        image: "/images/static/IMG_0026.jpg",
      },
    ],
  },
  accessories: {
    title: "ACCESSORIES",
    defaultImage: "/images/static/IMG_0025.jpg",
    items: [
      {
        name: "LKB Flagship Caps",
        desc: "Premium trucker hats & exclusive headwear",
        link: "/shop?category=flagship caps",
        image: "/images/static/nav-caps.jpg",
      },
      {
        name: "Watch Strap",
        desc: "Exclusive straps & custom watch accessories",
        link: "/shop?category=watch strap",
        image: "/images/static/nav-strap.jpg",
      },
      {
        name: "Lifestyle",
        desc: "Apparel, gifts & collector items",
        link: "/shop?category=lifestyle",
        image: "/images/static/nav-lifestyle.jpg",
      },
    ],
  },
  services: {
    title: "OTHER SERVICES",
    defaultImage: "/about-us/IMG_0005.jpg",
    offerings: [
      {
        name: "Bespoke Designs",
        desc: "Custom creations by master craftsmen",
        link: "/bespoke",
        image: "/about-us/davido-42.webp",
      },
      {
        name: "Sell",
        desc: "Get competitive valuations for your exclusive items",
        link: "/we-buy",
        image: "/RichardMilleChandellier-RA-5.jpg",
      },
      {
        name: "Watches/Jewellery Servicing",
        desc: "Expert restoration & maintenance services",
        link: "/servicing",
        image: "/about-us/IMG_0005.jpg",
      },
    ],
  },
  contact: {
    title: "ABOUT US",
    defaultImage: "/about-us/crown-jewels.webp",
    links: [
      // Hall of Fame - temporarily hidden
      // {
      //   name: "Hall of Fame",
      //   desc: "Our distinguished clientele & their pieces",
      //   link: "/hall-of-fame",
      //   image: "/about-us/hall-of-fame.jpg",
      // },
      {
        name: "Our Boutique",
        desc: "Visit our Hatton Garden showroom by appointment",
        link: "/about/our-boutique",
        image: "/images/static/showroom-entry.jpg",
      },
      {
        name: "LKB Foundation",
        desc: "Our commitment to giving back",
        link: "https://www.lkbfoundation.org/",
        image: "/about-us/mini-pendant.jpg",
        external: true,
      },
      {
        name: "About Us",
        desc: "Our heritage, values & craftsmanship",
        link: "/about",
        image: "/about-us/crown-jewels.webp",
      },
      {
        name: "Contact Us",
        desc: "Visit us at Hatton Garden, London",
        link: "/contact",
        image: "/about-us/IMG_5750.jpg",
      },
    ],
  },
};

export const siteConfig = {
  businessName: "LKB Jewellers",
  legalName: "Local Kettle Brothers UK",
  address: "New House, 67-68 Hatton Garden, London EC1N 8JY",
  phone: "020 3336 5303",
  phoneTel: "+442033365303",
  email: "info@lkbjewellers.com",
  instagram: "https://www.instagram.com/localkettlebrothersuk/",
  tiktok: "https://www.tiktok.com/@localkettlebrothersuk",
  youtube: "https://www.youtube.com/@lkbjewellers",
  facebook:
    "https://web.facebook.com/people/Local-Kettle-Brothers-UK/100086313849712/",
  twitter: "https://twitter.com/lkb_uk",
  logo: "/white-logo.png",
};

export const videoSections = [
  {
    id: "watches",
    title: "EXCLUSIVE TIMEPIECES",
    videoUrl: "/timepieces/desktop-new.mp4",
    mobileVideoUrl: "/timepieces/mobile-new.mp4",
    link: "/watches",
  },
  {
    id: "jewellery",
    title: "PREMIUM JEWELLERY",
    videoUrl: "/jewellery/desktop-new.mp4",
    mobileVideoUrl: "/jewellery/mobile-new.mp4",
    link: "/jewellery",
  },
  {
    id: "accessories",
    title: "MERCHANDISE",
    videoUrl: "/merchandise/desktop.mp4",
    mobileVideoUrl: "/merchandise/mobile.mp4",
    link: "/accessories",
  },
  {
    id: "rings",
    title: "ENGAGEMENT RINGS",
    videoUrl: "/rings/desktop-new.mp4",
    mobileVideoUrl: "/rings/mobile-new.mp4",
    link: "/engagement-rings",
  },
];

export const serviceCards = [
  {
    id: "buy",
    title: "WE BUY",
    image:
      "/offer/we-buy.jpg",
    hoverImage: "/offer/we-buy-2.jpg",
    description: "Competitive valuations for your exclusive timepieces.",
  },
  {
    id: "sell",
    title: "WE SELL",
    image:
      "/offer/we-sell.jpg",
    hoverImage: "/offer/we-sell-2.jpg",
    description: "Sourcing the rarest pieces from around the globe.",
  },
  {
    id: "service",
    title: "SERVICING",
    image:
      "/offer/servicing.jpg",
    hoverImage: "/offer/servicing-2.jpg",
    description: "Expert restoration and maintenance for longevity.",
  },
  {
    id: "bespoke",
    title: "BESPOKE",
    image:
      "/offer/bespoke.jpg",
    hoverImage: "/offer/bespoke-2.jpg",
    description: "Custom designs crafted to your exact specifications.",
  },
];
