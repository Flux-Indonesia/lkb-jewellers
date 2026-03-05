"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Trash2, Star, Eye, Loader2, CheckCircle, AlertCircle, Save } from "lucide-react"

// ─── Types ─────────────────────────────────────────────────────────────────────

type ColorKey = "yellow" | "white" | "rose"

const COLORS: { key: ColorKey; label: string; accent: string; badgeClass: string }[] = [
  {
    key: "yellow",
    label: "Yellow Gold",
    accent: "text-yellow-400",
    badgeClass: "border-yellow-700 text-yellow-400 bg-yellow-950/30",
  },
  {
    key: "white",
    label: "White Gold",
    accent: "text-zinc-200",
    badgeClass: "border-zinc-500 text-zinc-200 bg-zinc-800/50",
  },
  {
    key: "rose",
    label: "Rose Gold",
    accent: "text-rose-400",
    badgeClass: "border-rose-700 text-rose-400 bg-rose-950/30",
  },
]

type ColorPref = {
  thumbnail_url: string | null
  hover_url: string | null
}

type Preferences = Record<ColorKey, ColorPref>

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Dari public URL supabase, ekstrak path relatif storage:
 * misal: https://xxx.supabase.co/storage/v1/object/public/engagement-rings/rings/allison/yellow_1.jpg
 * → rings/allison/yellow_1.jpg
 */
function extractStoragePath(url: string): string {
  const match = url.match(/\/engagement-rings\/(.+?)(?:\?.*)?$/)
  return match ? match[1] : ""
}

const DEFAULT_PREFS: Preferences = {
  yellow: { thumbnail_url: null, hover_url: null },
  white: { thumbnail_url: null, hover_url: null },
  rose: { thumbnail_url: null, hover_url: null },
}

// ─── Component ────────────────────────────────────────────────────────────────

interface RingImageManagerProps {
  slug: string
  name: string
}

export default function RingImageManager({ slug, name }: RingImageManagerProps) {
  const [images, setImages] = useState<Record<ColorKey, string[]>>({
    yellow: [],
    white: [],
    rose: [],
  })
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS)
  const [activeColor, setActiveColor] = useState<ColorKey>("yellow")
  const [loadingData, setLoadingData] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Per-color upload/save state
  const [uploading, setUploading] = useState(false)
  const [savingColor, setSavingColor] = useState<ColorKey | null>(null)
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null)

  // Feedback per color — { yellow: 'saved' | 'error' | null }
  const [feedback, setFeedback] = useState<Record<ColorKey, "saved" | "error" | null>>({
    yellow: null,
    white: null,
    rose: null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Fetch images + prefs ──────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoadingData(true)
    setLoadError(null)
    try {
      const [listRes, prefsRes] = await Promise.all([
        fetch("/api/rings/list"),
        fetch(`/api/rings/preferences?slug=${encodeURIComponent(slug)}`),
      ])

      if (!listRes.ok) throw new Error(`List API gagal: HTTP ${listRes.status}`)
      if (!prefsRes.ok) throw new Error(`Preferences API gagal: HTTP ${prefsRes.status}`)

      const listJson = await listRes.json()
      const prefsJson = await prefsRes.json()

      // List: filter by slug
      const ringData = (listJson.data ?? []).find(
        (r: { slug: string }) => r.slug === slug
      )
      const rawImages: Record<string, string[]> = ringData?.images ?? {}

      setImages({
        yellow: rawImages.yellow ?? [],
        white: rawImages.white ?? [],
        rose: rawImages.rose ?? [],
      })

      // Prefs: { [color]: { thumbnail_url, hover_url } }
      const rawPrefs: Record<string, ColorPref> = prefsJson.data ?? {}
      setPrefs({
        yellow: rawPrefs.yellow ?? { thumbnail_url: null, hover_url: null },
        white: rawPrefs.white ?? { thumbnail_url: null, hover_url: null },
        rose: rawPrefs.rose ?? { thumbnail_url: null, hover_url: null },
      })
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Gagal memuat data")
    } finally {
      setLoadingData(false)
    }
  }, [slug])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ── Set thumbnail / hover (local state only) ──────────────────────────────
  function setThumbnail(color: ColorKey, url: string) {
    setPrefs((prev) => ({
      ...prev,
      [color]: {
        ...prev[color],
        thumbnail_url: prev[color].thumbnail_url === url ? null : url,
      },
    }))
  }

  function setHover(color: ColorKey, url: string) {
    setPrefs((prev) => ({
      ...prev,
      [color]: {
        ...prev[color],
        hover_url: prev[color].hover_url === url ? null : url,
      },
    }))
  }

  // ── Save prefs ke API ─────────────────────────────────────────────────────
  async function savePrefs(color: ColorKey) {
    setSavingColor(color)
    setFeedback((prev) => ({ ...prev, [color]: null }))
    try {
      const res = await fetch("/api/rings/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          color,
          thumbnail_url: prefs[color].thumbnail_url,
          hover_url: prefs[color].hover_url,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }
      setFeedback((prev) => ({ ...prev, [color]: "saved" }))
      setTimeout(() => setFeedback((prev) => ({ ...prev, [color]: null })), 2500)
    } catch (err) {
      setFeedback((prev) => ({ ...prev, [color]: "error" }))
      setTimeout(() => setFeedback((prev) => ({ ...prev, [color]: null })), 3000)
      console.error("Save prefs error:", err)
    } finally {
      setSavingColor(null)
    }
  }

  // ── Upload image ──────────────────────────────────────────────────────────
  async function uploadImage(file: File) {
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("slug", slug)
      fd.append("color", activeColor)

      const res = await fetch("/api/rings/images", {
        method: "POST",
        body: fd,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }
      const json = await res.json()
      const newUrl: string = json.url
      setImages((prev) => ({
        ...prev,
        [activeColor]: [...prev[activeColor], newUrl],
      }))
    } catch (err) {
      console.error("Upload error:", err)
      alert(`Upload gagal: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setUploading(false)
      // Reset file input agar bisa upload file yg sama lagi
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // ── Delete image ──────────────────────────────────────────────────────────
  async function deleteImage(url: string) {
    const path = extractStoragePath(url)
    if (!path) {
      alert("Tidak dapat menentukan path file.")
      return
    }
    if (!confirm(`Hapus foto ini?\n${path}`)) return

    setDeletingUrl(url)
    try {
      const res = await fetch(`/api/rings/images?path=${encodeURIComponent(path)}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }

      // Hapus dari local state
      setImages((prev) => ({
        ...prev,
        [activeColor]: prev[activeColor].filter((u) => u !== url),
      }))

      // Hapus dari prefs jika sedang dipakai
      setPrefs((prev) => ({
        ...prev,
        [activeColor]: {
          thumbnail_url: prev[activeColor].thumbnail_url === url ? null : prev[activeColor].thumbnail_url,
          hover_url: prev[activeColor].hover_url === url ? null : prev[activeColor].hover_url,
        },
      }))
    } catch (err) {
      console.error("Delete error:", err)
      alert(`Hapus gagal: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setDeletingUrl(null)
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-8 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
        <span className="text-zinc-500 text-sm">Memuat data {name}…</span>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex items-center gap-2 p-4 text-red-400 text-sm">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{loadError}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          className="ml-auto border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          Coba Lagi
        </Button>
      </div>
    )
  }

  const currentImages = images[activeColor]
  const currentPrefs = prefs[activeColor]

  return (
    <div className="p-4 space-y-4">
      {/* ── Color tabs ─────────────────────────────────────────────────────── */}
      <div className="flex gap-1 border-b border-zinc-800 pb-0">
        {COLORS.map(({ key, label, accent }) => {
          const count = images[key].length
          const isActive = activeColor === key
          return (
            <button
              key={key}
              onClick={() => setActiveColor(key)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                isActive
                  ? `${accent} border-current`
                  : "text-zinc-500 border-transparent hover:text-zinc-300"
              }`}
            >
              {label}
              <span
                className={`ml-1.5 text-xs font-normal ${
                  isActive ? "opacity-80" : "text-zinc-600"
                }`}
              >
                ({count})
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Preference badges ───────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 items-center text-xs text-zinc-500">
        <span>Saat ini:</span>
        {currentPrefs.thumbnail_url ? (
          <Badge variant="outline" className="border-yellow-700 text-yellow-400 bg-yellow-950/20 text-xs gap-1">
            <Star className="w-3 h-3" />
            Thumbnail aktif
          </Badge>
        ) : (
          <Badge variant="outline" className="border-zinc-800 text-zinc-600 text-xs">
            Belum ada thumbnail
          </Badge>
        )}
        {currentPrefs.hover_url ? (
          <Badge variant="outline" className="border-sky-700 text-sky-400 bg-sky-950/20 text-xs gap-1">
            <Eye className="w-3 h-3" />
            Hover aktif
          </Badge>
        ) : (
          <Badge variant="outline" className="border-zinc-800 text-zinc-600 text-xs">
            Belum ada hover
          </Badge>
        )}
      </div>

      {/* ── Image grid ─────────────────────────────────────────────────────── */}
      {currentImages.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-lg py-10 text-center text-zinc-600 text-sm">
          Belum ada foto untuk{" "}
          {COLORS.find((c) => c.key === activeColor)?.label}.
          <br />
          Upload foto di bawah.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {currentImages.map((url) => {
            const isThumbnail = currentPrefs.thumbnail_url === url
            const isHover = currentPrefs.hover_url === url
            const isDeleting = deletingUrl === url

            return (
              <div
                key={url}
                className={`relative group rounded-lg overflow-hidden border transition-colors ${
                  isThumbnail
                    ? "border-yellow-600"
                    : isHover
                    ? "border-sky-600"
                    : "border-zinc-800"
                } bg-zinc-900`}
              >
                {/* Image */}
                <div className="relative aspect-square w-full">
                  <Image
                    src={url}
                    alt="Ring photo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    unoptimized
                  />

                  {/* Overlay saat deleting */}
                  {isDeleting && (
                    <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
                    </div>
                  )}
                </div>

                {/* Assigned badges */}
                <div className="absolute top-1 left-1 flex flex-col gap-1">
                  {isThumbnail && (
                    <span className="flex items-center gap-0.5 bg-yellow-600/90 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                      <Star className="w-2.5 h-2.5" /> TN
                    </span>
                  )}
                  {isHover && (
                    <span className="flex items-center gap-0.5 bg-sky-600/90 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                      <Eye className="w-2.5 h-2.5" /> HV
                    </span>
                  )}
                </div>

                {/* Action buttons — show on hover */}
                <div className="absolute inset-0 flex flex-col justify-end p-1 gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setThumbnail(activeColor, url)}
                    disabled={isDeleting}
                    className={`h-6 text-[10px] px-1.5 w-full justify-start gap-1 ${
                      isThumbnail
                        ? "bg-yellow-600 border-yellow-600 text-white hover:bg-yellow-700"
                        : "bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    <Star className="w-3 h-3 flex-shrink-0" />
                    {isThumbnail ? "Unset TN" : "Set Thumbnail"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setHover(activeColor, url)}
                    disabled={isDeleting}
                    className={`h-6 text-[10px] px-1.5 w-full justify-start gap-1 ${
                      isHover
                        ? "bg-sky-600 border-sky-600 text-white hover:bg-sky-700"
                        : "bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    <Eye className="w-3 h-3 flex-shrink-0" />
                    {isHover ? "Unset HV" : "Set Hover"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteImage(url)}
                    disabled={isDeleting}
                    className="h-6 text-[10px] px-1.5 w-full justify-start gap-1 bg-red-950/60 border-red-900 text-red-400 hover:bg-red-900 hover:text-white"
                  >
                    <Trash2 className="w-3 h-3 flex-shrink-0" />
                    Hapus
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Footer: Upload + Save ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-800">
        {/* Upload button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) uploadImage(file)
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-2"
          >
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            {uploading ? "Mengupload…" : "Upload Foto"}
          </Button>
        </div>

        {/* Save preferences */}
        <Button
          size="sm"
          onClick={() => savePrefs(activeColor)}
          disabled={savingColor === activeColor}
          className="bg-zinc-100 text-zinc-900 hover:bg-white gap-2"
        >
          {savingColor === activeColor ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {savingColor === activeColor ? "Menyimpan…" : "Simpan Preferensi"}
        </Button>

        {/* Feedback indicator */}
        {feedback[activeColor] === "saved" && (
          <span className="flex items-center gap-1 text-emerald-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            Tersimpan
          </span>
        )}
        {feedback[activeColor] === "error" && (
          <span className="flex items-center gap-1 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            Gagal menyimpan
          </span>
        )}
      </div>
    </div>
  )
}
