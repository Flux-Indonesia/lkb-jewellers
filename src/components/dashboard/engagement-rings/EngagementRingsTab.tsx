"use client"

import { useState, useEffect, useMemo, useCallback, useRef, Fragment } from "react"
import {
  Search,
  Gem,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Layers,
  X,
  SearchX,
  Pencil,
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
import RingImageManager from "./RingImageManager"
import RingEditForm from "./RingEditForm"

type RingListItem = {
  slug: string
  name: string
  images: Record<string, string[]>
}

type ColorPref = {
  thumbnail_url: string | null
  hover_url: string | null
}

type AllPreferences = Record<string, Record<string, ColorPref>>

export default function EngagementRingsTab() {
  const [rings, setRings] = useState<RingListItem[]>([])
  const [allPreferences, setAllPreferences] = useState<AllPreferences>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/rings/list"),
      fetch("/api/rings/preferences"),
    ])
      .then(async ([listRes, prefsRes]) => {
        if (!listRes.ok) throw new Error(`HTTP ${listRes.status}`)
        const listJson = await listRes.json()
        setRings(listJson.data ?? [])
        if (prefsRes.ok) {
          const prefsJson = await prefsRes.json()
          setAllPreferences(prefsJson.data ?? {})
        }
      })
      .catch((err) => setError(err.message ?? "Failed to load ring data"))
      .finally(() => setLoading(false))
  }, [])

  const ringHasPreferences = useCallback(
    (slug: string): boolean => {
      const ringPrefs = allPreferences[slug]
      if (!ringPrefs) return false
      return Object.values(ringPrefs).some(
        (pref) => pref.thumbnail_url !== null || pref.hover_url !== null
      )
    },
    [allPreferences]
  )

  function getTotalImages(images: Record<string, string[]>): number {
    return Object.values(images).reduce((sum, arr) => sum + arr.length, 0)
  }

  function toggleExpand(slug: string) {
    setExpandedSlug((prev) => (prev === slug ? null : slug))
  }

  const [debouncedSearch, setDebouncedSearch] = useState("")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const filtered = useMemo(
    () =>
      rings.filter(
        (r) =>
          r.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          r.slug.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [rings, debouncedSearch]
  )

  const { totalRings, ringsWithPrefs, ringsMissingPrefs, grandTotalImages } =
    useMemo(() => {
      const total = rings.length
      const withPrefs = rings.filter((r) => ringHasPreferences(r.slug)).length
      return {
        totalRings: total,
        ringsWithPrefs: withPrefs,
        ringsMissingPrefs: total - withPrefs,
        grandTotalImages: rings.reduce(
          (sum, r) => sum + getTotalImages(r.images),
          0
        ),
      }
    }, [rings, ringHasPreferences])

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Gem className="w-5 h-5 text-zinc-700" />
          <Skeleton className="h-6 w-48 bg-zinc-800" />
        </div>

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
                <TableHead className="w-10" />
                {["Name", "Slug", "Colors", "Photos", "Status"].map((col) => (
                  <TableHead key={col}>
                    <Skeleton className="h-3 w-16 bg-zinc-800" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="border-zinc-800 hover:bg-transparent">
                  <TableCell className="w-10 pl-4">
                    <Skeleton className="h-7 w-7 bg-zinc-800/60 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36 bg-zinc-800/60 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3 w-44 bg-zinc-800/60 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <Skeleton className="h-5 w-10 bg-zinc-800/60 rounded" />
                      <Skeleton className="h-5 w-10 bg-zinc-800/60 rounded" />
                      <Skeleton className="h-5 w-10 bg-zinc-800/60 rounded" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8 bg-zinc-800/60 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 bg-zinc-800/60 rounded" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-950/40 border border-red-800/50 rounded-lg text-red-400 text-sm">
        <span>⚠</span>
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Gem className="w-5 h-5 text-zinc-400" />
        <h2 className="text-lg font-semibold text-white">Engagement Rings</h2>
        <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-xs">
          {rings.length} {rings.length === 1 ? "ring" : "rings"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-zinc-900 border-zinc-800 py-4 gap-2">
          <CardContent className="px-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Layers className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                Total Rings
              </span>
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">{totalRings}</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 py-4 gap-2">
          <CardContent className="px-4">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                With Prefs
              </span>
            </div>
            <p className="text-2xl font-bold text-green-400 tabular-nums">{ringsWithPrefs}</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 py-4 gap-2">
          <CardContent className="px-4">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                No Prefs
              </span>
            </div>
            <p className="text-2xl font-bold text-yellow-400 tabular-nums">{ringsMissingPrefs}</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 py-4 gap-2">
          <CardContent className="px-4">
            <div className="flex items-center gap-1.5 mb-2">
              <ImageIcon className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                Total Images
              </span>
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">
              {grandTotalImages.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name or slug…"
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
          {filtered.length} of {rings.length}
        </Badge>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-zinc-800 rounded-lg gap-3">
          <SearchX className="w-8 h-8 text-zinc-700" />
          <p className="text-zinc-500 text-sm">
            {debouncedSearch
              ? `No rings match "${debouncedSearch}"`
              : "No ring data available"}
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
        <div className="border border-zinc-800 rounded-lg overflow-hidden h-[600px] overflow-y-auto">
            <table className="w-full caption-bottom text-sm">
              <TableHeader className="sticky top-0 z-10 bg-zinc-900">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="w-10" />
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium min-w-[180px]">
                    Name
                  </TableHead>
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium min-w-[160px]">
                    Slug
                  </TableHead>
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium">
                    Colors
                  </TableHead>
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium w-20">
                    Photos
                  </TableHead>
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium w-16">
                    Edit
                  </TableHead>
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wide font-medium w-28">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((ring) => {
                  const isOpen = expandedSlug === ring.slug
                  const colors = Object.keys(ring.images).filter(
                    (c) => ring.images[c].length > 0
                  )
                  const total = getTotalImages(ring.images)
                  const hasPrefs = ringHasPreferences(ring.slug)

                  return (
                    <Fragment key={ring.slug}>
                      <TableRow
                        className="border-zinc-800 hover:bg-zinc-800/40 cursor-pointer"
                        onClick={() => toggleExpand(ring.slug)}
                      >
                        <TableCell className="w-10 pl-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleExpand(ring.slug)
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

                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {colors.map((c) => (
                              <Badge
                                key={c}
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 h-5 border-zinc-700 ${
                                  c === "yellow"
                                    ? "text-yellow-400"
                                    : c === "white"
                                    ? "text-zinc-200"
                                    : "text-rose-400"
                                }`}
                              >
                                {c === "yellow" ? "Y" : c === "white" ? "W" : "R"}{" "}
                                {ring.images[c]?.length ?? 0}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>

                        <TableCell className="text-zinc-400 text-sm tabular-nums">
                          {total}
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-zinc-800"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingSlug(editingSlug === ring.slug ? null : ring.slug)
                              if (expandedSlug !== ring.slug) setExpandedSlug(ring.slug)
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>

                        <TableCell>
                          {hasPrefs ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-5 border-green-800 text-green-400 bg-green-950/20"
                            >
                              ✓ prefs
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-5 border-yellow-800 text-yellow-600 bg-yellow-950/20"
                            >
                              ⚠ no prefs
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>

                      {isOpen && (
                        <TableRow
                          key={`${ring.slug}-expanded`}
                          className="hover:bg-transparent border-zinc-800"
                        >
                          <TableCell colSpan={8} className="p-0">
                            <div className="border-t border-zinc-800 bg-zinc-950/50">
                              <RingImageManager
                                slug={ring.slug}
                                name={ring.name}
                              />
                              {editingSlug === ring.slug && (
                                <div className="border-t border-zinc-800">
                                  <RingEditForm
                                    slug={ring.slug}
                                    onClose={() => setEditingSlug(null)}
                                  />
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  )
                })}
              </TableBody>
            </table>
        </div>
      )}
    </div>
  )
}
