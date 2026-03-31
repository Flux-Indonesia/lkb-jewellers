"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Upload,
  Trash2,
  Star,
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle,
  Save,
  ChevronUp,
  ChevronDown,
  X,
  ImagePlus,
} from "lucide-react"

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

type PendingFile = {
  file: File
  preview: string
  id: string
  status: "pending" | "uploading" | "done" | "error"
  errorMsg?: string
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 5 * 1024 * 1024

function extractStoragePath(url: string): string {
  const match = url.match(/\/engagement-rings\/(.+?)(?:\?.*)?$/)
  return match ? match[1] : ""
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, or WebP images are allowed"
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large (${formatBytes(file.size)}). Max 5 MB`
  }
  return null
}

function uploadWithProgress(
  fd: FormData,
  onProgress: (p: number) => void,
): Promise<{ url: string; path: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/rings/images")
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch {
          reject(new Error("Invalid server response"))
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText)
          reject(new Error(err.error ?? `HTTP ${xhr.status}`))
        } catch {
          reject(new Error(`HTTP ${xhr.status}`))
        }
      }
    }
    xhr.onerror = () => reject(new Error("Network error"))
    xhr.send(fd)
  })
}

const DEFAULT_PREFS: Preferences = {
  yellow: { thumbnail_url: null, hover_url: null },
  white: { thumbnail_url: null, hover_url: null },
  rose: { thumbnail_url: null, hover_url: null },
}

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

  const [savingColor, setSavingColor] = useState<ColorKey | null>(null)
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Record<ColorKey, "saved" | "error" | null>>({
    yellow: null,
    white: null,
    rose: null,
  })

  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [uploadTotal, setUploadTotal] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadErrors, setUploadErrors] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async () => {
    setLoadingData(true)
    setLoadError(null)
    try {
      const [listRes, prefsRes] = await Promise.all([
        fetch("/api/rings/list"),
        fetch(`/api/rings/preferences?slug=${encodeURIComponent(slug)}`),
      ])

      if (!listRes.ok) throw new Error(`List API failed: HTTP ${listRes.status}`)
      if (!prefsRes.ok) throw new Error(`Preferences API failed: HTTP ${prefsRes.status}`)

      const listJson = await listRes.json()
      const prefsJson = await prefsRes.json()

      const ringData = (listJson.data ?? []).find((r: { slug: string }) => r.slug === slug)
      const rawImages: Record<string, string[]> = ringData?.images ?? {}

      setImages({
        yellow: rawImages.yellow ?? [],
        white: rawImages.white ?? [],
        rose: rawImages.rose ?? [],
      })

      const rawPrefs: Record<string, ColorPref> = prefsJson.data ?? {}
      setPrefs({
        yellow: rawPrefs.yellow ?? { thumbnail_url: null, hover_url: null },
        white: rawPrefs.white ?? { thumbnail_url: null, hover_url: null },
        rose: rawPrefs.rose ?? { thumbnail_url: null, hover_url: null },
      })
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoadingData(false)
    }
  }, [slug])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

  function moveImage(color: ColorKey, fromIndex: number, direction: "up" | "down") {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1
    setImages((prev) => {
      const arr = [...prev[color]]
      const [item] = arr.splice(fromIndex, 1)
      arr.splice(toIndex, 0, item)
      return { ...prev, [color]: arr }
    })
  }

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
      toast.success("Preferences saved!")
      setFeedback((prev) => ({ ...prev, [color]: "saved" }))
      setTimeout(() => setFeedback((prev) => ({ ...prev, [color]: null })), 2500)
    } catch (err) {
      toast.error("Failed to save preferences")
      setFeedback((prev) => ({ ...prev, [color]: "error" }))
      setTimeout(() => setFeedback((prev) => ({ ...prev, [color]: null })), 3000)
      console.error("Save prefs error:", err)
    } finally {
      setSavingColor(null)
    }
  }

  async function deleteImage(url: string) {
    const path = extractStoragePath(url)
    if (!path) {
      toast.error("Unable to determine file path.")
      return
    }

    setDeletingUrl(url)
    try {
      const res = await fetch(`/api/rings/images?path=${encodeURIComponent(path)}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }

      setImages((prev) => ({
        ...prev,
        [activeColor]: prev[activeColor].filter((u) => u !== url),
      }))

      setPrefs((prev) => ({
        ...prev,
        [activeColor]: {
          thumbnail_url: prev[activeColor].thumbnail_url === url ? null : prev[activeColor].thumbnail_url,
          hover_url: prev[activeColor].hover_url === url ? null : prev[activeColor].hover_url,
        },
      }))
    } catch (err) {
      console.error("Delete error:", err)
      toast.error(`Delete failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setDeletingUrl(null)
    }
  }

  function processFiles(rawFiles: FileList | File[]) {
    const files = Array.from(rawFiles)
    const errors: string[] = []
    const valid: PendingFile[] = []

    for (const file of files) {
      const err = validateFile(file)
      if (err) {
        errors.push(`${file.name}: ${err}`)
      } else {
        valid.push({
          file,
          preview: URL.createObjectURL(file),
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          status: "pending",
        })
      }
    }

    setUploadErrors(errors)
    if (valid.length > 0) setPendingFiles((prev) => [...prev, ...valid])
  }

  function removePending(id: string) {
    setPendingFiles((prev) => {
      const target = prev.find((f) => f.id === id)
      if (target) URL.revokeObjectURL(target.preview)
      return prev.filter((f) => f.id !== id)
    })
  }

  function cancelAll() {
    pendingFiles.forEach((f) => URL.revokeObjectURL(f.preview))
    setPendingFiles([])
    setUploadErrors([])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function uploadAllPending() {
    const toUpload = pendingFiles.filter((f) => f.status === "pending")
    if (toUpload.length === 0 || isUploading) return

    setIsUploading(true)
    setUploadTotal(toUpload.length)
    setUploadErrors([])

    for (let i = 0; i < toUpload.length; i++) {
      const pf = toUpload[i]
      setUploadingIndex(i)
      setUploadProgress(0)

      setPendingFiles((prev) =>
        prev.map((f) => (f.id === pf.id ? { ...f, status: "uploading" } : f)),
      )

      try {
        const fd = new FormData()
        fd.append("file", pf.file)
        fd.append("slug", slug)
        fd.append("color", activeColor)

        const result = await uploadWithProgress(fd, setUploadProgress)

        setImages((prev) => ({
          ...prev,
          [activeColor]: [...prev[activeColor], result.url],
        }))

        URL.revokeObjectURL(pf.preview)
        setPendingFiles((prev) =>
          prev.map((f) => (f.id === pf.id ? { ...f, status: "done" } : f)),
        )
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setPendingFiles((prev) =>
          prev.map((f) => (f.id === pf.id ? { ...f, status: "error", errorMsg: msg } : f)),
        )
      }
    }

    setIsUploading(false)
    setUploadingIndex(null)
    setUploadProgress(0)
    setUploadTotal(0)

    setTimeout(() => {
      setPendingFiles((prev) => prev.filter((f) => f.status === "error"))
      if (fileInputRef.current) fileInputRef.current.value = ""
    }, 800)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files)
  }

  if (loadingData) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex gap-2 border-b border-zinc-800 pb-2">
          <Skeleton className="h-8 w-28 bg-zinc-800" />
          <Skeleton className="h-8 w-24 bg-zinc-800" />
          <Skeleton className="h-8 w-24 bg-zinc-800" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-28 bg-zinc-800 rounded-full" />
          <Skeleton className="h-5 w-24 bg-zinc-800 rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full bg-zinc-800 rounded-lg" />
          ))}
        </div>
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
          Try Again
        </Button>
      </div>
    )
  }

  const currentImages = images[activeColor]
  const currentPrefs = prefs[activeColor]
  const pendingCount = pendingFiles.filter((f) => f.status === "pending").length

  return (
    <div className="p-4 space-y-4">
      <Tabs value={activeColor} onValueChange={(v) => setActiveColor(v as ColorKey)}>
        <TabsList variant="line" className="bg-transparent border-b border-zinc-800 w-full justify-start">
          {COLORS.map(({ key, label, accent }) => (
            <TabsTrigger
              key={key}
              value={key}
              className={`text-sm ${activeColor === key ? accent : "text-zinc-500"}`}
            >
              {label}
              <span className="ml-1.5 text-xs font-normal opacity-80">({images[key].length})</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-2 items-center text-xs text-zinc-500">
        <span>Current:</span>
        {currentPrefs.thumbnail_url ? (
          <Badge
            variant="outline"
            className="border-yellow-700 text-yellow-400 bg-yellow-950/20 text-xs gap-1"
          >
            <Star className="w-3 h-3" />
            Thumbnail set
          </Badge>
        ) : (
          <Badge variant="outline" className="border-zinc-800 text-zinc-600 text-xs">
            No thumbnail set
          </Badge>
        )}
        {currentPrefs.hover_url ? (
          <Badge
            variant="outline"
            className="border-sky-700 text-sky-400 bg-sky-950/20 text-xs gap-1"
          >
            <Eye className="w-3 h-3" />
            Hover set
          </Badge>
        ) : (
          <Badge variant="outline" className="border-zinc-800 text-zinc-600 text-xs">
            No hover set
          </Badge>
        )}
      </div>

      {currentImages.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-lg py-10 text-center text-zinc-600 text-sm">
          No photos for {COLORS.find((c) => c.key === activeColor)?.label}.
          <br />
          Upload photos below.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {currentImages.map((url, index) => {
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
                <div className="relative aspect-square w-full">
                  <Image
                    src={url}
                    alt="Ring photo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    unoptimized
                  />
                  {isDeleting && (
                    <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
                    </div>
                  )}
                </div>

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

                <div className="absolute top-1 right-1 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => moveImage(activeColor, index, "up")}
                    disabled={index === 0}
                    className="h-5 w-5 bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-25"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => moveImage(activeColor, index, "down")}
                    disabled={index === currentImages.length - 1}
                    className="h-5 w-5 bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-25"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </div>

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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isDeleting}
                        className="h-6 text-[10px] px-1.5 w-full justify-start gap-1 bg-red-950/60 border-red-900 text-red-400 hover:bg-red-900 hover:text-white"
                      >
                        <Trash2 className="w-3 h-3 flex-shrink-0" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Photo?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                          Foto ini akan dihapus permanen dari storage. Tindakan ini tidak dapat
                          dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-700 text-zinc-300 bg-transparent hover:bg-zinc-800">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteImage(url)}
                          className="bg-red-900 hover:bg-red-800 text-white border-0"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="pt-2 border-t border-zinc-800 space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) processFiles(e.target.files)
          }}
        />

        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 select-none ${
            isDragging
              ? "border-zinc-400 bg-zinc-800/60 scale-[1.01]"
              : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/20"
          } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
        >
          <div className="flex flex-col items-center gap-2">
            <div
              className={`p-2 rounded-full border transition-colors ${
                isDragging ? "border-zinc-400 bg-zinc-700" : "border-zinc-700 bg-zinc-800"
              }`}
            >
              <ImagePlus
                className={`w-4 h-4 transition-colors ${isDragging ? "text-zinc-200" : "text-zinc-500"}`}
              />
            </div>
            <div>
              <p
                className={`text-sm font-medium transition-colors ${isDragging ? "text-zinc-200" : "text-zinc-400"}`}
              >
                {isDragging ? "Drop to add photos" : "Drop images here or click to browse"}
              </p>
              <p className="text-xs text-zinc-600 mt-0.5">
                JPEG, PNG, WebP · max 5 MB per file · multiple files supported
              </p>
            </div>
          </div>
        </div>

        {uploadErrors.length > 0 && (
          <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 space-y-1">
            <p className="text-xs font-medium text-red-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {uploadErrors.length === 1 ? "1 file rejected" : `${uploadErrors.length} files rejected`}
            </p>
            {uploadErrors.map((err, i) => (
              <p key={i} className="text-xs text-red-400/70 pl-5">
                {err}
              </p>
            ))}
          </div>
        )}

        {pendingFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-400">
                {isUploading
                  ? `Uploading ${(uploadingIndex ?? 0) + 1} of ${uploadTotal}…`
                  : `${pendingFiles.length} file${pendingFiles.length > 1 ? "s" : ""} ready · uploading to ${COLORS.find((c) => c.key === activeColor)?.label}`}
              </p>
              {!isUploading && (
                <button
                  onClick={cancelAll}
                  className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  Cancel all
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {pendingFiles.map((pf) => (
                <div
                  key={pf.id}
                  className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${
                    pf.status === "error"
                      ? "border-red-900/50 bg-red-950/20"
                      : pf.status === "done"
                        ? "border-emerald-900/50 bg-emerald-950/20"
                        : pf.status === "uploading"
                          ? "border-zinc-600 bg-zinc-800/50"
                          : "border-zinc-800 bg-zinc-900/50"
                  }`}
                >
                  <div className="relative w-9 h-9 rounded overflow-hidden flex-shrink-0 bg-zinc-800">
                    <img
                      src={pf.preview}
                      alt={pf.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-300 truncate">{pf.file.name}</p>
                    <p className="text-xs text-zinc-600">{formatBytes(pf.file.size)}</p>
                    {pf.status === "uploading" && (
                      <div className="mt-1.5 h-1 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-300 rounded-full transition-all duration-150"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                    {pf.status === "error" && (
                      <p className="text-[10px] text-red-400 mt-0.5">{pf.errorMsg}</p>
                    )}
                  </div>

                  <div className="flex-shrink-0 w-8 flex items-center justify-center">
                    {pf.status === "uploading" && (
                      <span className="text-[10px] text-zinc-400 tabular-nums">
                        {uploadProgress}%
                      </span>
                    )}
                    {pf.status === "done" && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    {pf.status === "error" && <AlertCircle className="w-4 h-4 text-red-400" />}
                    {pf.status === "pending" && !isUploading && (
                      <button
                        onClick={() => removePending(pf.id)}
                        className="p-0.5 text-zinc-600 hover:text-zinc-300 transition-colors rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {pendingCount > 0 && (
              <Button
                size="sm"
                onClick={uploadAllPending}
                disabled={isUploading}
                className="w-full bg-zinc-100 text-zinc-900 hover:bg-white gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Uploading {(uploadingIndex ?? 0) + 1}/{uploadTotal}…
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    Upload {pendingCount} Photo{pendingCount > 1 ? "s" : ""}
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
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
            {savingColor === activeColor ? "Saving…" : "Save Preferences"}
          </Button>

          {feedback[activeColor] === "saved" && (
            <span className="flex items-center gap-1 text-emerald-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              Saved
            </span>
          )}
          {feedback[activeColor] === "error" && (
            <span className="flex items-center gap-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              Failed to save
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
