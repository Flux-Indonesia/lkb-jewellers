"use client";

import EngagementRingsTab from "@/components/dashboard/engagement-rings/EngagementRingsTab";
import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Crown,
  Gem,
  Shirt,
  Mail,
  DollarSign,
  Newspaper,
  Users,
  ChevronRight,
  PanelLeftClose,
  BarChart3,
  AlertTriangle,
  X,
  Pencil,
  Trash2,
  CheckCircle,
  Clock,
  User,
  Upload,
  Search,
  ArrowUp,
  ArrowDown,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import type { Product } from "@/data/products";
import {
  getProducts,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
} from "@/lib/products";
import { getContacts, updateContact, deleteContact, type Contact } from "@/lib/contacts";
import { getSellSubmissions, updateSellSubmission, deleteSellSubmission, type SellSubmission } from "@/lib/sell-submissions";
import { getOrders, updateOrder, deleteOrder, type Order } from "@/lib/orders";
import { getSubscribers, removeSubscriber, type NewsletterSubscriber } from "@/lib/newsletter";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type TabType = "add" | "watches" | "jewellery" | "merchandise" | "orders" | "contacts" | "sell" | "newsletter" | "engagement-rings";

interface FormData {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
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
  yearOfProduction: string;
}

const defaultFormData: FormData = {
  id: "",
  name: "",
  category: "luxury-jewellery",
  brand: "",
  price: 0,
  image: "",
  images: [],
  description: "",
  tags: "",
  featured: false,
  stock: 0,
  model: "",
  caseSize: "",
  caseMaterial: "",
  dialColor: "",
  yearOfProduction: "",
};

interface Notification {
  type: "success" | "error";
  text: string;
}

// Auth Guard Component — uses admin cookie session
function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setError("");
    setVerifying(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        document.cookie = `admin_session=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        window.location.reload();
      } else {
        setError("Incorrect password");
        setVerifying(false);
      }
    } catch {
      setError("Failed to verify. Please try again.");
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-gray-800 bg-[#0a0a0a] rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl text-white mb-2 font-heading">
          Dashboard Access
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Enter admin password to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-auto w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:border-white"
              disabled={verifying}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
              disabled={verifying}
            >
              {showPassword ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
          </div>

          <Button
            type="submit"
            className="h-auto w-full bg-white text-black py-3 rounded-lg font-bold tracking-widest text-sm hover:bg-gray-200 transition-all duration-300 active:scale-95 disabled:opacity-50"
            disabled={verifying}
          >
            {verifying ? "Verifying..." : "Enter Dashboard"}
          </Button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-white text-xs tracking-widest uppercase animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLoginForm />;
  }

  return <>{children}</>;
}

// Product Form Component
function ProductForm({
  formData,
  setFormData,
  imageInput,
  setImageInput,
  uploadingImages,
  loading,
  handleSubmit,
  handleInputChange,
  handleImageUpload,
  addImage,
  removeImage,
  moveImage,
  generateId,
  isUpdate,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  imageInput: string;
  setImageInput: (v: string) => void;
  uploadingImages: boolean;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addImage: () => void;
  removeImage: (i: number) => void;
  moveImage: (i: number, dir: "up" | "down") => void;
  generateId: () => void;
  isUpdate: boolean;
}) {
  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-xl">
      <div className="space-y-6">
        {/* Row 1: Product ID + Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Product ID <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <Input type="text" name="id" value={formData.id} onChange={handleInputChange}
                className="flex-1 bg-[#0a0a0a] border border-gray-800 rounded px-4 py-3 text-white focus:border-white focus:outline-none h-auto"
                placeholder="product-id-here" required disabled={isUpdate} />
              {!isUpdate && (
                <Button type="button" onClick={generateId}
                  className="px-5 py-3 bg-gradient-to-b from-[#f5d280] via-[#D4AF37] to-[#8B7225] hover:opacity-90 text-black rounded-lg text-sm font-bold transition-all hover:scale-105 h-auto">
                  AUTO
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Unique identifier (e.g., rolex-daytona-2024)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Product Name <span className="text-red-500">*</span></label>
            <Input type="text" name="name" value={formData.name} onChange={handleInputChange}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-4 py-3 text-white focus:border-white focus:outline-none h-auto"
              placeholder="Rolex Daytona" required />
          </div>
        </div>

        {/* Row 2: Category + Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category <span className="text-red-500">*</span></label>
            <select name="category" value={formData.category} onChange={handleInputChange}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-4 py-3 text-white focus:border-white focus:outline-none" required>
              <option value="watch">Watches</option>
              <option value="luxury-jewellery">Luxury Jewellery</option>
              <option value="merchandise">Merchandise</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
            <Input type="text" name="brand" value={formData.brand} onChange={handleInputChange}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-4 py-3 text-white focus:border-white focus:outline-none h-auto"
              placeholder="Rolex, Cartier, etc." />
          </div>
        </div>

        {/* Watch-specific fields */}
        {formData.category === "watch" && (
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Crown size={20} className="text-white" />
              <h3 className="text-lg text-white font-heading">Watch Specifications</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Model Reference</label>
              <Input type="text" name="model" value={formData.model} onChange={handleInputChange}
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-4 py-3 text-white focus:border-white focus:outline-none h-auto"
                placeholder="e.g., 5961R, 126500LN" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Case Size</label>
                <select name="caseSize" value={formData.caseSize} onChange={handleInputChange}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-4 py-3 text-white focus:border-white focus:outline-none">
                  <option value="">Select Size</option>
                  <option value="36 mm">36 mm</option>
                  <option value="40 mm">40 mm</option>
                  <option value="41 mm">41 mm</option>
                  <option value="42 mm">42 mm</option>
                  <option value="44 mm">44 mm</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Case Material</label>
                <select name="caseMaterial" value={formData.caseMaterial} onChange={handleInputChange}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-4 py-3 text-white focus:border-white focus:outline-none">
                  <option value="">Select Material</option>
                  <option value="diamond afterset">Diamond Afterset</option>
                  <option value="platinum">Platinum</option>
                  <option value="rose gold">Rose Gold</option>
                  <option value="rose gold and steel">Rose Gold and Steel</option>
                  <option value="steel">Steel</option>
                  <option value="white gold">White Gold</option>
                  <option value="yellow gold">Yellow Gold</option>
                  <option value="yellow gold and steel">Yellow Gold and Steel</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Dial Colour</label>
                <select name="dialColor" value={formData.dialColor} onChange={handleInputChange}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-4 py-3 text-white focus:border-white focus:outline-none">
                  <option value="">Select Colour</option>
                  <option value="black">Black</option>
                  <option value="blue">Blue</option>
                  <option value="brown">Brown</option>
                  <option value="champagne">Champagne</option>
                  <option value="diamond">Diamond</option>
                  <option value="green">Green</option>
                  <option value="pave">Pave</option>
                  <option value="pink">Pink</option>
                  <option value="white">White</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Year of Production</label>
                <select name="yearOfProduction" value={formData.yearOfProduction} onChange={handleInputChange}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-4 py-3 text-white focus:border-white focus:outline-none">
                  <option value="">Select Year</option>
                  {[2025, 2024, 2023, 2022, 2021, 2020, 2018, 2017, 2015, 2012, 2008].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Price (GBP)</label>
          <Input type="text" name="price" value={formData.price} onChange={handleInputChange}
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-4 py-3 text-white focus:border-white focus:outline-none h-auto"
            placeholder="0" inputMode="decimal" />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Stock Quantity <span className="text-red-500">*</span></label>
          <Input type="number" name="stock" value={formData.stock} onChange={handleInputChange}
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-4 py-3 text-white focus:border-white focus:outline-none h-auto"
            placeholder="0" min="0" required />
          <p className="text-xs text-gray-500 mt-1">
            <span className="text-red-500">0 = Out of Stock</span> —
            <span className="text-yellow-500 ml-2">1-10 = Low Stock</span> —
            <span className="text-green-500 ml-2">&gt;10 = In Stock</span>
          </p>
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Product Images <span className="text-red-500">*</span></label>
          <div className="mb-4">
            <label className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded hover:bg-gray-200 transition-colors cursor-pointer">
              <Upload size={18} />
              {uploadingImages ? "Uploading..." : "Upload Images"}
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploadingImages} className="hidden" />
            </label>
            <p className="text-xs text-gray-500 mt-2">Upload images or paste URL below</p>
          </div>
          <div className="flex gap-2 mb-4">
            <Input type="url" value={imageInput} onChange={(e) => setImageInput(e.target.value)}
              className="flex-1 bg-[#0a0a0a] border border-gray-800 rounded px-4 py-3 text-white focus:border-white focus:outline-none h-auto"
              placeholder="Or paste image URL here..."
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }} />
            <Button type="button" onClick={addImage}
              className="px-6 py-3 bg-white text-black rounded hover:bg-gray-200 transition-colors flex items-center gap-2 h-auto">
              <Plus size={18} /> Add
            </Button>
          </div>
          {formData.images.length > 0 && (
            <div className="space-y-2 bg-[#0a0a0a] border border-gray-800 rounded p-4">
              {formData.images.map((url, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-black rounded">
                  <div className="relative w-12 h-12 bg-[#0a0a0a] rounded overflow-hidden flex-shrink-0">
                    <Image src={url} alt={`Product ${index + 1}`} fill className="object-cover" sizes="48px" />
                  </div>
                  <span className="flex-1 text-sm text-gray-400 truncate">{url}</span>
                  <div className="flex gap-1">
                    <Button type="button" onClick={() => moveImage(index, "up")} disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-white disabled:opacity-30"><ArrowUp size={14} /></Button>
                    <Button type="button" onClick={() => moveImage(index, "down")} disabled={index === formData.images.length - 1}
                      className="p-1 text-gray-500 hover:text-white disabled:opacity-30"><ArrowDown size={14} /></Button>
                    <Button type="button" onClick={() => removeImage(index)}
                      className="p-1 text-red-400 hover:text-red-300"><Trash2 size={14} /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} rows={6}
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-4 py-3 text-white focus:border-white focus:outline-none resize-none"
            placeholder="Enter product description..." />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
          <Input type="text" name="tags" value={formData.tags} onChange={handleInputChange}
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-4 py-3 text-white focus:border-white focus:outline-none h-auto"
            placeholder="Collection:Watches, Brand:Rolex, Enquiry Only" />
          <p className="text-xs text-gray-500 mt-1">Comma-separated tags</p>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={handleInputChange}
            className="w-5 h-5 bg-[#0a0a0a] border-2 border-gray-800 rounded cursor-pointer accent-blue-500" />
          <label htmlFor="featured" className="text-sm text-gray-300 cursor-pointer">Mark as featured product</label>
        </div>

        {/* Submit */}
        <Button type="submit" disabled={loading || formData.images.length === 0}
          className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-105 disabled:hover:scale-100 h-auto">
          {loading ? (
            <><div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />{isUpdate ? "Updating Product..." : "Adding Product..."}</>
          ) : (
            <>{isUpdate ? "Update Product" : "Add Product"}</>
          )}
        </Button>
      </div>
    </form>
  );
}

// Main Dashboard
function DashboardContent() {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("add");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<Notification | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [imageInput, setImageInput] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit mode
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({ show: false, productId: "", productName: "" });

  // Products from Supabase
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const refreshProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Data from Supabase
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [sellSubmissions, setSellSubmissions] = useState<SellSubmission[]>([]);
  const [newsletters, setNewsletters] = useState<NewsletterSubscriber[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contactFilter, setContactFilter] = useState("all");
  const [sellFilter, setSellFilter] = useState("all");

  const refreshContacts = useCallback(async () => {
    try { const data = await getContacts(); setContacts(data); } catch (err) { console.error("Failed to fetch contacts:", err); }
  }, []);

  const refreshSellSubmissions = useCallback(async () => {
    try { const data = await getSellSubmissions(); setSellSubmissions(data); } catch (err) { console.error("Failed to fetch sell submissions:", err); }
  }, []);

  const refreshOrders = useCallback(async () => {
    try { const data = await getOrders(); setOrders(data); } catch (err) { console.error("Failed to fetch orders:", err); }
  }, []);

  const refreshNewsletters = useCallback(async () => {
    try { const data = await getSubscribers(); setNewsletters(data); } catch (err) { console.error("Failed to fetch newsletters:", err); }
  }, []);

  useEffect(() => {
    refreshContacts();
    refreshSellSubmissions();
    refreshOrders();
    refreshNewsletters();
  }, [refreshContacts, refreshSellSubmissions, refreshOrders, refreshNewsletters]);

  // Filtered products for current tab
  const filteredProducts = useMemo(() => {
    let categoryFilter = "";
    if (activeTab === "watches") categoryFilter = "watch";
    else if (activeTab === "jewellery") categoryFilter = "luxury-jewellery";
    else if (activeTab === "merchandise") categoryFilter = "merchandise";
    else return [];

    let result = products.filter((p) => p.category === categoryFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const terms = q.split(/\s+/).filter(Boolean);
      result = result.filter((p) => {
        const searchable = `${p.name} ${p.brand} ${p.tags} ${p.id} ${p.model} ${p.description}`.toLowerCase();
        return terms.every((t) => searchable.includes(t));
      });
    }
    return result;
  }, [activeTab, searchQuery, products]);

  const totalInCategory = useMemo(() => {
    if (activeTab === "watches") return products.filter((p) => p.category === "watch").length;
    if (activeTab === "jewellery") return products.filter((p) => p.category === "luxury-jewellery").length;
    if (activeTab === "merchandise") return products.filter((p) => p.category === "merchandise").length;
    return 0;
  }, [activeTab, products]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const generateId = useCallback(() => {
    if (!formData.name.trim()) {
      setNotification({ type: "error", text: "Please enter a product name first" });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    const id = formData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
    setFormData((prev) => ({ ...prev, id }));
    setNotification({ type: "success", text: `Product ID generated: ${id}` });
    setTimeout(() => setNotification(null), 3000);
  }, [formData.name]);

  const addImage = useCallback(() => {
    if (!imageInput.trim()) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, imageInput.trim()], image: prev.image || imageInput.trim() }));
    setImageInput("");
  }, [imageInput]);

  const removeImage = useCallback((index: number) => {
    setFormData((prev) => {
      const images = prev.images.filter((_, i) => i !== index);
      return { ...prev, images, image: images[0] || "" };
    });
  }, []);

  const moveImage = useCallback((index: number, dir: "up" | "down") => {
    setFormData((prev) => {
      const images = [...prev.images];
      const swapIndex = dir === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= images.length) return prev;
      [images[index], images[swapIndex]] = [images[swapIndex], images[index]];
      return { ...prev, images, image: images[0] };
    });
  }, []);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadingImages(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new window.FormData();
        fd.append("image", file);
        const res = await fetch("https://api.imgbb.com/1/upload?key=21a4ec39ce5dad29e92c47325c7d0d73", { method: "POST", body: fd });
        const data = await res.json();
        if (data.success && data.data?.url) {
          setFormData((prev) => ({ ...prev, images: [...prev.images, data.data.url], image: prev.image || data.data.url }));
        }
      }
      setNotification({ type: "success", text: "Images uploaded successfully!" });
    } catch {
      setNotification({ type: "error", text: "Failed to upload images" });
    } finally {
      setUploadingImages(false);
      setTimeout(() => setNotification(null), 3000);
    }
  }, []);

  const closeEditMode = useCallback(() => {
    setIsEditMode(false);
    setEditingProduct(null);
    setFormData(defaultFormData);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const productData: Partial<Product> = {
        id: formData.id,
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.price) || 0,
        image: formData.images[0] || formData.image,
        images: formData.images,
        description: formData.description,
        tags: formData.tags,
        featured: formData.featured,
        stock: Number(formData.stock) || 0,
        model: formData.model,
        caseSize: formData.caseSize,
        caseMaterial: formData.caseMaterial,
        dialColor: formData.dialColor,
        yearOfProduction: Number(formData.yearOfProduction) || 0,
      };

      if (isEditMode && editingProduct) {
        await apiUpdateProduct(editingProduct.id, productData);
        setNotification({ type: "success", text: "Product updated successfully!" });
        closeEditMode();
      } else {
        await apiCreateProduct(productData);
        setNotification({ type: "success", text: "Product created successfully!" });
        setFormData(defaultFormData);
      }
      await refreshProducts();
    } catch (err) {
      setNotification({ type: "error", text: `Failed to save product: ${err instanceof Error ? err.message : "Unknown error"}` });
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(null), 4000);
    }
  }, [formData, isEditMode, editingProduct, closeEditMode, refreshProducts]);

  const openEditMode = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      image: product.image,
      images: product.images || [product.image],
      description: product.description,
      tags: product.tags,
      featured: product.featured,
      stock: product.stock,
      model: product.model,
      caseSize: product.caseSize,
      caseMaterial: product.caseMaterial,
      dialColor: product.dialColor,
      yearOfProduction: String(product.yearOfProduction || ""),
    });
    setIsEditMode(true);
  }, []);

  const tabIcon = (tab: TabType) => {
    const cls = `${activeTab === tab ? "text-black" : "text-gray-400"}`;
    switch (tab) {
      case "add": return <Plus size={20} className={cls} />;
      case "watches": return <Crown size={20} className={cls} />;
      case "jewellery": return <Gem size={20} className={cls} />;
      case "merchandise": return <Shirt size={20} className={cls} />;
      case "orders": return <BarChart3 size={20} className={cls} />;
      case "contacts": return <Mail size={20} className={cls} />;
      case "sell": return <DollarSign size={20} className={cls} />;
      case "newsletter": return <Users size={20} className={cls} />;
      case "engagement-rings": return <Gem size={20} className={cls} />;
    }
  };

  const tabLabel = (tab: TabType) => {
    const labels: Record<TabType, string> = { add: "Add Product", watches: "Watches", jewellery: "Jewellery", merchandise: "Merchandise", orders: "Orders", contacts: "Contact Inquiries", sell: "Sell Submissions", newsletter: "Newsletter", "engagement-rings": "Engagement Rings" };
    return labels[tab];
  };

  const headerTitle = () => {
    const map: Record<TabType, { icon: React.ReactNode; title: string; desc: string }> = {
      add: { icon: <Plus size={36} className="text-white" />, title: "Add New Product", desc: "Create and publish new products" },
      watches: { icon: <Crown size={36} className="text-white" />, title: "Watches Collection", desc: "Manage your watches inventory" },
      jewellery: { icon: <Gem size={36} className="text-white" />, title: "Exclusive Jewellery", desc: "Manage your jewellery inventory" },
      merchandise: { icon: <Shirt size={36} className="text-white" />, title: "Merchandise", desc: "Manage your merchandise inventory" },
      orders: { icon: <BarChart3 size={36} className="text-white" />, title: "Orders", desc: "Review recent orders and customer details" },
      contacts: { icon: <Mail size={36} className="text-white" />, title: "Contact Inquiries", desc: "Manage customer inquiries and requests" },
      sell: { icon: <DollarSign size={36} className="text-white" />, title: "Sell Submissions", desc: "Manage watch sell submissions and offers" },
      newsletter: { icon: <Users size={36} className="text-white" />, title: "Newsletter Subscribers", desc: "View collected newsletter emails" },
      "engagement-rings": { icon: <Gem size={36} className="text-white" />, title: "Engagement Rings", desc: "Manage ring images, thumbnails, and hover photos" },
    };
    return map[activeTab];
  };

  const sidebarTabs: { tab: TabType; dividerBefore?: boolean; badge?: number }[] = [
    { tab: "add" },
    { tab: "watches" },
    { tab: "jewellery" },
    { tab: "merchandise" },
    { tab: "orders", dividerBefore: true, badge: orders.length || undefined },
    { tab: "contacts", badge: contacts.filter((c: Contact) => c.status === "new").length || undefined },
    { tab: "sell", badge: sellSubmissions.filter((s: SellSubmission) => s.status === "new").length || undefined },
    { tab: "newsletter", badge: newsletters.length || undefined },
    { tab: "engagement-rings", dividerBefore: true },
  ];

  const header = headerTitle();

  return (
    <div className="bg-black text-white min-h-screen flex pt-20">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-36 bottom-0 bg-[#0a0a0a] border-r border-gray-800 transition-all duration-300 z-40 ${isSidebarCollapsed ? "w-20" : "w-64"}`}>
        <div className="flex flex-col h-full">
          <Button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="flex items-center justify-center h-16 border-b border-gray-800 hover:bg-[#0a0a0a] transition-colors rounded-none">
            {isSidebarCollapsed ? <ChevronRight size={24} className="text-white" /> : <PanelLeftClose size={24} className="text-white" />}
          </Button>
          <nav className="flex-1 py-6 overflow-y-auto">
            <div className="space-y-2 px-3">
              {sidebarTabs.map(({ tab, dividerBefore, badge }) => (
                <div key={tab}>
                  {dividerBefore && <Separator className="my-4 border-t border-gray-800" />}
                  <Button onClick={() => { setActiveTab(tab); if (["watches", "jewellery", "merchandise"].includes(tab)) setSearchQuery(""); }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all h-auto cursor-pointer [&_svg]:!size-auto ${activeTab === tab ? "bg-white text-black hover:bg-white hover:text-black" : "text-gray-400 hover:text-white bg-transparent hover:bg-transparent"}`}>
                    {tabIcon(tab)}
                    {!isSidebarCollapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span className="font-medium">{tabLabel(tab)}</span>
                        {badge !== undefined && badge > 0 && (
                          <Badge className={`text-white text-xs font-bold px-2 py-0.5 rounded-full ${tab === "contacts" || tab === "sell" ? "bg-red-500" : "bg-gray-700"}`}>
                            {badge}
                          </Badge>
                        )}
                      </div>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </nav>
          {!isSidebarCollapsed && (
            <div className="p-4 border-t border-gray-800">
              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-2">Total Products</p>
                <p className="text-2xl font-bold text-white">{products.length}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">CRM</div>
                <h1 className="text-4xl font-serif text-white mb-2 flex items-center gap-3">
                  {header.icon} {header.title}
                </h1>
                <p className="text-gray-400">{header.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 hidden md:block">Admin</span>
                <Button
                  onClick={() => signOut()}
                  className="h-auto px-4 py-2 bg-gray-900 text-gray-300 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} /> Sign Out
                </Button>
              </div>
            </div>

          {/* Stats Cards (not on add tab) */}
          {activeTab !== "add" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-white/50 transition-all">
                <div className="flex items-center justify-between mb-3"><BarChart3 className="text-white" size={24} /></div>
                <p className="text-3xl font-bold text-white mb-1">{products.length}</p>
                <p className="text-gray-400 text-sm">Total Products</p>
              </div>
              <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-800/30 rounded-xl p-6 hover:border-green-500 transition-all">
                <div className="flex items-center justify-between mb-3"><BarChart3 className="text-green-400" size={24} /></div>
                <p className="text-3xl font-bold text-green-400 mb-1">{products.filter((p) => (p.stock || 0) > 10).length}</p>
                <p className="text-gray-400 text-sm">In Stock (&gt;10)</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-900/20 to-black border border-yellow-800/30 rounded-xl p-6 hover:border-yellow-500 transition-all">
                <div className="flex items-center justify-between mb-3"><AlertTriangle className="text-yellow-400" size={24} /></div>
                <p className="text-3xl font-bold text-yellow-400 mb-1">{products.filter((p) => { const s = p.stock || 0; return s >= 1 && s <= 10; }).length}</p>
                <p className="text-gray-400 text-sm">Low Stock (1-10)</p>
              </div>
              <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-800/30 rounded-xl p-6 hover:border-red-500 transition-all">
                <div className="flex items-center justify-between mb-3"><AlertTriangle className="text-red-400" size={24} /></div>
                <p className="text-3xl font-bold text-red-400 mb-1">{products.filter((p) => (p.stock || 0) === 0).length}</p>
                <p className="text-gray-400 text-sm">Out of Stock</p>
              </div>
            </div>
          )}
          </div>

          {/* Notification */}
          {notification && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 border ${notification.type === "success" ? "bg-green-900/20 border-green-800 text-green-400" : "bg-red-900/20 border-red-800 text-red-400"}`}>
              <AlertTriangle size={20} />
              <p>{notification.text}</p>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === "add" && (
            <ProductForm formData={formData} setFormData={setFormData} imageInput={imageInput} setImageInput={setImageInput}
              uploadingImages={uploadingImages} loading={saving} handleSubmit={handleSubmit} handleInputChange={handleInputChange}
              handleImageUpload={handleImageUpload} addImage={addImage} removeImage={removeImage} moveImage={moveImage}
              generateId={generateId} isUpdate={false} />
          )}

          {/* Product Listing Tabs (watches/jewellery/merchandise) */}
          {["watches", "jewellery", "merchandise"].includes(activeTab) && (
            <div>
              {/* Search */}
              <div className="mb-6 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Input type="text" placeholder={`Search ${activeTab}... (try: "miami cuban two tone", "rose gold diamond")`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-800 text-white rounded-lg pl-4 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white border border-gray-700 hover:border-gray-600 transition-colors h-auto" />
                    {searchQuery && (
                      <Button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-0 h-auto">
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 whitespace-nowrap">
                    {searchQuery
                      ? <span className="text-white font-medium">{filteredProducts.length} of {totalInCategory} results</span>
                      : <span>{filteredProducts.length} products</span>}
                  </div>
                </div>
                {searchQuery && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <span>Smart search:</span>
                    <Badge className="bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-800/50">Multi-term priority</Badge>
                    <Badge className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded border border-blue-800/50">Relevance ranked</Badge>
                    <Badge className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded border border-purple-800/50">Exact matches first</Badge>
                  </div>
                )}
              </div>

              {/* Product Grid */}
              {loadingProducts ? (
                <div className="text-center py-20">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-white border-r-transparent mb-4" />
                  <p className="text-gray-400">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-gradient-to-b from-[#0a0a0a] to-black border border-gray-800 rounded-xl">
                  {searchQuery ? (
                    <>
                      <Search size={64} className="mx-auto text-gray-700 mb-4" />
                      <p className="text-gray-400 text-lg mb-2">No products found for &quot;{searchQuery}&quot;</p>
                      <p className="text-gray-500 text-sm mb-6">Try adjusting your search terms or clear the search to see all products</p>
                      <Button onClick={() => setSearchQuery("")} className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors inline-flex items-center gap-2 h-auto">
                        <X size={20} /> Clear Search
                      </Button>
                    </>
                  ) : (
                    <>
                      <BarChart3 size={64} className="mx-auto text-gray-700 mb-4" />
                      <p className="text-gray-400 text-lg">No products in this category yet</p>
                      <Button onClick={() => setActiveTab("add")} className="mt-6 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors inline-flex items-center gap-2 h-auto">
                        <Plus size={20} /> Add Your First Product
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const stock = product.stock || 0;
                    const stockColor = stock === 0 ? "text-red-400" : stock <= 10 ? "text-yellow-400" : "text-green-400";
                    const stockBg = stock === 0 ? "bg-red-900/20 border-red-800/30" : stock <= 10 ? "bg-yellow-900/20 border-yellow-800/30" : "bg-green-900/20 border-green-800/30";
                    return (
                      <div key={product.id} className="bg-gradient-to-br from-[#0c0c0c] to-black border border-gray-800 rounded-xl overflow-hidden hover:border-white/30 transition-all group">
                        <div className="aspect-square bg-[#0a0a0a] overflow-hidden relative">
                          <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                          {stock === 0 && (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                              <div className="text-center">
                                <AlertTriangle size={48} className="text-red-500 mx-auto mb-2" />
                                <Badge className="text-red-400 font-bold text-lg bg-transparent hover:bg-transparent">OUT OF STOCK</Badge>
                              </div>
                            </div>
                          )}
                          {product.featured && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold">FEATURED</Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="mb-3">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-lg font-medium text-white line-clamp-2 flex-1">{product.name}</h3>
                              {searchQuery && (
                                <div className="flex-shrink-0">
                                  <Badge className="bg-white/20 text-white px-2 py-1 rounded text-xs font-bold border border-white/30">MATCH</Badge>
                                </div>
                              )}
                            </div>
                            {product.brand && <p className="text-sm text-gray-400">{product.brand}</p>}
                          </div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-white font-bold text-xl">
                              {product.price > 0 ? `£${product.price.toLocaleString("en-GB")}` : "POA"}
                            </span>
                            <Badge className={`text-xs ${stockBg} ${stockColor} px-3 py-1.5 rounded-full font-medium border`}>
                              {stock === 0 ? "Out" : stock <= 10 ? `${stock} left` : "In Stock"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                            <BarChart3 size={14} /> {product.images?.length || 0} images &bull; ID: {product.id}
                          </p>
                          <div className="flex gap-2">
                            <Button onClick={() => openEditMode(product)}
                              className="flex-1 bg-white text-black px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 hover:scale-105 h-auto">
                              <Pencil size={16} /> EDIT
                            </Button>
                            <Button onClick={() => setDeleteModal({ show: true, productId: product.id, productName: product.name })}
                              className="bg-red-900/30 text-red-400 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-900/50 transition-all flex items-center justify-center border border-red-800/50 hover:scale-105 h-auto">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Orders</p>
                      <p className="text-3xl font-bold text-white">{orders.length}</p>
                    </div>
                    <BarChart3 className="text-white/50" size={40} />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-800/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Paid</p>
                      <p className="text-3xl font-bold text-green-400">{orders.filter((o) => o.status === "paid" || o.status === "delivered").length}</p>
                    </div>
                    <CheckCircle className="text-green-400/50" size={40} />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-900/20 to-black border border-yellow-800/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Pending</p>
                      <p className="text-3xl font-bold text-yellow-400">{orders.filter((o) => o.status === "pending").length}</p>
                    </div>
                    <Clock className="text-yellow-400/50" size={40} />
                  </div>
                </div>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-b from-[#0a0a0a] to-black border border-gray-800 rounded-xl">
                  <BarChart3 size={64} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-400 text-lg">No orders yet.</p>
                </div>
              ) : (
                <div className="bg-gradient-to-b from-[#0a0a0a] to-black border border-gray-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-black/50 border-b border-gray-800">
                        <tr>
                          <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-white font-medium">{order.customer_first_name} {order.customer_last_name}</p>
                              <p className="text-gray-500 text-xs">{order.customer_email}</p>
                            </td>
                            <td className="px-6 py-4 text-white font-bold font-serif">£{(order.amount || 0).toLocaleString("en-GB")}</td>
                            <td className="px-6 py-4">
                              <select value={order.status} onChange={async (e) => {
                                try {
                                  await updateOrder(order.id, { status: e.target.value as Order["status"] });
                                  await refreshOrders();
                                  setNotification({ type: "success", text: "Order status updated" });
                                } catch { setNotification({ type: "error", text: "Failed to update order" }); }
                                setTimeout(() => setNotification(null), 3000);
                              }} className="bg-[#0a0a0a] border border-gray-800 text-white rounded px-3 py-1.5 text-sm">
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="refunded">Refunded</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-sm">{new Date(order.created_at).toLocaleDateString("en-GB")}</td>
                            <td className="px-6 py-4">
                              <Button onClick={async () => {
                                if (!confirm("Delete this order?")) return;
                                try { await deleteOrder(order.id); await refreshOrders(); setNotification({ type: "success", text: "Order deleted" }); }
                                catch { setNotification({ type: "error", text: "Failed to delete order" }); }
                                setTimeout(() => setNotification(null), 3000);
                              }} className="text-red-400 hover:text-red-300 p-2 h-auto"><Trash2 size={16} /></Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === "contacts" && (() => {
            const filtered = contacts.filter((c) => {
              if (contactFilter === "all") return true;
              if (contactFilter === "general") return !c.product_name;
              if (contactFilter === "product") return !!c.product_name;
              return c.status === contactFilter;
            });
            return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <User className="text-blue-400" size={32} />
                    <span className="text-3xl font-bold text-white">{contacts.length}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Total Inquiries</p>
                </div>
                <div className="bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Mail className="text-white" size={32} />
                    <span className="text-3xl font-bold text-white">{contacts.filter((c) => c.status === "new").length}</span>
                  </div>
                  <p className="text-gray-400 text-sm">New Messages</p>
                </div>
                <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="text-green-400" size={32} />
                    <span className="text-3xl font-bold text-white">{contacts.filter((c) => c.status === "closed").length}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Closed</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["all", "general", "product", "new", "read", "contacted", "closed"].map((f) => (
                  <Button key={f} onClick={() => setContactFilter(f)}
                    className={`px-6 py-3 font-medium transition-all border-b-2 h-auto capitalize ${contactFilter === f ? "border-white text-white" : "border-transparent text-gray-400 hover:text-white"}`}>
                    {f === "all" ? `All (${contacts.length})` : f}
                  </Button>
                ))}
              </div>
              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-gradient-to-b from-[#0a0a0a] to-black border border-gray-800 rounded-xl">
                  <Mail size={64} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-400 text-lg">No inquiries found</p>
                  <p className="text-gray-500 text-sm mt-2">Customer inquiries will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((contact) => (
                    <div key={contact.id} className="bg-gradient-to-b from-[#0a0a0a] to-black border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium text-white">{contact.first_name} {contact.last_name}</h3>
                            <Badge className={`text-xs px-2 py-0.5 rounded-full ${contact.status === "new" ? "bg-white/20 text-white border border-white/30" : contact.status === "contacted" ? "bg-blue-900/30 text-blue-400 border border-blue-800/30" : contact.status === "closed" ? "bg-green-900/30 text-green-400 border border-green-800/30" : "bg-gray-800 text-gray-400 border border-gray-800"}`}>
                              {contact.status}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mb-1">{contact.email} {contact.phone && `• ${contact.phone}`}</p>
                          {contact.interest && <p className="text-white text-sm mb-2">{contact.interest}</p>}
                          {contact.product_name && (
                            <Badge className="bg-purple-900/20 text-purple-400 border border-purple-800/30 text-xs mb-2">Product: {contact.product_name}</Badge>
                          )}
                          <p className="text-gray-300 text-sm mt-2">{contact.message}</p>
                          <p className="text-gray-600 text-xs mt-3">{new Date(contact.created_at).toLocaleString("en-GB")}</p>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <select value={contact.status} onChange={async (e) => {
                            try {
                              await updateContact(contact.id, { status: e.target.value as Contact["status"] });
                              await refreshContacts();
                              setNotification({ type: "success", text: "Status updated" });
                            } catch { setNotification({ type: "error", text: "Failed to update" }); }
                            setTimeout(() => setNotification(null), 3000);
                          }} className="bg-[#0a0a0a] border border-gray-800 text-white rounded px-3 py-1.5 text-sm">
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                          <Button onClick={async () => {
                            if (!confirm("Delete this inquiry?")) return;
                            try { await deleteContact(contact.id); await refreshContacts(); setNotification({ type: "success", text: "Inquiry deleted" }); }
                            catch { setNotification({ type: "error", text: "Failed to delete" }); }
                            setTimeout(() => setNotification(null), 3000);
                          }} className="text-red-400 hover:text-red-300 p-2 h-auto border border-red-800/30 rounded"><Trash2 size={14} /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            );
          })()}

          {/* Sell Submissions Tab */}
          {activeTab === "sell" && (() => {
            const filtered = sellSubmissions.filter((s) => sellFilter === "all" ? true : s.status === sellFilter);
            return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="text-blue-400" size={32} />
                    <span className="text-3xl font-bold text-white">{sellSubmissions.length}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Total Submissions</p>
                </div>
                <div className="bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Mail className="text-white" size={32} />
                    <span className="text-3xl font-bold text-white">{sellSubmissions.filter((s) => s.status === "new").length}</span>
                  </div>
                  <p className="text-gray-400 text-sm">New Submissions</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="text-purple-400" size={32} />
                    <span className="text-3xl font-bold text-white">{sellSubmissions.filter((s) => s.status === "reviewing" || s.status === "offer-sent").length}</span>
                  </div>
                  <p className="text-gray-400 text-sm">In Progress</p>
                </div>
                <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="text-green-400" size={32} />
                    <span className="text-3xl font-bold text-white">{sellSubmissions.filter((s) => s.status === "accepted" || s.status === "completed").length}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Accepted/Completed</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {["all", "new", "reviewing", "offer-sent", "accepted", "completed", "declined"].map((f) => (
                  <Button key={f} onClick={() => setSellFilter(f)}
                    className={`px-6 py-3 font-medium transition-all border-b-2 h-auto capitalize ${sellFilter === f ? "border-white text-white" : "border-transparent text-gray-400 hover:text-white"}`}>
                    {f === "all" ? `All (${sellSubmissions.length})` : f.replace("-", " ")}
                  </Button>
                ))}
              </div>
              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-gradient-to-b from-[#0a0a0a] to-black border border-gray-800 rounded-xl">
                  <DollarSign size={64} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-400 text-lg">No sell submissions</p>
                  <p className="text-gray-500 text-sm mt-2">Submissions will appear here when customers use the sell form</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((sub) => (
                    <div key={sub.id} className="bg-gradient-to-b from-[#0a0a0a] to-black border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium text-white">{sub.full_name}</h3>
                            <Badge className={`text-xs px-2 py-0.5 rounded-full capitalize ${sub.status === "new" ? "bg-white/20 text-white border border-white/30" : sub.status === "reviewing" ? "bg-purple-900/30 text-purple-400 border border-purple-800/30" : sub.status === "offer-sent" ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800/30" : sub.status === "accepted" || sub.status === "completed" ? "bg-green-900/30 text-green-400 border border-green-800/30" : sub.status === "declined" ? "bg-red-900/30 text-red-400 border border-red-800/30" : "bg-gray-800 text-gray-400 border border-gray-800"}`}>
                              {sub.status}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{sub.email} {sub.phone && `• ${sub.phone}`}</p>
                          <div className="flex flex-wrap gap-3 mb-3">
                            {sub.brand && <Badge className="bg-gray-800 text-gray-300 border border-gray-800 text-xs">{sub.brand}</Badge>}
                            {sub.model && <Badge className="bg-gray-800 text-gray-300 border border-gray-800 text-xs">{sub.model}</Badge>}
                            {sub.reference_number && <Badge className="bg-gray-800 text-gray-300 border border-gray-800 text-xs">Ref: {sub.reference_number}</Badge>}
                            {sub.condition && <Badge className="bg-gray-800 text-gray-300 border border-gray-800 text-xs">{sub.condition}</Badge>}
                            {sub.has_box && <Badge className="bg-green-900/20 text-green-400 border border-green-800/30 text-xs">Box</Badge>}
                            {sub.has_papers && <Badge className="bg-green-900/20 text-green-400 border border-green-800/30 text-xs">Papers</Badge>}
                          </div>
                          {sub.additional_info && <p className="text-gray-300 text-sm">{sub.additional_info}</p>}
                          {sub.images && sub.images.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {sub.images.map((img, i) => (
                                <div key={i} className="w-16 h-16 relative rounded overflow-hidden border border-gray-800">
                                  <Image src={img} alt={`Item ${i+1}`} fill className="object-cover" sizes="64px" />
                                </div>
                              ))}
                            </div>
                          )}
                          {sub.offer_amount > 0 && (
                            <p className="text-white font-bold font-serif mt-3">Offer: £{sub.offer_amount.toLocaleString("en-GB")}</p>
                          )}
                          <p className="text-gray-600 text-xs mt-3">{new Date(sub.created_at).toLocaleString("en-GB")}</p>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <select value={sub.status} onChange={async (e) => {
                            try {
                              await updateSellSubmission(sub.id, { status: e.target.value as SellSubmission["status"] });
                              await refreshSellSubmissions();
                              setNotification({ type: "success", text: "Status updated" });
                            } catch { setNotification({ type: "error", text: "Failed to update" }); }
                            setTimeout(() => setNotification(null), 3000);
                          }} className="bg-[#0a0a0a] border border-gray-800 text-white rounded px-3 py-1.5 text-sm">
                            <option value="new">New</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="offer-sent">Offer Sent</option>
                            <option value="accepted">Accepted</option>
                            <option value="completed">Completed</option>
                            <option value="declined">Declined</option>
                          </select>
                          <Input type="number" placeholder="Offer £" defaultValue={sub.offer_amount || ""} onBlur={async (e) => {
                            const val = Number(e.target.value);
                            if (val === sub.offer_amount) return;
                            try {
                              await updateSellSubmission(sub.id, { offer_amount: val });
                              await refreshSellSubmissions();
                            } catch { setNotification({ type: "error", text: "Failed to update offer" }); setTimeout(() => setNotification(null), 3000); }
                          }} className="bg-[#0a0a0a] border border-gray-800 text-white rounded px-3 py-1.5 text-sm w-28 h-auto" />
                          <Button onClick={async () => {
                            if (!confirm("Delete this submission?")) return;
                            try { await deleteSellSubmission(sub.id); await refreshSellSubmissions(); setNotification({ type: "success", text: "Submission deleted" }); }
                            catch { setNotification({ type: "error", text: "Failed to delete" }); }
                            setTimeout(() => setNotification(null), 3000);
                          }} className="text-red-400 hover:text-red-300 p-2 h-auto border border-red-800/30 rounded"><Trash2 size={14} /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            );
          })()}

          {/* Newsletter Tab */}
          {activeTab === "newsletter" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Newspaper className="text-white" size={32} />
                    <span className="text-3xl font-bold text-white">{newsletters.length}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Total Subscribers</p>
                </div>
                <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="text-green-400" size={32} />
                    <span className="text-3xl font-bold text-white">{newsletters.filter(n => n.subscribed).length}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Active</p>
                </div>
                <div className="bg-gradient-to-b from-[#0a0a0a] to-black border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="text-gray-400" size={32} />
                    <Button onClick={() => refreshNewsletters()} className="text-xs font-bold tracking-widest uppercase text-white hover:text-white/80 transition-colors h-auto p-0">Refresh</Button>
                  </div>
                  <p className="text-gray-400 text-sm">Latest first</p>
                </div>
              </div>
              <div className="bg-gradient-to-b from-[#0a0a0a] to-black border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="text-xl font-serif text-white">Subscribers</h3>
                  <p className="text-gray-400 text-sm">{newsletters.length} total</p>
                </div>
                {newsletters.length === 0 ? (
                  <div className="text-center py-16">
                    <Newspaper size={64} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-400 text-lg">No subscribers yet</p>
                    <p className="text-gray-500 text-sm">Newsletter emails will appear here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-black/50 border-b border-gray-800">
                        <tr>
                          <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {newsletters.map((sub) => (
                          <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-white">{sub.email}</td>
                            <td className="px-6 py-4 text-gray-400">{sub.name || "—"}</td>
                            <td className="px-6 py-4">
                              <Badge className={`text-xs px-2 py-0.5 rounded-full ${sub.subscribed ? "bg-green-900/30 text-green-400 border border-green-800/30" : "bg-red-900/30 text-red-400 border border-red-800/30"}`}>
                                {sub.subscribed ? "Active" : "Unsubscribed"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-sm">{new Date(sub.created_at).toLocaleDateString("en-GB")}</td>
                            <td className="px-6 py-4">
                              <Button onClick={async () => {
                                if (!confirm(`Remove ${sub.email}?`)) return;
                                try { await removeSubscriber(sub.id); await refreshNewsletters(); setNotification({ type: "success", text: "Subscriber removed" }); }
                                catch { setNotification({ type: "error", text: "Failed to remove" }); }
                                setTimeout(() => setNotification(null), 3000);
                              }} className="text-red-400 hover:text-red-300 p-2 h-auto"><Trash2 size={14} /></Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Engagement Rings Tab */}
          {activeTab === "engagement-rings" && (
            <div className="space-y-6">
              <EngagementRingsTab />
            </div>
          )}
        </div>
      </main>

      {/* Edit Product Modal */}
      <Dialog open={isEditMode} onOpenChange={(open) => { if (!open) closeEditMode(); }}>
        <DialogContent className="bg-gradient-to-b from-[#0a0a0a] to-black border border-blue-500/30 rounded-2xl max-w-4xl w-full shadow-2xl shadow-blue-500/10 p-0 [&>button]:hidden">
          <DialogHeader className="p-6 border-b border-gray-800 bg-gradient-to-r from-blue-500/5 to-transparent">
            <DialogTitle className="text-3xl text-white flex items-center gap-3 font-heading">
              <Pencil size={28} className="text-white" /> Edit Product
            </DialogTitle>
            <DialogDescription className="sr-only">Edit the selected product details</DialogDescription>
            <Button onClick={closeEditMode} className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg h-auto">
              <X size={24} />
            </Button>
          </DialogHeader>
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {notification && (
              <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 border ${notification.type === "success" ? "bg-green-900/20 border-green-800 text-green-400" : "bg-red-900/20 border-red-800 text-red-400"}`}>
                <AlertTriangle size={20} />
                <p>{notification.text}</p>
              </div>
            )}
            <ProductForm formData={formData} setFormData={setFormData} imageInput={imageInput} setImageInput={setImageInput}
              uploadingImages={uploadingImages} loading={saving} handleSubmit={handleSubmit} handleInputChange={handleInputChange}
              handleImageUpload={handleImageUpload} addImage={addImage} removeImage={removeImage} moveImage={moveImage}
              generateId={generateId} isUpdate={true} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.show} onOpenChange={(open) => { if (!open) setDeleteModal({ show: false, productId: "", productName: "" }); }}>
        <DialogContent className="bg-[#0a0a0a] border border-red-800/50 rounded-2xl max-w-md w-full shadow-2xl shadow-red-900/20 p-0 [&>button]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>Confirm deletion of the selected product</DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-red-900/30 flex items-center justify-center border border-red-800">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Delete Product?</h3>
                <p className="text-gray-400 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-4 mb-6">
              <p className="text-gray-300">You&apos;re about to permanently delete:</p>
              <p className="text-white font-bold mt-2 text-lg">&quot;{deleteModal.productName}&quot;</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setDeleteModal({ show: false, productId: "", productName: "" })}
                className="flex-1 px-5 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all hover:scale-105 h-auto">
                Cancel
              </Button>
              <Button onClick={async () => {
                const pid = deleteModal.productId;
                setDeleteModal({ show: false, productId: "", productName: "" });
                try {
                  await apiDeleteProduct(pid);
                  setNotification({ type: "success", text: "Product deleted successfully!" });
                  await refreshProducts();
                } catch (err) {
                  setNotification({ type: "error", text: `Failed to delete: ${err instanceof Error ? err.message : "Unknown error"}` });
                }
                setTimeout(() => setNotification(null), 4000);
              }}
                className="flex-1 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-bold hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 hover:scale-105 h-auto">
                <Trash2 size={18} /> Delete Forever
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
