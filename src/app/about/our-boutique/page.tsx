import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Phone, ArrowRight, Car, Train } from "lucide-react";
import ShowroomSection from "@/components/showroom-section";

export default function OurBoutiquePage() {
	return (
		<div className="bg-black min-h-screen">
			{/* Hero */}
			<section className="relative h-[80vh] w-full overflow-hidden">
				<Image
					src="/images/static/showroom-entry.jpg"
					alt="LKB Jewellers Boutique – Hatton Garden"
					fill
					className="object-cover"
					priority
					sizes="100vw"
				/>
				<div className="absolute inset-0 bg-black/60" />
				<div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
					<span className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-4">
						New House, 67-68 Hatton Garden
					</span>
					<h1 className="text-5xl md:text-7xl text-white mb-6 max-w-4xl leading-tight font-heading">
						Our Boutique
					</h1>
					<p className="text-gray-300 text-lg max-w-xl font-display">
						A private destination for luxury timepieces &amp; bespoke jewellery in the heart of London
					</p>
				</div>
			</section>

			{/* Welcome Section */}
			<section className="py-20 md:py-28 px-6">
				<div className="container mx-auto max-w-6xl">
					<div className="flex flex-col lg:flex-row gap-16 items-center">
						{/* Text */}
						<div className="lg:w-1/2">
							<div className="inline-flex items-center gap-4 mb-6">
								<div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
								<span className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase">The Experience</span>
							</div>
							<h2 className="text-4xl md:text-5xl text-white mb-8 font-heading leading-tight">
								Where Luxury Meets Craftsmanship
							</h2>
							<p className="text-gray-300 leading-relaxed text-lg mb-6">
								Nestled in Hatton Garden — London&apos;s legendary jewellery quarter — our boutique is a sanctuary for discerning clients who demand the finest. Step inside and be immersed in an environment crafted to reflect the same standards as the pieces we curate.
							</p>
							<p className="text-gray-400 leading-relaxed text-base mb-10">
								From rare Rolex references to fully bespoke diamond commissions, every visit is a personal, unhurried experience. Our specialists are on hand to guide you through our collection, arrange private viewings, and bring your vision to life.
							</p>
							<Link
								href="https://wa.me/447802323652?text=Hello%2C%20I%27d%20like%20to%20book%20a%20boutique%20appointment"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-3 bg-[#D4AF37] text-black px-8 py-4 text-sm font-bold tracking-widest hover:bg-white transition-all duration-300"
							>
								BOOK AN APPOINTMENT <ArrowRight size={16} />
							</Link>
						</div>

						{/* Image */}
						<div className="w-full lg:w-1/2 relative">
							<div className="aspect-[4/5] relative border border-gray-800 p-3">
								<Image
									src="/images/static/showroom-entry-2.jpg"
									alt="LKB Jewellers Boutique Interior"
									fill
									className="object-cover"
									sizes="(max-width: 1024px) 100vw, 50vw"
								/>
							</div>
							{/* Floating badge */}
							<div className="absolute -bottom-6 -left-6 bg-[#0a0a0a] border border-gray-800 p-6 max-w-[220px] hidden md:block">
								<p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-1">Est.</p>
								<p className="text-white text-3xl font-bold font-heading">2009</p>
								<p className="text-gray-500 text-xs mt-1">Hatton Garden, London</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Boutique Gallery */}
			<section className="py-16 bg-[#0a0a0a] border-y border-gray-900">
				<div className="container mx-auto px-6 max-w-6xl">
					<div className="text-center mb-12">
						<div className="inline-flex items-center gap-4 mb-4">
							<div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
							<span className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase">Inside The Boutique</span>
							<div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
						</div>
						<h2 className="text-4xl md:text-5xl text-white font-heading">A Space Built for Exclusivity</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div className="aspect-square relative overflow-hidden group lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:h-[500px]">
							<Image
								src="/about-us/crown-jewels.webp"
								alt="LKB Jewellers Crown Collection"
								fill
								className="object-cover group-hover:scale-105 transition-transform duration-700"
								sizes="(max-width: 768px) 100vw, 50vw"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
							<div className="absolute bottom-6 left-6">
								<p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-1">Exclusive Collection</p>
								<p className="text-white font-heading text-xl">Crown Jewels</p>
							</div>
						</div>
						<div className="aspect-square relative overflow-hidden group">
							<Image
								src="/about-us/IMG_0007.jpg"
								alt="LKB Jewellers Boutique"
								fill
								className="object-cover group-hover:scale-105 transition-transform duration-700"
								sizes="(max-width: 768px) 100vw, 33vw"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
						</div>
						<div className="aspect-square relative overflow-hidden group">
							<Image
								src="/about-us/heritage.jpg"
								alt="LKB Jewellers Heritage"
								fill
								className="object-cover group-hover:scale-105 transition-transform duration-700"
								sizes="(max-width: 768px) 100vw, 33vw"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
						</div>
					</div>
				</div>
			</section>

			{/* Visit Details */}
			<section className="py-20 md:py-28 px-6">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-4 mb-4">
							<div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
							<span className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase">Plan Your Visit</span>
							<div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
						</div>
						<h2 className="text-4xl md:text-5xl text-white font-heading">Find Us</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
						{/* Address */}
						<div className="bg-[#0a0a0a] border border-gray-800 p-8 hover:border-[#D4AF37]/50 transition-colors">
							<div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-6">
								<MapPin className="text-[#D4AF37]" size={20} />
							</div>
							<h3 className="text-white text-sm font-bold tracking-widest uppercase mb-3 font-heading">Address</h3>
							<p className="text-gray-400 text-sm leading-relaxed">
								New House<br />
								67-68 Hatton Garden<br />
								London, EC1N 8JY<br />
								United Kingdom
							</p>
						</div>

						{/* Opening Hours */}
						<div className="bg-[#0a0a0a] border border-gray-800 p-8 hover:border-[#D4AF37]/50 transition-colors">
							<div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-6">
								<Clock className="text-[#D4AF37]" size={20} />
							</div>
							<h3 className="text-white text-sm font-bold tracking-widest uppercase mb-3 font-heading">Opening Hours</h3>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Monday – Friday</span>
									<span className="text-white">By Appointment</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Saturday</span>
									<span className="text-white">By Appointment</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Sunday</span>
									<span className="text-white">By Appointment</span>
								</div>
							</div>
						</div>

						{/* Contact */}
						<div className="bg-[#0a0a0a] border border-gray-800 p-8 hover:border-[#D4AF37]/50 transition-colors">
							<div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-6">
								<Phone className="text-[#D4AF37]" size={20} />
							</div>
							<h3 className="text-white text-sm font-bold tracking-widest uppercase mb-3 font-heading">Get In Touch</h3>
							<div className="space-y-2 text-sm">
								<p><span className="text-gray-500">Phone: </span><a href="tel:+442033365303" className="text-white hover:text-[#D4AF37] transition-colors">020 3336 5303</a></p>
								<p><span className="text-gray-500">WhatsApp: </span><a href="https://wa.me/447802323652" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#D4AF37] transition-colors">+44 78 0232 3652</a></p>
								<p><span className="text-gray-500">Email: </span><a href="mailto:info@lkbjewellers.com" className="text-white hover:text-[#D4AF37] transition-colors">info@lkbjewellers.com</a></p>
							</div>
						</div>
					</div>

					{/* Getting Here */}
					<div className="bg-[#0a0a0a] border border-gray-800 p-8 md:p-12 mb-10">
						<h3 className="text-white text-2xl font-heading mb-8">Getting Here</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="flex gap-4">
								<div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-1">
									<Train className="text-white" size={18} />
								</div>
								<div>
									<h4 className="text-white text-sm font-bold uppercase tracking-wide mb-2">By Tube</h4>
									<p className="text-gray-400 text-sm leading-relaxed">
										Chancery Lane (Central Line) — 2 min walk<br />
										Farringdon (Circle, Metropolitan, Elizabeth Line) — 5 min walk
									</p>
								</div>
							</div>
							<div className="flex gap-4">
								<div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-1">
									<Car className="text-white" size={18} />
								</div>
								<div>
									<h4 className="text-white text-sm font-bold uppercase tracking-wide mb-2">By Car</h4>
									<p className="text-gray-400 text-sm leading-relaxed">
										Located in EC1N. Nearest car parks on Greville Street and Leather Lane. Street parking available on surrounding roads.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* CTA Row */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="https://maps.google.com/?q=New+House+67-68+Hatton+Garden+London+EC1N+8JY"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-sm font-bold tracking-widest hover:bg-gray-200 transition-all duration-300"
						>
							GET DIRECTIONS <ArrowRight size={16} />
						</Link>
						<Link
							href="https://wa.me/447802323652?text=Hello%2C%20I%27d%20like%20to%20book%20a%20boutique%20appointment"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center gap-3 border border-[#D4AF37] text-[#D4AF37] px-8 py-4 text-sm font-bold tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
						>
							BOOK APPOINTMENT <ArrowRight size={16} />
						</Link>
					</div>
				</div>
			</section>

			<ShowroomSection />
		</div>
	);
}
