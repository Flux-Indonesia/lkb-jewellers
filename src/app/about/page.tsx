"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ShowroomSection from "@/components/showroom-section";
import { BLUR_DATA_URL } from '@/lib/utils'

const hallOfFameItems = [
	{
		image: "/images/static/nav-chain.jpg",
		title: "24mm Raised Diamond Pointer",
		subtitle: "MIAMI CUBAN CHAIN",
		year: "YEAR 2024",
		description:
			"Miami Cuban chains boasting distinctive interlocking links and weighty design. Meticulously set by our accomplished in-house team.",
		featured: true,
	},
	{
		image: "/images/static/nav-ring.jpg",
		title: "Rose Gold Diamond Collection",
		subtitle: "ETERNITY RING",
	},
	{
		image: "/images/static/nav-pendant.jpg",
		title: "JH Custom Diamond",
		subtitle: "BESPOKE PENDANT",
	},
	{
		image: "/images/static/hof-batman.jpg",
		title: "Rolex Batman",
		subtitle: "GMT MASTER II",
	},
];

const socialStats = [
	{
		icon: (
			<svg viewBox="0 0 24 24" width={28} height={28} fill="currentColor">
				<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
			</svg>
		),
		number: "143K+",
		label: "Instagram Followers",
		linkText: "Follow Us",
		glowClass: "bg-pink-500/20",
		borderClass: "border-pink-500/50",
		textClass: "text-pink-500",
		hoverClass: "group-hover:text-pink-500",
		href: "https://www.instagram.com/localkettlebrothersuk/",
	},
	{
		icon: (
			<svg viewBox="0 0 24 24" width={28} height={28} fill="currentColor">
				<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.16 8.16 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
			</svg>
		),
		number: "7.9K+",
		label: "TikTok Followers",
		linkText: "Follow Us",
		glowClass: "bg-white/20",
		borderClass: "border-white/50",
		textClass: "text-white",
		hoverClass: "group-hover:text-white",
		href: "https://www.tiktok.com/@localkettlebrothersuk",
	},
	{
		icon: (
			<svg viewBox="0 0 24 24" width={28} height={28} fill="currentColor">
				<path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
			</svg>
		),
		number: "354K+",
		label: "YouTube Views",
		linkText: "Subscribe",
		glowClass: "bg-red-500/20",
		borderClass: "border-red-500/50",
		textClass: "text-red-500",
		hoverClass: "group-hover:text-red-500",
		href: "https://www.youtube.com/@lkbjewellers",
	},
];

export default function AboutPage() {
	return (
		<div className="bg-black min-h-screen">
			{/* Hero with Background Image */}
			<section className="relative h-[70vh] w-full overflow-hidden">
				<div
					className="absolute inset-0 bg-cover"
					style={{
						backgroundImage: "url('/about-us/hero-about.webp')",
						backgroundPosition: "center 60%",
					}}
				/>
				<div className="absolute inset-0 bg-black/60" />
				<div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
					<span className="text-gold text-sm tracking-[0.3em] uppercase mb-4 animate-slide-up">
						The LKB Legacy
					</span>
					<h1 className="text-5xl md:text-7xl text-white mb-8 max-w-4xl leading-tight animate-fade-in font-heading">
						Diamonds From The Dirt
					</h1>
				</div>
			</section>

			{/* Hatton Garden Heritage */}
			<section className="py-24 px-6">
				<div className="container mx-auto">
					<div className="flex flex-col lg:flex-row gap-16 items-center">
						{/* Left - Text */}
						<div className="lg:w-1/2">
							<h2 className="text-4xl mb-8 text-gold font-heading">
								Hatton Garden Heritage
							</h2>
							<p className="text-gray-300 leading-loose mb-6 text-lg">
								The Local Kettle Brothers aren&apos;t just jewellers; we are
								custodians of a craft that demands perfection. Based in the heart
								of London&apos;s iconic jewellery district, Hatton Garden, our
								journey is one of resilience, artistry, and an unyielding
								commitment to excellence.
							</p>
							<p className="text-gray-300 leading-loose mb-8 text-lg">
								From bespoke pieces for the UK&apos;s biggest music artists to
								sourcing the rarest Richard Mille timepieces for collectors, we
								have built a reputation on trust and quality. We believe that
								every piece of jewellery tells a story—your story.
							</p>
							<Image
								src="/white-logo.png"
								alt="LKB Logo"
								width={64}
								height={64}
								className="h-16 w-auto opacity-50" placeholder="blur" blurDataURL={BLUR_DATA_URL}
							/>
						</div>

						{/* Right - Image with Quote */}
						<div className="lg:w-1/2 relative">
							<div className="aspect-[3/4] border border-gray-800 p-4">
								<div className="relative w-full h-full overflow-hidden">
									<Image
										src="/about-us/heritage.jpg"
										alt="LKB Jewellers craftsmanship"
										fill
										className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
										sizes="(max-width: 1024px) 100vw, 50vw" placeholder="blur" blurDataURL={BLUR_DATA_URL}
									/>
								</div>
							</div>
							{/* Floating Quote */}
							<div className="absolute -bottom-10 -left-10 bg-[#0a0a0a] p-8 border border-gray-800 max-w-xs hidden lg:block">
								<p className="text-xl italic text-gold font-heading">
									&ldquo;We don&apos;t just sell gold. We forge legacy.&rdquo;
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Excellence in Numbers */}
			<section className="py-20 bg-[#0a0a0a] border-y border-gray-900 relative overflow-hidden">
				<div className="absolute inset-0 opacity-5">
					<div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gold rounded-full blur-[120px]" />
					<div className="absolute top-1/2 right-1/4 w-96 h-96 bg-white rounded-full blur-[120px]" />
				</div>

				<div className="container mx-auto px-6 relative z-10">
					{/* Section Header */}
					<div className="text-center mb-12">
						<div className="inline-flex items-center gap-4 mb-6">
							<div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
							<span className="text-gold text-xs tracking-[0.5em] uppercase">
								Our Achievements
							</span>
							<div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
						</div>
						<h2 className="text-5xl md:text-6xl text-white mb-6 font-normal font-heading">
							Excellence in Numbers
						</h2>
						<p className="text-gray-400 text-lg max-w-2xl mx-auto font-display">
							Our commitment to craftsmanship and client satisfaction speaks
							through our achievements
						</p>
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
						{[
							{ icon: "✦", number: "15+", label: "Years Experience" },
							{ icon: "◆", number: "1000+", label: "Pieces Crafted" },
							{ icon: "★", number: "100%", label: "Satisfaction" },
						].map((stat) => (
							<div key={stat.label} className="text-center group">
								<div className="relative w-16 h-16 mx-auto mb-4">
									<div className="absolute inset-0 bg-gold/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
									<div className="relative w-full h-full rounded-full border-2 border-gold/50 bg-black/50 flex items-center justify-center">
										<span className="text-gold text-2xl">{stat.icon}</span>
									</div>
								</div>
								<div className="text-4xl md:text-5xl font-bold text-white group-hover:text-gold transition-colors duration-300 mb-2 font-heading">
									{stat.number}
								</div>
								<p className="text-gray-400 text-xs tracking-[0.3em] uppercase">
									{stat.label}
								</p>
								<div className="h-px w-16 mx-auto mt-4 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
							</div>
						))}
					</div>

					{/* Decorative Divider */}
					<div className="flex items-center justify-center gap-4 my-16">
						<div className="h-px w-24 bg-gradient-to-r from-transparent to-gold/50" />
						<svg
							viewBox="0 0 24 24"
							width={16}
							height={16}
							className="text-gold"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M2 4l3 12h14l3-12-8.5 5.5L12 2l-1.5 7.5L2 4z" />
						</svg>
						<div className="h-px w-24 bg-gradient-to-l from-transparent to-gold/50" />
					</div>

					{/* Join Our Community */}
					<div className="text-center mb-12">
						<h3 className="text-5xl md:text-6xl text-white mb-6 font-normal font-heading">
							Join Our Community
						</h3>
						<p className="text-gray-400 text-lg max-w-2xl mx-auto font-display">
							Follow our journey across social platforms
						</p>
					</div>

					{/* Social Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						{socialStats.map((social) => (
							<div key={social.label} className="text-center group">
								<div className="relative w-16 h-16 mx-auto mb-4">
									<div
										className={`absolute inset-0 ${social.glowClass} rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
									/>
									<div
										className={`relative w-full h-full rounded-full border-2 ${social.borderClass} bg-black/50 flex items-center justify-center ${social.textClass}`}
									>
										{social.icon}
									</div>
								</div>
								<div
									className={`text-4xl md:text-5xl font-bold text-white ${social.hoverClass} transition-colors duration-300 mb-2 font-heading`}
								>
									{social.number}
								</div>
								<p className="text-gray-400 text-xs tracking-[0.3em] uppercase mb-4">
									{social.label}
								</p>
								<a
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className={`${social.textClass} text-sm font-semibold tracking-wider hover:underline`}
								>
									{social.linkText}
								</a>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Hall of Fame */}
			<section className="py-12 bg-gradient-to-b from-black to-[#0a0a0a] relative overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-[150px]" />
					<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold rounded-full blur-[150px]" style={{ animationDelay: "2s" }} />
				</div>

				<div className="container mx-auto px-6 relative z-10">
					{/* Header */}
					<div className="text-center mb-12">
						<div className="flex items-center justify-center gap-4 mb-6">
							<div className="h-px w-24 bg-gradient-to-r from-transparent to-gold/50" />
							<svg viewBox="0 0 24 24" width={16} height={16} className="text-gold" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
								<path d="M2 4l3 12h14l3-12-8.5 5.5L12 2l-1.5 7.5L2 4z" />
							</svg>
							<div className="h-px w-24 bg-gradient-to-l from-transparent to-gold/50" />
						</div>
						<h2 className="text-5xl md:text-6xl text-white mb-6 font-normal font-heading">
							Hall of Fame
						</h2>
						<p className="text-gray-400 text-lg max-w-2xl mx-auto font-display">
							Celebrating our distinguished clientele and their extraordinary pieces
						</p>
					</div>

					{/* Gallery Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
						{hallOfFameItems.map((item) => (
							<div
								key={item.title}
								className={`relative overflow-hidden group cursor-pointer ${
									item.featured
										? "lg:col-span-2 lg:row-span-2 h-[250px] md:h-[300px] lg:h-[612px]"
										: "h-[300px] hover:scale-105 transition-transform duration-300"
								}`}
							>
								<Image
									src={item.image}
									alt={item.title}
									fill
									className="object-cover transition-all duration-700 group-hover:scale-110"
									sizes={item.featured ? "50vw" : "25vw"} placeholder="blur" blurDataURL={BLUR_DATA_URL}
								/>
								<div
									className={`absolute inset-0 ${
										item.featured
											? "bg-gradient-to-t from-black via-black/70 to-transparent"
											: "bg-gradient-to-t from-black/80 via-black/40 to-transparent"
									}`}
								/>
								<div className="absolute bottom-0 left-0 right-0 p-6">
									{item.year && (
										<span className="text-gold text-xs tracking-[0.25em] uppercase mb-2 block">
											{item.year}
										</span>
									)}
									<h3 className="text-2xl text-white mb-1 font-heading">
										{item.title}
									</h3>
									<p className="text-gray-400 uppercase tracking-wider text-sm">
										{item.subtitle}
									</p>
									{item.description && (
										<p className="text-gray-400 text-sm mt-3 leading-relaxed max-w-md">
											{item.description}
										</p>
									)}
									{item.featured && (
										<div className="flex items-center justify-center gap-4 mt-6">
											<div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
											<svg viewBox="0 0 24 24" width={12} height={12} className="text-gold" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
												<path d="M2 4l3 12h14l3-12-8.5 5.5L12 2l-1.5 7.5L2 4z" />
											</svg>
											<div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
										</div>
									)}
								</div>
							</div>
						))}
					</div>

					{/* View Full Hall of Fame CTA */}
					<div className="text-center">
						<Link
							href="/hall-of-fame"
							className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold/10 to-gold/5 border-2 border-gold text-gold font-bold tracking-widest text-sm hover:bg-gold hover:text-black transition-all duration-300 active:scale-95"
						>
							VIEW FULL HALL OF FAME
							<ArrowRight size={16} />
						</Link>
					</div>
				</div>
			</section>

			{/* Start Your Journey CTA */}
			<section className="py-32 text-center px-6">
				<div className="container mx-auto max-w-3xl">
					<div className="inline-flex items-center gap-4 mb-6">
						<div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
						<h2 className="text-5xl md:text-6xl text-white font-normal font-heading">
							Start Your Journey
						</h2>
						<div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
					</div>
					<p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto font-display">
						Whether you are looking to acquire a rare timepiece or design a
						custom chain, our team is ready to assist.
					</p>
					<div className="flex flex-col md:flex-row gap-6 justify-center">
						<Link
							href="/contact"
							className="bg-gold text-black px-10 py-4 text-sm font-bold tracking-widest hover:bg-white transition-all duration-300 active:scale-95"
						>
							CONTACT US
						</Link>
						<Link
							href="/watches"
							className="border border-white text-white px-10 py-4 text-sm font-bold tracking-widest hover:bg-white hover:text-black transition-all duration-300 active:scale-95"
						>
							VIEW COLLECTION
						</Link>
					</div>
				</div>
			</section>

			{/* Showroom */}
			<ShowroomSection />
		</div>
	);
}
