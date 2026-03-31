"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, Clock, MapPin, Wallet, Upload } from "lucide-react";
import { toast } from "sonner";
import ShowroomSection from "@/components/showroom-section";

export default function WeBuyPage() {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phone: "",
		brand: "",
		model: "",
		referenceNumber: "",
		yearOfManufacture: "",
		condition: "Excellent",
		boxAndPapers: "Full Set (Box & Papers)",
		additionalInfo: "",
		isInternational: false,
		visitedOtherJewellers: false,
	});
	const [images, setImages] = useState<string[]>([]);
	const [uploading, setUploading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const target = e.target;
		const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
		setFormData((prev) => ({ ...prev, [target.name]: value }));
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files?.length) return;
		setUploading(true);
		try {
			for (const file of Array.from(files).slice(0, 5 - images.length)) {
				const fd = new FormData();
				fd.append("image", file);
				const res = await fetch("https://api.imgbb.com/1/upload?key=21a4ec39ce5dad29e92c47325c7d0d73", { method: "POST", body: fd });
				const data = await res.json();
				if (data.success && data.data?.url) {
					setImages((prev) => [...prev, data.data.url]);
				}
			}
		} catch {
			/* ignore */
		} finally {
			setUploading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await fetch("/api/sell-submission", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fullName: formData.fullName,
					email: formData.email,
					phone: formData.phone,
					brand: formData.brand,
					model: formData.model,
					referenceNumber: formData.referenceNumber,
					yearOfManufacture: formData.yearOfManufacture,
					condition: formData.condition,
					hasBox: formData.boxAndPapers.includes("Box"),
					hasPapers: formData.boxAndPapers.includes("Papers"),
					additionalInfo: formData.additionalInfo,
					images,
					isInternational: formData.isInternational,
					visitedOthers: formData.visitedOtherJewellers,
				}),
			});
			if (!res.ok) throw new Error("Failed to submit");
			toast.success("Submission sent successfully!");
			setSubmitted(true);
		} catch (err) {
			console.error("Failed to submit:", err);
			toast.error("Failed to submit. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen text-white bg-black">
			{/* ===== HERO ===== */}
			<section className="pt-32 md:pt-40 pb-10 md:pb-14 px-6 bg-[#050505] border-b border-gray-900">
				<div className="container mx-auto max-w-4xl text-center">
					<h1 className="text-4xl md:text-5xl text-white mb-4 font-heading italic">Sell Your Watch</h1>
					<p className="text-gray-400 text-base max-w-2xl mx-auto" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
						Secure the best market value for your timepiece with our streamlined, secure selling process.
					</p>
				</div>
			</section>

			{/* ===== PROCESS STEPS ===== */}
			<div className=" mx-auto px-6 max-w-5xl">
				<div className="py-20 grid grid-cols-1 md:grid-cols-4 gap-12 text-center relative">
					{/* Connecting line */}
					<div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-900 -z-10 transform -translate-y-12" />

					{/* Step 01 - Featured (gold) */}
					<div className="bg-black p-4">
						<div className="w-20 h-20 mx-auto bg-black border-2 border-white rounded-full flex items-center justify-center mb-6">
							<FileText className="w-8 h-8 text-white" />
						</div>
						<h3 className="font-heading text-xl mb-2">01</h3>
						<p className="text-sm text-gray-400">Complete the form below.</p>
					</div>

					{/* Step 02 */}
					<div className="bg-black p-4">
						<div className="w-20 h-20 mx-auto bg-black border-2 border-gray-800 rounded-full flex items-center justify-center mb-6">
							<Clock className="w-8 h-8 text-gray-500" />
						</div>
						<h3 className="font-heading text-xl mb-2">02</h3>
						<p className="text-sm text-gray-400">Receive an offer within 24 hours.</p>
					</div>

					{/* Step 03 */}
					<div className="bg-black p-4">
						<div className="w-20 h-20 mx-auto bg-black border-2 border-gray-800 rounded-full flex items-center justify-center mb-6">
							<MapPin className="w-8 h-8 text-gray-500" />
						</div>
						<h3 className="font-heading text-xl mb-2">03</h3>
						<p className="text-sm text-gray-400">Visit our showroom or ship securely.</p>
					</div>

					{/* Step 04 */}
					<div className="bg-black p-4">
						<div className="w-20 h-20 mx-auto bg-black border-2 border-gray-800 rounded-full flex items-center justify-center mb-6">
							<Wallet className="w-8 h-8 text-gray-500" />
						</div>
						<h3 className="font-heading text-xl mb-2">04</h3>
						<p className="text-sm text-gray-400">Instant payment via Bank Transfer.</p>
					</div>
				</div>

				{/* ===== SELL FORM ===== */}
				{submitted ? (
					<div className="bg-[#0a0a0a] border border-gray-900 p-8 md:p-16 rounded-sm shadow-2xl text-center mb-20">
						<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 border border-white/30 flex items-center justify-center">
							<FileText className="w-7 h-7 text-white" />
						</div>
						<h3 className="text-2xl text-white mb-2 font-heading">Submission Received</h3>
						<p className="text-gray-400 mb-6">Thank you! Our team will review your submission and contact you within 24 hours with a valuation.</p>
						<button
							onClick={() => {
								setSubmitted(false);
								setImages([]);
							}}
							className="text-white text-sm tracking-widest hover:underline"
						>
							SUBMIT ANOTHER ITEM
						</button>
					</div>
				) : (
					<div className="bg-[#0a0a0a] border border-gray-900 p-8 md:p-16 rounded-sm shadow-2xl mb-20">
						<form onSubmit={handleSubmit} className="space-y-12">
							{/* Personal Information */}
							<div>
								<h3 className="text-white text-sm tracking-widest uppercase mb-6 border-b border-gray-800 pb-2">Personal Information</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									<div className="space-y-2">
										<label className="text-xs text-gray-500">Full Name *</label>
										<input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Enter your name..." className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:border-white outline-none transition-colors" style={{ fontSize: "16px" }} />
									</div>
									<div className="space-y-2">
										<label className="text-xs text-gray-500">Email Address *</label>
										<input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email..." className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:border-white outline-none transition-colors" style={{ fontSize: "16px" }} />
									</div>
									<div className="space-y-2 md:col-span-2">
										<label className="text-xs text-gray-500">Telephone *</label>
										<div className="flex items-center gap-3">
											<span className="text-2xl">&#x1F1EC;&#x1F1E7;</span>
											<input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+44 20 1234 5678" className="flex-1 bg-transparent border-b border-gray-700 py-3 text-white focus:border-white outline-none transition-colors" style={{ fontSize: "16px" }} />
										</div>
									</div>
								</div>
								<div className="mt-8 pt-6 border-t border-gray-800">
									<label className="flex items-center gap-3 cursor-pointer group">
										<input type="checkbox" name="isInternational" checked={formData.isInternational} onChange={handleChange} className="w-5 h-5 accent-white cursor-pointer" />
										<span className="text-white text-sm group-hover:text-white transition-colors">I am an international client</span>
									</label>
								</div>
							</div>

							{/* Watch Details */}
							<div>
								<h3 className="text-white text-sm tracking-widest uppercase mb-6 border-b border-gray-800 pb-2">Watch Details</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									<div className="space-y-2">
										<label className="text-xs text-gray-500">Make *</label>
										<input type="text" name="brand" value={formData.brand} onChange={handleChange} required placeholder="e.g. Rolex" className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:border-white outline-none transition-colors" />
									</div>
									<div className="space-y-2">
										<label className="text-xs text-gray-500">Model *</label>
										<input type="text" name="model" value={formData.model} onChange={handleChange} required placeholder="e.g. Submariner" className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:border-white outline-none transition-colors" />
									</div>
									<div className="space-y-2">
										<label className="text-xs text-gray-500">Serial Number (Optional)</label>
										<input type="text" name="referenceNumber" value={formData.referenceNumber} onChange={handleChange} placeholder="Serial Number..." className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:border-white outline-none transition-colors" />
									</div>
									<div className="space-y-2">
										<label className="text-xs text-gray-500">Age / Year</label>
										<input type="text" name="yearOfManufacture" value={formData.yearOfManufacture} onChange={handleChange} placeholder="e.g. 2022 or Brand New" className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:border-white outline-none transition-colors" />
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
									<div className="space-y-2">
										<label className="text-xs text-gray-500">Box &amp; Papers?</label>
										<select name="boxAndPapers" value={formData.boxAndPapers} onChange={handleChange} className="w-full bg-black border border-gray-700 py-3 px-4 text-white focus:border-white outline-none">
											<option value="Full Set (Box & Papers)">Full Set (Box &amp; Papers)</option>
											<option value="Box Only">Box Only</option>
											<option value="Papers Only">Papers Only</option>
											<option value="Watch Only">Watch Only</option>
										</select>
									</div>
									<div className="space-y-2">
										<label className="text-xs text-gray-500">Condition</label>
										<select name="condition" value={formData.condition} onChange={handleChange} className="w-full bg-black border border-gray-700 py-3 px-4 text-white focus:border-white outline-none">
											<option value="Excellent">Excellent</option>
											<option value="Good">Good</option>
											<option value="Fair">Fair</option>
											<option value="Poor">Poor</option>
										</select>
									</div>
								</div>
								<div className="mt-8 space-y-2">
									<label className="text-xs text-gray-500">Message / Additional Details</label>
									<textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={4} placeholder="Please describe any scratches, servicing history, or specific details..." className="w-full bg-black border border-gray-700 p-4 text-white focus:border-white outline-none" />
								</div>
								<div className="mt-8">
									<label className="text-xs text-gray-500 mb-3 block">Upload Watch Photos (Max 5)</label>
									<div className="border-2 border-dashed border-gray-800 p-8 text-center hover:border-white transition-colors relative">
										<input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading || images.length >= 5} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
										<Upload className="w-8 h-8 mx-auto text-gray-600 mb-2" />
										<p className="text-gray-400 text-sm">
											Drag &amp; Drop Photos Here or <span className="text-white underline">Browse</span>
										</p>
										<p className="text-xs text-gray-600 mt-2">Upload up to 5 images (Max 5MB each) - {images.length}/5 uploaded</p>
									</div>
									{images.length > 0 && (
										<div className="flex gap-2 mt-3">
											{images.map((img, i) => (
												<div key={i} className="relative w-16 h-16 rounded overflow-hidden border border-gray-800">
													<Image src={img} alt={`Upload ${i + 1}`} fill className="object-cover" sizes="64px" />
												</div>
											))}
										</div>
									)}
								</div>
							</div>

							{/* Visited other jewellers */}
							<div className="border-t border-gray-800 pt-8">
								<label className="flex items-center gap-3 cursor-pointer group">
									<input type="checkbox" name="visitedOtherJewellers" checked={formData.visitedOtherJewellers} onChange={handleChange} className="w-5 h-5 accent-white cursor-pointer" />
									<span className="text-white text-sm group-hover:text-white transition-colors">Have you visited other jewellers for this item?</span>
								</label>
							</div>

							{/* Submit */}
							<div className="pt-4 text-right">
								<button type="submit" disabled={loading} className="bg-white hover:bg-gray-200 text-black px-12 py-4 font-bold rounded-sm transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed">
									{loading ? "Submitting..." : "Submit Enquiry"}
								</button>
							</div>
						</form>
					</div>
				)}
			</div>

			{/* ===== VISIT OUR SHOWROOM ===== */}
			<ShowroomSection />
		</div>
	);
}
