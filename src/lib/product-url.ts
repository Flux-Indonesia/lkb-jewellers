import type { Product } from "@/data/products";

export function brandSlug(brand: string): string {
  return brand.toLowerCase().replace(/\s+/g, "-");
}

export function productUrl(product: Pick<Product, "id" | "brand" | "seo">): string {
  const slug = product.seo?.slug || product.id;
  if (product.brand) {
    return `/product/${brandSlug(product.brand)}/${slug}`;
  }
  return `/product/${slug}`;
}
