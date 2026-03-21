// components/FeaturedEvents.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface Tournament {
  name: string;
  date: string;
  prize: string;
  status: "open" | "soon" | "closed";
  description?: string;
  location?: string;
  format?: string;
  registrationDeadline?: string;
  spots?: number;
}

const TOURNAMENTS: Tournament[] = [
  {
    name: "Torneio Rápido de Verão",
    date: "15 de Fevereiro, 2025",
    prize: "75.000 MT",
    status: "open",
    description: "Torneio no sistema suíço em 7 rodadas. Partidas de 15 minutos + 5 segundos de incremento.",
    location: "Sede do Real Chess Club - Mahotas, Maputo",
    format: "Rápido (15+5)",
    registrationDeadline: "10 de Fevereiro, 2025",
    spots: 40,
  },
  {
    name: "Campeonato Nacional Absoluto",
    date: "20 de Março, 2025",
    prize: "150.000 MT",
    status: "soon",
    description: "O mais prestigiado torneio do calendário nacional. Vagas limitadas para 64 participantes.",
    location: "Centro de Conferências Joaquim Chissano - Maputo",
    format: "Clássico (90+30)",
    registrationDeadline: "15 de Março, 2025",
    spots: 64,
  },
  {
    name: "Circuito Mahotas de Xadrez",
    date: "5 de Abril, 2025",
    prize: "50.000 MT",
    status: "soon",
    description: "Torneio aberto para todas as idades e níveis. Categorias: Absoluto, Sub-16 e Sub-12.",
    location: "Bairro das Mahotas, Maputo",
    format: "Rápido (10+3)",
    registrationDeadline: "1 de Abril, 2025",
    spots: 80,
  },
];

const STATUS_CONFIG = {
  open: {
    label: "Inscrições Abertas",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    button: "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800",
    icon: "✅",
  },
  soon: {
    label: "Em Breve",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    button: "bg-gray-600 hover:bg-gray-700",
    icon: "📅",
  },
  closed: {
    label: "Inscrições Encerradas",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    button: "bg-gray-500/50 cursor-not-allowed",
    icon: "🔒",
  },
};

export default function FeaturedEvents() {
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

  const formatPrize = (prize: string) => {
    return prize;
  };

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
              <span className="mr-2">🏆</span>
              Agenda Oficial
            </span>
          </div>
          <h2 className={`
            text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 delay-100 transform
            bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            Próximos Torneios
          </h2>
          <div className={`
            w-24 h-1 bg-yellow-500 mx-auto mb-8 rounded-full transition-all duration-700 delay-150
            ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
          `} />
          <p className={`
            text-gray-300 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            Participe dos melhores torneios de xadrez de Moçambique. 
            Vença prêmios, ganhe experiência e faça parte da nossa comunidade!
          </p>
        </div>

        {/* Tournaments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOURNAMENTS.map((tournament, index) => {
            const statusConfig = STATUS_CONFIG[tournament.status];
            const isOpen = tournament.status === "open";
            const isHovered = hoveredCard === index;

            return (
              <div
                key={index}
                className={`
                  group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden
                  border border-white/20 hover:border-yellow-500/50
                  transition-all duration-500 transform hover:-translate-y-2
                  ${isVisible ? "animate-fade-in-up" : "opacity-0"}
                `}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${statusConfig.color}`}>
                    <span>{statusConfig.icon}</span>
                    <span>{statusConfig.label}</span>
                  </span>
                </div>

                {/* Featured Badge for Main Tournament */}
                {index === 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 backdrop-blur-sm border border-red-500/30">
                      <span>⭐</span>
                      <span>Destaque</span>
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Prize */}
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-yellow-500">
                      {formatPrize(tournament.prize)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">em prêmios</div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                    {tournament.name}
                  </h3>

                  {/* Description */}
                  {tournament.description && (
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-2">
                      {tournament.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <svg className="w-4 h-4 flex-shrink-0 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{tournament.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <svg className="w-4 h-4 flex-shrink-0 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{tournament.location}</span>
                    </div>
                    {tournament.format && (
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <svg className="w-4 h-4 flex-shrink-0 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{tournament.format}</span>
                      </div>
                    )}
                    {tournament.spots && (
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <svg className="w-4 h-4 flex-shrink-0 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{tournament.spots} vagas</span>
                      </div>
                    )}
                    {tournament.registrationDeadline && isOpen && (
                      <div className="flex items-center gap-2 text-orange-400 text-xs font-medium mt-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Inscrições até {tournament.registrationDeadline}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link href={isOpen ? "/eventos" : "#"}>
                    <button
                      className={`
                        w-full py-3 rounded-lg font-semibold transition-all duration-300
                        transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500
                        ${statusConfig.button}
                        ${!isOpen ? "opacity-60 cursor-not-allowed" : "text-white"}
                      `}
                      disabled={!isOpen}
                      aria-label={`Inscrever-se no ${tournament.name}`}
                    >
                      {isOpen ? (
                        <span className="flex items-center justify-center gap-2">
                          <span>🎯</span>
                          <span>Inscreva-se Agora</span>
                          <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>{statusConfig.icon}</span>
                          <span>{statusConfig.label}</span>
                        </span>
                      )}
                    </button>
                  </Link>
                </div>

                {/* Animated Border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                
                {/* Hover Glow Effect */}
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View All Events Button */}
        <div className={`
          text-center mt-12 transition-all duration-700 delay-400
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <Link href="/eventos">
            <button
              className="group inline-flex items-center gap-2 bg-transparent border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              aria-label="Ver todos os torneios"
            >
              <span>Ver Todos os Torneios</span>
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
          </Link>
        </div>

        {/* Info Note */}
        <div className={`
          mt-12 text-center transition-all duration-700 delay-500
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            <span>ℹ️</span>
            <span>Torneios sujeitos a alterações. Consulte o regulamento completo no ato da inscrição.</span>
          </p>
        </div>
      </div>
    </section>
  );
}