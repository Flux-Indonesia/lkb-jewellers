"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal, RefreshCw } from "lucide-react";
import { getProducts } from "@/lib/products";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/product-card";

function titleCase(str: string): string {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// Brand priority order (matches reference site exactly)
const BRAND_PRIORITY: Record<string, number> = {
  rolex: 1,
  "audemars piguet": 2,
  "patek philippe": 3,
  "richard mille": 4,
  cartier: 5,
  omega: 6,
  "tag heuer": 7,
  breitling: 8,
  iwc: 9,
  panerai: 10,
};

// Extract model family from product name + brand (matches reference site logic)
function getModelFamily(name: string, brand: string): string {
  const n = name.toLowerCase();
  const b = brand.toLowerCase();
  const stripped = n.replace(new RegExp(`^${b}\\s*`, "i"), "").trim();

  if (b === "rolex") {
    if (stripped.includes("cosmograph") || stripped.includes("daytona")) return "cosmograph daytona";
    if (stripped.includes("day-date") || stripped.includes("day date")) return "day-date";
    if (stripped.includes("datejust")) return "datejust";
    if (stripped.includes("submariner")) return "submariner";
    if (stripped.includes("yacht-master") || stripped.includes("yacht master")) return "yacht-master";
    if (stripped.includes("gmt-master") || stripped.includes("gmt master")) return "gmt-master";
    if (stripped.includes("explorer")) return "explorer";
    if (stripped.includes("milgauss")) return "milgauss";
    if (stripped.includes("sea-dweller") || stripped.includes("sea dweller")) return "sea-dweller";
    if (stripped.includes("oyster perpetual")) return "oyster perpetual";
    if (stripped.includes("sky-dweller") || stripped.includes("sky dweller")) return "sky-dweller";
  }
  if (b === "cartier") {
    if (stripped.includes("pasha")) return "pasha";
    if (stripped.includes("santos")) return "santos";
    if (stripped.includes("tank")) return "tank";
    if (stripped.includes("ballon bleu")) return "ballon bleu";
    if (stripped.includes("panthere")) return "panthere";
    if (stripped.includes("roadster")) return "roadster";
  }
  if (b === "audemars piguet") {
    if (stripped.includes("royal oak")) return "royal oak";
    if (stripped.includes("millenary")) return "millenary";
    if (stripped.includes("jules audemars")) return "jules audemars";
  }
  if (b === "patek philippe") {
    if (stripped.includes("nautilus")) return "nautilus";
    if (stripped.includes("aquanaut")) return "aquanaut";
    if (stripped.includes("calatrava")) return "calatrava";
    if (stripped.includes("complications")) return "complications";
    if (stripped.includes("grand complications")) return "grand complications";
  }
  if (b === "richard mille") {
    const match = stripped.match(/rm\s*(\d+[-\d]*)/i);
    if (match) return `rm ${match[1]}`;
  }

  return stripped.split(" ").filter((w) => w.length > 2).slice(0, 2).join(" ") || stripped;
}

const brandCarouselData = [
  { name: "Rolex", image: "/images/static/nav-rolex.jpg" },
  { name: "Cartier", image: "/images/static/nav-cartier.jpg" },
  { name: "Richard Mille", image: "/images/static/nav-rm.jpg" },
  { name: "Audemars Piguet", image: "/images/static/nav-ap.jpg" },
  { name: "Patek Philippe", image: "/images/static/nav-patek.jpg" },
];

interface ShopContentProps {
  defaultCategory?: string;
}

export default function ShopContent({ defaultCategory }: ShopContentProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category") ?? null;
  const brandParam = searchParams?.get("brand") ?? null;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [activeBrand, setActiveBrand] = useState("all");
  const [activeCaseSize, setActiveCaseSize] = useState("all");
  const [activeMaterial, setActiveMaterial] = useState("all");
  const [sortOrder, setSortOrder] = useState("featured");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Initialize from URL params
  useEffect(() => {
    if (brandParam) {
      setActiveBrand(brandParam.replace(/-/g, " "));
      setActiveCategory("watch");
      setActiveSubcategory("all");
    } else if (categoryParam) {
      // Map URL param values to actual DB category names
      const catMap: Record<string, string> = {
        "watch": "watch",
        "exclusive jewellery": "luxury-jewellery",
        "luxury-jewellery": "luxury-jewellery",
        "jewellery": "luxury-jewellery",
        "merchandise": "merchandise",
      };
      // Map subcategory URL params to tag keywords for filtering
      const subcatTagMap: Record<string, string> = {
        "chains": "chains",
        "bracelets": "bracelets",
        "rings": "ring",
        "pendants": "pendants",
        "earrings": "earrings",
        "flagship caps": "caps",
        "watch strap": "watch strap",
        "lifestyle": "lifestyle",
      };
      const raw = categoryParam.toLowerCase();
      if (subcatTagMap[raw]) {
        setActiveCategory("all");
        setActiveSubcategory(subcatTagMap[raw]);
      } else {
        setActiveCategory(catMap[raw] || raw);
        setActiveSubcategory("all");
      }
    } else if (defaultCategory) {
      const map: Record<string, string> = {
        Watches: "watch",
        Jewellery: "luxury-jewellery",
        Accessories: "merchandise",
      };
      setActiveCategory(map[defaultCategory] || "all");
      setActiveSubcategory("all");
    }
  }, [categoryParam, brandParam, defaultCategory]);

  const isWatches = activeCategory === "watch";

  // Dynamic filter options from product data
  const uniqueBrands = useMemo(() => {
    const brands = products
      .filter((p) => p.category.toLowerCase() === "watch" && p.brand)
      .map((p) => p.brand);
    return [...new Set(brands)].sort();
  }, [products]);

  const uniqueCaseSizes = useMemo(() => {
    const sizes = products
      .filter((p) => p.category.toLowerCase() === "watch" && p.caseSize)
      .map((p) => p.caseSize);
    return [...new Set(sizes)].sort();
  }, [products]);

  const uniqueMaterials = useMemo(() => {
    const mats = products
      .filter((p) => p.category.toLowerCase() === "watch" && p.caseMaterial)
      .map((p) => p.caseMaterial);
    return [...new Set(mats)].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (activeCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory
      );
    }

    // Subcategory (filter by tags, normalize non-breaking spaces)
    if (activeSubcategory !== "all") {
      result = result.filter(
        (p) => p.tags && p.tags.toLowerCase().replace(/\u00A0/g, " ").includes(activeSubcategory.toLowerCase())
      );
    }

    // Brand
    if (activeBrand !== "all") {
      result = result.filter(
        (p) => p.brand && p.brand.toLowerCase() === activeBrand.toLowerCase()
      );
    }

    // Case Size
    if (activeCaseSize !== "all") {
      result = result.filter((p) => p.caseSize === activeCaseSize);
    }

    // Material
    if (activeMaterial !== "all") {
      result = result.filter((p) => p.caseMaterial === activeMaterial);
    }

    // Price
    if (priceMin > 0) result = result.filter((p) => p.price >= priceMin);
    if (priceMax > 0) result = result.filter((p) => p.price <= priceMax);

    // Sort
    switch (sortOrder) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: {
        // "featured" — matches reference site sort logic
        result.sort((a, b) => {
          if (activeCategory === "watch" || a.category === "watch") {
            const aBrand = (a.brand || "").toLowerCase();
            const bBrand = (b.brand || "").toLowerCase();
            const aPriority = BRAND_PRIORITY[aBrand] || 999;
            const bPriority = BRAND_PRIORITY[bBrand] || 999;
            if (aPriority !== bPriority) return aPriority - bPriority;
            const aModel = getModelFamily(a.name, a.brand || "");
            const bModel = getModelFamily(b.name, b.brand || "");
            if (aModel !== bModel) return aModel.localeCompare(bModel);
            return a.name.localeCompare(b.name);
          }
          // Non-watch: featured first, then default order
          if (b.featured !== a.featured) return b.featured ? 1 : -1;
          return 0;
        });
        break;
      }
    }

    return result;
  }, [
    products,
    activeCategory,
    activeSubcategory,
    activeBrand,
    activeCaseSize,
    activeMaterial,
    sortOrder,
    priceMin,
    priceMax,
  ]);

  const refresh = () => {
    setRefreshing(true);
    getProducts().then((data) => {
      setProducts(data);
      setRefreshing(false);
    });
  };

  const getTitle = () => {
    switch (activeCategory) {
      case "watch":
        return "Exclusive Timepieces";
      case "luxury-jewellery":
        return "Exclusive Jewellery";
      case "merchandise":
        return "Accessories";
      default:
        return "Our Collection";
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-xs tracking-widest uppercase">
          Loading collection...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* Hero Section */}
      <div className="bg-gray-50 border-b border-gray-200 pt-12 pb-16 px-6">
        <div className="container mx-auto text-center">
          <h1
            className="text-4xl md:text-6xl uppercase mb-4 text-gray-900 font-heading"
          >
            {getTitle()}
          </h1>
          <p
            className="text-gray-600 tracking-widest text-sm max-w-2xl mx-auto"
          >
            Discover our curated selection of exclusive items, verified by
            experts.
          </p>
        </div>
      </div>

      {/* Brand Carousel — watches only */}
      {isWatches && (
        <div className="bg-white py-8 border-b border-gray-200 overflow-hidden">
          <div className="relative">
            <div
              className="flex gap-8 shrink-0"
              style={{ animation: "scroll-brands 30s linear infinite" }}
            >
              {[
                ...brandCarouselData,
                ...brandCarouselData,
                ...brandCarouselData,
                ...brandCarouselData,
              ].map((brand, i) => (
                <Link
                  key={i}
                  href={`/shop?brand=${brand.name.toLowerCase().replace(/ /g, "-")}`}
                  className="relative w-48 h-32 bg-linear-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group shrink-0 cursor-pointer"
                >
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="192px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white font-bold text-sm tracking-wider">
                      {brand.name.toUpperCase()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Toolbar + Filter wrapper */}
        <div className="mb-8">
          {/* Toolbar */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Hide/Show Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-white bg-gray-900 px-4 py-2 hover:bg-gray-800 transition-colors rounded"
              >
                <SlidersHorizontal size={16} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              {/* Refresh */}
              <button
                onClick={refresh}
                disabled={refreshing}
                className="flex items-center gap-2 text-sm text-gray-900 bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh products to ensure all images load properly"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
              {/* Results count */}
              <span className="text-gray-600 text-sm">
                Showing {filteredProducts.length} Results
              </span>
            </div>

            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-white text-xs text-gray-900 outline-none cursor-pointer border border-gray-300 px-3 py-2 focus:border-gray-900 rounded w-full lg:w-auto"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-gray-50 border border-gray-200 p-6 mb-6 rounded-lg shadow-sm">
              <div className="flex flex-col lg:flex-row lg:flex-wrap gap-6">
                {/* Category */}
                <div className="w-full lg:flex-1 lg:min-w-37.5">
                  <h3
                    className="text-sm font-bold tracking-wider uppercase mb-3 text-gray-900 font-heading"
                  >
                    Category
                  </h3>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: "View All", value: "all" },
                      { label: "Watches", value: "watch" },
                      { label: "Jewellery", value: "luxury-jewellery" },
                      { label: "Accessories", value: "merchandise" },
                    ].map(({ label, value }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setActiveCategory(value);
                          setActiveBrand("all");
                          setActiveCaseSize("all");
                          setActiveMaterial("all");
                        }}
                        className={`block hover:text-gray-900 transition-colors ${
                          activeCategory === value
                            ? "text-gray-900 font-bold"
                            : "text-gray-600"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand — watches only */}
                {isWatches && (
                  <div className="w-full lg:flex-1 lg:min-w-37.5">
                    <h3
                      className="text-sm font-bold tracking-wider uppercase mb-3 text-gray-900 font-heading"
                    >
                      Brand
                    </h3>
                    <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                      <button
                        onClick={() => setActiveBrand("all")}
                        className={`block hover:text-gray-900 transition-colors ${
                          activeBrand === "all"
                            ? "text-gray-900 font-bold"
                            : "text-gray-600"
                        }`}
                      >
                        All Brands
                      </button>
                      {uniqueBrands.slice(0, 10).map((brand) => (
                        <button
                          key={brand}
                          onClick={() => setActiveBrand(brand)}
                          className={`block hover:text-gray-900 transition-colors ${
                            activeBrand === brand
                              ? "text-gray-900 font-bold"
                              : "text-gray-600"
                          }`}
                        >
                          {titleCase(brand)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Case Size — watches only */}
                {isWatches && uniqueCaseSizes.length > 0 && (
                  <div className="w-full lg:flex-1 lg:min-w-37.5">
                    <h3
                      className="text-sm font-bold tracking-wider uppercase mb-3 text-gray-900 font-heading"
                    >
                      Case Size
                    </h3>
                    <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                      <button
                        onClick={() => setActiveCaseSize("all")}
                        className={`block hover:text-gray-900 transition-colors ${
                          activeCaseSize === "all"
                            ? "text-gray-900 font-bold"
                            : "text-gray-600"
                        }`}
                      >
                        All Sizes
                      </button>
                      {uniqueCaseSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setActiveCaseSize(size)}
                          className={`block hover:text-gray-900 transition-colors ${
                            activeCaseSize === size
                              ? "text-gray-900 font-bold"
                              : "text-gray-600"
                          }`}
                        >
                          {titleCase(size)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Material — watches only */}
                {isWatches && uniqueMaterials.length > 0 && (
                  <div className="w-full lg:flex-1 lg:min-w-37.5">
                    <h3
                      className="text-sm font-bold tracking-wider uppercase mb-3 text-gray-900 font-heading"
                    >
                      Material
                    </h3>
                    <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                      <button
                        onClick={() => setActiveMaterial("all")}
                        className={`block hover:text-gray-900 transition-colors ${
                          activeMaterial === "all"
                            ? "text-gray-900 font-bold"
                            : "text-gray-600"
                        }`}
                      >
                        All Materials
                      </button>
                      {uniqueMaterials.map((mat) => (
                        <button
                          key={mat}
                          onClick={() => setActiveMaterial(mat)}
                          className={`block hover:text-gray-900 transition-colors ${
                            activeMaterial === mat
                              ? "text-gray-900 font-bold"
                              : "text-gray-600"
                          }`}
                        >
                          {titleCase(mat)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div className="w-full lg:flex-1 lg:min-w-37.5">
                  <h3
                    className="text-sm font-bold tracking-wider uppercase mb-3 text-gray-900 font-heading"
                  >
                    Price Range
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Min Price (£)
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="0"
                        value={priceMin || ""}
                        onChange={(e) =>
                          setPriceMin(parseInt(e.target.value.replace(/\D/g, "")) || 0)
                        }
                        className="w-full text-sm border border-gray-300 px-3 py-2.5 rounded focus:border-gray-900 focus:outline-none"
                        style={{ fontSize: "16px" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Max Price (£)
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="No limit"
                        value={priceMax || ""}
                        onChange={(e) =>
                          setPriceMax(parseInt(e.target.value.replace(/\D/g, "")) || 0)
                        }
                        className="w-full text-sm border border-gray-300 px-3 py-2.5 rounded focus:border-gray-900 focus:outline-none"
                        style={{ fontSize: "16px" }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 pt-1">
                      {priceMin > 0 || priceMax > 0
                        ? `£${priceMin.toLocaleString()} - ${priceMax > 0 ? `£${priceMax.toLocaleString()}` : "No limit"}`
                        : "All prices"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm tracking-wide">
              No products found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
