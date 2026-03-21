// app/sobre/page.tsx
"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Coach {
  name: string;
  title: string;
  bio: string;
  specialty?: string;
  image?: string;
}

interface Achievement {
  year: string;
  title: string;
  description: string;
  icon?: string;
}

export default function Sobre() {
  const [hoveredCoach, setHoveredCoach] = useState<number | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const isVisible = true;

  const coaches: Coach[] = [
    { 
      name: "Carlos Silva", 
      title: "Mestre FIDE", 
      bio: "20 anos de experiência em competições nacionais e internacionais. Especialista em aberturas e finais.", 
      specialty: "Aberturas e Finais" 
    },
    { 
      name: "Ana Oliveira", 
      title: "Treinadora Principal", 
      bio: "Campeã nacional por 3 anos consecutivos. Formou mais de 50 alunos campeões estaduais.", 
      specialty: "Estratégia e Tática" 
    },
    { 
      name: "Roberto Santos", 
      title: "Coach Juvenil", 
      bio: "Especialista em iniciação ao xadrez. Metodologia lúdica para crianças e iniciantes.", 
      specialty: "Iniciação Infantil" 
    },
  ];

  const achievements: Achievement[] = [
    { year: "2024", title: "Campeonato Nacional por Equipes", description: "1º lugar - Categoria Absoluta", icon: "🥇" },
    { year: "2023", title: "Circuito Mahotas", description: "Campeão geral do circuito", icon: "🏆" },
    { year: "2022", title: "Torneio Internacional da CPLP", description: "3º lugar - Delegação Moçambicana", icon: "🌍" },
    { year: "2021", title: "Campeonato Regional Sul", description: "Campeão invicto", icon: "👑" },
  ];

  const values = [
    { title: "Excelência", description: "Buscamos a perfeição em cada movimento, dentro e fora do tabuleiro.", icon: "⭐" },
    { title: "Disciplina", description: "A dedicação e o compromisso são fundamentais para o crescimento.", icon: "🎯" },
    { title: "Comunidade", description: "Valorizamos cada membro como parte de uma grande família.", icon: "🤝" },
    { title: "Respeito", description: "Respeito ao adversário, ao esporte e a nós mesmos.", icon: "🙏" },
  ];


  return (
    <>
      <Header />
      <main ref={pageRef} className="relative bg-linear-to-b from-gray-900 to-gray-950 mt-10">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '30px 30px'
          }} />
        </div>

        {/* Animated Chess Pieces Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 text-7xl animate-float">♔</div>
          <div className="absolute bottom-20 right-10 text-7xl animate-float-delayed">♕</div>
          <div className="absolute top-1/2 right-20 text-5xl animate-float-slow">♗</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className={`
              inline-block mb-6 transition-all duration-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
                <span className="mr-2">📖</span>
                Nossa História
              </span>
            </div>
            <h1 className={`
              text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 delay-100
              bg-linear-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Sobre o Real Chess Club
            </h1>
            <div className={`
              w-24 h-1 bg-yellow-500 mx-auto mb-8 rounded-full transition-all duration-700 delay-150
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `} />
            <p className={`
              text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Fundado em 2019 no <span className="text-yellow-400 font-semibold">Bairro das Mahotas, Maputo</span>, 
              o Real Chess Club nasceu da paixão de um grupo de amigos que queriam promover o xadrez 
              em Moçambique. Hoje, somos referência no ensino e prática do esporte, formando campeões 
              e promovendo a cultura enxadrista em nossa comunidade.
            </p>
          </div>

          {/* Stats Banner */}
          <div className={`
            grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-700 delay-250
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-3xl font-bold text-yellow-500">2019</div>
              <div className="text-sm text-gray-400 mt-1">Ano de Fundação</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-3xl font-bold text-yellow-500">100+</div>
              <div className="text-sm text-gray-400 mt-1">Membros Ativos</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-3xl font-bold text-yellow-500">50+</div>
              <div className="text-sm text-gray-400 mt-1">Torneios Realizados</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-3xl font-bold text-yellow-500">10+</div>
              <div className="text-sm text-gray-400 mt-1">Títulos Nacionais</div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className={`
              group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-yellow-500/50
              transition-all duration-500 hover:-translate-y-1
              ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
            `} style={{ animationDelay: '300ms' }}>
              <div className="absolute inset-0 bg-linear-to-r from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="text-5xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold text-white mb-3">Missão</h2>
                <p className="text-gray-300 leading-relaxed">
                  Promover o xadrez como ferramenta de desenvolvimento intelectual,
                  social e pessoal em Moçambique, formando jogadores competitivos
                  e cidadãos exemplares através do esporte.
                </p>
              </div>
            </div>

            <div className={`
              group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-yellow-500/50
              transition-all duration-500 hover:-translate-y-1
              ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
            `} style={{ animationDelay: '400ms' }}>
              <div className="absolute inset-0 bg-linear-to-r from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="text-5xl mb-4">👁️</div>
                <h2 className="text-2xl font-bold text-white mb-3">Visão</h2>
                <p className="text-gray-300 leading-relaxed">
                  Ser reconhecido como o principal centro de excelência em xadrez
                  de Moçambique e referência na África Austral, formando campeões
                  e promovendo a cultura enxadrista em todo o país.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
              Nossos Valores
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className={`
                    group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center
                    border border-white/20 hover:border-yellow-500/50
                    transition-all duration-500 hover:-translate-y-1
                    ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
                  `}
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <div className="text-4xl mb-3">{value.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coaches */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
              Nossos Treinadores
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {coaches.map((coach, index) => (
                <div
                  key={index}
                  className={`
                    group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center
                    border border-white/20 hover:border-yellow-500/50
                    transition-all duration-500 hover:-translate-y-2
                    ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
                  `}
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                  onMouseEnter={() => setHoveredCoach(index)}
                  onMouseLeave={() => setHoveredCoach(null)}
                >
                  <div className="w-32 h-32 bg-linear-to-br from-yellow-500/20 to-yellow-600/20 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-yellow-500/30 group-hover:border-yellow-500 transition-all duration-300">
                    <span className="text-5xl">♟️</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                    {coach.name}
                  </h3>
                  <p className="text-yellow-500 text-sm font-semibold mb-2">{coach.title}</p>
                  <p className="text-gray-400 text-sm mb-3">{coach.bio}</p>
                  <div className="inline-block px-3 py-1 bg-yellow-500/10 rounded-full text-xs text-yellow-400">
                    {coach.specialty}
                  </div>

                  {/* Hover Glow */}
                  {hoveredCoach === index && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 bg-linear-to-t from-yellow-500/10 to-transparent rounded-2xl" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
              Conquistas Recentes
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`
                    group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6
                    border border-white/20 hover:border-yellow-500/50
                    transition-all duration-500 hover:-translate-y-1
                    ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
                  `}
                  style={{ animationDelay: `${1100 + index * 100}ms` }}
                >
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <div className="text-2xl font-bold text-yellow-500 mb-2">{achievement.year}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{achievement.title}</h3>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Location Card */}
          <div className={`
            mt-16 max-w-2xl mx-auto transition-all duration-700 delay-1200
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <div className="relative group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-yellow-500/50 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-linear-to-r from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-4xl">📍</span>
                  <h3 className="text-2xl font-bold text-white">Venha nos Visitar</h3>
                </div>
                <p className="text-center text-gray-300 font-medium text-lg">
                  Bairro das Mahotas, Maputo - Moçambique
                </p>
                <p className="text-center text-gray-400 text-sm mt-3">
                  Estamos de portas abertas para receber novos membros e amigos do xadrez
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
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

          {/* Trust Badge */}
          <div className={`
            mt-12 text-center transition-all duration-700 delay-1300
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-xs text-gray-500">
              🏆 Clube oficialmente filiado à Federação Moçambicana de Xadrez
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}