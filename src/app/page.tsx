"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import ShowroomSection from "@/components/showroom-section";
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
			toast.success("Thanks for subscribing!");
		}, 1000);
	};

	return (
		<div className="bg-black">
			{/* ===== HERO ===== */}
			<section className="relative h-[80vh] md:h-[85vh] lg:h-screen w-full overflow-hidden bg-black">
				<video className="absolute top-0 left-0 w-full h-full object-cover opacity-80" preload="metadata" playsInline autoPlay muted loop style={{ willChange: "transform" }}>
					<source src="/hero-video.webm" type="video/webm" />
					<source src="/hero-video.mp4" type="video/mp4" />
				</video>
				<div className="absolute inset-0 bg-black/40" />
				<div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
					<h2 className="text-white tracking-[0.3em] text-sm md:text-2xl mb-6 animate-slide-up font-display">TIMELESS ELEGANCE</h2>
					<h1 className="text-7xl md:text-9xl lg:text-[12rem] text-white mb-8 animate-fade-in font-normal font-heading" style={{ lineHeight: "normal" }}>
						CRAFTED WITH
						<br />
						PASSION
					</h1>
					<p className="max-w-xl text-gray-200 text-base md:text-lg mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
						LKB Jewellers brings you exceptional pieces that tell your story. Each creation is a testament to our commitment to quality and artistry.
					</p>
					<Link href="/shop" className="border border-white text-white px-10 py-4 text-sm tracking-widest hover:bg-white hover:text-black transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.4s" }}>
						EXPLORE COLLECTION
					</Link>
				</div>
			</section>

			{/* ===== LATEST ARRIVALS ===== */}
			<section className="py-12 md:py-16 bg-black relative overflow-hidden">
				<div className="container mx-auto px-4 md:px-6 relative z-10">
					<div className="text-center mb-12">
						<div className="inline-flex items-center gap-4 mb-6">
							<div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
							<span className="text-white text-xs tracking-[0.5em] uppercase">New Collection</span>
							<div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
						</div>
						<h2 className="text-5xl md:text-6xl text-white mb-6 font-normal font-heading">Latest Arrivals</h2>
						<p className="text-gray-400 text-lg max-w-2xl mx-auto font-display">Scroll to discover our newest pieces, each one crafted with precision and passion</p>
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

			{/* ===== STICKY VIDEO SECTIONS ===== */}
			<div className="relative w-full bg-black">
				{videoSections.map((section, index) => (
					<section key={section.id} className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center border-t border-white/10 bg-black" style={{ zIndex: index + 1 }}>
						<video className="absolute inset-0 w-full h-full object-cover opacity-60 hidden md:block" preload="metadata" playsInline autoPlay muted loop>
							<source src={section.videoUrl.replace('.mp4', '.webm')} type="video/webm" />
							<source src={section.videoUrl} type="video/mp4" />
						</video>
						<video className="absolute inset-0 w-full h-full object-cover opacity-60 md:hidden" preload="metadata" playsInline autoPlay muted loop>
							<source src={(section.mobileVideoUrl || section.videoUrl).replace('.mp4', '.webm')} type="video/webm" />
							<source src={section.mobileVideoUrl || section.videoUrl} type="video/mp4" />
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
							<Link key={card.id} href={card.id === "buy" ? "/we-buy" : card.id === "sell" ? "/shop" : card.id === "service" ? "/servicing" : "/bespoke"} className="group relative h-[380px] md:h-[420px] lg:h-[450px] overflow-hidden cursor-pointer block" style={{ animationDelay: `${index * 100}ms` }}>
								<div className="relative h-full transition-all duration-500 group-hover:-translate-y-4 group-hover:scale-105" style={{ transformStyle: "preserve-3d" }}>
									<div className="absolute inset-0 border-2 border-gray-900 group-hover:border-white/50 transition-all duration-500 z-20 pointer-events-none" />
									<div className="absolute inset-0 overflow-hidden">
										<Image src={card.image} alt={card.title} fill className={"object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 " + (card.hoverImage ? "group-hover:opacity-0" : "")} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
										{card.hoverImage && <Image src={card.hoverImage} alt={card.title} fill className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 opacity-0 group-hover:opacity-100" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />}
									</div>
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
									<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-8 z-20">
										<h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.15em] md:tracking-[0.2em] text-white mb-1 md:mb-2 font-heading">{card.title}</h3>
										<p className="text-gray-300 text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase font-display">{card.description}</p>
									</div>
									<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
								</div>
								<div className="absolute inset-0 bg-black/50 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-8" />
							</Link>
						))}
					</div>

					<div className="flex items-center justify-center gap-4 mt-12">
						<div className="h-px w-24 bg-gradient-to-r from-transparent to-white/50" />
						<div className="w-2 h-2 rounded-full bg-white " />
						<div className="h-px w-24 bg-gradient-to-l from-transparent to-white/50" />
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

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
						{[
							{ href: "/watches", img: "/shop-category/timepieces.jpg", alt: "Exclusive Timepieces", title: "EXCLUSIVE TIMEPIECES", sub: "Exclusive Watches" },
							{ href: "/shop?category=luxury-jewellery", img: "/shop-category/jewellery.jpg", alt: "Fine Jewellery", title: "PREMIUM JEWELLERY", sub: "Bespoke Creations" },
							{ href: "/accessories", img: "/shop-category/accessories.jpg", alt: "LKB Merchandise", title: "MERCHANDISE", sub: "Premium Accessories" },
							{ href: "/engagement-rings", img: "/shop-category/engagement-rings.jpg", alt: "Engagement Rings", title: "ENGAGEMENT RINGS", sub: "Diamond Rings" },
						].map((cat) => (
							<Link key={cat.title} href={cat.href} className="group relative h-[300px] md:h-[320px] lg:h-[350px] overflow-hidden block rounded-lg">
								<div className="absolute inset-0 overflow-hidden">
									<Image src={cat.img} alt={cat.alt} fill className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
								</div>
								<div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
								<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-8">
									<h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.15em] md:tracking-[0.2em] text-white mb-1 md:mb-2 font-heading">{cat.title}</h3>
									<p className="text-gray-300 text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase">{cat.sub}</p>
								</div>
								<div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-all duration-500 pointer-events-none rounded-lg" />
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* ===== NEWSLETTER ===== */}
			<section className="relative py-12 md:py-16 bg-black overflow-hidden">
				<div className="container mx-auto px-4 md:px-6 relative z-10">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-12">
							<div className="inline-flex items-center gap-4 mb-6">
								<div className="h-px w-12 bg-gradient-to-r from-transparent to-white" />
								<span className="text-white text-xs tracking-[0.5em] uppercase">Stay Connected</span>
								<div className="h-px w-12 bg-gradient-to-l from-transparent to-white" />
							</div>
							<h2 className="text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight font-normal font-heading uppercase">JOIN OUR CIRCLE</h2>
							<p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-display">Subscribe to receive exclusive updates on new collections, private sales, and insider access to the world of LKB Jewellers.</p>
						</div>

						<div className="relative px-4">
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
									<h3 className="text-white font-semibold mb-1 md:mb-2 text-xs sm:text-sm md:text-base font-heading uppercase">{stat.title}</h3>
									<p className="text-gray-500 text-[0.65rem] sm:text-xs md:text-sm font-display">{stat.desc}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ===== VISIT OUR SHOWROOM ===== */}
			<ShowroomSection />
		</div>
	);
}
