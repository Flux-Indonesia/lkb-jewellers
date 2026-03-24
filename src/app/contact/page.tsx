"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { createContact } from "@/lib/contacts";
import ShowroomSection from "@/components/showroom-section";

export default function ContactPage() {
	const [formData, setFormData] = useState({
		firstName: "", lastName: "", email: "", phone: "", interest: "", message: "",
	});
	const [loading, setLoading] = useState(false);
	const [activeSlide, setActiveSlide] = useState(0);
	const contactImages = ["/contact/1.avif", "/contact/2.avif", "/contact/3.avif", "/contact/4.avif"];

	const [submitted, setSubmitted] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await createContact({
				first_name: formData.firstName,
				last_name: formData.lastName,
				email: formData.email,
				phone: formData.phone,
				interest: formData.interest,
				message: formData.message,
				preferred_contact_method: "email",
				status: "new",
			});
			setSubmitted(true);
			setFormData({ firstName: "", lastName: "", email: "", phone: "", interest: "", message: "" });
		} catch (err) {
			console.error("Failed to submit contact:", err);
			toast.error("Failed to send message. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-black text-white min-h-screen pt-20" style={{ transform: "scale(0.9)", transformOrigin: "center top" }}>
			<div className="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)]">
				{/* Left - Image */}
				<div className="lg:w-1/2 bg-black relative overflow-hidden min-h-[300px] lg:min-h-0">
					{contactImages.map((img, i) => (
						<Image key={img} src={img} alt={`LKB Jewellers ${i + 1}`} fill className={`object-cover transition-opacity duration-1000 ${activeSlide === i ? "opacity-100" : "opacity-0"}`} sizes="(max-width: 1024px) 100vw, 50vw" priority={i === 0} />
					))}
					<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
						{contactImages.map((img, i) => (
							<button key={i} onClick={() => setActiveSlide(i)} className={`relative w-14 h-10 rounded overflow-hidden border-2 transition-all ${activeSlide === i ? "border-white shadow-lg shadow-white/50" : "border-gray-700 opacity-60 hover:opacity-100"}`}>
								<Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="56px" />
							</button>
						))}
					</div>
				</div>

				{/* Right - Form + Get In Touch */}
				<div className="lg:w-1/2 bg-black p-12 lg:p-24 flex flex-col justify-center">
					<div className="inline-flex items-center gap-4 mb-6">
						<div className="h-px w-12 bg-gradient-to-r from-transparent to-white" />
						<span className="text-white text-xs tracking-[0.5em] uppercase">Contact Us</span>
						<div className="h-px w-12 bg-gradient-to-l from-transparent to-white" />
					</div>
					<h2 className="text-4xl md:text-5xl mb-10 text-white font-heading uppercase tracking-wide">
						GET IN TOUCH
					</h2>

					{submitted ? (
						<div className="bg-gray-900/50 border border-white/30 p-8 text-center">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 border border-white/30 flex items-center justify-center">
								<Mail className="w-7 h-7 text-white" />
							</div>
							<h3 className="text-2xl text-white mb-2" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>Message Sent!</h3>
							<p className="text-gray-400" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
								Thank you for reaching out. We&apos;ll respond within 24 hours.
							</p>
							<button onClick={() => setSubmitted(false)} className="mt-6 text-white text-sm tracking-widest hover:underline uppercase">
								SEND ANOTHER MESSAGE
							</button>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-8">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div className="border-b border-gray-800 py-2">
									<input
										type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
										placeholder="FIRST NAME"
										className="w-full bg-transparent text-white outline-none placeholder-gray-600 tracking-widest text-sm focus:placeholder-white transition-colors"
										style={{ fontSize: "16px" }}
									/>
								</div>
								<div className="border-b border-gray-800 py-2">
									<input
										type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
										placeholder="LAST NAME"
										className="w-full bg-transparent text-white outline-none placeholder-gray-600 tracking-widest text-sm focus:placeholder-white transition-colors"
										style={{ fontSize: "16px" }}
									/>
								</div>
							</div>
							<div className="border-b border-gray-800 py-2">
								<input
									type="email" name="email" value={formData.email} onChange={handleChange} required
									placeholder="EMAIL ADDRESS"
									className="w-full bg-transparent text-white outline-none placeholder-gray-600 tracking-widest text-sm focus:placeholder-white transition-colors"
								/>
							</div>
							<div className="border-b border-gray-800 py-2">
								<input
									type="tel" name="phone" value={formData.phone} onChange={handleChange} required
									placeholder="PHONE NUMBER"
									className="w-full bg-transparent text-white outline-none placeholder-gray-600 tracking-widest text-sm focus:placeholder-white transition-colors"
								/>
							</div>
							<div className="border-b border-gray-800 py-2">
								<select
									name="interest" value={formData.interest} onChange={handleChange} required
									className="w-full bg-black text-gray-400 outline-none tracking-widest text-sm border-none"
								>
									<option value="">INTERESTED IN...</option>
									<optgroup label="Products">
										<option value="Exclusive Watches">Exclusive Watches</option>
										<option value="Diamond Jewellery">Diamond Jewellery</option>
										<option value="Chains & Pendants">Chains &amp; Pendants</option>
										<option value="Rings & Wedding Bands">Rings &amp; Wedding Bands</option>
										<option value="Bracelets & Bangles">Bracelets &amp; Bangles</option>
										<option value="Earrings">Earrings</option>
										<option value="Grillz">Grillz</option>
									</optgroup>
									<optgroup label="Services">
										<option value="Custom Bespoke Jewellery">Custom Bespoke Jewellery</option>
										<option value="Watch Sourcing">Watch Sourcing</option>
										<option value="Jewellery Repair & Restoration">Jewellery Repair &amp; Restoration</option>
										<option value="Watch Servicing">Watch Servicing</option>
										<option value="Engraving Services">Engraving Services</option>
										<option value="Appraisal & Valuation">Appraisal &amp; Valuation</option>
									</optgroup>
									<optgroup label="Buying & Selling">
										<option value="Sell My Watch">Sell My Watch</option>
										<option value="Sell My Jewellery">Sell My Jewellery</option>
										<option value="Trade-In">Trade-In</option>
										<option value="Consignment">Consignment</option>
									</optgroup>
									<optgroup label="Other">
										<option value="General Enquiry">General Enquiry</option>
										<option value="Schedule Appointment">Schedule Appointment</option>
										<option value="Partnership Opportunity">Partnership Opportunity</option>
										<option value="Media & Press">Media &amp; Press</option>
									</optgroup>
								</select>
							</div>
							<div className="border-b border-gray-800 py-2">
								<textarea
									name="message" value={formData.message} onChange={handleChange} required rows={3}
									placeholder="TELL US ABOUT YOUR REQUEST"
									className="w-full bg-transparent text-white outline-none placeholder-gray-600 tracking-widest text-sm focus:placeholder-white transition-colors resize-none"
								/>
							</div>
							<button
								type="submit" disabled={loading}
								className="group mt-8 bg-white text-black px-12 py-5 font-bold tracking-widest hover:bg-gray-200 transition-all flex items-center gap-4 w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? "SENDING..." : (
									<>SEND REQUEST <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
								)}
							</button>
						</form>
					)}

					{/* Get In Touch */}
					<div className="mt-16 pt-12 border-t border-gray-800">
						<p className="text-xs tracking-[0.3em] text-white uppercase mb-8 font-semibold">Get In Touch</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Call Us */}
							<a href="tel:02033365303" className="group bg-gray-900/30 border border-gray-800 p-6 hover:border-white transition-all">
								<div className="flex items-start gap-4">
									<div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
										<Phone className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Call Us</p>
										<p className="text-white font-semibold text-lg">+44 20 3336 5303</p>
									</div>
								</div>
							</a>

							{/* WhatsApp */}
							<a href="https://wa.me/447802323652?text=Hello%2C%20I%27m%20interested%20in%20your%20services" target="_blank" rel="noopener noreferrer" className="group bg-gray-900/30 border border-gray-800 p-6 hover:border-white transition-all">
								<div className="flex items-start gap-4">
									<div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
										<svg viewBox="0 0 24 24" width={20} height={20} fill="white" className="w-5 h-5">
											<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
										</svg>
									</div>
									<div>
										<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">WhatsApp</p>
										<p className="text-white font-semibold text-lg">+44 78 0232 3652</p>
									</div>
								</div>
							</a>

							{/* Email */}
							<a href="mailto:info@lkbjewellers.com" className="group bg-gray-900/30 border border-gray-800 p-6 hover:border-white transition-all">
								<div className="flex items-start gap-4">
									<div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
										<Mail className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
										<p className="text-white font-semibold text-lg break-all">info@lkbjewellers.com</p>
									</div>
								</div>
							</a>

							{/* Visit Us */}
							<a href="https://maps.app.goo.gl/qA4frsncEb2xGHTE7" target="_blank" rel="noopener noreferrer" className="group bg-gray-900/30 border border-gray-800 p-6 hover:border-white transition-all cursor-pointer">
								<div className="flex items-start gap-4">
									<div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
										<MapPin className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Visit Us</p>
										<p className="text-white font-semibold text-lg leading-relaxed">New House, 67-68 Hatton Garden, London, EC1N 8JY</p>
									</div>
								</div>
							</a>

							{/* Hours */}
							<div className="group bg-gray-900/30 border border-gray-800 p-6">
								<div className="flex items-start gap-4">
									<div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
										<Clock className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Hours</p>
										<p className="text-white font-semibold text-lg">By Appointment</p>
										<p className="text-gray-400 text-xs mt-1">24/7 for VIP Clients</p>
									</div>
								</div>
							</div>

							{/* Get Directions */}
							<a href="https://maps.app.goo.gl/qA4frsncEb2xGHTE7" target="_blank" rel="noopener noreferrer" className="group bg-gray-900/30 border border-gray-800 p-6 hover:border-white transition-all cursor-pointer">
								<div className="flex items-start gap-4">
									<div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
										<MapPin className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Get Directions</p>
										<p className="text-white font-semibold text-lg">Navigate to Our Showroom</p>
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* ===== MAP SECTION ===== */}
			<div className="mt-16 pt-12 border-t border-gray-800">
				<div className="text-center mb-12">
					<div className="inline-flex items-center gap-4 mb-6">
						<div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
						<MapPin className="w-6 h-6 text-white" />
						<div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
					</div>
					<h2 className="text-5xl md:text-6xl text-white mb-6 font-normal" style={{ fontFamily: 'Prata, "Prata Fallback", serif' }}>
						Find Us in Hatton Garden
					</h2>
					<p className="text-gray-400 text-lg max-w-2xl mx-auto" style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}>
						London&apos;s Historic Jewellery Quarter
					</p>
				</div>

				<div className="relative group">
					{/* Corner decorations */}
					<div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-white z-10" />
					<div className="absolute -top-4 -right-4 w-16 h-16 border-t-2 border-r-2 border-white z-10" />
					<div className="absolute -bottom-4 -left-4 w-16 h-16 border-b-2 border-l-2 border-white z-10" />
					<div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-white z-10" />

					{/* Glow */}
					<div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/10 to-white/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

					<div className="relative h-[500px] overflow-hidden border-2 border-gray-800 group-hover:border-white/50 transition-all duration-500">
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.5234567890123!2d-0.10789!3d51.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b4ccf0d7f1f%3A0x5b9b5b9b5b9b5b9b!2s67-68%20Hatton%20Garden%2C%20London%20EC1N%208JY!5e0!3m2!1sen!2suk!4v1234567890123!5m2!1sen!2suk"
							width="100%"
							height="100%"
							allowFullScreen
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							className="grayscale hover:grayscale-0 transition-all duration-700"
							style={{ border: 0 }}
						/>

						{/* Overlay - top left */}
						<div className="absolute top-6 left-6 bg-black/90 backdrop-blur-sm border border-white px-6 py-3 rounded-lg z-10">
							<p className="text-white text-xs font-bold tracking-wider uppercase mb-1">LKB Jewellers</p>
							<p className="text-white text-sm font-semibold">Hatton Garden, London</p>
						</div>

						{/* Overlay - bottom right */}
						<div className="absolute bottom-6 right-6 z-10">
							<a
								href="https://maps.app.goo.gl/qA4frsncEb2xGHTE7"
								target="_blank"
								rel="noopener noreferrer"
								className="group/btn inline-flex items-center gap-3 bg-white text-black px-6 py-3 font-bold tracking-widest hover:bg-gray-200 hover:shadow-2xl transition-all duration-300 rounded-lg"
							>
								<MapPin size={18} />
								GET DIRECTIONS
								<ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* ===== VISIT OUR SHOWROOM ===== */}
			<ShowroomSection />
		</div>
	);
}
