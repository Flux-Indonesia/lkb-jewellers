"use client";

import Image from "next/image";
import { Crown } from "lucide-react";


const galleryImages = [
  {
    src: "https://i0.wp.com/lkbjewellers.com/wp-content/uploads/2025/09/SuspectDelivery-14-scaled.jpg?resize=1229%2C1536&ssl=1",
    alt: "Distinguished client showcase 1",
  },
  {
    src: "https://i0.wp.com/lkbjewellers.com/wp-content/uploads/2025/09/IMG_6199-scaled.jpg?resize=1229%2C1536&ssl=1",
    alt: "Distinguished client showcase 2",
  },
  {
    src: "https://i0.wp.com/lkbjewellers.com/wp-content/uploads/2025/09/DAVIDO-91-scaled.jpg?resize=1229%2C1536&ssl=1",
    alt: "Distinguished client showcase 3",
  },
  {
    src: "https://i0.wp.com/lkbjewellers.com/wp-content/uploads/2025/07/DSF0447.jpg?resize=1229%2C1536&ssl=1",
    alt: "Distinguished client showcase 4",
  },
  {
    src: "https://i0.wp.com/lkbjewellers.com/wp-content/uploads/2025/07/DSF1169-1.jpg?resize=1229%2C1536&ssl=1",
    alt: "Distinguished client showcase 5",
  },
  {
    src: "https://i0.wp.com/lkbjewellers.com/wp-content/uploads/2025/07/DAVIDO5IVELKBOFFICE-11-scaled.jpg?resize=640%2C800&ssl=1",
    alt: "Distinguished client showcase 6",
  },
];

export default function HallOfFamePage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.5em] uppercase">
              Our Clientele
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 font-normal tracking-wider font-heading"
          >
            HALL OF FAME
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed font-display">
            Celebrating our distinguished clientele and their extraordinary
            pieces
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="aspect-[3/4] overflow-hidden group relative rounded-lg"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4AF37]/30 transition-all duration-500 rounded-lg pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-yellow-500 to-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
            </div>
          ))}
        </div>

        {/* Bottom Decorative Line */}
        <div className="flex items-center justify-center gap-4 mt-16">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
          <Crown className="w-5 h-5 text-[#D4AF37]/50" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
        </div>
      </div>
    </div>
  );
}
