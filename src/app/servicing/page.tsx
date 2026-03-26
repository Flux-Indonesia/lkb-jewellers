"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Wrench, Clock, Droplet, Shield, Watch, CircleCheckBig } from "lucide-react";
import ShowroomSection from "@/components/showroom-section";

const servicingImages = [
	"/servicing/1.jpg",
	"/servicing/2.jpg",
	"/servicing/3.jpg",
	"/servicing/4.jpg",
	"/servicing/5.jpg",
];

export default function ServicingPage() {
	const [activeImage, setActiveImage] = useState(0);
	const [activeCard, setActiveCard] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveCard((prev) => (prev + 1) % 6);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="bg-black min-h-screen text-white">
			{/* ===== HERO ===== */}
			<section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">

				<div className="container mx-auto px-6 text-center relative z-10">
					<Sparkles className="w-10 h-10 text-white mx-auto mb-6" />
					<h1 className="text-4xl md:text-6xl lg:text-7xl text-white mb-6 font-heading">
						Expert Watch Servicing
					</h1>
					<div className="w-[40rem] max-w-full h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6" />
					<p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
						Rolex-trained watchmakers with decades of expertise
					</p>
				</div>
			</section>

			{/* ===== SERVICES GRID ===== */}
			<section className="container mx-auto px-6 py-12">
				<h2 className="text-3xl md:text-4xl text-center text-white mb-10" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
					Our Watch Services Include
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
					{/* Full Maintenance Service */}
					<div
						className={`group relative bg-gray-900/50 border rounded-lg p-6 text-center transition-all duration-500 cursor-pointer ${activeCard === 0 ? "border-white scale-105 shadow-2xl shadow-white/50" : "border-gray-800 hover:border-gray-600"}`}
						onMouseEnter={() => setActiveCard(0)}
					>
						<div className={`absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-yellow-600 rounded-lg transition-opacity duration-500 ${activeCard === 0 ? "opacity-10" : "opacity-0 group-hover:opacity-5"}`} />
						<div className="relative z-10">
							<div className={`inline-block p-4 rounded-full mb-4 transition-all duration-500 ${activeCard === 0 ? "bg-gradient-to-br from-[#D4AF37] to-yellow-600 shadow-lg" : "bg-white/20"}`}>
								<Wrench className="w-8 h-8 text-white" />
							</div>
							<h3 className="font-bold text-sm mb-2 transition-colors duration-300 min-h-10 flex items-center justify-center text-white" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>
								FULL MAINTENANCE SERVICE
							</h3>
							<p className="text-xs text-gray-400" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
								Complete mechanical overhaul and cleaning
							</p>
						</div>
						{activeCard === 0 && (
							<div className="absolute -top-1 -right-1">
								<CircleCheckBig className="w-6 h-6 text-white" />
							</div>
						)}
					</div>

					{/* Timekeeping Tests */}
					<div
						className={`group relative bg-gray-900/50 border rounded-lg p-6 text-center transition-all duration-500 cursor-pointer ${activeCard === 1 ? "border-white scale-105 shadow-2xl shadow-white/50" : "border-gray-800 hover:border-gray-600"}`}
						onMouseEnter={() => setActiveCard(1)}
					>
						<div className={`absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg transition-opacity duration-500 ${activeCard === 1 ? "opacity-10" : "opacity-0 group-hover:opacity-5"}`} />
						<div className="relative z-10">
							<div className={`inline-block p-4 rounded-full mb-4 transition-all duration-500 ${activeCard === 1 ? "bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg" : "bg-white/20"}`}>
								<Clock className="w-8 h-8 text-white" />
							</div>
							<h3 className="font-bold text-sm mb-2 transition-colors duration-300 min-h-10 flex items-center justify-center text-white" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>
								TIMEKEEPING TESTS
							</h3>
							<p className="text-xs text-gray-400" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
								Precision accuracy verification
							</p>
						</div>
						{activeCard === 1 && (
							<div className="absolute -top-1 -right-1">
								<CircleCheckBig className="w-6 h-6 text-white" />
							</div>
						)}
					</div>

					{/* Waterproofing */}
					<div
						className={`group relative bg-gray-900/50 border rounded-lg p-6 text-center transition-all duration-500 cursor-pointer ${activeCard === 2 ? "border-white scale-105 shadow-2xl shadow-white/50" : "border-gray-800 hover:border-gray-600"}`}
						onMouseEnter={() => setActiveCard(2)}
					>
						<div className={`absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg transition-opacity duration-500 ${activeCard === 2 ? "opacity-10" : "opacity-0 group-hover:opacity-5"}`} />
						<div className="relative z-10">
							<div className={`inline-block p-4 rounded-full mb-4 transition-all duration-500 ${activeCard === 2 ? "bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg" : "bg-white/20"}`}>
								<Droplet className="w-8 h-8 text-white" />
							</div>
							<h3 className="font-bold text-sm mb-2 transition-colors duration-300 min-h-10 flex items-center justify-center text-white" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>
								WATERPROOFING
							</h3>
							<p className="text-xs text-gray-400" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
								Seal integrity and pressure testing
							</p>
						</div>
						{activeCard === 2 && (
							<div className="absolute -top-1 -right-1">
								<CircleCheckBig className="w-6 h-6 text-white" />
							</div>
						)}
					</div>

					{/* Resealing */}
					<div
						className={`group relative bg-gray-900/50 border rounded-lg p-6 text-center transition-all duration-500 cursor-pointer ${activeCard === 3 ? "border-white scale-105 shadow-2xl shadow-white/50" : "border-gray-800 hover:border-gray-600"}`}
						onMouseEnter={() => setActiveCard(3)}
					>
						<div className={`absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-lg transition-opacity duration-500 ${activeCard === 3 ? "opacity-10" : "opacity-0 group-hover:opacity-5"}`} />
						<div className="relative z-10">
							<div className={`inline-block p-4 rounded-full mb-4 transition-all duration-500 ${activeCard === 3 ? "bg-gradient-to-br from-green-400 to-green-600 shadow-lg" : "bg-white/20"}`}>
								<Shield className="w-8 h-8 text-white" />
							</div>
							<h3 className="font-bold text-sm mb-2 transition-colors duration-300 min-h-10 flex items-center justify-center text-white" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>
								RESEALING
							</h3>
							<p className="text-xs text-gray-400" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
								Gasket replacement and protection
							</p>
						</div>
						{activeCard === 3 && (
							<div className="absolute -top-1 -right-1">
								<CircleCheckBig className="w-6 h-6 text-white" />
							</div>
						)}
					</div>

					{/* Strap Changes */}
					<div
						className={`group relative bg-gray-900/50 border rounded-lg p-6 text-center transition-all duration-500 cursor-pointer ${activeCard === 4 ? "border-white scale-105 shadow-2xl shadow-white/50" : "border-gray-800 hover:border-gray-600"}`}
						onMouseEnter={() => setActiveCard(4)}
					>
						<div className={`absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg transition-opacity duration-500 ${activeCard === 4 ? "opacity-10" : "opacity-0 group-hover:opacity-5"}`} />
						<div className="relative z-10">
							<div className={`inline-block p-4 rounded-full mb-4 transition-all duration-500 ${activeCard === 4 ? "bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg" : "bg-white/20"}`}>
								<Watch className="w-8 h-8 text-white" />
							</div>
							<h3 className="font-bold text-sm mb-2 transition-colors duration-300 min-h-10 flex items-center justify-center text-white" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>
								STRAP CHANGES
							</h3>
							<p className="text-xs text-gray-400" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
								Professional fitting and adjustment
							</p>
						</div>
						{activeCard === 4 && (
							<div className="absolute -top-1 -right-1">
								<CircleCheckBig className="w-6 h-6 text-white" />
							</div>
						)}
					</div>

					{/* Polishing */}
					<div
						className={`group relative bg-gray-900/50 border rounded-lg p-6 text-center transition-all duration-500 cursor-pointer ${activeCard === 5 ? "border-white scale-105 shadow-2xl shadow-white/50" : "border-gray-800 hover:border-gray-600"}`}
						onMouseEnter={() => setActiveCard(5)}
					>
						<div className={`absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-yellow-600 rounded-lg transition-opacity duration-500 ${activeCard === 5 ? "opacity-10" : "opacity-0 group-hover:opacity-5"}`} />
						<div className="relative z-10">
							<div className={`inline-block p-4 rounded-full mb-4 transition-all duration-500 ${activeCard === 5 ? "bg-gradient-to-br from-[#D4AF37] to-yellow-600 shadow-lg" : "bg-white/20"}`}>
								<Sparkles className="w-8 h-8 text-white" />
							</div>
							<h3 className="font-bold text-sm mb-2 transition-colors duration-300 min-h-10 flex items-center justify-center text-white" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>
								POLISHING
							</h3>
							<p className="text-xs text-gray-400" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
								Starting from £150
import { BLUR_DATA_URL } from '@/lib/utils'
							</p>
						</div>
						{activeCard === 5 && (
							<div className="absolute -top-1 -right-1">
								<CircleCheckBig className="w-6 h-6 text-white" />
							</div>
						)}
					</div>
				</div>
			</section>

			{/* ===== ABOUT SERVICING + IMAGE CAROUSEL ===== */}
			<div className="container mx-auto px-6 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left - Text */}
					<div className="space-y-6 text-gray-300 leading-relaxed" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
						<div className="space-y-6">
							<div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-white/50 transition-colors duration-300">
								<p>Servicing your watch with The Local Kettle Brothers remains a luxurious experience. We take pride in placing your watch in the most skilled and capable hands ensuring it receives the utmost care and expertise it deserves. We provide a complimentary 1 year Local Kettle Brother&apos;s warranty with all watch purchases.</p>
							</div>
							<div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-white/50 transition-colors duration-300">
								<p>At Local Kettle Brothers UK, we provide meticulous watch servicing to ensure the longevity and precision of your timepiece. Every intricate mechanism within your mechanical watch plays a crucial role in keeping time accurate. Similar to caring for your car, it is financially wise to prioritize the maintenance of your valuable watch.</p>
							</div>
							<div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-white/50 transition-colors duration-300">
								<p>When it comes to opening your watchcase for servicing or waterproofing, it is imperative to entrust the task to a highly skilled watchmaker equipped with the necessary testing tools. Our team of Rolex-trained watchmakers at Local Kettle Brothers UK possesses extensive experience in the intricate art of watch servicing.</p>
							</div>
							<div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-white/50 transition-colors duration-300">
								<p>In addition to comprehensive repair services, we offer a range of specialized services including battery replacement, maintenance servicing, timekeeping testing, waterproofing, and resealing. Your watch is in capable hands with us, ensuring it remains a reliable companion for years to come.</p>
							</div>
						</div>
						<div className="pt-8">
							<Link href="/contact" className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 hover:shadow-2xl hover:shadow-white/50 transition-all duration-300 font-bold tracking-widest text-sm rounded">
								<span>BOOK CONSULTATION</span>
								<Watch className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
							</Link>
						</div>
					</div>

					{/* Right - Image Carousel */}
					<div className="relative">
						<div className="relative h-[300px] md:h-[480px] rounded-lg overflow-hidden shadow-2xl">
							{servicingImages.map((img, i) => (
								<Image
									key={i}
									src={img}
									alt={`Watch servicing ${i + 1}`}
									fill
									className={`object-cover transition-opacity duration-1000 ${activeImage === i ? "opacity-100" : "opacity-0"}`}
									sizes="(max-width: 1024px) 100vw, 50vw" placeholder="blur" blurDataURL={BLUR_DATA_URL}
								/>
							))}
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
							<div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur px-4 py-2 rounded-full border border-white/50">
								<span className="text-white font-semibold">{activeImage + 1}</span>
								<span className="text-gray-400"> / {servicingImages.length}</span>
							</div>
						</div>
						<div className="grid grid-cols-6 gap-2 mt-4">
							{servicingImages.map((img, i) => (
								<button
									key={i}
									onClick={() => setActiveImage(i)}
									className={`relative h-12 rounded cursor-pointer overflow-hidden border-2 transition-all duration-300 ${
										activeImage === i
											? "border-white shadow-lg shadow-white/50"
											: "border-gray-700 hover:border-gray-500 opacity-60 hover:opacity-100"
									}`}
								>
									<Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* ===== WARRANTY SECTION ===== */}
			<div className="relative py-16 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
				<div className="container mx-auto px-6 relative z-10">
					<div className="max-w-3xl mx-auto text-center">
						<div className="relative inline-block">
							<div className="relative bg-gray-900 border-2 border-white rounded-2xl p-12 px-16">
								<Shield className="w-20 h-20 text-white mx-auto mb-6" />
								<h3 className="text-3xl md:text-4xl text-white mb-4 font-heading">1 Year Warranty</h3>
								<p className="text-gray-300 text-base px-4" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
									Complimentary with all watch purchases
								</p>
							</div>
						</div>
						<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-white/50 transition-colors">
								<CircleCheckBig className="w-8 h-8 text-white mx-auto mb-3" />
								<h4 className="text-white font-semibold mb-2" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>Expert Care</h4>
								<p className="text-sm text-gray-400" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>Rolex-trained specialists</p>
							</div>
							<div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-white/50 transition-colors">
								<CircleCheckBig className="w-8 h-8 text-white mx-auto mb-3" />
								<h4 className="text-white font-semibold mb-2" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>Genuine Parts</h4>
								<p className="text-sm text-gray-400" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>Only authentic components</p>
							</div>
							<div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-white/50 transition-colors">
								<CircleCheckBig className="w-8 h-8 text-white mx-auto mb-3" />
								<h4 className="text-white font-semibold mb-2" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>Full Coverage</h4>
								<p className="text-sm text-gray-400" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>Comprehensive protection</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ===== VISIT OUR SHOWROOM ===== */}
			<ShowroomSection />
		</div>
	);
}
