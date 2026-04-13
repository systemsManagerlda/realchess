/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/aula/[aulaId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import Image from "next/image";
import {
  TbChess,
  TbRefresh,
  TbPlayerTrackNext,
  TbPlayerTrackPrev,
  TbDownload,
  TbBook,
  TbVideo,
  TbPhoto,
  TbFileText,
  TbStar,
  TbMessage,
  TbEye,
  TbClock,
  TbUser,
  TbCalendar,
  TbAward,
  TbCheck,
  TbX,
  TbArrowNarrowLeft,
  TbArrowNarrowRight,
} from "react-icons/tb";

const BASE_URL = "https://desktop-api-4f850b3f9733.herokuapp.com";

interface Exercicio {
  exercicioId: string;
  titulo: string;
  descricao: string;
  tipo: string;
  configuracaoTabuleiro: {
    fenInicial: string;
    orientacao: string;
  };
  nivel: string;
  pontos: number;
  solucao?: {
    movimentos: Array<{ notacao: string; from: string; to: string }>;
    explicacao?: string;
  };
}

interface Aula {
  aulaId: string;
  titulo: string;
  subtitulo?: string;
  descricao: string;
  categoria: string;
  nivel: string;
  status: string;
  visualizacoes: number;
  duracaoEstimada?: number;
  totalExercicios?: number;
  totalVideos?: number;
  totalImagens?: number;
  progresso: number;
  concluido: boolean;
  certificadoGerado: boolean;
  formadorNome: string;
  formadorId: string;
  dataCriacao: string;
  estatisticas?: {
    totalAlunosInscritos: number;
    avaliacaoMedia: number;
  };
  conteudo?: {
    textoExplicativo: string;
    imagens: Array<{ url: string; titulo: string; descricao?: string }>;
    videos: Array<{ url: string; titulo: string; duracao: number; plataforma?: string }>;
    materiais: Array<{ url: string; nome: string; tipo?: string }>;
    posicoesXadrez?: Array<{
      posicaoId: string;
      titulo: string;
      descricao: string;
      fen: string;
      pgn?: string;
      movimentos?: Array<{ notacao: string; from: string; to: string; comentario?: string }>;
    }>;
  };
  exercicios?: Exercicio[];
}

export default function VisualizarAula() {
  const router = useRouter();
  const params = useParams();
  const aulaId = params.aulaId as string;
  
  const [aula, setAula] = useState<Aula | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("conteudo");
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [historico, setHistorico] = useState<string[]>([]);
  const [indiceHistorico, setIndiceHistorico] = useState(0);
  const [movimentoValido, setMovimentoValido] = useState<boolean | null>(null);
  const [mensagemErro, setMensagemErro] = useState("");
  const [posicaoAtual, setPosicaoAtual] = useState(0);
  const [posicoesLista, setPosicoesLista] = useState<any[]>([]);
  const [exercicioAtual, setExercicioAtual] = useState(0);
  const [avaliacao, setAvaliacao] = useState({ nota: 0, comentario: "" });
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);
  const [comentario, setComentario] = useState("");
  const [exercicioCompletado, setExercicioCompletado] = useState(false);
  const [boardWidth, setBoardWidth] = useState(500);
  const [showBoardNotation, setShowBoardNotation] = useState(true);

  // Ajustar tamanho do tabuleiro baseado na tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setBoardWidth(320);
      } else if (window.innerWidth < 768) {
        setBoardWidth(400);
      } else {
        setBoardWidth(500);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAula = async () => {
      try {
        const response = await fetch(`${BASE_URL}/getAulaDetail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aulaId }),
        });

        const result = await response.json();
        
        if (result.returnCode === 200) {
          setAula(result.data);
          
          // Inicializar tabuleiro com primeira posição de xadrez ou posição inicial
          if (result.data.conteudo?.posicoesXadrez?.length > 0) {
            setPosicoesLista(result.data.conteudo.posicoesXadrez);
            const primeiraPosicao = result.data.conteudo.posicoesXadrez[0];
            if (primeiraPosicao.fen) {
              const novoJogo = new Chess();
              novoJogo.load(primeiraPosicao.fen);
              setGame(novoJogo);
              setFen(novoJogo.fen());
            }
          } else {
            // Se não há posições pré-definidas, começar com posição inicial
            const novoJogo = new Chess();
            setGame(novoJogo);
            setFen(novoJogo.fen());
          }
        } else {
          showNotification("error", "Erro ao carregar aula");
          router.push("/dashboard/aluno");
        }
      } catch (error) {
        console.error("Error fetching aula:", error);
        showNotification("error", "Erro de conexão");
      } finally {
        setLoading(false);
      }
    };

    if (aulaId) {
      fetchAula();
    }
  }, [aulaId, router]);

  const showNotification = (type: string, message: string) => {
    console.log(`${type}: ${message}`);
    // Você pode implementar um toast notification aqui
  };

  // Funções do Tabuleiro
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    try {
      const movimento = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (movimento) {
        const novoHistorico = [...historico.slice(0, indiceHistorico + 1), movimento.san];
        setHistorico(novoHistorico);
        setIndiceHistorico(novoHistorico.length - 1);
        setFen(game.fen());
        setMovimentoValido(true);
        setMensagemErro("");
        
        // Verificar se completou exercício
        if (activeSection === "exercicios" && aula?.exercicios && aula.exercicios.length > 0 && !exercicioCompletado) {
          const exercicio = aula.exercicios[exercicioAtual];
          const solucaoEsperada = exercicio.solucao?.movimentos?.[0]?.notacao;
          if (solucaoEsperada && movimento.san === solucaoEsperada) {
            setExercicioCompletado(true);
            showNotification("success", "🎉 Exercício concluído com sucesso!");
          }
        }
        
        return true;
      }
      
      setMovimentoValido(false);
      setMensagemErro("Movimento inválido!");
      setTimeout(() => {
        setMovimentoValido(null);
        setMensagemErro("");
      }, 2000);
      return false;
    } catch (error) {
      setMovimentoValido(false);
      setMensagemErro(error instanceof Error ? error.message : "Erro ao fazer movimento");
      setTimeout(() => {
        setMovimentoValido(null);
        setMensagemErro("");
      }, 2000);
      return false;
    }
  };

  const desfazerMovimento = () => {
    if (indiceHistorico > 0) {
      game.undo();
      setIndiceHistorico(indiceHistorico - 1);
      setFen(game.fen());
    }
  };

  const refazerMovimento = () => {
    if (indiceHistorico < historico.length - 1) {
      const historicoAte = historico.slice(0, indiceHistorico + 1);
      const novoJogo = new Chess();
      if (posicoesLista[posicaoAtual]?.fen) {
        novoJogo.load(posicoesLista[posicaoAtual].fen);
      } else {
        novoJogo.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      }
      
      for (const move of historicoAte) {
        novoJogo.move(move);
      }
      
      setGame(novoJogo);
      setIndiceHistorico(indiceHistorico + 1);
      setFen(novoJogo.fen());
    }
  };

  const resetarTabuleiro = () => {
    const posicaoAtualObj = posicoesLista[posicaoAtual];
    const novoJogo = new Chess();
    if (posicaoAtualObj?.fen) {
      novoJogo.load(posicaoAtualObj.fen);
    } else {
      novoJogo.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    }
    setGame(novoJogo);
    setFen(novoJogo.fen());
    setHistorico([]);
    setIndiceHistorico(0);
  };

  const resetarJogoCompleto = () => {
    const novoJogo = new Chess();
    setGame(novoJogo);
    setFen(novoJogo.fen());
    setHistorico([]);
    setIndiceHistorico(0);
    setMovimentoValido(null);
    setMensagemErro("");
  };

  const carregarPosicao = (index: number) => {
    const posicao = posicoesLista[index];
    if (posicao) {
      const novoJogo = new Chess();
      novoJogo.load(posicao.fen);
      setGame(novoJogo);
      setFen(novoJogo.fen());
      setHistorico([]);
      setIndiceHistorico(0);
      setPosicaoAtual(index);
    }
  };

  const proximaPosicao = () => {
    if (posicaoAtual < posicoesLista.length - 1) {
      carregarPosicao(posicaoAtual + 1);
    }
  };

  const posicaoAnterior = () => {
    if (posicaoAtual > 0) {
      carregarPosicao(posicaoAtual - 1);
    }
  };

  const resetarExercicio = () => {
    if (aula?.exercicios && aula.exercicios.length > 0 && aula.exercicios[exercicioAtual]) {
      const exercicio = aula.exercicios[exercicioAtual];
      const novoJogo = new Chess();
      if (exercicio.configuracaoTabuleiro?.fenInicial) {
        novoJogo.load(exercicio.configuracaoTabuleiro.fenInicial);
      }
      setGame(novoJogo);
      setFen(novoJogo.fen());
      setHistorico([]);
      setIndiceHistorico(0);
      setExercicioCompletado(false);
    }
  };

  const handleEnviarAvaliacao = async () => {
    const membroId = localStorage.getItem("membroId");
    
    try {
      const response = await fetch(`${BASE_URL}/avaliarAula`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aulaId: aula?.aulaId,
          alunoId: membroId,
          alunoNome: localStorage.getItem("nomeCompleto"),
          nota: avaliacao.nota,
          comentario: avaliacao.comentario,
        }),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        showNotification("success", "Avaliação enviada com sucesso!");
        setShowAvaliacaoModal(false);
        setAvaliacao({ nota: 0, comentario: "" });
      }
    } catch (error) {
      showNotification("error", "Erro ao enviar avaliação");
    }
  };

  const handleAdicionarComentario = async () => {
    const membroId = localStorage.getItem("membroId");
    
    try {
      const response = await fetch(`${BASE_URL}/adicionarComentario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aulaId: aula?.aulaId,
          alunoId: membroId,
          alunoNome: localStorage.getItem("nomeCompleto"),
          conteudo: comentario,
        }),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        showNotification("success", "Comentário adicionado!");
        setComentario("");
      }
    } catch (error) {
      showNotification("error", "Erro ao adicionar comentário");
    }
  };
const getGoogleDriveImage = (url: string) => {
  if (!url) return "";

  // já está correto
  if (url.includes("uc?export=view")) return url;

  // extrair ID do Drive
  const match = url.match(/\/d\/(.*?)\//);
  const id = match?.[1];

  if (!id) return url;

  return `https://drive.google.com/uc?export=view&id=${id}`;
};
  const getStatusJogo = () => {
    if (game.isCheckmate()) return "Xeque-mate!";
    if (game.isCheck()) return "Xeque!";
    if (game.isStalemate()) return "Afogamento!";
    return "Jogo em andamento";
  };

  const getVezJogador = () => {
    return game.turn() === "w" ? "Brancas jogam" : "Pretas jogam";
  };

  // Funções seguras para acessar exercícios
  const hasExercicios = (): boolean => {
    return !!(aula?.exercicios && aula.exercicios.length > 0);
  };

  const getExercicioAtual = (): Exercicio | null => {
    if (!aula?.exercicios || aula.exercicios.length === 0) return null;
    return aula.exercicios[exercicioAtual] || null;
  };

  const getTotalExercicios = (): number => {
    return aula?.exercicios?.length || 0;
  };

  // Verificar se tem posições de xadrez
  const hasPosicoesXadrez = (): boolean => {
    return !!(aula?.conteudo?.posicoesXadrez && aula.conteudo.posicoesXadrez.length > 0);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-400">Carregando aula...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!aula) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400">Aula não encontrada</p>
            <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-yellow-600 rounded-lg">
              Voltar
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const exercicioAtualObj = getExercicioAtual();
  const totalExercicios = getTotalExercicios();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Cabeçalho da Aula */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition"
            >
              <TbArrowNarrowLeft className="w-5 h-5" />
              Voltar ao Dashboard
            </button>
            
            <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 rounded-2xl p-6 border border-yellow-500/30">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{aula.titulo}</h1>
                  {aula.subtitulo && (
                    <p className="text-gray-400 text-lg">{aula.subtitulo}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <TbUser className="w-4 h-4" /> {aula.formadorNome}
                    </span>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <TbCalendar className="w-4 h-4" /> {new Date(aula.dataCriacao).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <TbEye className="w-4 h-4" /> {aula.visualizacoes} visualizações
                    </span>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <TbClock className="w-4 h-4" /> {aula.duracaoEstimada || 60} minutos
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-yellow-600/20 rounded-full">
                    <span className="text-yellow-500 text-sm capitalize">{aula.nivel}</span>
                  </div>
                  <div className="px-3 py-1 bg-blue-600/20 rounded-full">
                    <span className="text-blue-400 text-sm">{aula.categoria}</span>
                  </div>
                  <div className="px-3 py-1 bg-green-600/20 rounded-full">
                    <span className="text-green-400 text-sm">{aula.progresso}% completo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar de Navegação */}
            <div className="lg:w-64 space-y-2">
              <button
                onClick={() => setActiveSection("conteudo")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === "conteudo"
                    ? "bg-yellow-600 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <TbBook className="w-5 h-5" />
                <span>Conteúdo</span>
              </button>
              
              {aula.conteudo?.videos && aula.conteudo.videos.length > 0 && (
                <button
                  onClick={() => setActiveSection("videos")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === "videos"
                      ? "bg-yellow-600 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <TbVideo className="w-5 h-5" />
                  <span>Vídeos ({aula.conteudo.videos.length})</span>
                </button>
              )}
              
              {aula.conteudo?.imagens && aula.conteudo.imagens.length > 0 && (
                <button
                  onClick={() => setActiveSection("imagens")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === "imagens"
                      ? "bg-yellow-600 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <TbPhoto className="w-5 h-5" />
                  <span>Imagens ({aula.conteudo.imagens.length})</span>
                </button>
              )}
              
              {/* Tabuleiro Interativo - SEMPRE VISÍVEL */}
              <button
                onClick={() => setActiveSection("tabuleiro")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === "tabuleiro"
                    ? "bg-yellow-600 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <TbChess className="w-5 h-5" />
                <span>Tabuleiro Interativo</span>
              </button>
              
              {hasExercicios() && (
                <button
                  onClick={() => setActiveSection("exercicios")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === "exercicios"
                      ? "bg-yellow-600 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <TbAward className="w-5 h-5" />
                  <span>Exercícios ({totalExercicios})</span>
                </button>
              )}
              
              {aula.conteudo?.materiais && aula.conteudo.materiais.length > 0 && (
                <button
                  onClick={() => setActiveSection("materiais")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === "materiais"
                      ? "bg-yellow-600 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <TbFileText className="w-5 h-5" />
                  <span>Materiais</span>
                </button>
              )}
              
              <button
                onClick={() => setActiveSection("comentarios")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === "comentarios"
                    ? "bg-yellow-600 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <TbMessage className="w-5 h-5" />
                <span>Comentários</span>
              </button>
              
              <button
                onClick={() => setShowAvaliacaoModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-all duration-300"
              >
                <TbStar className="w-5 h-5" />
                <span>Avaliar Aula</span>
              </button>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1">
              {/* Conteúdo Textual */}
              {activeSection === "conteudo" && (
                <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4">Descrição da Aula</h2>
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {aula.descricao}
                  </p>
                  
                  {aula.conteudo?.textoExplicativo && (
                    <>
                      <div className="h-px bg-white/20 my-6" />
                      <h3 className="text-xl font-semibold text-white mb-3">Conteúdo Explicativo</h3>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {aula.conteudo.textoExplicativo}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Vídeos */}
              {activeSection === "videos" && aula.conteudo?.videos && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4">Vídeos da Aula</h2>
                  {aula.conteudo.videos.map((video, idx) => (
                    <div key={idx} className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-2">{video.titulo}</h3>
                      <div className="aspect-video bg-black/50 rounded-lg overflow-hidden">
                        {video.plataforma === "youtube" ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${video.url.split("v=")[1]?.split("&")[0] || video.url.split("/").pop()}`}
                            title={video.titulo}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        ) : (
                          <video controls className="w-full h-full">
                            <source src={video.url} />
                            Seu navegador não suporta vídeo.
                          </video>
                        )}
                      </div>
                      {video.duracao > 0 && (
                        <p className="text-sm text-gray-400 mt-2">
                          Duração: {Math.floor(video.duracao / 60)}:{(video.duracao % 60).toString().padStart(2, "0")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Imagens */}
              {activeSection === "imagens" && aula.conteudo?.imagens && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4">Imagens da Aula</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aula.conteudo.imagens.map((imagem, idx) => (
                      <div key={idx} className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <Image
                        src={getGoogleDriveImage(imagem.url)}
                        alt={imagem.titulo}
                        width={500}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                        <p className="text-white font-semibold">{imagem.titulo}</p>
                        {imagem.descricao && <p className="text-gray-400 text-sm">{imagem.descricao}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabuleiro Interativo - SEMPRE VISÍVEL E FUNCIONAL */}
              {activeSection === "tabuleiro" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4">Tabuleiro Interativo</h2>
                  
                  {/* Navegação de Posições (se houver) */}
                  {hasPosicoesXadrez() && posicoesLista.length > 1 && (
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <button
                        onClick={posicaoAnterior}
                        disabled={posicaoAtual === 0}
                        className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 transition"
                      >
                        <TbArrowNarrowLeft className="w-5 h-5" />
                      </button>
                      <div className="flex gap-2 overflow-x-auto py-2">
                        {posicoesLista.map((pos, idx) => (
                          <button
                            key={idx}
                            onClick={() => carregarPosicao(idx)}
                            className={`px-3 py-1 rounded-lg text-sm transition ${
                              posicaoAtual === idx
                                ? "bg-yellow-600 text-white"
                                : "bg-white/10 text-gray-300 hover:bg-white/20"
                            }`}
                          >
                            {pos.titulo || `Posição ${idx + 1}`}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={proximaPosicao}
                        disabled={posicaoAtual === posicoesLista.length - 1}
                        className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 transition"
                      >
                        <TbArrowNarrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  
                  {/* Descrição da Posição (se houver) */}
                  {hasPosicoesXadrez() && posicoesLista[posicaoAtual]?.descricao && (
                    <div className="bg-blue-600/10 rounded-lg p-4 border border-blue-500/30">
                      <p className="text-blue-300">{posicoesLista[posicaoAtual].descricao}</p>
                    </div>
                  )}
                  
                  {/* Tabuleiro */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="flex justify-center">
                          <Chessboard
                            position={fen}
                            onPieceDrop={onDrop}
                            boardWidth={boardWidth}
                            areArrowsAllowed={true}
                            showBoardNotation={showBoardNotation}
                          />
                        </div>
                        
                        {/* Status do Jogo */}
                        <div className="mt-4 text-center">
                          <p className="text-sm text-gray-400">{getVezJogador()}</p>
                          <p className={`text-sm font-semibold ${game.isCheck() ? "text-red-400" : "text-yellow-500"}`}>
                            {getStatusJogo()}
                          </p>
                        </div>
                        
                        {/* Controles */}
                        <div className="flex justify-center gap-3 mt-4">
                          <button
                            onClick={desfazerMovimento}
                            disabled={indiceHistorico === 0}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 transition"
                            title="Desfazer"
                          >
                            <TbPlayerTrackPrev className="w-5 h-5" />
                          </button>
                          <button
                            onClick={resetarTabuleiro}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                            title="Resetar Posição"
                          >
                            <TbRefresh className="w-5 h-5" />
                          </button>
                          <button
                            onClick={resetarJogoCompleto}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                            title="Novo Jogo"
                          >
                            <TbChess className="w-5 h-5" />
                          </button>
                          <button
                            onClick={refazerMovimento}
                            disabled={indiceHistorico === historico.length - 1}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 transition"
                            title="Refazer"
                          >
                            <TbPlayerTrackNext className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {/* Botão para mostrar/esconder notação */}
                        <div className="flex justify-center mt-2">
                          <button
                            onClick={() => setShowBoardNotation(!showBoardNotation)}
                            className="text-xs text-gray-400 hover:text-yellow-500 transition"
                          >
                            {showBoardNotation ? "Ocultar notação" : "Mostrar notação"}
                          </button>
                        </div>
                        
                        {/* Mensagem de erro/sucesso */}
                        {movimentoValido === false && (
                          <div className="mt-3 p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                            <TbX className="inline-block mr-1" /> {mensagemErro}
                          </div>
                        )}
                        
                        {/* Histórico de Movimentos */}
                        {historico.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs text-gray-500 mb-2">Histórico de movimentos:</p>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                              {historico.map((move, idx) => (
                                <span
                                  key={idx}
                                  className={`text-xs px-2 py-1 rounded ${
                                    idx === indiceHistorico
                                      ? "bg-yellow-600 text-white"
                                      : "bg-white/10 text-gray-300"
                                  }`}
                                >
                                  {idx + 1}. {move}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Explicação e Dicas */}
                    <div className="lg:w-80">
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <TbChess className="w-5 h-5 text-yellow-500" />
                          Sobre o Tabuleiro
                        </h3>
                        <div className="space-y-3 text-gray-300 text-sm">
                          <p>Use o tabuleiro para praticar seus movimentos, testar estratégias e analisar posições.</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-400">
                            <li>Arraste as peças para fazer movimentos</li>
                            <li>Use os botões para desfazer/refazer movimentos</li>
                            <li>Clique em &quot;Novo Jogo&quot; para recomeçar</li>
                            <li>As jogadas são validadas pelas regras oficiais do xadrez</li>
                          </ul>
                        </div>
                        
                        {hasPosicoesXadrez() && posicoesLista[posicaoAtual]?.movimentos && (
                          <>
                            <div className="h-px bg-white/20 my-3" />
                            <h4 className="font-semibold text-yellow-500 mb-2">Movimentos Sugeridos:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {posicoesLista[posicaoAtual].movimentos.map((mov: any, idx: number) => (
                                <li key={idx}>
                                  <span className="text-gray-400">{mov.notacao}</span>
                                  {mov.comentario && (
                                    <p className="text-xs text-gray-500 ml-4">{mov.comentario}</p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Exercícios */}
              {activeSection === "exercicios" && hasExercicios() && exercicioAtualObj && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Exercícios</h2>
                    <div className="text-sm text-gray-400">
                      Exercício {exercicioAtual + 1} de {totalExercicios}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="px-3 py-1 bg-yellow-600/20 rounded-full">
                        <span className="text-yellow-500 text-sm capitalize">{exercicioAtualObj.nivel}</span>
                      </div>
                      <div className="px-3 py-1 bg-green-600/20 rounded-full">
                        <span className="text-green-400 text-sm">{exercicioAtualObj.pontos} pontos</span>
                      </div>
                      {exercicioCompletado && (
                        <div className="px-3 py-1 bg-green-600/20 rounded-full">
                          <span className="text-green-400 text-sm flex items-center gap-1">
                            <TbCheck className="w-3 h-3" /> Completado!
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {exercicioAtualObj.titulo}
                    </h3>
                    <p className="text-gray-300 mb-6">
                      {exercicioAtualObj.descricao}
                    </p>
                    
                    {/* Tabuleiro do Exercício */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="flex justify-center">
                        <Chessboard
                          position={exercicioAtualObj.configuracaoTabuleiro?.fenInicial || fen}
                          onPieceDrop={onDrop}
                          boardWidth={boardWidth}
                          areArrowsAllowed={true}
                          showBoardNotation={showBoardNotation}
                        />
                      </div>
                    </div>
                    
                    {/* Botões do Exercício */}
                    <div className="flex justify-between gap-3 mt-6">
                      <button
                        onClick={resetarExercicio}
                        className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                      >
                        Resetar Exercício
                      </button>
                      <button
                        onClick={() => {
                          if (exercicioAtual < totalExercicios - 1) {
                            setExercicioAtual(exercicioAtual + 1);
                            setExercicioCompletado(false);
                            setTimeout(() => resetarExercicio(), 100);
                          }
                        }}
                        disabled={exercicioAtual === totalExercicios - 1}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition disabled:opacity-50"
                      >
                        Próximo Exercício
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Materiais */}
              {activeSection === "materiais" && aula.conteudo?.materiais && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4">Materiais de Apoio</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aula.conteudo.materiais.map((material, idx) => (
                      <div key={idx} className="bg-white/10 rounded-xl p-4 border border-white/20 flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold">{material.nome}</h3>
                          <p className="text-xs text-gray-400">{material.tipo || "Material"}</p>
                        </div>
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm transition flex items-center gap-2"
                        >
                          <TbDownload className="w-4 h-4" />
                          Baixar
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comentários */}
              {activeSection === "comentarios" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4">Comentários</h2>
                  
                  {/* Formulário de Comentário */}
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <textarea
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder="Deixe seu comentário sobre esta aula..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleAdicionarComentario}
                      disabled={!comentario.trim()}
                      className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition disabled:opacity-50"
                    >
                      Enviar Comentário
                    </button>
                  </div>
                  
                  {/* Lista de Comentários (placeholder) */}
                  <div className="text-center py-8 text-gray-400">
                    <TbMessage className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Seja o primeiro a comentar nesta aula!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Avaliação */}
      {showAvaliacaoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-yellow-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Avaliar Aula</h3>
              <button onClick={() => setShowAvaliacaoModal(false)} className="text-gray-400 hover:text-white">
                <TbX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Nota (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((nota) => (
                    <button
                      key={nota}
                      onClick={() => setAvaliacao({ ...avaliacao, nota })}
                      className={`flex-1 py-2 rounded-lg transition ${
                        avaliacao.nota === nota
                          ? "bg-yellow-600 text-white"
                          : "bg-white/10 text-gray-400 hover:bg-white/20"
                      }`}
                    >
                      {nota} ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Comentário (opcional)</label>
                <textarea
                  value={avaliacao.comentario}
                  onChange={(e) => setAvaliacao({ ...avaliacao, comentario: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  rows={3}
                  placeholder="O que você achou desta aula?"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowAvaliacaoModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEnviarAvaliacao}
                  className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
                >
                  Enviar Avaliação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(234,179,8,0.5);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}