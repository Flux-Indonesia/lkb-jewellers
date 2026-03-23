"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, ShoppingBag, Search, Menu, X } from "lucide-react";
import { navMenuData } from "@/data/products";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

type MenuKey = "watches" | "jewellery" | "accessories" | "services" | "contact";

interface MenuItem {
	name: string;
	desc: string;
	link: string;
	image: string;
	external?: boolean;
}

const navLinks: { label: string; key: MenuKey | null; href: string }[] = [
	{ label: "HOME", key: null, href: "/" },
	{ label: "WATCHES", key: "watches", href: "/shop?category=watch" },
	{ label: "JEWELLERY", key: "jewellery", href: "/shop?category=luxury-jewellery" },
	{ label: "ACCESSORIES", key: "accessories", href: "/shop?category=merchandise" },
	{ label: "RINGS", key: null, href: "/engagement-rings" },
];

const rightLinks: { label: string; key: MenuKey; href: string }[] = [
	{ label: "OTHER SERVICES", key: "services", href: "/services" },
	{ label: "ABOUT US", key: "contact", href: "/about" },
];

function getMenuItems(key: MenuKey): MenuItem[] {
	const data = navMenuData[key];
	if ("brands" in data) return data.brands;
	if ("categories" in data) return data.categories;
	if ("items" in data) return data.items;
	if ("offerings" in data) return data.offerings;
	if ("links" in data) return data.links;
	return [];
}

function getMenuDefaultImage(key: MenuKey): string {
	return navMenuData[key].defaultImage;
}

export default function Navbar() {
	const router = useRouter();
	const [scrolled, setScrolled] = useState(false);
	const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
	const [hoveredImage, setHoveredImage] = useState<string | null>(null);
	const [mobileOpen, setMobileOpen] = useState(false);
	const { cartCount } = useCart();
	const { user } = useAuth();

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const handleMenuEnter = useCallback((key: MenuKey | null) => {
		if (key) setActiveMenu(key);
	}, []);

	const handleNavLeave = useCallback(() => {
		setActiveMenu(null);
		setHoveredImage(null);
	}, []);

	const previewImage = activeMenu && hoveredImage ? hoveredImage : activeMenu ? getMenuDefaultImage(activeMenu) : null;

	return (
		<>
			<nav className={`fixed left-0 w-full z-50 transition-all duration-500 bg-black border-b border-white ${scrolled ? "top-0" : "top-12"}`} onMouseLeave={handleNavLeave}>
				{/* Main bar */}
				<div className="w-full mx-auto h-20 flex justify-between items-center relative z-50">
					{/* Left nav links - desktop */}
					<div className="hidden xl:flex gap-8 items-center w-5/12 justify-start pl-16">
						{navLinks.map((item, i) => (
							<Fragment key={item.label}>
								{i > 0 && <div className="h-7 w-px bg-gradient-to-b from-white via-gray-400 to-white opacity-50" />}
								<div className="relative h-full flex items-center">
									<Link href={item.href} className="text-white text-sm font-semibold tracking-[0.2em] hover:text-gray-300 transition-colors py-6 font-display" onMouseEnter={() => handleMenuEnter(item.key)}>
										{item.label}
									</Link>
								</div>
							</Fragment>
						))}
					</div>

					{/* Center logo */}
					<div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center z-50 xl:w-2/12 pointer-events-none">
						<Link href="/" className="group flex flex-col items-center py-2 pointer-events-auto">
							<Image src="/white-logo.png" alt="LKB Official Logo" width={200} height={200} className="transition-all duration-500 hover:scale-110 cursor-pointer h-8 md:h-12 animate-logo-pop w-auto" priority />
							<div className="text-white tracking-[0.15em] transition-all duration-500 whitespace-nowrap text-[9px] animate-logo-pop mt-1 font-heading hidden md:block">
								LOCAL KETTLE BROTHERS UK
							</div>
							<div className="text-white tracking-[0.3em] transition-all duration-500 whitespace-nowrap text-[7px] animate-logo-pop font-heading hidden md:block">
								JEWELLERS
							</div>
						</Link>
					</div>

					{/* Right nav links + icons - desktop */}
					<div className="hidden xl:flex items-center justify-end w-5/12 pr-8">
						<div className="flex gap-8 items-center">
						{rightLinks.map((item, i) => (
							<Fragment key={item.label}>
								{i > 0 && <div className="h-7 w-px bg-gradient-to-b from-white via-gray-400 to-white opacity-50" />}
								<div className="relative h-full flex items-center">
									<Link href={item.href} className="text-white text-sm font-semibold tracking-[0.2em] hover:text-gray-300 transition-colors py-6 font-display" onMouseEnter={() => handleMenuEnter(item.key)}>
										{item.label}
									</Link>
								</div>
							</Fragment>
						))}
						</div>

						{/* Icons */}
						<div className="flex items-center gap-6 ml-6">
							{user ? (
							<div className="relative shrink-0 group">
								<button className="text-white hover:text-white transition-colors focus:outline-none" aria-label="Account">
									<User size={18} strokeWidth={2} />
								</button>
								<div className="absolute right-0 top-full mt-2 w-56 bg-black border border-white/30 rounded-lg shadow-2xl z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
									<div className="p-4 border-b border-gray-800 flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center overflow-hidden shrink-0">
											<User size={20} className="text-black" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-white font-medium truncate">{user.email}</p>
										</div>
									</div>
									<div className="py-2">
										<button onClick={() => router.push("/profile")} className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors">My Profile</button>
										<button onClick={() => router.push("/dashboard")} className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors">My Orders</button>
									</div>
								</div>
							</div>
						) : (
							<button onClick={() => router.push("/login")} className="text-white hover:text-white transition-colors focus:outline-none shrink-0" aria-label="Login">
								<User size={18} strokeWidth={2} />
							</button>
						)}
							<Link href="/checkout" className="relative group shrink-0">
								<ShoppingBag size={18} strokeWidth={2} className="text-white group-hover:text-gray-300 transition-colors" />
								{cartCount > 0 && <Badge className="absolute -top-3 -right-3 bg-white text-black text-[9px] font-bold w-4 h-4 p-0 flex items-center justify-center hover:bg-white">{cartCount}</Badge>}
							</Link>
							<button className="text-white hover:text-gray-300 cursor-pointer transition-colors focus:outline-none shrink-0" aria-label="Search">
								<Search size={18} strokeWidth={2} />
							</button>
						</div>
					</div>

					{/* Mobile section */}
					<div className="xl:hidden flex items-center justify-between w-full px-4">
						<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="text-white hover:bg-transparent h-auto w-auto p-2" aria-label="Open menu">
									<Menu size={22} />
								</Button>
							</SheetTrigger>
							<SheetContent side="left" showCloseButton={false} className="w-full sm:max-w-full bg-black border-none p-0">
								<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
								{/* Mobile header */}
								<div className="flex items-center justify-between h-20 px-4 border-b border-gray-800">
									<SheetClose asChild>
										<Link href="/" className="flex items-center">
											<Image src="/white-logo.png" alt="LKB Official Logo" width={100} height={40} className="h-10 w-auto" />
										</Link>
									</SheetClose>
									<SheetClose asChild>
										<Button variant="ghost" size="icon" className="text-white hover:bg-transparent h-auto w-auto p-1" aria-label="Close menu">
											<X size={24} />
										</Button>
									</SheetClose>
								</div>

								{/* Mobile menu items */}
								<div className="overflow-y-auto h-[calc(100vh-80px)] pb-32">
									<div className="flex flex-col">
										{/* Accordion items */}
										<Accordion type="single" collapsible className="w-full">
											{/* HOME - no dropdown */}
											<AccordionItem value="home" className="border-b border-gray-900">
												<AccordionTrigger className="text-white text-sm font-semibold tracking-[0.2em] font-body px-6 py-5 hover:bg-gray-900/50 hover:no-underline [&>svg]:hidden" onClick={() => { router.push("/"); setMobileOpen(false); }}>HOME</AccordionTrigger>
											</AccordionItem>

											{/* ENGAGEMENT RINGS - no dropdown */}
											<AccordionItem value="rings" className="border-b border-gray-900">
												<AccordionTrigger className="text-white text-sm font-semibold tracking-[0.2em] font-body px-6 py-5 hover:bg-gray-900/50 hover:no-underline [&>svg]:hidden" onClick={() => { router.push("/engagement-rings"); setMobileOpen(false); }}>ENGAGEMENT RINGS</AccordionTrigger>
											</AccordionItem>

											{([
												{ label: "WATCHES", key: "watches" as MenuKey },
												{ label: "JEWELLERY", key: "jewellery" as MenuKey },
												{ label: "ACCESSORIES", key: "accessories" as MenuKey },
												{ label: "OTHER SERVICES", key: "services" as MenuKey },
												{ label: "ABOUT US", key: "contact" as MenuKey },
											] as const).map((section) => (
												<AccordionItem key={section.key} value={section.key} className="border-b border-gray-900">
													<AccordionTrigger className="text-white text-sm font-semibold tracking-[0.2em] font-body px-6 py-5 hover:bg-gray-900/50 hover:no-underline [&>svg]:text-gray-400">{section.label}</AccordionTrigger>
													<AccordionContent>
														{getMenuItems(section.key).map((item) => {
															const isExternal = "external" in item && item.external;
															if (isExternal) {
																return (
																	<SheetClose key={item.name} asChild>
																		<a href={item.link} target="_blank" rel="noopener noreferrer" className="block px-10 py-3 text-gray-400 text-sm tracking-wide hover:text-white hover:bg-gray-900/30 transition-colors">{item.name}</a>
																	</SheetClose>
																);
															}
															return (
																<SheetClose key={item.name} asChild>
																	<Link href={item.link} className="block px-10 py-3 text-gray-400 text-sm tracking-wide hover:text-white hover:bg-gray-900/30 transition-colors">{item.name}</Link>
																</SheetClose>
															);
														})}
													</AccordionContent>
												</AccordionItem>
											))}
										</Accordion>
									</div>

									{/* Bottom: Login/Profile */}
									<div className="px-6 py-8 mt-4 flex flex-col gap-3">
										{user ? (
											<>
												<div className="flex items-center gap-3 mb-4">
													<div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center shrink-0">
														<User size={20} className="text-black" />
													</div>
													<p className="text-white text-sm truncate">{user.email}</p>
												</div>
												<SheetClose asChild>
													<Link href="/profile" className="w-full py-3 border border-white text-white text-sm font-semibold tracking-[0.2em] text-center hover:bg-white hover:text-black transition-colors block">MY PROFILE</Link>
												</SheetClose>
												<SheetClose asChild>
													<Link href="/dashboard" className="w-full py-3 border border-gray-800 text-gray-300 text-sm font-semibold tracking-[0.2em] text-center hover:bg-gray-900 transition-colors block">MY ORDERS</Link>
												</SheetClose>
											</>
										) : (
											<SheetClose asChild>
												<Link href="/login" className="w-full py-3 border border-white text-white text-sm font-semibold tracking-[0.2em] text-center hover:bg-white hover:text-black transition-colors block">LOGIN</Link>
											</SheetClose>
										)}
									</div>
								</div>
							</SheetContent>
						</Sheet>

						{/* Mobile right icons */}
						<div className="flex items-center gap-10">
							{user ? (
								<Link href="/profile" className="text-white shrink-0">
									<User size={18} strokeWidth={2} />
								</Link>
							) : (
								<Link href="/login" className="text-white shrink-0">
									<User size={18} strokeWidth={2} />
								</Link>
							)}
							<Link href="/checkout" className="relative text-white shrink-0">
								<ShoppingBag size={18} strokeWidth={2} />
								{cartCount > 0 && <Badge className="absolute -top-3 -right-3 bg-white text-black text-[9px] font-bold w-4 h-4 p-0 flex items-center justify-center hover:bg-white">{cartCount}</Badge>}
							</Link>
							<button type="button" className="p-0! m-0! border-0! bg-transparent! outline-none! appearance-none! leading-none! text-white shrink-0 cursor-pointer" aria-label="Search">
								<Search size={18} strokeWidth={2} />
							</button>
						</div>
					</div>
				</div>

				{/* Mega menu dropdown */}
				<div className={`absolute top-full left-0 w-full bg-black border-b border-gray-800 transition-all duration-500 ease-in-out overflow-hidden ${activeMenu ? "max-h-125 opacity-100 visible" : "max-h-0 opacity-0 invisible"}`}>
					{activeMenu && (
						<div className="container mx-auto py-12 px-4 md:px-8">
							<div className="grid grid-cols-12 gap-8">
								{/* Left image preview */}
								<div className="col-span-3 hidden xl:block">
									<div className="aspect-square relative overflow-hidden rounded-sm">
										{previewImage && <Image src={previewImage} alt={navMenuData[activeMenu].title} fill className="object-cover transition-all duration-500" sizes="25vw" />}
										<div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/85" />
										<div className="absolute bottom-6 left-6">
											<p className="text-white text-xs font-semibold tracking-[0.3em] uppercase mb-2">{navMenuData[activeMenu].title}</p>
											<div className="w-8 h-0.5 bg-white" />
										</div>
									</div>
								</div>

								{/* Right menu items */}
								<div className="col-span-12 xl:col-span-9">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
										{getMenuItems(activeMenu).map((item) => {
											const isExternal = "external" in item && item.external;
											const Wrapper = isExternal ? "a" : Link;
											const wrapperProps = isExternal
												? {
														href: item.link,
														target: "_blank" as const,
														rel: "noopener noreferrer",
													}
												: { href: item.link };

											return (
												<Wrapper key={item.name} {...(wrapperProps as any)} className="group border-b border-gray-800 py-6 transition-colors block" onMouseEnter={() => setHoveredImage(item.image)} onMouseLeave={() => setHoveredImage(null)} onClick={() => setActiveMenu(null)}>
													<h3 className="text-xl text-white transition-colors font-heading">{item.name}</h3>
													<p className="text-gray-500 text-sm mt-1">{item.desc}</p>
												</Wrapper>
											);
										})}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</nav>
		</>
	);
}
