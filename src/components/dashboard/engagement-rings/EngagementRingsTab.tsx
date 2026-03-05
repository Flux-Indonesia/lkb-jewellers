"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown, ChevronRight, Gem, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import RingImageManager from "./RingImageManager"

type RingListItem = {
  slug: string
  name: string
  images: Record<string, string[]>
}

export default function EngagementRingsTab() {
  const [rings, setRings] = useState<RingListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/rings/list")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((json) => setRings(json.data ?? []))
      .catch((err) => setError(err.message ?? "Gagal memuat data ring"))
      .finally(() => setLoading(false))
  }, [])

  const filtered = rings.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.slug.toLowerCase().includes(search.toLowerCase())
  )

  function toggleExpand(slug: string) {
    setExpandedSlug((prev) => (prev === slug ? null : slug))
  }

  function getTotalImages(images: Record<string, string[]>): number {
    return Object.values(images).reduce((sum, arr) => sum + arr.length, 0)
  }

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
        <span className="ml-3 text-zinc-400 text-sm">Memuat daftar ring…</span>
      </div>
    )
  }

  // ─── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-950/40 border border-red-800/50 rounded-lg text-red-400 text-sm">
        <span>⚠</span>
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gem className="w-5 h-5 text-zinc-400" />
          <h2 className="text-lg font-semibold text-white">Engagement Rings</h2>
          <Badge
            variant="outline"
            className="text-zinc-400 border-zinc-700 text-xs"
          >
            {rings.length} ring
          </Badge>
        </div>
      </div>

      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan nama atau slug…"
          className="pl-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
        />
      </div>

      {/* ── Ring List ──────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-zinc-600 text-sm">
          {search ? `Tidak ada ring dengan kata kunci "${search}"` : "Belum ada data ring"}
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((ring) => {
            const isOpen = expandedSlug === ring.slug
            const totalImages = getTotalImages(ring.images)
            const colors = Object.keys(ring.images).filter(
              (c) => ring.images[c].length > 0
            )

            return (
              <div
                key={ring.slug}
                className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50"
              >
                {/* Ring row header */}
                <button
                  onClick={() => toggleExpand(ring.slug)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/60 transition-colors group"
                >
                  {/* Expand icon */}
                  <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0">
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>

                  {/* Ring info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white text-sm">
                        {ring.name}
                      </span>
                      <span className="text-zinc-600 text-xs font-mono">
                        {ring.slug}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {colors.map((c) => (
                      <Badge
                        key={c}
                        variant="outline"
                        className={`text-xs border-zinc-700 ${
                          c === "yellow"
                            ? "text-yellow-400"
                            : c === "white"
                            ? "text-zinc-300"
                            : "text-rose-400"
                        }`}
                      >
                        {c === "yellow" ? "Y" : c === "white" ? "W" : "R"}{" "}
                        {ring.images[c]?.length ?? 0}
                      </Badge>
                    ))}
                    <Badge
                      variant="outline"
                      className="text-xs border-zinc-700 text-zinc-400"
                    >
                      {totalImages} foto
                    </Badge>
                  </div>
                </button>

                {/* Expanded: RingImageManager */}
                {isOpen && (
                  <div className="border-t border-zinc-800">
                    <RingImageManager slug={ring.slug} name={ring.name} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
