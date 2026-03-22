import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About Us | Our Heritage & Story",
	description:
		"Learn about LKB Jewellers, Hatton Garden London's premier luxury jewellers. Our heritage, master craftsmen, and commitment to excellence since establishment.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
	return children;
}
