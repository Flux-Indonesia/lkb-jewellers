import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Access Your Account",
  description:
    "Sign in to your LKB Jewellers account. Manage your orders, save favourites, and enjoy a personalised shopping experience.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
