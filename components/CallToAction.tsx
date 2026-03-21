// components/CallToAction.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function CallToAction() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Animated Chess Pieces Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-8xl animate-float">♔</div>
        <div className="absolute bottom-10 right-10 text-8xl animate-float-delayed">♕</div>
        <div className="absolute top-1/3 right-1/4 text-6xl animate-float-slow">♗</div>
        <div className="absolute bottom-1/3 left-1/4 text-6xl animate-float-slow">♘</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className={`
          inline-block mb-6 transition-all duration-700 transform
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
            <span className="mr-2">🇲🇿</span>
            Junte-se à família Real Chess
          </span>
        </div>

        {/* Main Title */}
        <h2 className={`
          text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 delay-100 transform
          bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          Faça parte da nossa história!
        </h2>

        {/* Description */}
        <p className={`
          text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto transition-all duration-700 delay-200 transform
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          Junte-se ao Real Chess Club e comece sua jornada no mundo do xadrez em Moçambique
        </p>

        {/* CTA Buttons */}
        <div className={`
          flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 transform
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <Link href="/membros">
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Tornar-se membro do clube"
            >
              <span className="relative flex items-center gap-2 text-white text-lg">
                <span>🎉</span>
                Torne-se Membro
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </button>
          </Link>

          <Link href="/eventos">
            <button
              className="group relative overflow-hidden bg-transparent border-2 border-yellow-600 hover:bg-yellow-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Ver eventos do clube"
            >
              <span className="relative flex items-center gap-2 text-yellow-600 hover:text-white text-lg transition-colors duration-300">
                <span>♟️</span>
                Ver Eventos
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className={`
          mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8 md:gap-16
          transition-all duration-700 delay-400 transform
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">100+</div>
            <div className="text-sm text-gray-400 mt-1">Membros Activos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">50+</div>
            <div className="text-sm text-gray-400 mt-1">Torneios/Ano</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">5</div>
            <div className="text-sm text-gray-400 mt-1">Anos de Tradição</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">📍</div>
            <div className="text-sm text-gray-400 mt-1">Mahotas, Maputo</div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-8">
          <p className="text-xs text-gray-500">
            🏆 Clube oficialmente filiado à Federação Moçambicana de Xadrez
          </p>
        </div>
      </div>
    </section>
  );
}