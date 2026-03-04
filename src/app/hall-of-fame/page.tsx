"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Crown } from "lucide-react";
import ShowroomSection from "@/components/showroom-section";

const pieces = [
	{
		id: 1, name: "MIAMI CUBAN CHAIN", year: "2024", piece: "24mm Raised Diamond Pointer",
		image: "/images/static/nav-chain.jpg",
		description: "Miami Cuban chains boasting distinctive interlocking links and weighty design. Meticulously set by our accomplished in-house team.",
		category: "Exclusive Jewellery", status: "Custom Piece",
	},
	{
		id: 2, name: "ETERNITY RING", year: "2024", piece: "Rose Gold Diamond Collection",
		image: "/images/static/nav-ring.jpg",
		description: "Custom-crafted masterpiece featuring 1.9ct center diamond with 18kt Rose Gold ring, weighing 3.90 grams.",
		category: "Exclusive Jewellery", status: "Custom Piece",
	},
	{
		id: 3, name: "BESPOKE PENDANT", year: "2023", piece: "JH Custom Diamond",
		image: "/images/static/nav-pendant.jpg",
		description: "Celebration of style boasting 32.04 carats of rounds and 24.26 carats of emeralds. Set in 10 karat gold.",
		category: "Exclusive Jewellery", status: "Custom Piece",
	},
	{
		id: 4, name: "GMT MASTER II", year: "2023", piece: "Rolex Batman",
		image: "/images/static/hof-batman.jpg",
		description: "Indispensable tool for travelers and coveted symbol of esteem. Dual-time functionality with impeccable precision.",
		category: "Exclusive Jewellery", status: "Custom Piece",
	},
	{
		id: 5, name: "DAY-DATE 40", year: "2023", piece: "Presidential Collection",
		image: "/images/static/hof-serial-003.jpg",
		description: "Symphony of precious metals bearing witness to the passage of time with enduring grace.",
		category: "Exclusive Jewellery", status: "Custom Piece",
	},
	{
		id: 6, name: "LADY DATEJUST", year: "2023", piece: "26mm Jubilee Bracelet",
		image: "/images/static/hof-updated-9.jpg",
		description: "Refined elegance with iconic Jubilee bracelet. A companion to every occasion and treasured heirloom.",
		category: "Exclusive Jewellery", status: "Custom Piece",
	},
	{
		id: 7, name: "SKY-DWELLER", year: "2023", piece: "Annual Calendar GMT",
		image: "/images/static/hof-serial-005.jpg",
		description: "Marvel of mechanical complexity with Ring Command Bezel. Tradition and innovation for discerning globetrotters.",
		category: "Exclusive Jewellery", status: "Custom Piece",
	},
	{
		id: 8, name: "SUBMARINER DATE", year: "2023", piece: "Professional Dive Watch",
		image: "/images/static/hof-serial-009.jpg",
		description: "Refined elegance that seamlessly transitions from sea to land. An embodiment of the spirit of exploration.",
		category: "Exclusive Jewellery", status: "Custom Piece",
	},
	{
		id: 9, name: "DATEJUST 41", year: "2023", piece: "Oystersteel & Gold",
		image: "/images/static/hof-serial-011.jpg",
		description: "Silent companion to history in the making. From iconic figures to captains of industry.",
		category: "Exclusive Jewellery", status: "Custom Piece",
	},
	{
		id: 10, name: "LKB FLAGSHIP", year: "2023", piece: "Signature Pendant",
		image: "/images/static/hof-web15thfeb.jpg",
		description: "Our flagship pendant representing the pinnacle of LKB craftsmanship and exclusive design excellence.",
		category: "Exclusive Jewellery", status: "Custom Piece",
	},
];

function CornerBrackets({ color = "#555" }: { color?: string }) {
	return (
		<>
			<svg className="absolute top-0 left-0 w-3 h-3" viewBox="0 0 10 10" fill="none">
				<path d={`M9.51051 1.00049H0.253906V9.75645`} stroke={color} strokeWidth="1.5" />
			</svg>
			<svg className="absolute top-0 right-0 w-3 h-3" viewBox="0 0 10 10" fill="none">
				<path d={`M0.253906 1.00049H9.51051V9.75645`} stroke={color} strokeWidth="1.5" />
			</svg>
			<svg className="absolute bottom-0 left-0 w-3 h-3" viewBox="0 0 10 10" fill="none">
				<path d={`M9.51051 9.00049H0.253906V0.244531`} stroke={color} strokeWidth="1.5" />
			</svg>
			<svg className="absolute bottom-0 right-0 w-3 h-3" viewBox="0 0 10 10" fill="none">
				<path d={`M0.253906 9.00049H9.51051V0.244531`} stroke={color} strokeWidth="1.5" />
			</svg>
		</>
	);
}

export default function HallOfFamePage() {
	const [activeIndex, setActiveIndex] = useState(2);
	const carouselRef = useRef<HTMLDivElement>(null);
	const current = pieces[activeIndex];

	useEffect(() => {
		const el = carouselRef.current;
		if (!el) return;
		const handler = (e: WheelEvent) => {
			e.preventDefault();
			if (e.deltaY > 0) {
				setActiveIndex((prev) => Math.min(prev + 1, pieces.length - 1));
			} else {
				setActiveIndex((prev) => Math.max(prev - 1, 0));
			}
		};
		el.addEventListener("wheel", handler, { passive: false });
		return () => el.removeEventListener("wheel", handler);
	}, []);

	const touchStartY = useRef(0);
	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartY.current = e.touches[0].clientY;
	};
	const handleTouchEnd = (e: React.TouchEvent) => {
		const delta = touchStartY.current - e.changedTouches[0].clientY;
		if (delta > 30) setActiveIndex((prev) => Math.min(prev + 1, pieces.length - 1));
		if (delta < -30) setActiveIndex((prev) => Math.max(prev - 1, 0));
	};

	return (
		<div className="min-h-screen bg-black flex flex-col pt-20 pb-8">
			{/* ===== HEADER ===== */}
			<div className="container mx-auto px-6 mb-6">
				<div className="flex items-center justify-center gap-3 mb-3">
					<Crown className="w-8 h-8 text-white" aria-hidden="true" />
					<h1 className="text-4xl md:text-5xl font-normal tracking-[0.15em] text-white" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>
						HALL OF FAME
					</h1>
				</div>
				<p className="text-center text-gray-400 text-sm max-w-xl mx-auto" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
					Celebrating our distinguished clientele and their extraordinary pieces
				</p>
			</div>

			{/* ===== CONTENT ===== */}
			<div className="container mx-auto px-6 flex-1 flex items-center">
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 w-full">
					{/* LEFT - Vertical Carousel */}
					<div className="lg:col-span-2 order-1 lg:order-1">
						<div className="text-center mb-4">
							<h2 className="text-xl text-white mb-1 font-bold" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>Our Clients</h2>
							<p className="text-xs text-gray-500 tracking-widest uppercase" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
								<span className="hidden md:inline">Scroll to Navigate</span>
								<span className="md:hidden">Swipe to Navigate</span>
							</p>
						</div>

						{/* Carousel */}
						<div
							ref={carouselRef}
							className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden cursor-pointer border border-gray-800/50 rounded-lg bg-gray-900/20"
							style={{ perspective: "1000px", touchAction: "pan-y" }}
	
							onTouchStart={handleTouchStart}
							onTouchEnd={handleTouchEnd}
						>
							{/* Scroll hint */}
							<div className="absolute top-4 right-4 z-20 text-xs text-gray-500 animate-pulse">
								<span className="hidden md:inline">🖱️ Scroll</span>
								<span className="md:hidden">👆 Swipe</span>
							</div>

							{/* Items */}
							<div className="relative w-full">
								{pieces.map((item, i) => {
									const offset = i - activeIndex;
									const absOffset = Math.abs(offset);
									const isActive = i === activeIndex;

									let yOffset: number;
									let scale: number;
									let opacity: number;
									let pointerEvents: "auto" | "none";

									if (isActive) {
										yOffset = 0;
										scale = 1;
										opacity = 1;
										pointerEvents = "auto";
									} else if (absOffset === 1) {
										yOffset = offset * 50;
										scale = 0.88;
										opacity = 0.8;
										pointerEvents = "auto";
									} else if (absOffset === 2) {
										yOffset = offset * 50;
										scale = 0.76;
										opacity = 0.6;
										pointerEvents = "auto";
									} else if (absOffset === 3) {
										yOffset = offset * 50;
										scale = 0.7;
										opacity = 0.4;
										pointerEvents = "none";
									} else {
										yOffset = offset * 50;
										scale = 0.7;
										opacity = 0.2;
										pointerEvents = "none";
									}

									return (
										<button
											key={item.id}
											onClick={() => setActiveIndex(i)}
											className="absolute w-full transition-all duration-500 ease-out"
											style={{
												transform: `translateY(${yOffset}px) scale(${scale})`,
												opacity,
												top: "50%",
												marginTop: "-15px",
												pointerEvents,
											}}
										>
											<div className={`relative px-4 py-3 text-center transition-all duration-400 ${isActive ? "bg-gradient-to-r from-transparent via-white/10 to-transparent" : "bg-transparent"}`}>
												<CornerBrackets color={isActive ? "#D4AF37" : "#555"} />
												{isActive ? (
													<>
														<div className="tracking-[0.15em] transition-all duration-400 text-white text-base md:text-lg font-light" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>
															{item.name}
														</div>
														<div className="mt-1 text-xs text-white uppercase tracking-[0.25em] font-medium">
															{item.year}
														</div>
													</>
												) : (
													<div className="tracking-[0.15em] transition-all duration-400 text-gray-500 text-sm" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>
														{item.name}
													</div>
												)}
											</div>
										</button>
									);
								})}
							</div>

							{/* Center highlight line */}
							<div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

							{/* Top/bottom fade */}
							<div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent pointer-events-none" />
							<div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
						</div>

						{/* Counter */}
						<div className="text-center mt-3 text-xs text-gray-400 uppercase tracking-widest font-medium">
							{activeIndex + 1} / {pieces.length}
						</div>
					</div>

					{/* RIGHT - Detail Panel */}
					<div className="lg:col-span-3 order-2 lg:order-2" style={{ touchAction: "auto" }}>
						<div className="bg-gray-900/30 border border-gray-800 overflow-hidden h-[400px] md:h-[500px] flex flex-col" style={{ touchAction: "auto" }}>
							{/* Image Area */}
							<div className="relative h-60 md:h-80 bg-black overflow-hidden group" style={{ touchAction: "auto" }}>
								<Image
									src={current.image}
									alt={current.name}
									fill
									className="object-contain transition-all duration-500 group-hover:scale-105"
									sizes="(max-width: 1024px) 100vw, 60vw"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
								<div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
									<div className="flex items-end justify-between">
										<div>
											<p className="text-xs text-white uppercase tracking-[0.25em] mb-1" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>PIECE</p>
											<h2 className="text-xl md:text-2xl lg:text-3xl text-white mb-1 font-bold" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>{current.piece}</h2>
										</div>
										<div className="text-right">
											<p className="text-xs text-gray-400 uppercase tracking-wider mb-1" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>YEAR</p>
											<p className="text-lg md:text-xl text-white font-bold" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>{current.year}</p>
										</div>
									</div>
								</div>
							</div>

							{/* Details Area */}
							<div className="p-4 md:p-6 border-t border-gray-800 flex-1" style={{ touchAction: "auto" }}>
								<div className="flex items-center gap-3 mb-4">
									<div className="h-px flex-1 bg-gradient-to-r from-white to-transparent" />
									<Crown className="w-5 h-5 text-white" aria-hidden="true" />
									<div className="h-px flex-1 bg-gradient-to-l from-white to-transparent" />
								</div>

								<h3 className="text-lg md:text-xl text-white mb-3 tracking-wide font-bold" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>{current.name}</h3>
								<p className="text-gray-400 leading-relaxed text-sm mb-4" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
									{current.description}
								</p>

								<div className="grid grid-cols-2 gap-3">
									<div className="bg-black/50 p-3 border border-gray-800">
										<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Category</p>
										<p className="text-white font-semibold text-sm">{current.category}</p>
									</div>
									<div className="bg-black/50 p-3 border border-gray-800">
										<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
										<p className="text-white font-semibold text-sm">{current.status}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ShowroomSection />
		</div>
	);
}
