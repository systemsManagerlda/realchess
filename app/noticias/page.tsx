// app/noticias/page.tsx
"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Article {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content?: string;
  author?: string;
  image?: string;
  readTime?: string;
}

export default function Noticias() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [email, setEmail] = useState("");
  const pageRef = useRef<HTMLDivElement>(null);

  const isVisible = true;

  const news: Article[] = [
    {
      id: 1,
      title: "João Silva vence Torneio Rápido de Janeiro",
      date: "2025-01-20",
      category: "Resultados",
      excerpt: "Em uma emocionante final, João Silva derrotou Maria Santos em uma partida de 45 lances, conquistando o título do primeiro torneio do ano.",
      author: "Departamento de Comunicação",
      readTime: "3 min",
      content: "O torneio contou com a participação de 32 enxadristas de todo o país..."
    },
    {
      id: 2,
      title: "Dica de Xadrez: Como melhorar seu rating",
      date: "2025-01-18",
      category: "Dicas",
      excerpt: "Confira 5 dicas essenciais para elevar seu rating e se tornar um jogador mais forte. Desde estudo de aberturas até análise de partidas.",
      author: "GM Carlos Silva",
      readTime: "5 min",
      content: "1. Estude finais diariamente... 2. Analise suas partidas..."
    },
    {
      id: 3,
      title: "Análise: A partida imortal de Bobby Fischer",
      date: "2025-01-15",
      category: "Análises",
      excerpt: "Uma análise detalhada da famosa partida entre Fischer e Spassky de 1972, considerada uma das mais brilhantes da história do xadrez.",
      author: "Mestre Internacional Ana Oliveira",
      readTime: "8 min",
      content: "A partida começou com a abertura Siciliana..."
    },
    {
      id: 4,
      title: "Real Chess Club promove torneio beneficente",
      date: "2025-01-12",
      category: "Eventos do Clube",
      excerpt: "Nosso clube realizará um torneio beneficente em fevereiro para arrecadar fundos para escolas locais em Maputo.",
      author: "Diretoria do Clube",
      readTime: "2 min",
      content: "O evento acontecerá no dia 15 de fevereiro..."
    },
    {
      id: 5,
      title: "Novo curso de xadrez para iniciantes",
      date: "2025-01-10",
      category: "Eventos do Clube",
      excerpt: "Estão abertas as inscrições para o novo curso de xadrez para iniciantes. Aulas começam em março.",
      author: "Coordenação Pedagógica",
      readTime: "2 min",
      content: "O curso terá duração de 3 meses..."
    },
    {
      id: 6,
      title: "Técnica de finais: Rei e peão vs rei",
      date: "2025-01-08",
      category: "Dicas",
      excerpt: "Aprenda a técnica fundamental de finais de rei e peão, essencial para jogadores de todos os níveis.",
      author: "MF Roberto Santos",
      readTime: "6 min",
      content: "O final de rei e peão é um dos mais importantes..."
    },
  ];

  const categories = ["Todos", "Resultados", "Dicas", "Análises", "Eventos do Clube"];

  const filteredNews = selectedCategory === "Todos" 
    ? news 
    : news.filter(article => article.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "Resultados": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Dicas": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Análises": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Eventos do Clube": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`✅ Inscrição realizada com sucesso! Você receberá nossas novidades em ${email}`);
      setEmail("");
    }
  };

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

        {/* Animated Chess Pieces */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 right-20 text-7xl animate-float">♔</div>
          <div className="absolute bottom-20 left-20 text-7xl animate-float-delayed">♕</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`
              inline-block mb-6 transition-all duration-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
                <span className="mr-2">📰</span>
                Últimas Novidades
              </span>
            </div>
            <h1 className={`
              text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 delay-100
              bg-linear-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Notícias e Blog
            </h1>
            <div className={`
              w-24 h-1 bg-yellow-500 mx-auto mb-6 rounded-full transition-all duration-700 delay-150
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `} />
            <p className={`
              text-gray-300 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Fique por dentro de todas as novidades, resultados e dicas do Real Chess Club
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Category Filter */}
              <div className={`
                flex flex-wrap gap-2 mb-6 transition-all duration-700 delay-300
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                      ${selectedCategory === category
                        ? 'bg-yellow-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Articles */}
              {filteredNews.map((article, index) => (
                <article
                  key={article.id}
                  className={`
                    group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden
                    border border-white/20 hover:border-yellow-500/50
                    transition-all duration-500 hover:-translate-y-1
                    ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
                  `}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="p-6">
                    {/* Category and Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">{article.readTime} de leitura</span>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(article.date)}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                      {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>

                    {/* Author and Read More */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <span className="text-sm">✍️</span>
                        </div>
                        <span className="text-sm text-gray-400">{article.author}</span>
                      </div>
                      <button className="group inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-semibold transition-colors">
                        <span>Leia mais</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Animated Border */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-yellow-500 via-yellow-600 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </article>
              ))}

              {/* Load More Button */}
              {filteredNews.length >= 6 && (
                <div className="text-center pt-6">
                  <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300">
                    <span>Carregar Mais</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className={`
              space-y-6 transition-all duration-700 delay-400
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              {/* Categories Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-yellow-500 rounded-full"></span>
                  Categorias
                </h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        block w-full text-left px-4 py-2 rounded-lg transition-all duration-300
                        ${selectedCategory === category
                          ? 'bg-yellow-600/20 text-yellow-400'
                          : 'text-gray-300 hover:bg-white/10'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category}</span>
                        <span className="text-xs text-gray-500">
                          {category === "Todos" ? news.length : news.filter(a => a.category === category).length}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Card */}
              <div className="bg-linear-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-6 border border-yellow-500/30">
                <h2 className="text-xl font-bold text-white mb-2">Newsletter</h2>
                <p className="text-gray-300 text-sm mb-4">
                  Receba as últimas notícias e dicas diretamente no seu email
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Seu melhor email"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Inscrever-se
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  ✨ Não enviamos spam. Você pode cancelar a qualquer momento.
                </p>
              </div>

              {/* Featured Post */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  Destaque da Semana
                </h2>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-yellow-400">
                    Dica do Mestre
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    &quot;Analise suas partidas perdidas com mais atenção do que as vencidas. 
                    É nos erros que mais aprendemos!&quot;
                  </p>
                  <p className="text-xs text-gray-500">- GM Carlos Silva</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔗</span>
                  Redes Sociais
                </h2>
                <div className="flex gap-3">
                  <button className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all duration-300">
                    <span className="block text-2xl">📘</span>
                    <span className="text-xs text-gray-400 mt-1">Facebook</span>
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all duration-300">
                    <span className="block text-2xl">📷</span>
                    <span className="text-xs text-gray-400 mt-1">Instagram</span>
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all duration-300">
                    <span className="block text-2xl">🐦</span>
                    <span className="text-xs text-gray-400 mt-1">Twitter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}