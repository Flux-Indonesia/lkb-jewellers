"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Clock, Phone } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { videoSections, serviceCards } from "@/data/products";
import { getProducts } from "@/lib/products";
import type { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [showroomTab, setShowroomTab] = useState<"london" | "international">("london");

	useEffect(() => {
		getProducts().then((data) => setProducts(data));
	}, []);

	const latestProducts = products.slice(0, 12);

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) return;
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setEmail("");
			alert("Thanks for subscribing!");
		}, 1000);
	};

	return (
		<div className="bg-black">
			{/* ===== HERO ===== */}
			<section className="relative h-[70vh] md:h-[85vh] lg:h-screen w-full overflow-hidden bg-black">
				<video className="absolute top-0 left-0 w-full h-full object-cover opacity-80" preload="metadata" playsInline autoPlay muted loop style={{ willChange: "transform" }}>
					<source src="/heroVideo.mp4" type="video/mp4" />
				</video>
				<div className="absolute inset-0 bg-black/40" />
				<div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
					<h2 className="text-white tracking-[0.3em] text-sm md:text-2xl mb-6 animate-slide-up" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
						TIMELESS ELEGANCE
					</h2>
					<h1 className="text-7xl md:text-9xl lg:text-[12rem] text-white mb-8 animate-fade-in font-normal font-heading" style={{ lineHeight: "normal" }}>
						CRAFTED WITH
						<br />
						PASSION
					</h1>
					<p
						className="max-w-xl text-gray-200 text-base md:text-lg mb-10 leading-relaxed animate-slide-up"
						style={{
							animationDelay: "0.2s",
							fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif',
						}}
					>
						LKB Jewellers brings you exceptional pieces that tell your story. Each creation is a testament to our commitment to quality and artistry.
					</p>
					<Link href="/shop" className="border border-white text-white px-10 py-4 text-sm tracking-widest hover:bg-white hover:text-black transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.4s" }}>
						EXPLORE COLLECTION
					</Link>
				</div>
			</section>

			{/* ===== LATEST ARRIVALS ===== */}
			<section className="py-12 md:py-16 bg-black relative overflow-hidden">
				<div className="absolute inset-0 opacity-5">
					<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-[120px] animate-pulse" />
					<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
				</div>
				<div className="container mx-auto px-4 md:px-6 relative z-10">
					<div className="text-center mb-8">
						<div className="inline-flex items-center gap-4 mb-4">
							<div className="h-px w-12 bg-gradient-to-r from-transparent to-white" />
							<span className="text-gray-200 text-xs tracking-[0.4em] uppercase">New Collection</span>
							<div className="h-px w-12 bg-gradient-to-l from-transparent to-white" />
						</div>
						<h2 className="text-4xl md:text-5xl text-white mb-4 font-normal font-heading">Latest Arrivals</h2>
						<p className="text-gray-300 text-base max-w-xl mx-auto font-display">Scroll to discover our newest pieces, each one crafted with precision and passion</p>
					</div>
				</div>

				{/* Marquee carousel - full width, outside container */}
				<div className="relative z-10 w-[80%] mx-auto">
					<Marquee pauseOnHover repeat={8} className="py-12 [--duration:60s] [--gap:1rem]">
						{latestProducts.map((product) => (
							<Link key={product.id} href={`/product/${product.id}`} className="group/card relative flex-shrink-0 w-[180px] sm:w-[210px] md:w-[240px]">
								<div className="relative aspect-[3/4] overflow-hidden bg-black rounded-lg">
									<Image src={product.image} alt={product.name} fill className="object-cover transition-all duration-700 group-hover/card:scale-110" sizes="(max-width: 640px) 180px, (max-width: 768px) 210px, 240px" />
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover/card:opacity-60 transition-opacity duration-500" />
									<div className="absolute inset-0 rounded-lg transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.4)] group-hover/card:ring-1 group-hover/card:ring-white/20" />

									{/* Corner decorations on hover */}
									<div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
									<div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
									<div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
									<div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

									{/* Bottom info */}
									<div className="absolute inset-x-0 bottom-0 p-4">
										<div className="h-0.5 w-12 bg-gradient-to-r from-white to-transparent mb-3" />
										<h3 className="text-white text-base font-sans mb-1 line-clamp-2 drop-shadow-2xl font-semibold">{product.name}</h3>
										<p className="text-white text-sm font-bold mb-2 drop-shadow-lg">£{product.price.toLocaleString("en-GB")}</p>
										<div className="flex items-center gap-2 text-white text-[10px] font-bold tracking-wider uppercase opacity-0 -translate-x-4 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-500">
											<span>View Details</span>
											<ArrowRight className="w-3 h-3" />
										</div>
									</div>

									{/* NEW badge */}
									<div className="absolute top-3 left-3">
										<Badge className="bg-white/90 backdrop-blur-sm text-black text-xs font-bold tracking-wider uppercase hover:bg-white/90">New</Badge>
									</div>
								</div>
							</Link>
						))}
					</Marquee>
				</div>

				<div className="container mx-auto px-4 md:px-6 relative z-10">
					<div className="text-center mt-12">
						<Button asChild className="group bg-white text-black px-10 py-4 h-auto font-bold tracking-widest text-sm hover:shadow-2xl hover:shadow-white/50 rounded-none relative overflow-hidden hover:bg-white active:scale-95 transition-all duration-300">
							<Link href="/shop">
								<span className="relative z-10">EXPLORE FULL COLLECTION</span>
								<ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
								<div className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* ===== CRAFTSMANSHIP ===== */}
			<section className="relative py-16 md:py-20 lg:py-28 bg-black overflow-hidden">
				<div className="absolute inset-0">
					<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-white/5" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-[150px] animate-pulse" />
				</div>
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full animate-float" />
					<div className="absolute bottom-20 right-10 w-48 h-48 border border-white/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />
				</div>

				<div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
						<div className="flex flex-col justify-center space-y-6 md:space-y-8 max-w-xl mx-auto lg:mx-0 py-8 md:py-12">
							<div className="flex items-center gap-4">
								<div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
								<span className="text-white uppercase tracking-[0.3em] text-xs font-light">Bespoke Craftsmanship</span>
							</div>
							<h2 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-heading">
								<span className="text-white block mb-2 font-bold tracking-[0.2em]">CRAFTING MOMENTS</span>
								<span className="text-white block mb-2 font-bold tracking-[0.2em]">THAT</span>
								<span className="block text-white font-bold tracking-[0.2em]">LAST A LIFETIME</span>
							</h2>
							<div className="relative pl-6 border-l-2 border-white/30">
								<p className="text-gray-300 text-base leading-relaxed">We design more than jewellery. We create heirlooms that capture memories and emotions with uncompromising craftsmanship.</p>
							</div>
							<div className="flex flex-wrap gap-4 pt-4">
								<Button asChild className="group relative px-6 py-3 h-auto bg-white text-black font-bold tracking-widest text-sm overflow-hidden hover:shadow-2xl hover:shadow-white/50 rounded-none hover:bg-white active:scale-95 transition-all duration-300">
									<Link href="/bespoke">
										<span className="relative z-10">LEARN MORE</span>
										<div className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									</Link>
								</Button>
								<Button variant="outline" asChild className="group px-6 py-3 h-auto border-2 border-white text-white bg-transparent font-bold tracking-widest text-sm hover:bg-white hover:text-black rounded-none active:scale-95 transition-all duration-300">
									<Link href="/shop">
										DISCOVER
										<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
									</Link>
								</Button>
							</div>
						</div>

						<div className="flex items-center justify-center px-4 md:px-0">
							<div className="relative max-w-xl w-full">
								<div className="absolute -inset-4 bg-gradient-to-r from-white via-gray-400 to-white opacity-20 animate-pulse" />
								<div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-white" />
								<div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-white" />
								{/* Sparkles */}
								<div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-sparkle" />
								<div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-gray-300 rounded-full animate-sparkle" style={{ animationDelay: "0.5s" }} />
								<div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white rounded-full animate-sparkle" style={{ animationDelay: "1s" }} />
								<div className="absolute top-1/4 right-1/4 text-white text-2xl animate-sparkle opacity-80" style={{ animationDelay: "0.3s" }}>
									✦
								</div>
								<div className="absolute bottom-1/4 right-1/3 text-gray-300 text-xl animate-sparkle opacity-70" style={{ animationDelay: "1.2s" }}>
									✦
								</div>

								<div className="relative aspect-square max-h-[500px] overflow-visible rounded-lg group w-full">
									<div className="absolute -inset-24 bg-white/20 rounded-full blur-[140px] opacity-90 animate-pulse" style={{ animationDuration: "3s" }} />
									<div className="absolute -inset-12 bg-white/15 rounded-full blur-[80px] opacity-95 animate-pulse group-hover:opacity-100 transition-opacity duration-1000" style={{ animationDuration: "6s", animationDelay: "1.5s" }} />
									<div className="relative w-full h-full overflow-hidden rounded-lg shadow-[0_0_80px_rgba(255,255,255,0.6)]">
										<Image src="https://i0.wp.com/lkbjewellers.com/wp-content/uploads/2023/12/MINI-LKB-PENDANT.jpg?w=1500&ssl=1" alt="Exclusive bespoke pendant craftsmanship" fill className="object-contain transform group-hover:scale-105 transition-transform duration-700 relative z-10" sizes="(max-width: 1024px) 100vw, 50vw" />
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
										<div className="absolute top-6 right-6 bg-black/80 backdrop-blur-sm border border-white/50 px-4 py-2 rounded-full z-20">
											<span className="text-white text-xs font-semibold tracking-wider">HANDCRAFTED</span>
										</div>
									</div>
								</div>
								<div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full animate-pulse" />
								<div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
							</div>
						</div>
					</div>
				</div>
				<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
			</section>

			{/* ===== STICKY VIDEO SECTIONS ===== */}
			<div className="relative w-full bg-black">
				{videoSections.map((section, index) => (
					<section key={section.id} className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center border-t border-white/10 bg-black" style={{ zIndex: index + 1 }}>
						<video className="absolute inset-0 w-full h-full object-cover opacity-60" preload="metadata" playsInline autoPlay muted loop>
							<source src={section.videoUrl} type="video/mp4" />
						</video>
						<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
						<div className="relative z-10 text-center max-w-4xl px-6">
							<h2 className="text-6xl md:text-8xl text-white mb-8 uppercase font-bold text-shadow-hero font-heading">{section.title}</h2>
							<Button variant="link" asChild className="text-white border-b border-white pb-2 hover:text-gray-300 hover:border-gray-300 hover:no-underline tracking-widest text-sm rounded-none h-auto px-0">
								<Link href={section.link}>
									DISCOVER <ArrowRight size={16} />
								</Link>
							</Button>
						</div>
					</section>
				))}
			</div>

			{/* ===== WHAT WE OFFER ===== */}
			<section className="py-12 md:py-16 bg-gradient-to-b from-[#0a0a0a] to-black px-4 md:px-6 relative overflow-hidden">
				<div className="absolute inset-0 opacity-5 overflow-hidden">
					<div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-[120px] animate-pulse" />
					<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
				</div>
				<div className="container mx-auto relative z-10">
					<div className="text-center mb-12">
						<div className="inline-flex items-center gap-4 mb-6">
							<div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
							<span className="text-white text-xs tracking-[0.5em] uppercase">Our Expertise</span>
							<div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
						</div>
						<h2 className="text-5xl md:text-6xl text-white mb-6 font-normal font-heading">
							What We <span className="text-white">Offer</span>
						</h2>
						<p className="text-gray-400 text-lg max-w-2xl mx-auto font-display">Exceptional services tailored to your vision</p>
						<Button variant="link" asChild className="text-gray-500 hover:text-white text-xs tracking-widest uppercase pt-4 h-auto p-0 hover:no-underline group">
							<Link href="/contact">
								Contact a Specialist
								<ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
							</Link>
						</Button>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
						{serviceCards.map((card, index) => (
							<Link key={card.id} href={card.id === "buy" ? "/we-buy" : card.id === "sell" ? "/shop" : card.id === "service" ? "/servicing" : "/bespoke"} className="group relative h-[350px] md:h-[400px] lg:h-[450px] overflow-hidden cursor-pointer block" style={{ animationDelay: `${index * 100}ms` }}>
								<div className="relative h-full transition-all duration-500 group-hover:-translate-y-4 group-hover:scale-105" style={{ transformStyle: "preserve-3d" }}>
									<div className="absolute inset-0 border-2 border-gray-900 group-hover:border-[#D4AF37]/50 transition-all duration-500 z-20 pointer-events-none" />
									<div className="absolute inset-0 overflow-hidden">
										<Image src={card.image} alt={card.title} fill className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
									</div>
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
									<div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#D4AF37] via-white to-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left z-30" />
									<div className="absolute top-6 right-6 z-30">
										<div className="w-12 h-12 rounded-full border border-gray-700 group-hover:border-[#D4AF37] bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-500 group-hover:scale-110">
											<span className="text-[#D4AF37] text-sm font-bold">0{index + 1}</span>
										</div>
									</div>
									<div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 lg:p-8 z-20">
										<div className="w-12 h-12 mb-4 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transform -translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
											<ArrowRight size={20} className="text-[#D4AF37] rotate-[-45deg]" />
										</div>
										<h3 className="text-2xl md:text-3xl text-white mb-2 md:mb-3 transition-all duration-300 group-hover:text-white font-bold font-heading">{card.title}</h3>
										<p className="text-gray-400 text-xs md:text-sm leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150">{card.description}</p>
										<div className="flex items-center gap-2 text-[#D4AF37] text-[0.65rem] md:text-xs tracking-widest uppercase mt-3 md:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
											Learn More
											<ArrowRight size={10} className="md:w-3 md:h-3 group-hover:translate-x-2 transition-transform" />
										</div>
									</div>
									<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
								</div>
								<div className="absolute inset-0 bg-black/50 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-8" />
							</Link>
						))}
					</div>

					<div className="flex items-center justify-center gap-4 mt-12">
						<div className="h-px w-24 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
						<div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
						<div className="h-px w-24 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
					</div>
				</div>
			</section>

			{/* ===== SHOP BY CATEGORY ===== */}
			<section className="py-12 md:py-16 bg-black px-4 md:px-6 relative overflow-hidden">
				<div className="container mx-auto relative z-10 max-w-7xl">
					<div className="text-center mb-12">
						<div className="inline-flex items-center gap-4 mb-6">
							<div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
							<span className="text-white text-xs tracking-[0.5em] uppercase">Curated Collections</span>
							<div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
						</div>
						<h2 className="text-5xl md:text-6xl text-white mb-6 font-normal font-heading">
							Shop By <span className="font-normal text-white">Category</span>
						</h2>
						<p className="text-gray-400 text-lg max-w-2xl mx-auto font-display">Discover Excellence</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
						{[
							{ href: "/watches", img: "https://i.ibb.co/ynGMQB6f/1-blue-gold.jpg", alt: "Exclusive Watches", title: "TIMEPIECES", sub: "Exclusive Watches" },
							{ href: "/shop?category=luxury-jewellery", img: "https://i.ibb.co/m5z17bfC/1.jpg", alt: "Fine Jewellery", title: "EXCLUSIVE JEWELLERY", sub: "Bespoke Creations" },
							{ href: "/accessories", img: "https://i.ibb.co/9HRG7t7H/WEBNEWHATS-8.jpg", alt: "LKB Merchandise", title: "ACCESSORIES", sub: "Premium Accessories", extraClass: "md:col-span-2 lg:col-span-1" },
						].map((cat) => (
							<Link key={cat.title} href={cat.href} className={`group relative h-[250px] md:h-[280px] lg:h-[300px] overflow-hidden block rounded-lg ${cat.extraClass || ""}`}>
								<div className="absolute inset-0 overflow-hidden">
									<Image src={cat.img} alt={cat.alt} fill className="object-cover transition-transform duration-500 ease-out group-hover:scale-110" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
									<div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
								</div>
								<div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
								<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-8">
									<h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.15em] md:tracking-[0.2em] text-white mb-1 md:mb-2 font-heading">{cat.title}</h3>
									<p className="text-gray-300 text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase">{cat.sub}</p>
								</div>
								<div className="absolute inset-0 border-2 border-gray-800 group-hover:border-white/50 transition-all duration-500 pointer-events-none rounded-lg" />
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* ===== NEWSLETTER ===== */}
			<section className="relative py-12 md:py-16 bg-black overflow-hidden">
				<div className="absolute inset-0 opacity-10 overflow-hidden">
					<div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-[150px] animate-pulse" />
					<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "1.5s" }} />
				</div>
				<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
				<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

				<div className="container mx-auto px-4 md:px-6 relative z-10">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-12">
							<div className="inline-flex items-center gap-4 mb-6">
								<div className="h-px w-12 bg-gradient-to-r from-transparent to-white" />
								<span className="text-white text-xs tracking-[0.5em] uppercase">Stay Connected</span>
								<div className="h-px w-12 bg-gradient-to-l from-transparent to-white" />
							</div>
							<h2 className="text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight font-normal font-heading">Join Our Circle</h2>
							<p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-display">Subscribe to receive exclusive updates on new collections, private sales, and insider access to the world of LKB Jewellers.</p>
						</div>

						<div className="relative px-4">
							<div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/40 to-white/20 rounded-2xl blur-lg opacity-50" />
							<div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 lg:p-12">
								<form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3 md:gap-4">
									<div className="flex-1 relative group">
										<Input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} className="w-full px-4 md:px-6 py-3 md:py-4 h-auto bg-black/50 border-gray-700 rounded-lg text-white placeholder:text-gray-500 text-base focus-visible:border-white focus-visible:ring-white/20" style={{ fontSize: "16px" }} required />
										<div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
									</div>
									<Button type="submit" disabled={loading} className="group relative px-6 md:px-8 py-3 md:py-4 h-auto bg-white text-black font-bold tracking-widest text-xs md:text-sm rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-white/50 hover:scale-105 hover:bg-white active:scale-95 transition-all duration-300">
										<span className="relative z-10 flex items-center justify-center gap-2">
											{loading ? "SENDING..." : "SUBSCRIBE"}
											<ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
										</span>
										<div className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									</Button>
								</form>
								<p className="text-gray-500 text-[0.65rem] md:text-xs text-center mt-4 md:mt-6 px-2">
									By subscribing, you agree to our{" "}
									<Link href="/privacy-policy" className="text-white hover:underline">
										Privacy Policy
									</Link>
									. Unsubscribe anytime.
								</p>
								{/* Corner decorations */}
								<div className="absolute top-3 left-3 md:top-4 md:left-4 w-12 h-12 md:w-16 md:h-16 border-t border-l border-white/20 rounded-tl-xl" />
								<div className="absolute top-3 right-3 md:top-4 md:right-4 w-12 h-12 md:w-16 md:h-16 border-t border-r border-white/20 rounded-tr-xl" />
								<div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-12 h-12 md:w-16 md:h-16 border-b border-l border-white/20 rounded-bl-xl" />
								<div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-12 h-12 md:w-16 md:h-16 border-b border-r border-white/20 rounded-br-xl" />
							</div>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 mt-8 md:mt-12 px-2 md:px-4">
							{[
								{ icon: "✦", title: "Exclusive Previews", desc: "Be first to see new collections" },
								{ icon: "★", title: "Special Offers", desc: "Members-only discounts & sales" },
								{ icon: "◆", title: "Expert Insights", desc: "Jewellery care & styling tips" },
							].map((stat) => (
								<div key={stat.title} className="text-center">
									<div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-3 lg:mb-4 rounded-full bg-white/10 border border-white/30 flex items-center justify-center">
										<span className="text-white text-lg sm:text-xl md:text-2xl">{stat.icon}</span>
									</div>
									<h3 className="text-white font-semibold mb-1 md:mb-2 text-xs sm:text-sm md:text-base font-heading">{stat.title}</h3>
									<p className="text-gray-500 text-[0.65rem] sm:text-xs md:text-sm">{stat.desc}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ===== FULL-WIDTH SEPARATOR ===== */}
			<div className="w-full h-px bg-gray-800" />

			{/* ===== VISIT OUR SHOWROOM ===== */}
			<section className="bg-black py-24 relative overflow-hidden">
				<div className="container mx-auto px-6 max-w-7xl">
					<div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-8 border border-gray-800 bg-[#050505] relative z-10 mx-auto max-w-6xl">
						{/* Left - Showroom Image */}
						<div className="w-full md:w-1/2 h-[300px] md:h-[500px] relative transition-all duration-700 overflow-hidden group">
							<Image src={showroomTab === "london" ? "https://www.lkbjewellers.com/showroomEntry.jpg" : "https://www.lkbjewellers.com/showroomEntry2.jpg"} alt={showroomTab === "london" ? "Hatton Garden Showroom" : "International Service"} fill className="object-cover transform group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
							<div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
							{/* Location Tabs */}
							<div className="absolute bottom-8 left-8 flex gap-3 z-10">
								<button onClick={() => setShowroomTab("london")} className={`px-6 py-4 text-sm font-bold tracking-widest uppercase transition-all ${showroomTab === "london" ? "bg-white text-black" : "bg-black/60 text-white hover:bg-white/20"}`}>
									London HQ
								</button>
								<button onClick={() => setShowroomTab("international")} className={`px-6 py-4 text-sm font-bold tracking-widest uppercase transition-all ${showroomTab === "international" ? "bg-white text-black" : "bg-black/60 text-white hover:bg-white/20"}`}>
									International
								</button>
							</div>
						</div>

						{/* Right - Info */}
						<div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left">
							<span className="text-white text-xs tracking-[0.3em] uppercase mb-4 block">{showroomTab === "london" ? "The Experience" : "Global Service"}</span>
							<h2 className="text-3xl md:text-4xl text-white mb-6 leading-tight font-heading">{showroomTab === "london" ? "Visit Our Showroom" : "International Delivery"}</h2>
							<div className="w-12 h-0.5 bg-gray-800 mb-8" />
							<p className="text-gray-400 leading-relaxed mb-8 max-w-md text-base">
								{showroomTab === "london" ? "Immerse yourself in the world of Local Kettle Brothers. Our Hatton Garden boutique offers a private, exclusive environment to view our exclusive timepieces and discuss bespoke commissions." : "We cater to international clients with personalized service. No need to travel to us - once you have decided on your chosen watch, we will have a member of our team personally fly to hand deliver it to you, anywhere in the world."}
							</p>

							{/* Contact Details */}
							<div className="space-y-6 mb-8 w-full max-w-md">
								{showroomTab === "london" ? (
									<>
										<div className="flex items-start gap-4">
											<div className="bg-gray-900 p-2 rounded-full flex-shrink-0">
												<MapPin className="text-white" size={18} />
											</div>
											<div className="text-left">
												<h4 className="text-white text-sm font-bold uppercase tracking-wide font-heading">Address</h4>
												<span className="text-gray-400 text-sm font-display">New House, 67-68 Hatton Garden, London, EC1N 8JY</span>
											</div>
										</div>
										<div className="flex items-start gap-4">
											<div className="bg-gray-900 p-2 rounded-full flex-shrink-0">
												<Clock className="text-white" size={18} />
											</div>
											<div className="text-left">
												<h4 className="text-white text-sm font-bold uppercase tracking-wide font-heading">Opening Hours</h4>
												<span className="text-gray-400 text-sm font-display">Mon - Sun: By Appointment Only</span>
											</div>
										</div>
										<div className="flex items-start gap-4">
											<div className="bg-gray-900 p-2 rounded-full flex-shrink-0">
												<Phone className="text-white" size={18} />
											</div>
											<div className="text-left">
												<h4 className="text-white text-sm font-bold uppercase tracking-wide font-heading">Contact</h4>
												<span className="text-gray-400 text-sm font-display">+44 20 3336 5303</span>
											</div>
										</div>
										<div className="flex items-start gap-4">
											<div className="bg-gray-900 p-2 rounded-full flex-shrink-0">
												<svg viewBox="0 0 24 24" width={18} height={18} className="text-white" fill="currentColor">
													<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
												</svg>
											</div>
											<div className="text-left">
												<h4 className="text-white text-sm font-bold uppercase tracking-wide font-heading">WhatsApp</h4>
												<a href="https://wa.me/447802323652?text=Hello%2C%20I%27m%20interested%20in%20visiting%20your%20showroom" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm transition-colors font-display">
													+44 78 0232 3652
												</a>
											</div>
										</div>
									</>
								) : (
									<>
										<div className="flex items-start gap-4">
											<div className="bg-gray-900 p-2 rounded-full flex-shrink-0">
												<MapPin className="text-white" size={18} />
											</div>
											<div className="text-left">
												<h4 className="text-white text-sm font-bold uppercase tracking-wide font-heading">Worldwide Delivery</h4>
												<span className="text-gray-400 text-sm font-display">Hand-delivered to your door, anywhere in the world</span>
											</div>
										</div>
										<div className="flex items-start gap-4">
											<div className="bg-gray-900 p-2 rounded-full flex-shrink-0">
												<Phone className="text-white" size={18} />
											</div>
											<div className="text-left">
												<h4 className="text-white text-sm font-bold uppercase tracking-wide font-heading">Contact</h4>
												<span className="text-gray-400 text-sm font-display">+44 20 3336 5303</span>
											</div>
										</div>
									</>
								)}
							</div>

							<Link href="https://maps.google.com/?q=New+House+67-68+Hatton+Garden+London+EC1N+8JY" target="_blank" rel="noopener noreferrer" className="bg-white text-black px-8 py-3 text-sm font-bold tracking-widest hover:bg-gray-200 transition-all duration-300 inline-flex items-center gap-2 active:scale-95">
								GET DIRECTIONS <ArrowRight size={16} />
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
