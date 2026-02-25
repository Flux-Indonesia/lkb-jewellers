"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import EntranceOverlay from "@/components/entrance-overlay";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (isHomepage && !sessionStorage.getItem("lkb-entered")) {
      setShowOverlay(true);
    }
  }, [isHomepage]);

  return (
    <>
      {showOverlay && <EntranceOverlay onEnter={() => setShowOverlay(false)} />}
      <div
        className={`bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black transition-opacity duration-700 ${
          showOverlay ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </>
  );
}
