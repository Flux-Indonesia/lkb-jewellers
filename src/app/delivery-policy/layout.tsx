import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Policy | Shipping Information & Timeframes",
  description:
    "Learn about LKB Jewellers' delivery policy. Free insured shipping on all orders, secure packaging, and tracked delivery for luxury watches and jewellery from Hatton Garden London.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
