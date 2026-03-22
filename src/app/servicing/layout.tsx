import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Watch Servicing | Expert Repair & Maintenance",
	description:
		"Professional luxury watch servicing and repair at LKB Jewellers. Rolex, Patek Philippe, Omega certified service centre in Hatton Garden London.",
};

export default function ServicingLayout({ children }: { children: React.ReactNode }) {
	return children;
}
