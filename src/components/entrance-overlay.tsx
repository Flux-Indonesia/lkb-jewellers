"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface EntranceOverlayProps {
  onEnter: () => void;
}

export default function EntranceOverlay({ onEnter }: EntranceOverlayProps) {
  const [showContent, setShowContent] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const dismissOverlay = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lkb-entered", "true");
    }
    onEnter();
  };

  const handleEnter = () => {
    setShowContent(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      videoRef.current.onended = dismissOverlay;
    } else {
      // Fallback if video can't play
      setTimeout(dismissOverlay, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Background image (door closed) */}
      <Image
        src="/DoorClosedPicture.png"
        alt=""
        fill
        className="object-cover"
        priority
      />

      {/* Door open video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: "cover",
          objectPosition: "center center",
          transform: "scale(1.2)",
        }}
        muted
        playsInline
        preload="auto"
      >
        <source src="/DoorOpenVideo.mp4" type="video/mp4" />
      </video>

      {/* Content overlay */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center pt-16 md:justify-start md:pt-32 px-8 transition-opacity duration-500 select-none z-50 ${
          showContent ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="text-center mb-12 space-y-4 relative z-10">
          <h1
            className="text-5xl md:text-7xl lg:text-8xl tracking-wide animate-fade-in text-white uppercase font-heading text-shadow-hero"
          >
            Welcome to LKB Jewellers
          </h1>
          <p
            className="text-white text-sm md:text-lg lg:text-xl tracking-[0.3em] animate-slide-up font-semibold"
            style={{
              animationDelay: "0.4s",
              textShadow:
                "0 2px 8px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            TIMELESS &bull; ELEGANT &bull; CRAFTED
          </p>
        </div>

        <Button
          onClick={handleEnter}
          onTouchStart={(e) => {
            e.preventDefault();
            handleEnter();
          }}
          className="group relative px-12 py-4 h-auto bg-white border-2 border-white text-black font-bold tracking-[0.2em] text-sm md:text-base hover:scale-105 active:scale-95 animate-slide-up z-50 cursor-pointer touch-manipulation select-none rounded-none hover:bg-white"
          style={{
            animationDelay: "0.6s",
            WebkitTapHighlightColor: "transparent",
            userSelect: "none",
          }}
        >
          <span className="relative z-10 pointer-events-none">
            ENTER STORE
          </span>
        </Button>

        {/* Ambient glow effects */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-[120px] opacity-10 animate-pulse -z-10 pointer-events-none"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-[120px] opacity-10 animate-pulse -z-10 pointer-events-none"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        />
      </div>
    </div>
  );
}
