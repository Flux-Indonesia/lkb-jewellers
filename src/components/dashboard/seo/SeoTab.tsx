"use client"

import { useState, useEffect, useMemo, useRef, Fragment } from "react"
import {
  Search,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Globe,
  Eye,
  EyeOff,
  Link,
  Image as ImageIcon,
  FileText,
  X,
  CheckCircle2,
  AlertTriangle,
  SearchX,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// ─── Types ───────────────────────────────────────────────────────────────────

type ProductSeoItem = {
  id: string
  name: string
  category: string
  brand: string | null
  image: string | null
  slug: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  canonical_url: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  h1_override: string | null
  noindex: boolean
  nofollow: boolean
  image_alt_text: string | null
}

type RingSeoItem = {
  id: string
  slug: string
  name: string
  title: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  canonical_url: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  h1_override: string | null
  noindex: boolean
  nofollow: boolean
  is_active: boolean
}

type FaqItem = {
  id: string
  product_id: string
  product_type: string
  question: string
  answer: string
  sort_order: number
}

type SeoFormData = {
  meta_title: string
  meta_description: string
  meta_keywords: string
  canonical_url: string
  og_title: string
  og_description: string
  og_image: string
  h1_override: string
  noindex: boolean
  nofollow: boolean
  image_alt_text: string
}

type SectionKey = "basic" | "og" | "heading" | "indexing" | "faqs"

type SaveResult = { type: "success" | "error"; text: string }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcSeoScore(data: SeoFormData, isProduct: boolean): number {
  const fields: (keyof SeoFormData)[] = [
    "meta_title",
    "meta_description",
    "og_title",
    "og_description",
    "h1_override",
  ]
  if (isProduct) fields.push("image_alt_text")
  const filled = fields.filter(
    (f) => data[f] !== undefined && String(data[f]).trim().length > 0
  ).length
  return Math.round((filled / fields.length) * 100)
}

function buildFormFromProduct(p: ProductSeoItem): SeoFormData {
  return {
    meta_title: p.meta_title ?? "",
    meta_description: p.meta_description ?? "",
    meta_keywords: p.meta_keywords ?? "",
    canonical_url: p.canonical_url ?? "",
    og_title: p.og_title ?? "",
    og_description: p.og_description ?? "",
    og_image: p.og_image ?? "",
    h1_override: p.h1_override ?? "",
    noindex: p.noindex ?? false,
    nofollow: p.nofollow ?? false,
    image_alt_text: p.image_alt_text ?? "",
  }
}

function buildFormFromRing(r: RingSeoItem): SeoFormData {
  return {
    meta_title: r.meta_title ?? "",
    meta_description: r.meta_description ?? "",
    meta_keywords: r.meta_keywords ?? "",
    canonical_url: r.canonical_url ?? "",
    og_title: r.og_title ?? "",
    og_description: r.og_description ?? "",
    og_image: r.og_image ?? "",
    h1_override: r.h1_override ?? "",
    noindex: r.noindex ?? false,
    nofollow: r.nofollow ?? false,
    image_alt_text: "",
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreIndicator({ score }: { score: number }) {
  if (score >= 80) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
        <span className="text-[10px] text-green-400 tabular-nums">{score}%</span>
      </div>
    )
  }
  if (score >= 50) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
        <span className="text-[10px] text-yellow-400 tabular-nums">{score}%</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
      <span className="text-[10px] text-red-400 tabular-nums">{score}%</span>
    </div>
  )
}

function ToggleSwitch({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
        value
          ? "bg-red-500/30 border border-red-500/50"
          : "bg-zinc-700 border border-zinc-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
          value ? "translate-x-6 bg-red-400" : "translate-x-1 bg-zinc-400"
        }`}
      />
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

// ─── Primary SEO Component ────────────────────────────────────────────────────

interface PrimarySeoData {
  meta_title: string
  meta_title_template: string
  meta_description: string
  meta_keywords: string
  og_title: string
  og_description: string
  og_image: string
  twitter_title: string
  twitter_description: string
  twitter_image: string
  canonical_url: string
  noindex: boolean
  nofollow: boolean
}

function PrimarySeoEditor() {
  const [data, setData] = useState<PrimarySeoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null)

  useEffect(() => {
    fetch("/api/seo/primary")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setData(json.data)
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false))
  }, [])

  function updateField(field: keyof PrimarySeoData, value: string | boolean) {
    if (!data) return
    setData({ ...data, [field]: value })
    setDirty(true)
    setSaveResult(null)
  }

  async function handleSave() {
    if (!data || !dirty) return
    setSaving(true)
    try {
      const res = await fetch("/api/seo/primary", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setDirty(false)
      setSaveResult({ type: "success", text: "Saved!" })
    } catch {
      setSaveResult({ type: "error", text: "Failed to save" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3 p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4 text-red-400 text-sm flex items-center gap-2">
        <AlertTriangle size={16} />
        {error || "No data"}
      </div>
    )
  }

  const fieldRow = (
    label: string,
    field: keyof PrimarySeoData,
    opts?: { maxLen?: number; textarea?: boolean; placeholder?: string }
  ) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">{label}</label>
        {opts?.maxLen && (
          <span
            className={`text-[10px] tabular-nums ${
              String(data[field]).length > opts.maxLen
                ? "text-red-400"
                : "text-gray-500"
            }`}
          >
            {String(data[field]).length}/{opts.maxLen}
          </span>
        )}
      </div>
      {opts?.textarea ? (
        <textarea
          value={String(data[field])}
          onChange={(e) => updateField(field, e.target.value)}
          placeholder={opts?.placeholder}
          rows={3}
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-gray-500 focus:outline-none resize-none"
        />
      ) : (
        <input
          type="text"
          value={String(data[field])}
          onChange={(e) => updateField(field, e.target.value)}
          placeholder={opts?.placeholder}
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-gray-500 focus:outline-none"
        />
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm">Primary SEO — Root Website</h3>
          <p className="text-gray-500 text-xs mt-0.5">
            Metadata utama untuk https://www.lkbjewellers.com/
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveResult && (
            <span
              className={`text-xs ${
                saveResult.type === "success"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {saveResult.text}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={12} />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Basic SEO */}
      <Card className="bg-[#0a0a0a] border-gray-800">
        <CardContent className="p-5 space-y-4">
          <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Globe size={14} /> Basic SEO
          </h4>
          {fieldRow("Page Title (Meta Title)", "meta_title", { maxLen: 60 })}
          {fieldRow("Title Template (use %s for page name)", "meta_title_template", {
            placeholder: "%s | LKB Jewellers",
          })}
          {fieldRow("Meta Description", "meta_description", {
            maxLen: 160,
            textarea: true,
          })}
          {fieldRow("Meta Keywords", "meta_keywords", {
            placeholder: "keyword1, keyword2, keyword3",
          })}
          {fieldRow("Canonical URL", "canonical_url", {
            placeholder: "https://www.lkbjewellers.com",
          })}
          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <ToggleSwitch
                value={data.noindex}
                onChange={(v) => updateField("noindex", v)}
              />
              <span className="text-xs text-gray-400">Noindex</span>
            </div>
            <div className="flex items-center gap-2">
              <ToggleSwitch
                value={data.nofollow}
                onChange={(v) => updateField("nofollow", v)}
              />
              <span className="text-xs text-gray-400">Nofollow</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Graph */}
      <Card className="bg-[#0a0a0a] border-gray-800">
        <CardContent className="p-5 space-y-4">
          <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Globe size={14} /> Open Graph (Social Sharing)
          </h4>
          {fieldRow("OG Title", "og_title", { maxLen: 60 })}
          {fieldRow("OG Description", "og_description", { maxLen: 160, textarea: true })}
          {fieldRow("OG Image URL", "og_image", { placeholder: "/white-logo.png" })}
          {data.og_image && data.og_image.startsWith("http") && (
            <div className="mt-2">
              <img
                src={data.og_image}
                alt="OG preview"
                className="h-20 rounded border border-gray-700 object-cover"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Twitter */}
      <Card className="bg-[#0a0a0a] border-gray-800">
        <CardContent className="p-5 space-y-4">
          <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Globe size={14} /> Twitter Card
          </h4>
          {fieldRow("Twitter Title", "twitter_title", { maxLen: 60 })}
          {fieldRow("Twitter Description", "twitter_description", {
            maxLen: 160,
            textarea: true,
          })}
          {fieldRow("Twitter Image URL", "twitter_image", {
            placeholder: "/white-logo.png",
          })}
        </CardContent>
      </Card>

      {dirty && (
        <p className="text-yellow-500 text-xs flex items-center gap-1">
          <AlertTriangle size={12} /> Unsaved changes
        </p>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SeoTab() {
  // Sub-tab
  const [activeSubTab, setActiveSubTab] = useState<
    "primary" | "products" | "rings"
  >("primary")

  // Data
  const [products, setProducts] = useState<ProductSeoItem[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [errorProducts, setErrorProducts] = useState<string | null>(null)

  const [rings, setRings] = useState<RingSeoItem[]>([])
  const [loadingRings, setLoadingRings] = useState(true)
  const [errorRings, setErrorRings] = useState<string | null>(null)

  // Search
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Expand
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Forms keyed by product.id or ring.slug
  const [forms, setForms] = useState<Record<string, SeoFormData>>({})
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set())
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set())
  const [saveResults, setSaveResults] = useState<Record<string, SaveResult>>({})

  // Accordion sections: key = `${id}-${sectionKey}`
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())

  // FAQs
  const [faqs, setFaqs] = useState<Record<string, FaqItem[]>>({})
  const [loadingFaqs, setLoadingFaqs] = useState<Set<string>>(new Set())
  const [newFaqData, setNewFaqData] = useState<
    Record<string, { question: string; answer: string }>
  >({})
  const [addingFaq, setAddingFaq] = useState<Set<string>>(new Set())
  const [deletingFaqIds, setDeletingFaqIds] = useState<Set<string>>(new Set())

  // ── Fetch ────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetch("/api/seo?type=product")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setProducts(json.data ?? [])
      })
      .catch((err: unknown) =>
        setErrorProducts(
          err instanceof Error ? err.message : "Failed to load products"
        )
      )
      .finally(() => setLoadingProducts(false))
  }, [])

  useEffect(() => {
    fetch("/api/seo?type=ring")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setRings(json.data ?? [])
      })
      .catch((err: unknown) =>
        setErrorRings(
          err instanceof Error ? err.message : "Failed to load rings"
        )
      )
      .finally(() => setLoadingRings(false))
  }, [])

  // ── Search ───────────────────────────────────────────────────────────────

  function handleSearchChange(value: string) {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 300)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // ── Expand / Collapse row ────────────────────────────────────────────────

  function openRow(id: string, form: SeoFormData) {
    // Initialize form if not already set
    if (!forms[id]) {
      setForms((prev) => ({ ...prev, [id]: form }))
    }
    // Open "basic" section by default on first open
    const basicKey = `${id}-basic`
    setOpenSections((prev) => {
      if (prev.has(basicKey)) return prev
      return new Set([...prev, basicKey])
    })
    setExpandedId(id)
  }

  function toggleExpand(
    id: string,
    item: ProductSeoItem | RingSeoItem,
    isProduct: boolean
  ) {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    const form = isProduct
      ? buildFormFromProduct(item as ProductSeoItem)
      : buildFormFromRing(item as RingSeoItem)
    openRow(id, form)
    // Load FAQs if not yet loaded
    if (!faqs[id]) {
      loadFaqs(id, isProduct ? "product" : "ring")
    }
  }

  // ── Section accordion ────────────────────────────────────────────────────

  function toggleSection(itemId: string, section: SectionKey) {
    const key = `${itemId}-${section}`
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function isSectionOpen(itemId: string, section: SectionKey): boolean {
    return openSections.has(`${itemId}-${section}`)
  }

  // ── Form updates ─────────────────────────────────────────────────────────

  function updateForm(
    id: string,
    field: keyof SeoFormData,
    value: string | boolean
  ) {
    setForms((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
    setDirtyIds((prev) => new Set(prev).add(id))
  }

  // ── Save SEO ─────────────────────────────────────────────────────────────

  async function handleSave(id: string, isProduct: boolean) {
    const form = forms[id]
    if (!form) return

    setSavingIds((prev) => new Set(prev).add(id))
    try {
      const res = await fetch("/api/seo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: isProduct ? "product" : "ring",
          identifier: id,
          ...form,
        }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(
          (json as { error?: string }).error ?? `HTTP ${res.status}`
        )
      }
      setDirtyIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      setSaveResults((prev) => ({
        ...prev,
        [id]: { type: "success", text: "Saved" },
      }))
      // Sync local data
      if (isProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...form } : p))
        )
      } else {
        setRings((prev) =>
          prev.map((r) => (r.slug === id ? { ...r, ...form } : r))
        )
      }
    } catch (err: unknown) {
      setSaveResults((prev) => ({
        ...prev,
        [id]: {
          type: "error",
          text: err instanceof Error ? err.message : "Save failed",
        },
      }))
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      setTimeout(() => {
        setSaveResults((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
      }, 3000)
    }
  }

  // ── FAQs ─────────────────────────────────────────────────────────────────

  async function loadFaqs(id: string, productType: string) {
    setLoadingFaqs((prev) => new Set(prev).add(id))
    try {
      const res = await fetch(
        `/api/seo/faqs?product_id=${encodeURIComponent(id)}&product_type=${productType}`
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setFaqs((prev) => ({ ...prev, [id]: json.data ?? [] }))
    } catch {
      setFaqs((prev) => ({ ...prev, [id]: [] }))
    } finally {
      setLoadingFaqs((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  async function handleAddFaq(id: string, isProduct: boolean) {
    const data = newFaqData[id]
    if (!data?.question?.trim() || !data?.answer?.trim()) return

    setAddingFaq((prev) => new Set(prev).add(id))
    try {
      const res = await fetch("/api/seo/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: id,
          product_type: isProduct ? "product" : "ring",
          question: data.question.trim(),
          answer: data.answer.trim(),
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setFaqs((prev) => ({
        ...prev,
        [id]: [...(prev[id] ?? []), json.data as FaqItem],
      }))
      setNewFaqData((prev) => ({
        ...prev,
        [id]: { question: "", answer: "" },
      }))
    } catch {
      // silent — user can retry
    } finally {
      setAddingFaq((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  async function handleDeleteFaq(itemId: string, faqId: string) {
    setDeletingFaqIds((prev) => new Set(prev).add(faqId))
    try {
      const res = await fetch(
        `/api/seo/faqs?id=${encodeURIComponent(faqId)}`,
        { method: "DELETE" }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setFaqs((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] ?? []).filter((f) => f.id !== faqId),
      }))
    } catch {
      // silent
    } finally {
      setDeletingFaqIds((prev) => {
        const next = new Set(prev)
        next.delete(faqId)
        return next
      })
    }
  }

  // ── Filtered lists ────────────────────────────────────────────────────────

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          (p.slug ?? p.id).toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [products, debouncedSearch]
  )

  const filteredRings = useMemo(
    () =>
      rings.filter(
        (r) =>
          r.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          r.slug.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [rings, debouncedSearch]
  )

  // ── Stats ─────────────────────────────────────────────────────────────────

  const productStats = useMemo(() => {
    let good = 0,
      ok = 0,
      bad = 0
    for (const p of products) {
      const form = forms[p.id] ?? buildFormFromProduct(p)
      const score = calcSeoScore(form, true)
      if (score >= 80) good++
      else if (score >= 50) ok++
      else bad++
    }
    return { total: products.length, good, ok, bad }
  }, [products, forms])

  const ringStats = useMemo(() => {
    let good = 0,
      ok = 0,
      bad = 0
    for (const r of rings) {
      const form = forms[r.slug] ?? buildFormFromRing(r)
      const score = calcSeoScore(form, false)
      if (score >= 80) good++
      else if (score >= 50) ok++
      else bad++
    }
    return { total: rings.length, good, ok, bad }
  }, [rings, forms])

  // ── Render SEO Edit Panel ─────────────────────────────────────────────────

  function renderEditPanel(
    id: string,
    item: ProductSeoItem | RingSeoItem,
    isProduct: boolean,
    colSpan: number
  ) {
    const form = forms[id]
    if (!form) return null

    const saving = savingIds.has(id)
    const dirty = dirtyIds.has(id)
    const result = saveResults[id]
    const itemFaqs = faqs[id] ?? []
    const faqLoading = loadingFaqs.has(id)
    const faqEntry = newFaqData[id] ?? { question: "", answer: "" }
    const isAddingFaq = addingFaq.has(id)
    const score = calcSeoScore(form, isProduct)

    return (
      <TableRow
        key={`${id}-panel`}
        className="hover:bg-transparent border-zinc-800"
      >
        <TableCell colSpan={colSpan} className="p-0">
          <div className="border-t border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
            {/* Save bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500">SEO Score</span>
                <ScoreIndicator score={score} />
                {dirty && (
                  <Badge
                    variant="outline"
                    className="text-[10px] border-yellow-700 text-yellow-500 px-1.5 py-0 h-5"
                  >
                    unsaved changes
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {result && (
                  <span
                    className={`text-xs ${
                      result.type === "success"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {result.text}
                  </span>
                )}
                <Button
                  size="sm"
                  disabled={saving || !dirty}
                  onClick={() => handleSave(id, isProduct)}
                  className="h-7 px-3 bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 text-xs disabled:opacity-40"
                >
                  {saving ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin inline-block" />
                      Saving…
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Save className="w-3 h-3" />
                      Save
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* ── Section A: Basic SEO ─────────────────────────────────── */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(id, "basic")}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-900/80 hover:bg-zinc-900 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-300">
                    Basic SEO
                  </span>
                </div>
                {isSectionOpen(id, "basic") ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>
              {isSectionOpen(id, "basic") && (
                <div className="px-3 pb-3 pt-2 bg-zinc-950/30 space-y-3">
                  {/* Meta Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-wide">
                        Meta Title
                      </label>
                      <span
                        className={`text-[10px] tabular-nums ${
                          form.meta_title.length > 60
                            ? "text-red-400"
                            : "text-zinc-600"
                        }`}
                      >
                        {form.meta_title.length}/60
                      </span>
                    </div>
                    <Input
                      value={form.meta_title}
                      onChange={(e) =>
                        updateForm(id, "meta_title", e.target.value)
                      }
                      maxLength={80}
                      placeholder="Page title for search engines…"
                      className="h-8 text-xs bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700 focus-visible:ring-zinc-700"
                    />
                  </div>
                  {/* Meta Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-wide">
                        Meta Description
                      </label>
                      <span
                        className={`text-[10px] tabular-nums ${
                          form.meta_description.length > 160
                            ? "text-red-400"
                            : "text-zinc-600"
                        }`}
                      >
                        {form.meta_description.length}/160
                      </span>
                    </div>
                    <textarea
                      value={form.meta_description}
                      onChange={(e) =>
                        updateForm(id, "meta_description", e.target.value)
                      }
                      maxLength={200}
                      rows={2}
                      placeholder="Description shown in search results…"
                      className="w-full text-xs bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-700 rounded-md px-3 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-700"
                    />
                  </div>
                  {/* Meta Keywords */}
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">
                      Meta Keywords
                    </label>
                    <Input
                      value={form.meta_keywords}
                      onChange={(e) =>
                        updateForm(id, "meta_keywords", e.target.value)
                      }
                      placeholder="keyword1, keyword2, keyword3…"
                      className="h-8 text-xs bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700 focus-visible:ring-zinc-700"
                    />
                  </div>
                  {/* Slug (read-only for products) */}
                  {isProduct && (
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">
                        URL Slug / Product ID
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={
                            (item as ProductSeoItem).slug ??
                            (item as ProductSeoItem).id
                          }
                          readOnly
                          className="h-8 text-xs bg-zinc-900/40 border-zinc-800 text-zinc-500 cursor-not-allowed"
                        />
                        <span className="text-[10px] text-zinc-600 whitespace-nowrap shrink-0">
                          read-only
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Section B: Open Graph ─────────────────────────────────── */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(id, "og")}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-900/80 hover:bg-zinc-900 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-300">
                    Open Graph &amp; Social
                  </span>
                </div>
                {isSectionOpen(id, "og") ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>
              {isSectionOpen(id, "og") && (
                <div className="px-3 pb-3 pt-2 bg-zinc-950/30 space-y-3">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">
                      OG Title
                    </label>
                    <Input
                      value={form.og_title}
                      onChange={(e) =>
                        updateForm(id, "og_title", e.target.value)
                      }
                      placeholder="Social share title…"
                      className="h-8 text-xs bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700 focus-visible:ring-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">
                      OG Description
                    </label>
                    <textarea
                      value={form.og_description}
                      onChange={(e) =>
                        updateForm(id, "og_description", e.target.value)
                      }
                      rows={2}
                      placeholder="Social share description…"
                      className="w-full text-xs bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-700 rounded-md px-3 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">
                      OG Image URL
                    </label>
                    <Input
                      value={form.og_image}
                      onChange={(e) =>
                        updateForm(id, "og_image", e.target.value)
                      }
                      placeholder="https://…"
                      className="h-8 text-xs bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700 focus-visible:ring-zinc-700"
                    />
                    {form.og_image && (
                      <div className="mt-1.5 w-28 h-16 rounded overflow-hidden border border-zinc-800 bg-zinc-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={form.og_image}
                          alt="OG preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display =
                              "none"
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Section C: Heading & Content ─────────────────────────── */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(id, "heading")}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-900/80 hover:bg-zinc-900 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-300">
                    Heading &amp; Content
                  </span>
                </div>
                {isSectionOpen(id, "heading") ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>
              {isSectionOpen(id, "heading") && (
                <div className="px-3 pb-3 pt-2 bg-zinc-950/30 space-y-3">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">
                      H1 Override
                    </label>
                    <Input
                      value={form.h1_override}
                      onChange={(e) =>
                        updateForm(id, "h1_override", e.target.value)
                      }
                      placeholder="Override page H1 heading…"
                      className="h-8 text-xs bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700 focus-visible:ring-zinc-700"
                    />
                  </div>
                  {isProduct && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ImageIcon className="w-3 h-3 text-zinc-500" />
                        <label className="text-[10px] text-zinc-500 uppercase tracking-wide">
                          Image Alt Text
                        </label>
                      </div>
                      <Input
                        value={form.image_alt_text}
                        onChange={(e) =>
                          updateForm(id, "image_alt_text", e.target.value)
                        }
                        placeholder="Descriptive alt text for main image…"
                        className="h-8 text-xs bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700 focus-visible:ring-zinc-700"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Section D: Indexing ──────────────────────────────────── */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(id, "indexing")}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-900/80 hover:bg-zinc-900 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-300">
                    Indexing Controls
                  </span>
                </div>
                {isSectionOpen(id, "indexing") ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>
              {isSectionOpen(id, "indexing") && (
                <div className="px-3 pb-3 pt-2 bg-zinc-950/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-white">Noindex</span>
                      <p className="text-[10px] text-zinc-600">
                        Prevent search engine indexing
                      </p>
                    </div>
                    <ToggleSwitch
                      value={form.noindex}
                      onChange={(v) => updateForm(id, "noindex", v)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-white">Nofollow</span>
                      <p className="text-[10px] text-zinc-600">
                        Prevent link following
                      </p>
                    </div>
                    <ToggleSwitch
                      value={form.nofollow}
                      onChange={(v) => updateForm(id, "nofollow", v)}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Link className="w-3 h-3 text-zinc-500" />
                      <label className="text-[10px] text-zinc-500 uppercase tracking-wide">
                        Canonical URL
                      </label>
                    </div>
                    <Input
                      value={form.canonical_url}
                      onChange={(e) =>
                        updateForm(id, "canonical_url", e.target.value)
                      }
                      placeholder="https://lkbjewellers.com/…"
                      className="h-8 text-xs bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700 focus-visible:ring-zinc-700"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── Section E: FAQ Management ────────────────────────────── */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(id, "faqs")}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-900/80 hover:bg-zinc-900 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-300">
                    FAQ Management
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-zinc-700 text-zinc-500 px-1.5 py-0 h-4"
                  >
                    {itemFaqs.length}
                  </Badge>
                </div>
                {isSectionOpen(id, "faqs") ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>
              {isSectionOpen(id, "faqs") && (
                <div className="px-3 pb-3 pt-2 bg-zinc-950/30 space-y-2">
                  {faqLoading ? (
                    <div className="space-y-2 py-1">
                      <Skeleton className="h-12 bg-zinc-800/60 rounded" />
                      <Skeleton className="h-12 bg-zinc-800/60 rounded" />
                    </div>
                  ) : itemFaqs.length === 0 ? (
                    <p className="text-[10px] text-zinc-600 py-2">
                      No FAQs yet. Add one below.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {itemFaqs.map((faq) => (
                        <div
                          key={faq.id}
                          className="border border-zinc-800 rounded-md p-2.5 bg-zinc-900/50 space-y-1"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs text-white font-medium flex-1">
                              {faq.question}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={deletingFaqIds.has(faq.id)}
                              onClick={() => handleDeleteFaq(id, faq.id)}
                              className="h-5 w-5 shrink-0 text-zinc-600 hover:text-red-400 hover:bg-red-950/30"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-[10px] text-zinc-500 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* New FAQ form */}
                  <div className="border border-zinc-800 rounded-md p-2.5 bg-zinc-900/30 space-y-2 mt-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wide block">
                      Add New FAQ
                    </span>
                    <Input
                      value={faqEntry.question}
                      onChange={(e) =>
                        setNewFaqData((prev) => ({
                          ...prev,
                          [id]: { ...faqEntry, question: e.target.value },
                        }))
                      }
                      placeholder="Question…"
                      className="h-7 text-xs bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700 focus-visible:ring-zinc-700"
                    />
                    <textarea
                      value={faqEntry.answer}
                      onChange={(e) =>
                        setNewFaqData((prev) => ({
                          ...prev,
                          [id]: { ...faqEntry, answer: e.target.value },
                        }))
                      }
                      rows={2}
                      placeholder="Answer…"
                      className="w-full text-xs bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-700 rounded-md px-3 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-700"
                    />
                    <Button
                      size="sm"
                      disabled={
                        isAddingFaq ||
                        !faqEntry.question.trim() ||
                        !faqEntry.answer.trim()
                      }
                      onClick={() => handleAddFaq(id, isProduct)}
                      className="h-7 px-3 bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 text-xs disabled:opacity-40"
                    >
                      {isAddingFaq ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin inline-block" />
                          Adding…
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Plus className="w-3 h-3" />
                          Add FAQ
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────

  function renderSkeleton() {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px] bg-zinc-800 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 w-full bg-zinc-800 rounded-md" />
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-900/80">
                {["", "Name", "ID / Slug", "Meta Title", "Noindex", "Score"].map(
                  (_, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-3 w-16 bg-zinc-800" />
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 7 }).map((_, i) => (
                <TableRow key={i} className="border-zinc-800 hover:bg-transparent">
                  <TableCell>
                    <Skeleton className="h-7 w-7 bg-zinc-800/60 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36 bg-zinc-800/60 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3 w-32 bg-zinc-800/60 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3 w-28 bg-zinc-800/60 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 bg-zinc-800/60 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-10 bg-zinc-800/60 rounded" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  // ── Stats cards ───────────────────────────────────────────────────────────

  function renderStats(
    stats: { total: number; good: number; ok: number; bad: number }
  ) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-zinc-900 border-zinc-800 py-4 gap-2">
          <CardContent className="px-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Globe className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                Total
              </span>
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">
              {stats.total}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 py-4 gap-2">
          <CardContent className="px-4">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                Good ≥80%
              </span>
            </div>
            <p className="text-2xl font-bold text-green-400 tabular-nums">
              {stats.good}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 py-4 gap-2">
          <CardContent className="px-4">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                OK 50-79%
              </span>
            </div>
            <p className="text-2xl font-bold text-yellow-400 tabular-nums">
              {stats.ok}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 py-4 gap-2">
          <CardContent className="px-4">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                Poor &lt;50%
              </span>
            </div>
            <p className="text-2xl font-bold text-red-400 tabular-nums">
              {stats.bad}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Current tab state ─────────────────────────────────────────────────────

  const isLoading =
    activeSubTab === "products" ? loadingProducts : loadingRings
  const currentError =
    activeSubTab === "products" ? errorProducts : errorRings

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-zinc-400" />
        <h2 className="text-lg font-semibold text-white">SEO Settings</h2>
        <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-xs">
          {activeSubTab === "primary"
            ? "Root"
            : activeSubTab === "products"
              ? `${products.length} products`
              : `${rings.length} rings`}
        </Badge>
      </div>

      <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => {
            setActiveSubTab("primary")
            setExpandedId(null)
            handleSearchChange("")
          }}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeSubTab === "primary"
              ? "bg-white text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Primary SEO
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveSubTab("products")
            setExpandedId(null)
            handleSearchChange("")
          }}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeSubTab === "products"
              ? "bg-white text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Products
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveSubTab("rings")
            setExpandedId(null)
            handleSearchChange("")
          }}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeSubTab === "rings"
              ? "bg-white text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Engagement Rings
        </button>
      </div>

      {activeSubTab === "primary" ? (
        <PrimarySeoEditor />
      ) : isLoading ? (
        renderSkeleton()
      ) : currentError ? (
        <div className="flex items-center gap-3 p-4 bg-red-950/40 border border-red-800/50 rounded-lg text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{currentError}</span>
        </div>
      ) : (
        <>
          {/* Stats */}
          {activeSubTab === "products"
            ? renderStats(productStats)
            : renderStats(ringStats)}

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={
                  activeSubTab === "products"
                    ? "Search by name or product ID…"
                    : "Search by name or slug…"
                }
                className="pl-9 pr-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
              />
              {search && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <Badge
              variant="outline"
              className="text-zinc-400 border-zinc-700 whitespace-nowrap text-xs shrink-0"
            >
              {activeSubTab === "products"
                ? `${filteredProducts.length} of ${products.length}`
                : `${filteredRings.length} of ${rings.length}`}
            </Badge>
          </div>

          {/* ── Products table ────────────────────────────────────────── */}
          {activeSubTab === "products" &&
            (filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border border-zinc-800 rounded-lg gap-3">
                <SearchX className="w-8 h-8 text-zinc-700" />
                <p className="text-zinc-500 text-sm">
                  {debouncedSearch
                    ? `No products match "${debouncedSearch}"`
                    : "No products found"}
                </p>
                {debouncedSearch && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white"
                    onClick={() => handleSearchChange("")}
                  >
                    <X className="w-3 h-3 mr-1.5" />
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="border border-zinc-800 rounded-lg overflow-hidden max-h-[620px] overflow-y-auto">
                <table className="w-full caption-bottom text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-zinc-900">
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                      <TableHead className="w-10" />
                      <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium min-w-[160px]">
                        Name
                      </TableHead>
                      <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium min-w-[100px]">
                        Category
                      </TableHead>
                      <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium min-w-[110px]">
                        Slug / ID
                      </TableHead>
                      <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium min-w-[160px]">
                        Meta Title
                      </TableHead>
                      <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium w-24">
                        Noindex
                      </TableHead>
                      <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium w-20">
                        Score
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const isOpen = expandedId === product.id
                      const form =
                        forms[product.id] ?? buildFormFromProduct(product)
                      const score = calcSeoScore(form, true)

                      return (
                        <Fragment key={product.id}>
                          <TableRow
                            className="border-zinc-800 hover:bg-zinc-800/40 cursor-pointer"
                            onClick={() =>
                              toggleExpand(product.id, product, true)
                            }
                          >
                            <TableCell className="w-10 pl-4">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleExpand(product.id, product, true)
                                }}
                              >
                                {isOpen ? (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronRight className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="font-medium text-white text-sm">
                              {product.name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-5 border-zinc-700 text-zinc-400"
                              >
                                {product.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-zinc-500 font-mono text-xs">
                              {product.slug ?? product.id}
                            </TableCell>
                            <TableCell className="text-zinc-400 text-xs">
                              {product.meta_title ? (
                                <span className="truncate block max-w-[150px]">
                                  {product.meta_title.length > 42
                                    ? product.meta_title.slice(0, 42) + "…"
                                    : product.meta_title}
                                </span>
                              ) : (
                                <span className="text-zinc-700 italic">
                                  none
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {product.noindex ? (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 h-5 border-red-800 text-red-400 bg-red-950/20 flex items-center gap-1 w-fit"
                                >
                                  <EyeOff className="w-2.5 h-2.5" />
                                  noindex
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 h-5 border-green-800 text-green-400 bg-green-950/20 flex items-center gap-1 w-fit"
                                >
                                  <Eye className="w-2.5 h-2.5" />
                                  indexed
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <ScoreIndicator score={score} />
                            </TableCell>
                          </TableRow>

                          {isOpen &&
                            renderEditPanel(product.id, product, true, 7)}
                        </Fragment>
                      )
                    })}
                  </TableBody>
                </table>
              </div>
            ))}

          {/* ── Rings table ───────────────────────────────────────────── */}
          {activeSubTab === "rings" &&
            (filteredRings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border border-zinc-800 rounded-lg gap-3">
                <SearchX className="w-8 h-8 text-zinc-700" />
                <p className="text-zinc-500 text-sm">
                  {debouncedSearch
                    ? `No rings match "${debouncedSearch}"`
                    : "No rings found"}
                </p>
                {debouncedSearch && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white"
                    onClick={() => handleSearchChange("")}
                  >
                    <X className="w-3 h-3 mr-1.5" />
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="border border-zinc-800 rounded-lg overflow-hidden max-h-[620px] overflow-y-auto">
                <table className="w-full caption-bottom text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-zinc-900">
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                      <TableHead className="w-10" />
                      <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium min-w-[160px]">
                        Name
                      </TableHead>
                      <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium min-w-[140px]">
                        Slug
                      </TableHead>
                      <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium min-w-[160px]">
                        Meta Title
                      </TableHead>
                      <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium w-24">
                        Noindex
                      </TableHead>
                      <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium w-20">
                        Score
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRings.map((ring) => {
                      const isOpen = expandedId === ring.slug
                      const form =
                        forms[ring.slug] ?? buildFormFromRing(ring)
                      const score = calcSeoScore(form, false)

                      return (
                        <Fragment key={ring.slug}>
                          <TableRow
                            className="border-zinc-800 hover:bg-zinc-800/40 cursor-pointer"
                            onClick={() =>
                              toggleExpand(ring.slug, ring, false)
                            }
                          >
                            <TableCell className="w-10 pl-4">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleExpand(ring.slug, ring, false)
                                }}
                              >
                                {isOpen ? (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronRight className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="font-medium text-white text-sm">
                              {ring.name}
                            </TableCell>
                            <TableCell className="text-zinc-500 font-mono text-xs">
                              {ring.slug}
                            </TableCell>
                            <TableCell className="text-zinc-400 text-xs">
                              {ring.meta_title ? (
                                <span className="truncate block max-w-[150px]">
                                  {ring.meta_title.length > 42
                                    ? ring.meta_title.slice(0, 42) + "…"
                                    : ring.meta_title}
                                </span>
                              ) : (
                                <span className="text-zinc-700 italic">
                                  none
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {ring.noindex ? (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 h-5 border-red-800 text-red-400 bg-red-950/20 flex items-center gap-1 w-fit"
                                >
                                  <EyeOff className="w-2.5 h-2.5" />
                                  noindex
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 h-5 border-green-800 text-green-400 bg-green-950/20 flex items-center gap-1 w-fit"
                                >
                                  <Eye className="w-2.5 h-2.5" />
                                  indexed
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <ScoreIndicator score={score} />
                            </TableCell>
                          </TableRow>

                          {isOpen &&
                            renderEditPanel(ring.slug, ring, false, 6)}
                        </Fragment>
                      )
                    })}
                  </TableBody>
                </table>
              </div>
            ))}
        </>
      )}
    </div>
  )
}
