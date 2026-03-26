"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { BLUR_DATA_URL } from '@/lib/utils'

interface ThreeDCarouselProps {
  images: string[];
  radius?: number;
  cardW?: number;
  cardH?: number;
  autoSpinSpeed?: number;
}

const DRAG_SENSITIVITY = 1.2;
const FRICTION = 0.95;

export default function ThreeDCarousel({
  images,
  radius = 360,
  cardW = 240,
  cardH = 340,
  autoSpinSpeed = 0.03,
}: ThreeDCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);
  const rafRef = useRef<number>(0);

  const cards = images.map((src, i) => ({
    key: i,
    src,
    transform: `rotateY(${(i * 360) / images.length}deg) translateZ(${radius}px)`,
  }));

  useEffect(() => {
    const animate = () => {
      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.01) {
          angleRef.current += velocityRef.current;
          velocityRef.current *= FRICTION;
        } else {
          angleRef.current += autoSpinSpeed;
        }
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `rotateY(${angleRef.current}deg)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoSpinSpeed]);

  const handleDown = (x: number) => {
    isDraggingRef.current = true;
    velocityRef.current = 0;
    startXRef.current = x;
    startAngleRef.current = angleRef.current;
  };

  const handleMove = (x: number) => {
    if (!isDraggingRef.current) return;
    const delta = x - startXRef.current;
    const newAngle = startAngleRef.current + delta * DRAG_SENSITIVITY;
    velocityRef.current = newAngle - angleRef.current;
    angleRef.current = newAngle;
  };

  const handleUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ userSelect: "none" }}
      onMouseDown={(e) => handleDown(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleUp}
      onMouseLeave={handleUp}
      onTouchStart={(e) => handleDown(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleUp}
    >
      <div
        className="relative"
        style={{
          perspective: 1500,
          perspectiveOrigin: "center",
          width: Math.max(cardW * 1.5, radius * 2.2),
          height: Math.max(cardH * 1.8, radius * 1.5),
        }}
      >
        <div
          ref={innerRef}
          className="relative"
          style={{
            width: cardW,
            height: cardH,
            transformStyle: "preserve-3d",
            willChange: "transform",
            position: "absolute",
            left: "50%",
            top: "50%",
            marginLeft: -cardW / 2,
            marginTop: -cardH / 2,
          }}
        >
          {cards.map((card) => (
            <div
              key={card.key}
              className="absolute"
              style={{
                width: cardW,
                height: cardH,
                transform: card.transform,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <div
                className="w-full h-full rounded-2xl overflow-hidden bg-gray-800 shadow-lg shadow-gray-900/50 transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-900/70 hover:z-10"
                style={{ backfaceVisibility: "hidden" }}
              >
                <Image
                  src={card.src}
                  alt="Carousel item"
                  fill
                  className="w-full h-full object-cover"
                  sizes={`${cardW}px`}
                  draggable={false} placeholder="blur" blurDataURL={BLUR_DATA_URL}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
