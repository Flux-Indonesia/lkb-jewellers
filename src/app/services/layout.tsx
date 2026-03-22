import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Our Services | Watch & Jewellery Specialists",
	description:
		"Explore LKB Jewellers' services: luxury watch sales, bespoke jewellery, watch servicing, valuations, and more. Expert service from Hatton Garden London.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
	return children;
}
