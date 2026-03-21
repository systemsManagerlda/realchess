// app/partidas/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

interface Match {
  date: string;
  white: string;
  black: string;
  result: string;
  moves: string;
  tournament?: string;
  pgn?: string;
}

export default function Partidas() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [game, setGame] = useState(new Chess());
  const [currentMove, setCurrentMove] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [movesList, setMovesList] = useState<string[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(350);
  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 640) {
      setBoardWidth(window.innerWidth - 40);
    } else if (window.innerWidth < 768) {
      setBoardWidth(320);
    } else {
      setBoardWidth(350);
    }
  };
  
  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  const isVisible = true;

  const recentMatches: Match[] = [
    { 
      date: "2025-01-15", 
      white: "João Silva", 
      black: "Maria Santos", 
      result: "0-1", 
      moves: "45",
      tournament: "Torneio Rápido de Verão",
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 
4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 
7. Bb3 d6 8. c3 O-O 9. h3 Nb8 
10. d4 Nbd7 11. c4 c6 12. Nc3 Qc7 
13. Be3 Bb7 14. Rc1 Rfe8 15. a3 Bf8 
16. Ba2 exd4 17. Nxd4 Nxe4 18. Nxe4 Rxe4 
19. Bb1 Re5 20. cxb5 axb5 21. Nxb5 Qb8 
22. Nd4 c5 23. Nf3 Re8 24. Ng5 Nf6 
25. Ba2 d5 26. Bxc5 Bxc5 27. Rxc5 Qd6 
28. Rxe8+ Rxe8 29. Rc1 h6 30. Nf3 Ne4 
31. Nd4 Qf6 32. Qf3 Qxd4 33. Rc7 Nd6 
34. Rd7 Re1+ 35. Kh2 Qe5+ 36. g3 d4 
37. Bxf7+ Kh7 38. Bg6+ Kxg6 39. Qd3+ Be4 
40. Qd2 Rh1#`
    },
    { 
      date: "2025-01-14", 
      white: "Pedro Oliveira", 
      black: "Carlos Mendes", 
      result: "0-1", 
      moves: "32",
      tournament: "Circuito Mahotas",
      pgn: `1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 
4. Qc2 O-O 5. a3 Bxc3+ 6. Qxc3 b6 
7. Bg5 Bb7 8. e3 d6 9. Nf3 Nbd7 
10. Bd3 h6 11. Bh4 Qe7 12. O-O e5 
13. Bf5 Rfe8 14. Bxd7 Qxd7 15. Bxf6 Bxf3 
16. gxf3 gxf6 17. Kh1 Kh7 18. Rg1 Rg8 
19. Qd3+ f5 20. dxe5 Qe6 21. exd6 cxd6 
22. Rxg8 Rxg8 23. Rd1 Rg6 24. Qd5 Qf6 
25. b4 Qg5 26. f4 Qg4 27. Qxf7+ Rg7 
28. Qd5 Qe2 29. Qxf5+ Kh8 30. Rxd6 Qf1#`
    },
    { 
      date: "2025-01-13", 
      white: "Ana Costa", 
      black: "Roberto Silva", 
      result: "1-0", 
      moves: "24",
      tournament: "Campeonato Nacional",
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 
4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 
7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 
10. O-O-O Nbd7 11. g4 b5 12. g5 Nh5 
13. Kb1 Rc8 14. Nd5 Bxd5 15. exd5 f5 
16. gxf6 Nhxf6 17. Bh3 Rc4 18. Na5 Rh4 
19. Be6+ Kh8 20. Nc6 Qe8 21. Rhg1 Nc5 
22. Bxc5 dxc5 23. Qg5 Rh5 24. Qxg7#`
    },
  ];

  const loadGame = (pgn: string) => {
    try {
      const tempGame = new Chess();
      tempGame.loadPgn(pgn);
      const moves = tempGame.history();
      setMovesList(moves);
      setTotalMoves(moves.length);
      setCurrentMove(0);
      setGame(new Chess());
    } catch (error) {
      console.error("Error loading PGN:", error);
    }
  };

  const onMove = () => false;

  const goToMove = (moveIndex: number) => {
    if (selectedMatch?.pgn) {
      const tempGame = new Chess();
      tempGame.loadPgn(selectedMatch.pgn);
      const moves = tempGame.history({ verbose: true });
      const newGame = new Chess();
      for (let i = 0; i < moveIndex; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setCurrentMove(moveIndex);
    }
  };

  const nextMove = () => {
    if (currentMove < totalMoves) goToMove(currentMove + 1);
  };

  const prevMove = () => {
    if (currentMove > 0) goToMove(currentMove - 1);
  };

  const firstMove = () => goToMove(0);
  const lastMove = () => goToMove(totalMoves);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getResultColor = (result: string) => {
    if (result === "1-0") return "text-green-400";
    if (result === "0-1") return "text-red-400";
    return "text-yellow-400";
  };

  const getResultIcon = (result: string) => {
    if (result === "1-0") return "🏆";
    if (result === "0-1") return "⚫";
    return "🤝";
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case "Iniciante": return "bg-green-500/20 text-green-400";
      case "Intermediário": return "bg-blue-500/20 text-blue-400";
      case "Avançado": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const tutorials = [
    { title: "Abertura Italiana", duration: "15 min", level: "Iniciante", description: "Aprenda os conceitos básicos da abertura italiana.", category: "Aberturas" },
    { title: "Finais de Peões", duration: "20 min", level: "Intermediário", description: "Domine os conceitos fundamentais de finais de peões.", category: "Finais" },
    { title: "Ataque ao Rei", duration: "25 min", level: "Avançado", description: "Técnicas avançadas para executar ataques decisivos.", category: "Tática" },
    { title: "Estratégia de Centro", duration: "18 min", level: "Intermediário", description: "Como controlar e utilizar o centro do tabuleiro.", category: "Estratégia" },
  ];

  return (
    <>
      <Header />
      <main ref={pageRef} className="relative bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen pt-20">
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
          <div className="absolute top-20 left-20 text-7xl animate-float">♔</div>
          <div className="absolute bottom-20 right-20 text-7xl animate-float-delayed">♕</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className={`
              inline-block mb-4 sm:mb-6 transition-all duration-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <span className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
                <span className="mr-2">♟️</span>
                Análise e Treinamento
              </span>
            </div>
            <h1 className={`
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 transition-all duration-700 delay-100
              bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Partidas e Treinamento
            </h1>
            <div className={`
              w-20 sm:w-24 h-1 bg-yellow-500 mx-auto mb-4 sm:mb-6 rounded-full transition-all duration-700 delay-150
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `} />
            <p className={`
              text-gray-300 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4 transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Analise partidas recentes, estude táticas e melhore seu jogo com nossos tutoriais exclusivos
            </p>
          </div>

          {/* Grid Principal - Responsivo */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Recent Matches */}
            <div className={`
              bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20
              transition-all duration-700 delay-300
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <div className="p-4 sm:p-6 border-b border-white/20">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">📊</span>
                  Últimas Partidas
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Partidas recentes dos nossos membros</p>
              </div>
              <div className="divide-y divide-white/10">
                {recentMatches.map((match, index) => (
                  <div 
                    key={index} 
                    className="p-4 sm:p-6 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedMatch(match);
                      if (match.pgn) loadGame(match.pgn);
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <span className="text-xs sm:text-sm text-gray-400">{formatDate(match.date)}</span>
                      <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full w-fit">
                        {match.tournament}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          <span className="font-semibold text-white text-sm sm:text-base">{match.white}</span>
                          <span className="text-gray-500 text-xs">vs</span>
                          <span className="font-semibold text-white text-sm sm:text-base">{match.black}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`font-bold text-xs sm:text-sm ${getResultColor(match.result)}`}>
                            {getResultIcon(match.result)} {match.result}
                          </span>
                          <span className="text-gray-500 text-xs">({match.moves} lances)</span>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Stream */}
            <div className={`
              bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20
              transition-all duration-700 delay-400
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <div className="p-4 sm:p-6 border-b border-white/20">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">🔴</span>
                  Transmissões ao Vivo
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Acompanhe as partidas em tempo real</p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-8 text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-yellow-500/10" />
                  <div className="relative">
                    <div className="inline-block mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 bg-red-500/20 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-red-400 text-xs sm:text-sm font-semibold">AO VIVO</span>
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Torneio Rápido de Verão</h3>
                    <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">Final: João Silva vs Maria Santos</p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">📅 20 de Fevereiro às 14:00</p>
                    <button className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                      <span>🔴</span>
                      Assistir ao Vivo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tutorials - Grid Responsivo */}
          <div className={`
            bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 mb-8 sm:mb-12
            transition-all duration-700 delay-500
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-1 h-5 sm:h-6 bg-yellow-500 rounded-full"></span>
              Tutoriais e Dicas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {tutorials.map((tutorial, index) => (
                <div
                  key={index}
                  className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 sm:p-5 border border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(tutorial.level)}`}>
                      {tutorial.level}
                    </span>
                    <span className="text-xs text-gray-500">{tutorial.duration}</span>
                  </div>
                  <h3 className="font-bold text-white text-base sm:text-lg mb-2 group-hover:text-yellow-400 transition-colors">
                    {tutorial.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{tutorial.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-yellow-500/80">{tutorial.category}</span>
                    <button className="text-yellow-500 hover:text-yellow-400 font-semibold text-xs sm:text-sm flex items-center gap-1">
                      Assistir
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tip of the Day */}
          <div className={`
            relative overflow-hidden rounded-2xl p-4 sm:p-8 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30
            transition-all duration-700 delay-600
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent" />
            <div className="relative flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="text-4xl sm:text-5xl">💡</div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Dica do Dia</h2>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                  &quot;Controle o centro do tabuleiro nas primeiras jogadas. 
                  Isso dá mais mobilidade às suas peças e limita as opções do adversário!&quot;
                </p>
                <p className="text-yellow-500 text-xs sm:text-sm mt-3 sm:mt-4">- GM Garry Kasparov</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Análise - Responsivo */}
        {selectedMatch && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 z-50">
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl w-full max-w-full md:max-w-4xl max-h-[95vh] overflow-y-auto border border-white/20 shadow-2xl animate-fade-in-up">
      {/* Header fixo */}
      <div className="sticky top-0 bg-gradient-to-b from-gray-900 to-gray-950 z-10 px-4 sm:px-6 pt-4 sm:pt-6 pb-2 border-b border-white/20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Análise da Partida</h2>
          <button 
            onClick={() => setSelectedMatch(null)} 
            className="text-gray-400 hover:text-white transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Conteúdo com scroll */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Tabuleiro e Controles - Layout responsivo */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Coluna do Tabuleiro */}
          <div className="flex-1 space-y-3 sm:space-y-4">
            <div className="bg-white/5 rounded-lg p-3 sm:p-4">
              <div className="flex justify-center">
                <div className="w-full max-w-87.5 sm:max-w-100 mx-auto">
                  <Chessboard
                    position={game.fen()}
                    onPieceDrop={onMove}
                    boardWidth={boardWidth}
                    boardOrientation="white"
                    customBoardStyle={{ 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Controles de Navegação */}
            <div className="bg-white/5 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button 
                  onClick={firstMove} 
                  className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Primeiro lance"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={prevMove} 
                  className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Lance anterior"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="px-3 py-1.5 bg-white/10 rounded-lg">
                  <span className="text-white font-semibold text-xs sm:text-sm">
                    {currentMove} / {totalMoves}
                  </span>
                </div>
                <button 
                  onClick={nextMove} 
                  className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Próximo lance"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button 
                  onClick={lastMove} 
                  className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Último lance"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Lista de Movimentos - Rolagem horizontal em mobile */}
            <div className="bg-white/5 rounded-lg p-3 sm:p-4">
              <p className="text-gray-400 text-xs sm:text-sm mb-2">Lista de Movimentos</p>
              <div className="overflow-x-auto">
                <div className="flex flex-wrap gap-1 sm:gap-2 min-w-[200px]">
                  {movesList.map((move, idx) => {
                    const moveNumber = Math.floor(idx / 2) + 1;
                    const isWhiteMove = idx % 2 === 0;
                    return (
                      <button
                        key={idx}
                        onClick={() => goToMove(idx + 1)}
                        className={`
                          inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs sm:text-sm transition-colors
                          ${idx + 1 === currentMove 
                            ? 'bg-yellow-500/30 text-yellow-400 font-semibold' 
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }
                        `}
                      >
                        {isWhiteMove && <span className="text-gray-500 text-xs">{moveNumber}.</span>}
                        <span>{move}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Coluna das Informações */}
          <div className="flex-1 space-y-3 sm:space-y-4">
            {/* Jogadores */}
            <div className="bg-white/5 rounded-lg p-3 sm:p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">⚪ Brancas</p>
                  <p className="text-white font-bold text-sm sm:text-base truncate">{selectedMatch.white}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">⚫ Pretas</p>
                  <p className="text-white font-bold text-sm sm:text-base truncate">{selectedMatch.black}</p>
                </div>
              </div>
            </div>

            {/* Detalhes da Partida */}
            <div className="bg-white/5 rounded-lg p-3 sm:p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-400 text-xs">Torneio</p>
                  <p className="text-white text-xs sm:text-sm font-medium truncate">{selectedMatch.tournament}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Data</p>
                  <p className="text-white text-xs sm:text-sm">{formatDate(selectedMatch.date)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Resultado</p>
                  <p className={`font-bold text-sm ${getResultColor(selectedMatch.result)}`}>
                    {getResultIcon(selectedMatch.result)} {selectedMatch.result}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Lances</p>
                  <p className="text-white text-sm">{selectedMatch.moves}</p>
                </div>
              </div>
            </div>

            {/* PGN - Rolagem horizontal */}
            <div className="bg-white/5 rounded-lg p-3 sm:p-4">
              <p className="text-gray-400 text-xs sm:text-sm mb-2">PGN</p>
              <div className="overflow-x-auto">
                <pre className="text-[10px] sm:text-xs text-gray-300 font-mono bg-black/30 p-2 sm:p-3 rounded-lg whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                  {selectedMatch.pgn}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Botão Fechar */}
        <button
          onClick={() => setSelectedMatch(null)}
          className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base sticky bottom-0 mt-2"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
)}
      </main>
      <Footer />
    </>
  );
}