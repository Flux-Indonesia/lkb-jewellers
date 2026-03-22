import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Bespoke Jewellery | Custom Design & Craftsmanship",
	description:
		"Create your dream piece with LKB Jewellers' bespoke service. Custom diamond rings, pendants, and luxury jewellery designed and handcrafted in Hatton Garden London.",
};

export default function BespokeLayout({ children }: { children: React.ReactNode }) {
	return children;
}
