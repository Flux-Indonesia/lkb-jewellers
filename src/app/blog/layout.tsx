import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Blog | Luxury Watch & Jewellery Insights",
	description:
		"Expert insights on luxury watches, jewellery trends, and investment pieces. Read the latest from LKB Jewellers, Hatton Garden London.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
	return children;
}
