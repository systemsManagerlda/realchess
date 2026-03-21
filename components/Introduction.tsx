// components/Introduction.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

const STATS: StatItem[] = [
  { value: "10+", label: "Títulos Conquistados", suffix: "🏆" },
  { value: "100+", label: "Membros Ativos", suffix: "👥" },
  { value: "5", label: "Anos de Tradição", suffix: "📅" },
];

const FEATURES = [
  {
    title: "Treinamento de Elite",
    description: "Aulas com mestres internacionais e programas personalizados para todos os níveis.",
    icon: "🎯",
  },
  {
    title: "Torneios Regulares",
    description: "Competições semanais, mensais e eventos especiais ao longo do ano.",
    icon: "♟️",
  },
  {
    title: "Comunidade Ativa",
    description: "Ambiente acolhedor para networking, amizades e crescimento no xadrez.",
    icon: "🤝",
  },
];

export default function Introduction() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`
            inline-block mb-6 transition-all duration-700 transform
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
              <span className="mr-2">📖</span>
              Nossa História
            </span>
          </div>
          <h2 className={`
            text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 delay-100 transform
            bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            Sobre o Real Chess Club
          </h2>
          <div className={`
            w-24 h-1 bg-yellow-500 mx-auto mb-8 rounded-full transition-all duration-700 delay-150
            ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
          `} />
          <p className={`
            text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed transition-all duration-700 delay-200
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            Localizado no <span className="font-semibold text-yellow-400">Bairro das Mahotas, Maputo</span>, 
            o Real Chess Club é um dos mais tradicionais clubes de xadrez de Moçambique,
            dedicado a promover o esporte em todo o país. Com mais de 100 membros
            ativos e uma estrutura completa, oferecemos treinamento de qualidade,
            torneios regulares e um ambiente acolhedor para todos os apaixonados
            pelo xadrez moçambicano.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {STATS.map((stat, index) => {
            const isHovered = hoveredCard === index;
            return (
              <div
                key={index}
                className={`
                  group relative text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm
                  border border-white/20 hover:border-yellow-500/50
                  transition-all duration-500 transform hover:-translate-y-2
                  ${isVisible ? "animate-fade-in-up" : "opacity-0"}
                `}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="text-5xl mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                    {stat.suffix}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-300 font-medium">{stat.label}</div>
                </div>

                {/* Hover Glow Effect */}
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 to-transparent rounded-2xl" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => {
            const isHovered = hoveredCard === index + 3;
            return (
              <div
                key={index}
                className={`
                  group p-8 rounded-2xl bg-white/10 backdrop-blur-sm
                  border border-white/20 hover:border-yellow-500/50
                  transition-all duration-500 hover:shadow-xl hover:-translate-y-2
                  ${isVisible ? "animate-fade-in-up" : "opacity-0"}
                `}
                style={{ animationDelay: `${300 + index * 100}ms` }}
                onMouseEnter={() => setHoveredCard(index + 3)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors duration-300 border border-yellow-500/30 group-hover:border-yellow-500">
                    <span className="text-3xl group-hover:text-white transition-colors duration-300">
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Animated Border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                
                {/* Hover Glow Effect */}
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent rounded-2xl" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Location Card */}
        <div className={`
          mt-20 max-w-2xl mx-auto transition-all duration-700 delay-400
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <div className="relative group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-yellow-500/50 transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl">📍</span>
                <h3 className="text-2xl font-bold text-white">Nossa Localização</h3>
              </div>
              <p className="text-center text-gray-300 font-medium text-lg">
                Bairro das Mahotas, Maputo - Moçambique
              </p>
              <p className="text-center text-gray-400 text-sm mt-3">
                Venha nos visitar e fazer parte desta família enxadrista
              </p>
              <div className="flex justify-center mt-6">
                <button
                  className="group inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                  aria-label="Ver localização no mapa"
                >
                  <span>Ver no mapa</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`
          mt-16 text-center transition-all duration-700 delay-500
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <button
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Conheça mais sobre o clube"
          >
            <span>Conheça Nossa História</span>
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
          </button>
        </div>

        {/* Trust Badge */}
        <div className={`
          mt-12 text-center transition-all duration-700 delay-600
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <p className="text-xs text-gray-500">
            🏆 Clube oficialmente filiado à Federação Moçambicana de Xadrez
          </p>
        </div>
      </div>
    </section>
  );
}