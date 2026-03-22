import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sell Your Watch | Get the Best Price for Your Timepiece",
	description:
		"Sell your luxury watch to LKB Jewellers. We buy Rolex, Patek Philippe, Audemars Piguet, Richard Mille and more. Get a fair valuation from Hatton Garden experts.",
};

export default function WeBuyLayout({ children }: { children: React.ReactNode }) {
	return children;
}
