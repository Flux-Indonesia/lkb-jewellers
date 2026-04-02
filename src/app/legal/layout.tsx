import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Legal Information",
  description:
    "Read LKB Jewellers' terms and conditions. Legal information regarding purchases, warranties, and services at our Hatton Garden London showroom.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
