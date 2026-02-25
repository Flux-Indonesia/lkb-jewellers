"use client";

import { useState, useEffect } from "react";
import { Phone, Clock, Mail, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import { siteConfig } from "@/data/products";
import { Button } from "@/components/ui/button";

export default function TopBanner() {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const onScroll = () => {
			window.scrollY > 100 ? setVisible(false) : setVisible(true);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<div className={`bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between py-2.5 text-sm">
					{/* Left - Phone */}
					<a href={`tel:${siteConfig.phoneTel}`} className="flex items-center gap-2 text-black hover:text-gray-600 transition-all hover:scale-105 group">
						<Phone className="w-4 h-4 group-hover:animate-bounce" />
						<span className="font-semibold tracking-wide">{siteConfig.phone}</span>
					</a>

					{/* Right - 24/7, Mail Us, Social Icons */}
					<div className="flex items-center gap-4 md:gap-5">
						{/* 24/7 */}
						<div className="flex items-center gap-2 text-black">
							<Clock className="w-4 h-4 animate-spin" style={{ animationDuration: "10s" }} />
							<span className="font-semibold tracking-[0.15em]">24/7</span>
						</div>

						<div className="h-5 w-px bg-black/40 hidden md:block" />

						{/* Mail Us */}
						<a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-black hover:text-gray-600 transition-all hover:scale-105 group">
							<span className="font-semibold tracking-wide hidden md:inline">Mail Us</span>
							<Mail className="w-4 h-4 group-hover:animate-bounce" />
						</a>

						<div className="h-5 w-px bg-black/40 hidden md:block" />

						{/* Social Icons */}
						<div className="flex items-center gap-3 md:gap-4">
							<Button variant="ghost" size="icon-lg" className="text-black hover:text-gray-600 hover:bg-transparent hover:scale-125 transition-all h-auto w-auto p-0" asChild>
								<a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
									<Instagram className="w-4 h-4" />
								</a>
							</Button>
							<Button variant="ghost" size="icon-lg" className="text-black hover:text-gray-600 hover:bg-transparent hover:scale-125 transition-all h-auto w-auto p-0" asChild>
								<a href={siteConfig.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
									<Facebook className="w-4 h-4" />
								</a>
							</Button>
							<Button variant="ghost" size="icon-lg" className="text-black hover:text-gray-600 hover:bg-transparent hover:scale-125 transition-all h-auto w-auto p-0" asChild>
								<a href="https://x.com/lkb_uk" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
									<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
									</svg>
								</a>
							</Button>
							<Button variant="ghost" size="icon-lg" className="text-black hover:text-gray-600 hover:bg-transparent hover:scale-125 transition-all h-auto w-auto p-0" asChild>
								<a href="https://uk.linkedin.com/company/localkettlebrothers" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
									<Linkedin className="w-4 h-4" />
								</a>
							</Button>
							<Button variant="ghost" size="icon-lg" className="text-black hover:text-gray-600 hover:bg-transparent hover:scale-125 transition-all h-auto w-auto p-0" asChild>
								<a href={siteConfig.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
									<Youtube className="w-4 h-4" />
								</a>
							</Button>
							<Button variant="ghost" size="icon-lg" className="text-black hover:text-gray-600 hover:bg-transparent hover:scale-125 transition-all h-auto w-auto p-0" asChild>
								<a href={siteConfig.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
									<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
										<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
									</svg>
								</a>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
