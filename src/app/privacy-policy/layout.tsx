import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | How We Protect Your Data",
  description:
    "Read LKB Jewellers' privacy policy. Learn how we collect, use, and protect your personal data when you shop with us at Hatton Garden London.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
