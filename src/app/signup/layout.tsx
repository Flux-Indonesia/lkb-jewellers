import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Join LKB Jewellers",
  description:
    "Create your LKB Jewellers account. Save favourites, track orders, and enjoy exclusive access to new arrivals and offers.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
