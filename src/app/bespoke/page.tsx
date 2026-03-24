"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Wand2 } from "lucide-react";
import ThreeDCarousel from "@/components/three-d-carousel";
import ShowroomSection from "@/components/showroom-section";

const bespokeImages = ["/jefe-cover-blogs.jpg", "/bespoke/rnt.jpg", "/bespoke/rich.jpg", "/bespoke/tade-chain-16.jpg", "/tade-cover.jpg", "/bespoke/rich2.jpg", "/timeless-photos-2.jpg"];

const tabs = [
	{
		id: 1,
		name: "Masterpiece Collection",
		title: "Timeless Elegance",
		subtitle: "The Pinnacle of Craftsmanship",
		description:
			"Each piece in our masterpiece collection represents hundreds of hours of meticulous work by our master artisans. Using only the finest materials and time-honored techniques passed down through generations, we create jewelry that transcends mere adornment to become treasured heirlooms. Every diamond is hand-selected for its exceptional brilliance, every setting is crafted with microscopic precision, and every detail is perfected to create pieces that will be cherished for lifetimes.",
		videoUrl: "/jewellery-glorify-1.mp4",
		stats: [
			{ label: "Hours of Craftsmanship", value: "200+" },
			{ label: "Master Artisans", value: "5" },
			{ label: "Quality Checks", value: "50+" },
		],
	},
	{
		id: 2,
		name: "Signature Designs",
		title: "Iconic Excellence",
		subtitle: "Where Art Meets Innovation",
		description: "Our signature collection pushes the boundaries of traditional jewelry making, combining cutting-edge technology with centuries-old craftsmanship. Each design tells a unique story, from concept sketches to the final polished masterpiece. We use advanced 3D modeling alongside hand-finishing techniques to achieve levels of detail and precision that were previously impossible. The result is jewelry that is both contemporary and timeless, bold yet elegant.",
		videoUrl: "/jewellery-glorify-2.mp4",
		stats: [
			{ label: "Design Process", value: "3-6 Months" },
			{ label: "Unique Designs", value: "100+" },
			{ label: "Awards Won", value: "15+" },
		],
	},
];

const galleryImages1 = [
	{ src: "/bespoke/rich.jpg", alt: "Bespoke Jewellery 1" },
	{ src: "/bespoke/tade-chain-16.jpg", alt: "Bespoke Jewellery 2" },
	{ src: "/tade-cover.jpg", alt: "Bespoke Jewellery 3" },
];

const portfolioImages = [
	{ src: "/timeless-photos-2.jpg", alt: "Bespoke Work 1" },
	{ src: "/bespoke/bracelets-1.jpg", alt: "Bespoke Work 2" },
	{ src: "/timeless-photos-3.jpg", alt: "Bespoke Work 3" },
];

export default function BespokePage() {
	const [activeTab, setActiveTab] = useState(0);
	const current = tabs[activeTab];

	return (
		<div className="bg-black text-white min-h-screen">
			{/* ===== HERO - Split Layout ===== */}
			<section className="relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black pt-32 pb-8 md:pt-36 md:pb-12 lg:h-screen lg:py-0">
				<div className="container mx-auto px-4 md:px-6 h-full">
					<div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 h-full lg:items-center">
						{/* Left - Text */}
						<div className="text-center lg:text-left z-20 flex flex-col justify-center order-1 mb-6 md:mb-8 lg:mb-0">
							<div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 lg:mb-6 justify-center lg:justify-start">
								<div className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-white" />
								<div className="w-2 h-2 rotate-45 border border-white" />
							</div>
							<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl mb-3 md:mb-4 lg:mb-6 text-white tracking-tight leading-tight font-normal px-4 lg:px-0 font-heading">Bespoke Design</h1>
							<div className="w-16 md:w-24 lg:w-32 h-0.5 md:h-1 bg-white mb-3 md:mb-4 lg:mb-8 mx-auto lg:mx-0" />
							<p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-light leading-relaxed mb-3 md:mb-4 lg:mb-8 px-4 lg:px-0" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
								Where Your Vision Becomes Timeless Luxury
							</p>
							<p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0 px-4 lg:px-0" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
								Transform your dreams into exquisite reality with our master craftsmen. Each piece is meticulously designed to reflect your unique story and style.
							</p>
						</div>

						{/* Right - 3D Carousel */}
						<div className="relative h-[380px] sm:h-[420px] md:h-[500px] lg:h-[800px] flex items-center justify-center order-2">
							{/* White glow circle behind carousel */}
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[350px] md:h-[350px] lg:w-[500px] lg:h-[500px] bg-white/10 rounded-full blur-[50px] md:blur-[70px] lg:blur-[120px] animate-pulse" />
							</div>
							{/* Carousel with drop-shadow filter */}
							<div className="relative z-10 rounded-2xl scale-[0.65] sm:scale-[0.75] md:scale-[0.85] lg:scale-100" style={{ filter: "drop-shadow(0 20px 40px rgba(255, 255, 255, 0.1)) drop-shadow(0 30px 60px rgba(255, 255, 255, 0.15))" }}>
								<ThreeDCarousel images={bespokeImages} radius={360} cardW={240} cardH={340} autoSpinSpeed={0.03} />
							</div>
							{/* Decorative white dots */}
							<div className="absolute top-10 right-10 w-2 md:w-3 h-2 md:h-3 bg-white rounded-full animate-pulse opacity-60" />
							<div className="absolute bottom-20 left-10 w-1.5 md:w-2 h-1.5 md:h-2 bg-white rounded-full animate-pulse opacity-40" style={{ animationDelay: "1s" }} />
							<div className="absolute top-1/3 left-20 w-1 h-1 bg-white rounded-full animate-pulse opacity-50" style={{ animationDelay: "0.5s" }} />
						</div>
					</div>
				</div>
			</section>

			{/* ===== BESPOKE JEWELLERY INTRO ===== */}
			<div className="mx-auto px-4 md:px-6 text-center max-w-4xl my-12 md:my-16 relative">
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "55.8135%", top: "73.9739%", animationDelay: "2.63476s", animationDuration: "3.42336s", opacity: 0.810061 }} />
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "84.3031%", top: "76.5577%", animationDelay: "2.72858s", animationDuration: "2.98425s", opacity: 0.559772 }} />
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "45.9747%", top: "33.2331%", animationDelay: "1.87834s", animationDuration: "2.30436s", opacity: 0.73225 }} />
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "15.2933%", top: "82.0598%", animationDelay: "0.163197s", animationDuration: "2.55954s", opacity: 0.751574 }} />
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "43.4577%", top: "49.5507%", animationDelay: "0.287795s", animationDuration: "3.08631s", opacity: 0.757974 }} />
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "78.5185%", top: "6.41371%", animationDelay: "0.904114s", animationDuration: "3.61924s", opacity: 0.695006 }} />
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "37.1695%", top: "21.6541%", animationDelay: "1.08309s", animationDuration: "2.69894s", opacity: 0.572262 }} />
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "18.8139%", top: "16.5647%", animationDelay: "2.44818s", animationDuration: "2.27164s", opacity: 0.971967 }} />
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "28.4972%", top: "89.6973%", animationDelay: "1.68733s", animationDuration: "3.61344s", opacity: 0.768388 }} />
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "39.7637%", top: "65.8443%", animationDelay: "0.496274s", animationDuration: "3.01708s", opacity: 0.591293 }} />
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "50.8881%", top: "10.8658%", animationDelay: "1.39868s", animationDuration: "2.81652s", opacity: 0.99909 }} />
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "72.8409%", top: "78.1251%", animationDelay: "0.220552s", animationDuration: "2.48981s", opacity: 0.759028 }} />
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "47.5367%", top: "40.7652%", animationDelay: "0.261579s", animationDuration: "2.55087s", opacity: 0.590712 }} />
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "29.0815%", top: "79.225%", animationDelay: "0.688706s", animationDuration: "3.07498s", opacity: 0.77156 }} />
					<div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ left: "83.4321%", top: "45.8455%", animationDelay: "1.50202s", animationDuration: "2.82929s", opacity: 0.776874 }} />
				</div>
				<h2 className="text-3xl sm:text-4xl md:text-5xl mb-6 md:mb-8 text-white font-bold px-4 font-heading">Bespoke Jewellery</h2>
				<div className="w-16 md:w-24 h-0.5 bg-white mx-auto mb-8 md:mb-10" />
				<p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4 md:mb-6 font-normal px-4" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
					At the Local Kettle Brothers, we see bespoke jewellery as art. We create exquisite pieces that reflect our client&apos;s unique style and individuality. Our team of accredited creative designers and artist have years of experience bringing even the most complex visions to life.
				</p>
				<p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4 md:mb-6 font-normal px-4" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
					From our initial consultation to the final handcrafted product, we take meticulous care at every step of the process. We use only the finest materials and the most advanced techniques to create beautiful and durable jewellery.
				</p>
				<p className="text-gray-300 text-base md:text-lg leading-relaxed font-normal px-4" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
					We mark life&apos;s significant moments with pieces of exceptional beauty, rarity, and quality. Whether you&apos;re celebrating an engagement, a wedding, or simply want to indulge yourself, we&apos;ll create a piece of jewelry you&apos;ll cherish for years to come.
				</p>
			</div>

			<div className="container mx-auto px-4 md:px-6 my-10 md:my-12">
				<div
					className="relative overflow-hidden rounded-2xl border border-white/30 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10"
					style={{
						background: "linear-gradient(135deg, #0a0a0a 0%, #120e00 50%, #0a0a0a 100%)",
						boxShadow: "0 0 60px rgba(255, 255, 255,0.08), inset 0 0 60px rgba(255, 255, 255,0.03)",
					}}
				>
					<div
						className="absolute inset-0 pointer-events-none"
						style={{
							background: "radial-gradient(ellipse at 20% 50%, rgba(255, 255, 255,0.07) 0%, transparent 60%)",
						}}
					/>
					<div className="relative z-10 flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/40 flex items-center justify-center bg-white/10">
						<Wand2 className="w-6 h-6 md:w-7 md:h-7 text-white" />
					</div>
					<div className="relative z-10 flex-1 text-center md:text-left">
						<h3 className="text-xl md:text-2xl text-white mb-2 font-heading">Design Your Jewellery with AI</h3>
						<p className="text-gray-400 text-sm md:text-base leading-relaxed" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
							Describe your vision and watch it come to life. Tell us what you&apos;re dreaming of.
						</p>
					</div>
					<div className="relative z-10 flex-shrink-0">
						<Link href="/bespoke/design" className="inline-flex items-center gap-2 bg-white text-black px-6 md:px-8 py-3 md:py-3.5 font-bold tracking-widest text-xs md:text-sm hover:bg-gray-200 transition-colors whitespace-nowrap">
							Try AI Design Generator →
						</Link>
					</div>
				</div>
			</div>

			{/* ===== THE ART OF PERFECTION ===== */}
			<section className="relative min-h-screen flex flex-col justify-center bg-black py-8">
				<div className="absolute inset-0 opacity-10">
					<div
						className="absolute top-0 left-0 w-full h-full"
						style={{
							backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)",
							backgroundSize: "100% 100%",
						}}
					/>
				</div>
				<div className="container mx-auto px-4 md:px-6 relative z-10">
					{/* Header */}
					<div className="text-center mb-8 md:mb-12">
						<div className="flex items-center gap-4 mb-4 justify-center">
							<div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
							<span className="text-white text-xs tracking-[0.5em] uppercase" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
								Unparalleled Excellence
							</span>
							<div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
						</div>
						<h2 className="text-5xl md:text-6xl text-white mb-6 font-normal font-heading">
							<span className="block tracking-[0.1em] mb-1">THE ART OF</span>
							<span className="block text-white tracking-[0.1em]">PERFECTION</span>
						</h2>
						<p className="text-gray-400 text-lg max-w-2xl mx-auto" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
							Where precision meets passion. Every piece is a masterwork, meticulously crafted to transcend time.
						</p>
					</div>

					{/* Tabs Layout */}
					<div className="max-w-5xl mx-auto flex-1">
						<div className="flex flex-col lg:flex-row gap-4 h-full">
							{/* Tab Buttons */}
							<div className="lg:w-64 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
								{tabs.map((tab, i) => (
									<button
										key={tab.id}
										onClick={() => setActiveTab(i)}
										className={`relative group flex items-center gap-3 px-4 py-3 min-w-[200px] lg:min-w-0 rounded-lg transition-transform duration-300 hover:-translate-y-0.5 ${activeTab === i ? "" : "opacity-90 hover:opacity-100"}`}
										style={{
											background: activeTab === i ? "linear-gradient(90deg, #e8e3da 0%, #c89524 100%)" : "rgba(9, 12, 18, 0.9)",
											boxShadow: activeTab === i ? "0 12px 30px rgba(200, 149, 36, 0.4)" : "0 10px 20px rgba(0, 0, 0, 0.35)",
											border: activeTab === i ? "none" : "1px solid rgba(74, 87, 109, 0.5)",
										}}
									>
										<div className={`relative z-10 flex items-center gap-3 w-full drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)] ${activeTab === i ? "text-white" : "text-gray-200"}`}>
											<div className={`flex items-center justify-center w-9 h-9 rounded-full border ${activeTab === i ? "bg-white/20 border-white/40" : "bg-transparent border-gray-600"}`}>
												<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeTab === i ? "text-white" : "text-gray-300"}>
													{i === 0 ? (
														<>
															<path d="M10.5 3 8 9l4 13 4-13-2.5-6" />
															<path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z" />
															<path d="M2 9h20" />
														</>
													) : (
														<>
															<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
															<circle cx="12" cy="8" r="6" />
														</>
													)}
												</svg>
											</div>
											<div className="text-left flex-1">
												<span className={`font-semibold text-xs leading-tight ${activeTab === i ? "text-white" : "text-gray-100"}`}>{tab.name}</span>
												<span className={`block text-xs ${activeTab === i ? "text-white/70" : "text-gray-400"}`}>
													{i + 1} of {tabs.length}
												</span>
											</div>
											<div className={`w-1.5 h-1.5 rounded-full shadow ${activeTab === i ? "bg-white/90" : "bg-gray-300/70"}`} />
										</div>
									</button>
								))}
							</div>

							{/* Tab Content */}
							<div className="flex-1 relative rounded-lg bg-[#0a0f18]/95 backdrop-blur border border-[#1b2737] shadow-[0_14px_40px_rgba(0,0,0,0.35)] overflow-hidden">
								<div className="p-4 md:p-5 lg:p-6 h-full flex flex-col gap-3">
									<div className="flex flex-col h-full gap-3">
										{/* Text Content */}
										<div className="border-l-2 border-white pl-3 mb-3">
											<p className="text-white text-xs tracking-[0.2em] uppercase mb-1" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
												{current.subtitle}
											</p>
											<h3 className="text-lg md:text-xl text-white mb-2" style={{ fontFamily: "Times New Roman" }}>
												{current.title}
											</h3>
											<p className="text-gray-400 text-xs leading-relaxed max-w-lg" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
												{current.description}
											</p>
										</div>
										{/* Visual */}
										<div className="relative group flex-1">
											<div className="relative overflow-hidden rounded-md border border-[#2b394f] bg-gradient-to-b from-[#0b111a] to-[#0e1420] group-hover:border-[#c89524]/60 transition-all duration-700 h-full min-h-[260px] md:min-h-[320px] lg:min-h-[360px] max-h-[520px]">
												<div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-white/70 z-20 rounded-tl-md" />
												<div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-white/70 z-20 rounded-tr-md" />
												<div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-white/70 z-20 rounded-bl-md" />
												<div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-white/70 z-20 rounded-br-md" />
												<video autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700" key={current.videoUrl}>
													<source src={current.videoUrl} type="video/mp4" />
												</video>
												<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Bottom Quote */}
					<div className="text-center mt-8 md:mt-12">
						<p className="text-sm md:text-base text-gray-400 max-w-2xl px-4 text-center mx-auto">Every piece tells a story of dedication, artistry, and timeless elegance</p>
						<div className="flex items-center justify-center gap-4 mt-4">
							<div className="h-px w-12 bg-white/30" />
							<span className="text-white text-xs tracking-[0.3em]">LKB Jewellers</span>
							<div className="h-px w-12 bg-white/30" />
						</div>
					</div>
				</div>

				{/* Floating particles */}
				<div className="absolute top-20 left-10 w-1 h-1 bg-white rounded-full animate-bounce opacity-30" style={{ animationDuration: "3s" }} />
				<div className="absolute bottom-32 right-20 w-1.5 h-1.5 bg-white rounded-full animate-bounce opacity-20" style={{ animationDuration: "3s", animationDelay: "0.5s" }} />
				<div className="absolute top-1/3 right-10 w-1 h-1 bg-white rounded-full animate-bounce opacity-25" style={{ animationDuration: "3s", animationDelay: "1s" }} />
				<div className="absolute bottom-20 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-bounce opacity-30" style={{ animationDuration: "3s", animationDelay: "1.5s" }} />
			</section>

			{/* ===== THREE PILLARS ===== */}
			<div className="container mx-auto px-4 md:px-6 mb-16 md:mb-24">
				{/* Text Row */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
					<div className="flex flex-col items-center text-center">
						<h3 className="text-white text-xl md:text-2xl mb-3 md:mb-4 font-bold font-heading">Dedicated Client Advisors</h3>
						<p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
							Our client advisors serve as the bridge between our team and our clients, ensuring seamless communication, managing expectations, and overseeing every step of the process. Their dedication to exceptional service ensures that our clients feel valued, informed, and deeply satisfied with their Bespoke Jewellery experience.
						</p>
					</div>
					<div className="flex flex-col items-center text-center border-t md:border-t-0 md:border-l md:border-r border-gray-800 px-4 pt-8 md:pt-0 md:px-6 lg:px-8">
						<h3 className="text-white text-xl md:text-2xl mb-3 md:mb-4 font-bold font-heading">Master Artisans</h3>
						<p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
							Our skilled master artisans are the backbone of our team, bringing decades of experience and a deep reverence for traditional techniques to every piece they create. Their hands carry the wisdom of generations, and their craftsmanship ensures that each creation is a testament to their expertise and dedication.
						</p>
					</div>
					<div className="flex flex-col items-center text-center border-t md:border-t-0 border-gray-800 px-4 pt-8 md:pt-0 md:col-span-2 lg:col-span-1">
						<h3 className="text-white text-xl md:text-2xl mb-3 md:mb-4 font-bold font-heading">Celebrating Moments</h3>
						<p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
							Bespoke Jewellery has a unique capacity to celebrate life&apos;s most significant moments. From engagement and wedding rings that mark the beginning of a lifelong journey, to anniversary gifts that commemorate enduring love, these pieces encapsulate emotions and milestones in exquisite form.
						</p>
					</div>
				</div>
				{/* Images Row */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="relative h-72 sm:h-80 md:h-96 overflow-hidden">
						<Image src="/davido.jpg" alt="Dedicated Client Advisors" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
					</div>
					<div className="relative h-72 sm:h-80 md:h-96 overflow-hidden">
						<Image src="/bespoke/tade-chain-12.jpg" alt="Master Artisans" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
					</div>
					<div className="relative h-72 sm:h-80 md:h-96 overflow-hidden">
						<Image src="/jefe-cover-blogs.jpg" alt="Celebrating Moments" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
					</div>
				</div>
			</div>

			{/* ===== 3-D CAD DESIGN CTA ===== */}
			<div className="container mx-auto px-4 md:px-6 mb-16 md:mb-24">
				<div className="text-center mb-12">
					<div className="flex items-center gap-4 mb-4 justify-center">
						<div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
						<span className="text-white text-xs tracking-[0.5em] uppercase" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
							3-D CAD DESIGN TO FINISHED PRODUCT
						</span>
						<div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
					</div>
					<h2 className="text-5xl md:text-6xl text-white mb-6 font-normal font-heading">
						3-D CAD DESIGN
						<br />
						TO FINISHED PRODUCT
					</h2>
					<p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
						Bring your vision and designs to life with LKB. Whether you&apos;re designing a custom ring or creating bespoke handcrafted jewellery, we transform your ideas into beautifully finished pieces crafted with precision, care, and exceptional attention to detail.
					</p>
					<Link href="/contact" className="inline-block bg-white text-black px-8 md:px-12 py-3 md:py-4 font-bold tracking-widest text-sm md:text-base hover:bg-gray-200 transition-colors">
						START YOUR PROJECT
					</Link>
				</div>
			</div>

			{/* ===== FULL-WIDTH VIDEO ===== */}
			<div className="container mx-auto px-4 md:px-6 mb-16 md:mb-24">
				<div className="relative overflow-hidden rounded-lg group">
					<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10 pointer-events-none" />
					<video className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-cover" autoPlay muted loop playsInline>
						<source src="/about-us-hero.mp4" type="video/mp4" />
						Your browser does not support the video tag.
					</video>
				</div>
			</div>

			{/* ===== ABOUT SPLIT SECTION ===== */}
			<div className="container mx-auto px-4 md:px-6 mb-16 md:mb-24">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
					<div className="relative bg-gray-900 h-64 sm:h-80 md:h-96">
						<div className="grid grid-cols-2 h-full">
							<div className="relative overflow-hidden">
								<Image src="/bespoke/about1.jpg" alt="Bespoke Jewellery Detail" fill className="object-cover" sizes="25vw" />
							</div>
							<div className="relative overflow-hidden">
								<Image src="/bespoke/about2.jpg" alt="Bespoke Craftsmanship" fill className="object-cover" sizes="25vw" />
							</div>
						</div>
					</div>
					<div className="bg-black flex items-center justify-center p-8 md:p-12 lg:p-16">
						<div className="max-w-xl">
							<p className="text-gray-500 uppercase tracking-widest text-xs md:text-sm mb-4 md:mb-6" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
								ABOUT
							</p>
							<h2 className="text-2xl sm:text-3xl md:text-4xl text-white mb-4 md:mb-6 leading-tight font-bold font-heading">Bespoke Jewellery &mdash; Crafting Your Unique Expression</h2>
							<p className="text-gray-400 text-sm md:text-base leading-relaxed" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
								<span className="italic">Bespoke Jewellery</span> is the epitome of personalized exclusive luxury, where craftsmanship meets individuality to create exquisite adornments that tell unique stories. With a commitment to preserving the artistry of traditional jewellery-making while embracing modern sensibilities, Bespoke Jewellery offers a distinctive experience that transcends conventional trends.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* ===== WORK PORTFOLIO ===== */}
			<div className="container mx-auto px-4 md:px-6 mb-16 md:mb-24">
				<div className="text-center mb-12">
					<div className="flex items-center gap-4 mb-4 justify-center">
						<div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
						<span className="text-white text-xs tracking-[0.5em] uppercase" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
							WORK PORTFOLIO
						</span>
						<div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
					</div>
					<h2 className="text-5xl md:text-6xl text-white mb-6 font-normal font-heading">
						CRAFTSMANSHIP
						<br />
						AND CREATIVITY
					</h2>
					<p className="text-gray-400 text-lg max-w-2xl mx-auto" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
						At the heart of Bespoke Jewellery lies an unwavering dedication to craftsmanship. Every piece is meticulously handcrafted by skilled artisans who combine traditional techniques with innovative approaches.
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
					{portfolioImages.map((img, i) => (
						<div key={i} className={`overflow-hidden rounded-lg group relative h-72 sm:h-80 md:h-96 ${i === 2 ? "sm:col-span-2 md:col-span-1" : ""}`}>
							<Image src={img.src} alt={img.alt} fill className="object-cover hover:scale-110 transition-transform duration-700 group-hover:brightness-110" sizes="(max-width: 768px) 100vw, 33vw" />
						</div>
					))}
				</div>
			</div>

			{/* ===== TEAM SPLIT SECTION ===== */}
			<div className="container mx-auto px-4 md:px-6 mb-16 md:mb-24">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
					<div className="relative bg-gray-900 h-64 sm:h-80 md:h-96">
						<div className="grid grid-cols-2 h-full">
							<div className="relative overflow-hidden">
								<Image src="/bespoke/team1.jpg" alt="Bespoke Team" fill className="object-cover" sizes="25vw" />
							</div>
							<div className="relative overflow-hidden">
								<Image src="/bespoke/team2.jpg" alt="Innovative Designers" fill className="object-cover" sizes="25vw" />
							</div>
						</div>
					</div>
					<div className="bg-black flex items-center justify-center p-8 md:p-12 lg:p-16">
						<div className="max-w-xl">
							<p className="text-gray-500 uppercase tracking-widest text-xs md:text-sm mb-4 md:mb-6" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
								TEAM
							</p>
							<h2 className="text-2xl sm:text-3xl md:text-4xl text-white mb-4 md:mb-6 leading-tight font-bold font-heading">The power behind us</h2>
							<p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 md:mb-8" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
								At the heart of every exquisite creation that emerges from Bespoke Jewellery is an exceptional team of dedicated individuals who breathe life into dreams and turn them into wearable works of art. Our team is more than just a group of artisans; they are the architects of emotion, the custodians of craftsmanship, and the conduits through which personal stories are transformed into cherished pieces of jewellery.
							</p>
							<div className="border-l-2 border-white pl-4 md:pl-6">
								<h3 className="text-white font-semibold text-base md:text-lg mb-2 md:mb-3 font-bold font-heading">Innovative Designers:</h3>
								<p className="text-gray-400 text-sm md:text-base leading-relaxed" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
									Our innovative designers are the bridge between imagination and reality. They collaborate closely with clients, unraveling their desires and aspirations to craft designs that resonate on a deeply personal level. With an eye for aesthetics and a flair for innovation, our designers breathe life into the sketches that eventually become cherished heirlooms.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ===== FINAL CTA ===== */}
			<div className="text-center mt-16 md:mt-24 pb-16 md:pb-24 px-4">
				<Link href="/contact" className="inline-block bg-white text-black px-8 md:px-12 py-3 md:py-4 font-bold tracking-widest text-sm md:text-base hover:bg-gray-200 transition-colors">
					START YOUR PROJECT
				</Link>
			</div>

			{/* ===== VISIT OUR SHOWROOM ===== */}
			<ShowroomSection />
		</div>
	);
}
