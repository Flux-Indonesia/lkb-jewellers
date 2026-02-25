import { createClient } from "@/lib/supabase";
import type { Product } from "@/data/products";

// Map snake_case DB row to camelCase Product interface
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
  };
}

// Map camelCase Product to snake_case for DB insert/update
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

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapRow);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data ? mapRow(data) : null;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapRow);
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const supabase = createClient();
  const row = toRow(product);
  delete row._id; // Let DB generate
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
  const row = toRow(product);
  delete row._id;
  delete row.id; // Can't change primary slug
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
