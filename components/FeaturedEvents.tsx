// components/FeaturedEvents.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface Tournament {
  name: string;
  date: string;
  prize: string;
  status: "open" | "soon" | "closed" | "past";
  description?: string;
  location?: string;
  format?: string;
  registrationDeadline?: string;
  spots?: number;
  results?: string;
  winner?: string;
}

const TOURNAMENTS: Tournament[] = [
  {
    name: "Torneio Rápido de Verão",
    date: "15 de Fevereiro, 2025",
    prize: "75.000 MT",
    status: "past",
    description: "Torneio no sistema suíço em 7 rodadas. Partidas de 15 minutos + 5 segundos de incremento.",
    location: "Sede do Real Chess Club - Mahotas, Maputo",
    format: "Rápido (15+5)",
    registrationDeadline: "10 de Fevereiro, 2025",
    spots: 40,
    winner: "🏆 João Silva",
    results: "1º: João Silva | 2º: Maria Santos | 3º: Pedro Oliveira"
  },
  {
    name: "Campeonato Nacional Absoluto",
    date: "20 de Março, 2025",
    prize: "150.000 MT",
    status: "past",
    description: "O mais prestigiado torneio do calendário nacional. Vagas limitadas para 64 participantes.",
    location: "Centro de Conferências Joaquim Chissano - Maputo",
    format: "Clássico (90+30)",
    registrationDeadline: "15 de Março, 2025",
    spots: 64,
    winner: "🏆 Carlos Mendes",
    results: "1º: Carlos Mendes | 2º: Ana Costa | 3º: Roberto Silva"
  },
  {
    name: "Circuito Mahotas de Xadrez",
    date: "5 de Abril, 2025",
    prize: "50.000 MT",
    status: "past",
    description: "Torneio aberto para todas as idades e níveis. Categorias: Absoluto, Sub-16 e Sub-12.",
    location: "Bairro das Mahotas, Maputo",
    format: "Rápido (10+3)",
    registrationDeadline: "1 de Abril, 2025",
    spots: 80,
    winner: "🏆 Maria Santos",
    results: "1º: Maria Santos | 2º: João Silva | 3º: Pedro Oliveira"
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
  past: {
    label: "✅ Realizado",
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    button: "bg-gray-500/50 cursor-not-allowed opacity-50",
    icon: "🏁",
  },
};

export default function FeaturedEvents() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return "🎯";
      case "soon": return "📅";
      case "closed": return "🔒";
      case "past": return "🏁";
      default: return "📌";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open": return "Inscrições Abertas";
      case "soon": return "Em Breve";
      case "closed": return "Inscrições Encerradas";
      case "past": return "Evento Realizado";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "soon": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "closed": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "past": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const toggleExpand = (index: number) => {
    if (expandedCard === index) {
      setExpandedCard(null);
    } else {
      setExpandedCard(index);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
    >
      {/* Padrão de Fundo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Peças de Xadrez Animadas no Fundo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-8xl animate-float">♔</div>
        <div className="absolute bottom-10 right-10 text-8xl animate-float-delayed">♕</div>
        <div className="absolute top-1/3 right-1/4 text-6xl animate-float-slow">♗</div>
        <div className="absolute bottom-1/3 left-1/4 text-6xl animate-float-slow">♘</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
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
            Torneios
          </h2>
          <div className={`
            w-24 h-1 bg-yellow-500 mx-auto mb-8 rounded-full transition-all duration-700 delay-150
            ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
          `} />
          <p className={`
            text-gray-300 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            Conheça os torneios realizados e fique atento aos próximos eventos do clube
          </p>
        </div>

        {/* Grade de Torneios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOURNAMENTS.map((tournament, index) => {
            const isPast = tournament.status === "past";
            const isHovered = hoveredCard === index;
            const isExpanded = expandedCard === index;
            const statusColor = getStatusColor(tournament.status);

            return (
              <div
                key={index}
                className={`
                  group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden
                  border border-white/20 hover:border-yellow-500/50
                  transition-all duration-500 transform hover:-translate-y-2
                  ${isPast ? 'opacity-80 hover:opacity-100' : ''}
                  ${isVisible ? "animate-fade-in-up" : "opacity-0"}
                `}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Distintivo de Estado */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${statusColor}`}>
                    <span>{getStatusIcon(tournament.status)}</span>
                    <span>{getStatusLabel(tournament.status)}</span>
                  </span>
                </div>

                {/* Distintivo de Destaque para Torneios Passados */}
                {isPast && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
                      <span>🏁</span>
                      <span>Finalizado</span>
                    </span>
                  </div>
                )}

                {/* Conteúdo */}
                <div className={`p-6 ${isPast ? 'opacity-90' : ''}`}>
                  {/* Prêmio */}
                  <div className="mb-4">
                    <div className={`text-3xl font-bold ${isPast ? 'text-gray-400' : 'text-yellow-500'}`}>
                      {formatPrize(tournament.prize)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">em prêmios</div>
                  </div>

                  {/* Título */}
                  <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${isPast ? 'text-gray-300' : 'text-white group-hover:text-yellow-400'}`}>
                    {tournament.name}
                  </h3>

                  {/* Descrição */}
                  {tournament.description && (
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-2">
                      {tournament.description}
                    </p>
                  )}

                  {/* Detalhes */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <svg className="w-4 h-4 flex-shrink-0 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className={isPast ? 'text-gray-400' : ''}>{tournament.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <svg className="w-4 h-4 flex-shrink-0 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className={`truncate ${isPast ? 'text-gray-400' : ''}`}>{tournament.location}</span>
                    </div>
                    {tournament.format && (
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <svg className="w-4 h-4 flex-shrink-0 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={isPast ? 'text-gray-400' : ''}>{tournament.format}</span>
                      </div>
                    )}
                  </div>

                  {/* Vencedor - para torneios passados */}
                  {isPast && tournament.winner && (
                    <div className="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🏆</span>
                        <div>
                          <p className="text-xs text-gray-400">Vencedor</p>
                          <p className="text-sm font-semibold text-yellow-400">{tournament.winner}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botão Ver Detalhes / Resultados */}
                  <button
                    onClick={() => toggleExpand(index)}
                    className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isPast ? (
                      <>
                        <span>📊 Ver Resultados</span>
                        <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Ver Detalhes</span>
                        <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>

                  {/* Conteúdo Expandido */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
                      {isPast && tournament.results && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300 font-semibold">Resultados:</p>
                          <p className="text-sm text-gray-400">{tournament.results}</p>
                          {tournament.spots && (
                            <p className="text-xs text-gray-500">Participantes: {tournament.spots}</p>
                          )}
                          <div className="mt-2 flex gap-2">
                            <span className="px-2 py-1 bg-yellow-500/10 rounded-full text-xs text-yellow-400">🏆 Finalizado</span>
                            <span className="px-2 py-1 bg-green-500/10 rounded-full text-xs text-green-400">✅ Certificados Emitidos</span>
                          </div>
                        </div>
                      )}
                      {!isPast && (
                        <div className="space-y-2">
                          {tournament.spots && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Vagas disponíveis</span>
                              <span className="text-yellow-400 font-semibold">{tournament.spots}</span>
                            </div>
                          )}
                          {tournament.registrationDeadline && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Inscrições até</span>
                              <span className="text-orange-400 font-semibold">{tournament.registrationDeadline}</span>
                            </div>
                          )}
                          <Link href={tournament.status === "open" ? "/eventos" : "#"}>
                            <button
                              className={`w-full mt-2 py-2 rounded-lg font-semibold transition-all duration-300 ${
                                tournament.status === "open"
                                  ? "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white"
                                  : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                              }`}
                              disabled={tournament.status !== "open"}
                            >
                              {tournament.status === "open" ? "Inscrever-se" : "Indisponível"}
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Borda Animada */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${isPast ? 'opacity-50' : ''}`} />
                
                {/* Efeito de Brilho ao Pairar */}
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute inset-0 bg-gradient-to-t ${isPast ? 'from-gray-500/5' : 'from-yellow-500/10'} to-transparent`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Nota Informativa */}
        <div className={`
          mt-12 text-center transition-all duration-700 delay-500
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            <span>ℹ️</span>
            <span>Os torneios marcados com 🏁 já foram realizados. Confira os resultados clicando em &#34;Ver Resultados&#34;.</span>
          </p>
        </div>
      </div>
    </section>
  );
}