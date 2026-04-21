import { createClient } from "@/lib/supabase";
import type { Product, ProductSeo } from "@/data/products";

function mapSeo(row: Record<string, unknown>): ProductSeo {
  return {
    metaTitle: (row.meta_title as string) || "",
    metaDescription: (row.meta_description as string) || "",
    metaKeywords: (row.meta_keywords as string) || "",
    slug: (row.slug as string) || "",
    canonicalUrl: (row.canonical_url as string) || "",
    ogTitle: (row.og_title as string) || "",
    ogDescription: (row.og_description as string) || "",
    ogImage: (row.og_image as string) || "",
    h1Override: (row.h1_override as string) || "",
    noindex: (row.noindex as boolean) || false,
    nofollow: (row.nofollow as boolean) || false,
    imageAltText: (row.image_alt_text as string) || "",
  };
}

function mapRow(row: Record<string, unknown>): Product {
  return {
    _id: row._id as string,
    id: row.id as string,
    name: row.name as string,
    price: Number(row.price) || 0,
    category: row.category as string,
    brand: (row.brand as string) || "",
    image: (row.image as string) || "",
    images: (row.images as string[]) || [],
    description: (row.description as string) || "",
    tags: (row.tags as string) || "",
    featured: (row.featured as boolean) || false,
    stock: (row.stock as number) || 0,
    model: (row.model as string) || "",
    caseSize: (row.case_size as string) || "",
    caseMaterial: (row.case_material as string) || "",
    dialColor: (row.dial_color as string) || "",
    yearOfProduction: (row.year_of_production as number) || 0,
    seo: mapSeo(row),
  };
}

function toRow(product: Partial<Product>) {
  const row: Record<string, unknown> = {};
  if (product._id !== undefined) row._id = product._id;
  if (product.id !== undefined) row.id = product.id;
  if (product.name !== undefined) row.name = product.name;
  if (product.price !== undefined) row.price = product.price;
  if (product.category !== undefined) row.category = product.category;
  if (product.brand !== undefined) row.brand = product.brand;
  if (product.image !== undefined) row.image = product.image;
  if (product.images !== undefined) row.images = product.images;
  if (product.description !== undefined) row.description = product.description;
  if (product.tags !== undefined) row.tags = product.tags;
  if (product.featured !== undefined) row.featured = product.featured;
  if (product.stock !== undefined) row.stock = product.stock;
  if (product.model !== undefined) row.model = product.model;
  if (product.caseSize !== undefined) row.case_size = product.caseSize;
  if (product.caseMaterial !== undefined) row.case_material = product.caseMaterial;
  if (product.dialColor !== undefined) row.dial_color = product.dialColor;
  if (product.yearOfProduction !== undefined) row.year_of_production = product.yearOfProduction;
  row.updated_at = new Date().toISOString();
  return row;
}

function seoToRow(seo: Partial<ProductSeo>) {
  const row: Record<string, unknown> = {};
  if (seo.metaTitle !== undefined) row.meta_title = seo.metaTitle;
  if (seo.metaDescription !== undefined) row.meta_description = seo.metaDescription;
  if (seo.metaKeywords !== undefined) row.meta_keywords = seo.metaKeywords;
  if (seo.slug !== undefined) row.slug = seo.slug;
  if (seo.canonicalUrl !== undefined) row.canonical_url = seo.canonicalUrl;
  if (seo.ogTitle !== undefined) row.og_title = seo.ogTitle;
  if (seo.ogDescription !== undefined) row.og_description = seo.ogDescription;
  if (seo.ogImage !== undefined) row.og_image = seo.ogImage;
  if (seo.h1Override !== undefined) row.h1_override = seo.h1Override;
  if (seo.noindex !== undefined) row.noindex = seo.noindex;
  if (seo.nofollow !== undefined) row.nofollow = seo.nofollow;
  if (seo.imageAltText !== undefined) row.image_alt_text = seo.imageAltText;
  return row;
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapRow);
}

export async function getProductById(idOrSlug: string): Promise<Product | null> {
  const supabase = createClient();
  // Try slug first, fallback to id
  const { data: bySlug } = await supabase.from("products").select("*").eq("slug", idOrSlug).single();
  if (bySlug) return mapRow(bySlug);
  const { data: byId } = await supabase.from("products").select("*").eq("id", idOrSlug).single();
  return byId ? mapRow(byId) : null;
}

export async function getProductsByCategory(
  category: string,
  options?: { limit?: number; excludeId?: string }
): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("updated_at", { ascending: false });

  if (options?.excludeId) {
    query = query.neq("id", options.excludeId);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapRow);
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const supabase = createClient();
  const row = { ...toRow(product), ...(product.seo ? seoToRow(product.seo) : {}) };
  delete row._id;
  const { data, error } = await supabase
    .from("products")
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const supabase = createClient();
  const row = { ...toRow(product), ...(product.seo ? seoToRow(product.seo) : {}) };
  delete row._id;
  delete row.id;
  const { data, error } = await supabase
    .from("products")
    .update(row)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
}

export async function updateProductSeo(id: string, seo: Partial<ProductSeo>): Promise<Product> {
  const supabase = createClient();
  const row = { ...seoToRow(seo), updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from("products")
    .update(row)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
