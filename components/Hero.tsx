// components/Hero.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface HeroImage {
  src: string;
  alt: string;
}

const HERO_IMAGES: HeroImage[] = [
  { src: "/images/heropage1.jpg", alt: "Real Chess Club - Ambiente principal" },
  { src: "/images/heropage2.jpg", alt: "Real Chess Club - Torneio em andamento" },
  { src: "/images/heropage3.jpg", alt: "Real Chess Club - Membros jogando" },
];

const SLIDE_INTERVAL = 5000;

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(nextSlide, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="relative h-screen max-h-200 min-h-150 overflow-hidden">
      {/* Background Images */}
      {HERO_IMAGES.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={index !== currentIndex}
        >
          <div className="relative h-full w-full">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
              quality={75}
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/70" />
          </div>
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
        <div className="text-center text-white max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
              Bem-vindo ao{" "}
              <span className="text-yellow-500">Real Chess Club</span>
            </h1>
            <div className="w-24 h-1 bg-yellow-500 mx-auto my-6 rounded-full" />
            <p className="text-lg md:text-2xl lg:text-3xl mb-8 text-gray-200 font-light">
              Mais que um clube, uma família enxadrista
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="bg-yellow-600 hover:bg-yellow-700 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Conheça o clube"
              >
                Conheça o Clube
              </button>
              <button
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Ver torneios"
              >
                Ver Torneios
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            className="group relative transition-all duration-300 focus:outline-none"
            onClick={() => goToSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
            aria-current={index === currentIndex ? "true" : "false"}
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 bg-yellow-500"
                  : "w-2 bg-white/60 group-hover:bg-white/90"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        onClick={() => goToSlide((currentIndex - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
        aria-label="Slide anterior"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        onClick={() => goToSlide((currentIndex + 1) % HERO_IMAGES.length)}
        aria-label="Próximo slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}