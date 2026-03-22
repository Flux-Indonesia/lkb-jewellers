import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Hall of Fame | Celebrity & Notable Clients",
	description:
		"Discover the celebrities and notable clients who trust LKB Jewellers for their luxury watches and bespoke jewellery pieces.",
};

export default function HallOfFameLayout({ children }: { children: React.ReactNode }) {
	return children;
}
