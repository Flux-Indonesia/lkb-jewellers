"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, X } from "lucide-react"

const SHAPES = ["round", "oval", "emerald", "radiant", "pear", "cushion", "elongated_cushion", "elongated_hexagon", "marquise", "princess", "asscher"] as const
const SETTING_STYLES = ["trilogy", "solitaire", "halo", "toi_et_moi"] as const
const BAND_TYPES = ["plain", "pave", "accents"] as const
const SETTING_PROFILES = ["high_set", "low_set"] as const

type RingData = {
	name: string
	title: string
	description: string
	base_price_usd: number
	currency: string
	shape: string
	setting_style: string
	band_type: string
	setting_profile: string
	is_active: boolean
	engagement_ring_specs: Array<{
		band_width: string | null
		center_stone_size: string | null
		estimated_weight: string | null
		avg_side_stones: string | null
		claws_count: string | null
		resizable: boolean | null
	}> | null
}

function formatLabel(str: string): string {
	return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function RingEditForm({ slug, onClose }: { slug: string; onClose: () => void }) {
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)

	const [name, setName] = useState("")
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [basePrice, setBasePrice] = useState(0)
	const [currency, setCurrency] = useState("USD")
	const [shape, setShape] = useState("")
	const [settingStyle, setSettingStyle] = useState("")
	const [bandType, setBandType] = useState("")
	const [settingProfile, setSettingProfile] = useState("")
	const [isActive, setIsActive] = useState(true)

	const [bandWidth, setBandWidth] = useState("")
	const [centerStoneSize, setCenterStoneSize] = useState("")
	const [estimatedWeight, setEstimatedWeight] = useState("")
	const [avgSideStones, setAvgSideStones] = useState("")
	const [clawsCount, setClawsCount] = useState("")
	const [resizable, setResizable] = useState(true)

	useEffect(() => {
		fetch(`/api/rings/update?slug=${encodeURIComponent(slug)}`)
			.then(async (res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`)
				const json = await res.json()
				const d: RingData = json.data
				setName(d.name || "")
				setTitle(d.title || "")
				setDescription(d.description || "")
				setBasePrice(d.base_price_usd || 0)
				setCurrency(d.currency || "USD")
				setShape(d.shape || "")
				setSettingStyle(d.setting_style || "")
				setBandType(d.band_type || "")
				setSettingProfile(d.setting_profile || "")
				setIsActive(d.is_active ?? true)

				const specs = d.engagement_ring_specs?.[0]
				if (specs) {
					setBandWidth(specs.band_width || "")
					setCenterStoneSize(specs.center_stone_size || "")
					setEstimatedWeight(specs.estimated_weight || "")
					setAvgSideStones(specs.avg_side_stones || "")
					setClawsCount(specs.claws_count || "")
					setResizable(specs.resizable ?? true)
				}
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false))
	}, [slug])

	async function handleSave() {
		setSaving(true)
		setError(null)
		setSuccess(false)

		try {
			const res = await fetch("/api/rings/update", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					slug,
					name,
					title,
					description,
					base_price_usd: basePrice,
					currency,
					shape,
					setting_style: settingStyle,
					band_type: bandType,
					setting_profile: settingProfile,
					is_active: isActive,
					specs: {
						band_width: bandWidth || null,
						center_stone_size: centerStoneSize || null,
						estimated_weight: estimatedWeight || null,
						avg_side_stones: avgSideStones || null,
						claws_count: clawsCount || null,
						resizable,
					},
				}),
			})

			if (!res.ok) {
				const json = await res.json()
				throw new Error(json.error || `HTTP ${res.status}`)
			}

			setSuccess(true)
			setTimeout(() => setSuccess(false), 3000)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Failed to save")
		} finally {
			setSaving(false)
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
				<span className="ml-2 text-zinc-500 text-sm">Loading ring data...</span>
			</div>
		)
	}

	const inputClass = "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600 text-sm"
	const labelClass = "text-zinc-400 text-xs uppercase tracking-wider font-medium mb-1.5 block"
	const selectClass = "bg-zinc-900 border border-zinc-700 text-white text-sm rounded-md px-3 py-2 w-full focus:ring-1 focus:ring-zinc-600 focus:outline-none"

	return (
		<div className="p-5 space-y-5">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h3 className="text-white font-semibold text-sm">Edit Ring</h3>
					<Badge variant="outline" className="text-zinc-400 border-zinc-700 text-xs font-mono">{slug}</Badge>
				</div>
				<Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white" onClick={onClose}>
					<X className="w-4 h-4" />
				</Button>
			</div>

			{error && (
				<div className="text-red-400 text-xs bg-red-950/30 border border-red-800/50 rounded-md px-3 py-2">{error}</div>
			)}

			{/* Basic Info */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className={labelClass}>Name</label>
					<Input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
				</div>
				<div>
					<label className={labelClass}>Title (SEO)</label>
					<Input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
				</div>
			</div>

			<div>
				<label className={labelClass}>Description</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={3}
					className={`${inputClass} w-full rounded-md border px-3 py-2 resize-none`}
				/>
			</div>

			{/* Price & Status */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div>
					<label className={labelClass}>Base Price (USD)</label>
					<Input type="number" value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} className={inputClass} />
				</div>
				<div>
					<label className={labelClass}>Currency</label>
					<Input value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass} />
				</div>
				<div>
					<label className={labelClass}>Active</label>
					<select value={isActive ? "true" : "false"} onChange={(e) => setIsActive(e.target.value === "true")} className={selectClass}>
						<option value="true">Active</option>
						<option value="false">Inactive</option>
					</select>
				</div>
			</div>

			{/* Attributes */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div>
					<label className={labelClass}>Shape</label>
					<select value={shape} onChange={(e) => setShape(e.target.value)} className={selectClass}>
						<option value="">— Select —</option>
						{SHAPES.map((s) => <option key={s} value={s}>{formatLabel(s)}</option>)}
					</select>
				</div>
				<div>
					<label className={labelClass}>Setting Style</label>
					<select value={settingStyle} onChange={(e) => setSettingStyle(e.target.value)} className={selectClass}>
						<option value="">— Select —</option>
						{SETTING_STYLES.map((s) => <option key={s} value={s}>{formatLabel(s)}</option>)}
					</select>
				</div>
				<div>
					<label className={labelClass}>Band Type</label>
					<select value={bandType} onChange={(e) => setBandType(e.target.value)} className={selectClass}>
						<option value="">— Select —</option>
						{BAND_TYPES.map((s) => <option key={s} value={s}>{formatLabel(s)}</option>)}
					</select>
				</div>
				<div>
					<label className={labelClass}>Setting Profile</label>
					<select value={settingProfile} onChange={(e) => setSettingProfile(e.target.value)} className={selectClass}>
						<option value="">— Select —</option>
						{SETTING_PROFILES.map((s) => <option key={s} value={s}>{formatLabel(s)}</option>)}
					</select>
				</div>
			</div>

			{/* Specs */}
			<div>
				<h4 className="text-zinc-400 text-xs uppercase tracking-wider font-medium mb-3">Specifications</h4>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					<div>
						<label className={labelClass}>Band Width</label>
						<Input value={bandWidth} onChange={(e) => setBandWidth(e.target.value)} placeholder="e.g. 2mm" className={inputClass} />
					</div>
					<div>
						<label className={labelClass}>Center Stone Size</label>
						<Input value={centerStoneSize} onChange={(e) => setCenterStoneSize(e.target.value)} placeholder="e.g. 1.5ct" className={inputClass} />
					</div>
					<div>
						<label className={labelClass}>Estimated Weight</label>
						<Input value={estimatedWeight} onChange={(e) => setEstimatedWeight(e.target.value)} placeholder="e.g. 3.2g" className={inputClass} />
					</div>
					<div>
						<label className={labelClass}>Avg Side Stones</label>
						<Input value={avgSideStones} onChange={(e) => setAvgSideStones(e.target.value)} placeholder="e.g. 0.3ct" className={inputClass} />
					</div>
					<div>
						<label className={labelClass}>Claws Count</label>
						<Input value={clawsCount} onChange={(e) => setClawsCount(e.target.value)} placeholder="e.g. 4" className={inputClass} />
					</div>
					<div>
						<label className={labelClass}>Resizable</label>
						<select value={resizable ? "true" : "false"} onChange={(e) => setResizable(e.target.value === "true")} className={selectClass}>
							<option value="true">Yes</option>
							<option value="false">No</option>
						</select>
					</div>
				</div>
			</div>

			{/* Save */}
			<div className="flex items-center gap-3 pt-2">
				<Button onClick={handleSave} disabled={saving} className="bg-white text-black hover:bg-zinc-200 text-sm font-medium">
					{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
					{saving ? "Saving..." : "Save Changes"}
				</Button>
				{success && <span className="text-green-400 text-xs">Saved successfully!</span>}
			</div>
		</div>
	)
}
