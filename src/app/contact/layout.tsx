import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Us | Visit Our Hatton Garden Showroom",
	description:
		"Get in touch with LKB Jewellers. Visit our showroom at Hatton Garden, London. Call 020 3336 5303 or email us for enquiries about luxury watches and jewellery.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
	return children;
}
